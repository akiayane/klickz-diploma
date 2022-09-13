import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallerService } from '../api-caller.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LinkComponent } from '../link/link.component';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js'; 
import 'chartjs-adapter-moment';
import { FormControl } from '@angular/forms';
Chart.register( ...registerables);
//import { MatDialogModule } from '@angular/material';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { MatSnackBar } from '@angular/material/snack-bar';

import { trigger, transition, animate, style } from '@angular/animations'



@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        
        animate('200ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class LinksComponent implements OnInit {

  visible = false;
  
  

  active = true;

  public context: CanvasRenderingContext2D;


  toppings = new FormControl();
  //toppingList = ["cringe","bruh","gay"];

  links = [];
  disabledlinks = [];
  linksDisplay = [];
  disabledlinksDisplay = [];
  pageIndex = 0;
  linksId = [];
  linksNum = [];
  linksNumDisplay = [];

  isLoaded = false;
  isLoadedPie = false;
  isLoadedLine = false;


  //@ViewChild('#linechart') myChart: Chart; 

  myChart;
  myChart24;
  MyLineChart;

  search='';

  labels = [];
  label24 = [];
  data = [];
  data24 = [];

  date = new Date();
  pipe = new DatePipe('en-US');

  pageEvent: PageEvent;

  length;
  pageSize = 5;

  tmpArr = [];

  label;
  color;

  numForLineChart = 10;

  tags = [];



  counter = 0;

  counterS = 0;


  panelOpenState = false;

  @ViewChild('doughnut') doughnut;

  

  dragPosition;

  


  constructor(private api: ApiCallerService, public router: Router, public dialog: MatDialog, private elem: ElementRef, private _snackBar: MatSnackBar) { 
    this.width = 300 - this.margin.left - this.margin.right;
    this.height = 100 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() { 
    let cookie = JSON.parse(sessionStorage.getItem('links'));
    console.log(cookie);
    if(cookie==null){
      this.initialload();
      console.log("initial");
    } else {
      this.iterate(cookie);
      console.log("not initial");
    }
  }

  iterate(arr){
    for(let i=0;i < arr.length;i++){
      let linkDisplayName;
      if( arr[i].displayName==""){
        linkDisplayName = arr[i].name;
      } else {
        linkDisplayName = arr[i].displayName;
      }
      
      if(arr[i].isActive == true){
        this.links.push(arr[i]);
        this.getTags(arr[i]);
        var response = this.api.sendGetRequestWithAuth("/auth/link/get/"+arr[i].id+"/data/bytime")
          response.subscribe(data => {
            let array = [];
            for(let j=0;j<data['payload'].length;j++){
              array.push(data['payload'][j]);
            }
            this.graph24("#graph" + i.toString(), array);
          }, error => {
            // let array = [];
            // for(let i=0;i<288;i++){
            //   array.push({id:i, count:0})
            // }
            //array.push({id:288, count:1})
            //console.log(array);
            // this.graph24("#graph" + i.toString(), array);
            //this.drawicon("#graph" + i.toString());      [ngClass]="[this.checkTag(link.tags) ? '' : 'hide']"
            // console.log("#graph" + i.toString());
            this.api.errorHandler(error.status);
          });


          // --------------- request for alltime doughnut


          var response = this.api.sendGetRequestWithAuth("/auth/link/get/"+arr[i].id+"/data/sum")
          response.subscribe(data => {
            this.linksNum.push(data['payload'].count);
            this.linksId.push(linkDisplayName);
          }, error => {
            this.api.errorHandler(error.status);
          });

      } else {
        this.disabledlinks.push(arr[i]);
      }
      
    }

    this.linksDisplay = this.links;
    this.disabledlinksDisplay = this.disabledlinks;
    this.constructPieAllTime();
    this.constructPie24();
    this.constructLine();
  }



  initialload(){
    var response = this.api.sendGetRequestWithAuth("/auth/link/get")
    response.subscribe(data => {
      console.log(data['payload']);
      sessionStorage.setItem('links',  JSON.stringify(data['payload']));
      
      this.iterate(data['payload']);
    }, error => {
      this.api.errorHandler(error.status);
      //this.router.navigateByUrl('/');
    });
  }

  

  ngAfterViewInit(){    
    
    setTimeout(() => {
      if(this.myChart){
        this.myChart.update();
        this.dragPosition={x: (this.doughnut.nativeElement.offsetWidth/2)-85, y: 0};
      }
      if(this.myChart24){
        this.myChart24.update();
      }
      if(this.MyLineChart){
        this.MyLineChart.update();
      }
      
    }
    , 1000);
    //console.log(this.linksId, this.linksNum);
  }

  disablelink(link, i){
    var response = this.api.sendGetRequestWithAuth("/auth/link/update/"+link.id+"/disable")
      response.subscribe(data => {
        this.openSnackBar("Отключено","","disabled");
      }, error => {
        this.api.errorHandler(error.status);
      });
      this.disabledlinksDisplay.push(link);
      let array = [];
      for(let j=0;j<this.linksDisplay.length;j++){
        if (i!=j){
          array.push(this.linksDisplay[j]);
        }
      }
      this.linksDisplay = array;
  }

  restorelink(link, i){
    var response = this.api.sendGetRequestWithAuth("/auth/link/update/"+link.id+"/restore")
      response.subscribe(data => {
        this.openSnackBar("Восстановлено","","restored");
      }, error => {
        this.api.errorHandler(error.status);
      });
      this.linksDisplay.push(link);
      let array = [];
      for(let j=0;j<this.disabledlinksDisplay.length;j++){
        if (i!=j){
          array.push(this.disabledlinksDisplay[j]);
        }
      }
      this.disabledlinksDisplay = array;
  }

  getTags(link){
    var input = link.tags;
    var disabledinput = link.tags;
    if(this.active && (input!='' && input!=undefined)){
      let fields = input.split('#');
      for(let i=0;i<input.length;i++){
        if(!this.tags.includes(fields[i]) && fields[i]!="" && fields[i]!=undefined ){
          this.tags.push(fields[i]);
        }
      }
    } else if (!this.active && (disabledinput!='' && disabledinput!=undefined)){
      let fields = disabledinput.split('#');
      for(let i=0;i<disabledinput.length;i++){
        if(!this.tags.includes(fields[i]) && fields[i]!="" && fields[i]!=undefined ){
          this.tags.push(fields[i]);
        }
      }
    }
  }

  applyTags(value){
    console.log(value);
    if(value==""){
      this.linksDisplay = this.links;
      this.disabledlinksDisplay = this.disabledlinks;
    } else if(this.active){
      this.linksDisplay = [];
      for(let i=0;i<this.links.length;i++){
        if(this.links[i].tags){
          this.linksDisplay.push(this.links[i]);
        }
      }
    } else if(!this.active){
      this.disabledlinksDisplay = [];
      for(let i=0;i<this.disabledlinks.length;i++){
        if(this.disabledlinks[i].tags){
          this.disabledlinksDisplay.push(this.disabledlinks[i]);
        }
      }
    }
  }


  getRandomColor(): string {
    let color = '#'; // <-----------
    let letters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  constructPieAllTime(){
    this.myChart = new Chart("doughnut", { 
      type: 'doughnut', 
      data: {
        labels: this.linksId,
        datasets: [{
          data: this.linksNum,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(153,102,255)',
            'rgb(255,159,64)',
            'rgb(75,192,192)',
            'rgb(201,203,207)'
          ],
        }]
      },
      options: {
        //events: [],
        plugins: {
          legend: {
            display: false,
            
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        // scales: {
        //   y: {
        //     grid: {
        //       color: 'white'
        //     }
        //   },
        //   x: {
        //     grid: {
        //       color: 'red'
        //     }
        //   }
        // }
      
        
      }
    });
    this.isLoadedPie=true;
  }

  constructLine(){
    Chart.defaults.font.size = 16;
    //Chart.defaults.global.defaultFontStyle = 'Bold'
    for(let i=0;i < this.links.length && i < this.numForLineChart;i++){
      var response = this.api.sendGetRequestWithAuth("/auth/link/get/"+this.links[i].id+"/data/bytime72")
          response.subscribe(data => {
            
            let array = [];
            for(let i=0;i<data['payload'].length;i++){
              array.push(data['payload'][i].count);
              //console.log(data['payload']);
              
              if(this.labels.length!=24){
                this.labels.push(this.pipe.transform(data['payload'][i].starttime, 'MMM d : H.mm'));
              }
              
              
            }
            //console.log(data['payload']);
            let color = this.getRandomColor();
            this.data.push({label:this.links[i].name,data: array,borderColor: color,backgroundColor: color,yAxisID:"y"});
          }, error => {
            
              this.api.errorHandler(error.status);
          })
    }

    // console.log(this.labels);
    // console.log(this.data);

    this.MyLineChart = new Chart("linechart", { 
      type: 'line',
      data: {
        labels: this.labels.reverse(),
        datasets: this.data
      },
      options: {
        elements: {
          line: {
              tension: 0.3
          }
        },
        plugins: {
          legend: {
            display: false,
          }
        },
        
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        layout: {
          padding: 30
        },
        
        scales: {
          y: {
            grid: {
              color: 'rgba(255,255,255,0.8)'
            },
            ticks: {
              color: 'black',
              padding: 10,
            },
            beginAtZero: true
          },
          x: {
            grid: {
              color: 'rgba(255,255,255,0.0)',
              
            },
            ticks: {
              color: 'black',
              // autoSkip: true,
              // maxTicksLimit: 24
              callback:(value, index, values) => {
                //console.log(this.MyLineChart.data.labels[index]);
                if( index === 0 || index === 4 || index === 12 || index === 20){
                  return this.MyLineChart.data.labels[index].slice(0,6)
                }
                
              }
            },
            //type: 'time',
            // time: {
            //   unit: 'minute'
            // }
            // min: this.pipe.transform(start, 'dd/MM'),
            // max: this.pipe.transform(end, 'dd/MM'),
            time: {
              unit: 'day'
            }
          }
        }
      }
    });
    this.isLoadedLine=true;
  }

  constructPie24(){
    for(let i=0;i < this.links.length;i++){
      var response = this.api.sendGetRequestWithAuth("/auth/link/get/"+this.links[i].id+"/data/sum24")
          response.subscribe(data => {
            let array = [];
            let labelarray = [];
            array.push(data['payload'].count);
            if(this.links[i].displayName==""){labelarray.push(this.links[i].name);} 
            else {labelarray.push(this.links[i].displayName);}
            this.data24.push(array);
            this.label24.push(labelarray);
          }, error => {
              this.api.errorHandler(error.status);
          })
    }

    this.myChart24 = new Chart("doughnut24", { 
      type: 'pie', 
      data: {
        labels: this.label24,
        datasets: [{
          data: this.data24,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(153,102,255)',
            'rgb(255,159,64)',
            'rgb(75,192,192)',
            'rgb(201,203,207)'
          ],
        }]
      },
      options: {
        plugins: {
          legend: {display: false}
        },
        maintainAspectRatio: false,
        responsive: true,
      }
    });
    this.isLoadedPie=true;
  }

  

  format(tmp): string{
    if(tmp!=null){
      let gd = tmp.substring(0,tmp.indexOf('T'));
      let year = gd.substring(0,4);
      let month = gd.substring(5,7);
      let day = gd.substring(8,10);
      switch(month){
        case "01":
          month="Января";
          break;
        case "02":
          month="Февраля";
          break;
        case "03":
          month="Марта";
          break;
        case "04":
          month="Апреля";
          break;
        case "05":
          month="Мая";
          break;
        case "06":
          month="Июня";
          break;
        case "07":
          month="Июля";
          break;
        case "08":
          month="Августа";
          break;
        case "09":
          month="Сентября";
          break;
        case "10":
          month="Октября";
          break;
        case "11":
          month="Ноября";
          break;
        case "12":
          month="Декабря";
          break;
      }
      gd = day+" "+month+" "+year;
      return gd;
    } else {
      let gd = "";
      return gd;
    }
  }

  addData(chart, data) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
  }

  removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
  }

  openDialog(link): void {
  
  const dialogRef = this.dialog.open(LinkComponent, {
    data: {id: link.id, name: link.name, address: link.address, users: link.users, createdTime: link.createdTime},
    panelClass: "dialog"
  });

  dialogRef.afterClosed().subscribe(result => {
    //console.log('The dialog was closed');
  });
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: [className]
    });
  }

  // -------------------------     drawing svg -----------------------------------//

  drawicon(svg){


      let elements = this.elem.nativeElement.querySelectorAll(svg);

      console.log(elements[0].id);
      // this.context = elements[0].id.nativeElement.getContext('2d');
      // const ctx = elements[0].getContext('2d');

      
    
    
    

    
  }


  // -------------------------     24 HOUR GRAPHS -----------------------------------//

  
  private margin = {top: 0, right: 0, bottom: 0, left: 0};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  graphdata = [];
  chartId: string;


  graph24(id,data: any){
    this.buildSvg(id);
    this.addXandYAxis(data);
    this.drawLineAndPath(data);
  }

  private buildSvg(id) {
    this.svg = d3.select(id)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
  private addXandYAxis(data : any[]) {
     this.x = d3Scale.scaleLinear().range([0, this.width]);
     this.y = d3Scale.scaleLinear().range([this.height, 0]);
     this.x.domain(d3Array.extent(data, (d) => d.id ));
     this.y.domain(d3Array.extent(data, (d) => d.count ));
    this.svg.append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x).tickValues([]).tickSizeOuter(0)
        .tickSizeInner(0));
    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y)).call(g => g.select(".domain").remove());
  }

  private drawLineAndPath(data) {
    this.line = d3Shape.line()//.curve(d3Shape.curveNatural)
        .x( (d: any) => this.x(d.id) )
        .y( (d: any) => this.y(d.count) );
    this.svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', this.line);
  }
}