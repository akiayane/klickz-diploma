import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LinksComponent } from '../links/links.component';

import { Chart, registerables } from 'chart.js'; 
import { ApiCallerService } from '../api-caller.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
Chart.register( ...registerables);
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import { LinkInviteComponent } from '../link-invite/link-invite.component';


export interface DialogData {
  id: string;
  name: string;
  address: string;
  users: [];
  createdTime: string;
}


@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {

  createdTime;

  //data for piechart
  count;
  count24;

  //arrays for linechart
  lineChartCounts = [];
  lineChartLabels = [];

  RegionsChart: Chart<"pie", any[], string>;
  DevicesChart: Chart<"pie", any[], string>;
  lineChart: Chart<"line", any[], string>;

  ucountries = [];
  countries = [];
  devices = [];

  newlink = "http://klic.kz/l/"+this.data.name;

  localusers = [];

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [],
    showTitle: false,
    title: '',
    useBom: false,
    removeNewLines: true,
    filename: "test",
    keys: ['num','ip','device','createdTime']
  };
  
  loaded: boolean;

  labels = [];
  Gdata = [];
  tmpArr = [];

  alldata = [];

  pipe = new DatePipe('en-US');


  counter = 0;

  isLoaded = false;

  link;

  invitees = [];

  constructor(private api: ApiCallerService, public router: Router, public dialogRef: MatDialogRef<LinksComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,  private _snackBar: MatSnackBar, public dialog: MatDialog) {

    var response = this.api.sendGetRequestWithAuth("/auth/link/get/"+data.id+"/data/bytime")
          response.subscribe(data => {
            for(let i=0;i<data['payload'].length;i++){
              this.tmpArr.push(data['payload'][i].count);
              this.labels.push(this.pipe.transform(data['payload'][i].starttime, 'HH:MM'));
            }
            this.Gdata.push({label:'',data: this.tmpArr,borderColor: "white",backgroundColor: "white",yAxisID:"y"});
            this.tmpArr=[];
          }, error => {
              this.api.errorHandler(error.status);
          })

    this.createdTime = this.format(data.createdTime);
    this.localusers = data.users;
    //console.log(this.localusers);

    var response = this.api.sendGetRequestWithAuth("/auth/link/get/"+data.id+"/data")
          response.subscribe(data => {
            for(let i=0;i<data['payload'].length;i++){
              this.countries.push(data['payload'][i].country);
              this.devices.push(data['payload'][i].device);
              this.alldata = data['payload'];
              //console.log(this.alldata);
            }
          }, error => {
              this.api.errorHandler(error.status);
          });

          
  }

  format(tmp): string{
    if(tmp!=null){
      let HM = tmp.substring(tmp.indexOf('T')+1,tmp.indexOf('T')+6);
      let gd = tmp.substring(0,tmp.indexOf('T'));
      let year = gd.substring(0,4);
      let month = gd.substring(5,7);
      let day = gd.substring(8,10);
      
      gd = day+"/"+month+"/"+year+" - "+HM;
      return gd;
    } else {
      let gd = "";
      return gd;
    }
  }

  onNoClick(): void {
    if(this.RegionsChart != null){
      this.RegionsChart.destroy();
    }
    if(this.DevicesChart != null){
      this.DevicesChart.destroy();
    }
    if(this.lineChart != null){
      this.lineChart.destroy();
    }
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // var response = this.api.sendGetRequestWithAuth(`/auth/link/get/${this.data.id}/data/sum`)
    // response.subscribe(data => {
    //   console.log(data['payload']);
    //   this.count = data['payload'].count;
    // }, error => {
    //   // Add if login and password is incorrect.
    //   this.api.errorHandler(error.status);
    //   this.router.navigateByUrl('/');
    // })

    // response = this.api.sendGetRequestWithAuth(`/auth/link/get/${this.data.id}/data/sum24`)
    // response.subscribe(data => {
    //   //console.log(data['payload']);
    //   this.count24 = data['payload'].count;
    // }, error => {
    //   // Add if login and password is incorrect.
    //   // this.api.errorHandler(error.status);
    //   // this.router.navigateByUrl('/');
    // })

    

    // response = this.api.sendGetRequestWithAuth(`/auth/link/get/${this.data.id}/data/bytime`)
    // response.subscribe(data => {
    //   for(let i=0;i<data['payload'].length;i++){

    //     this.lineChartCounts.push(data['payload'][i].count);
    //     this.lineChartLabels.push(data['payload'][i].starttime.substring(11,19));
    //   }
    // }, error => {
    //   // Add if login and password is incorrect.
    //   this.api.errorHandler(error.status);
    //   // this.router.navigateByUrl('/');
    // })

    // ------------------ link preview check

    // var url = "https://www.youtube.com/watch?v=MejbOFk7H6c";

    // getLinkPreview(url).then((data) =>
    //   console.debug(data)
    // );
  }

  ngAfterViewInit(){

    


    setTimeout(()=>{                         
    

    this.constructPieCountries();
    this.constructPieDevices();
    this.constructLineChart();
    
    this.isLoaded=true;
    }, 1000);
    
  }

  constructPieCountries(){
    var ucountries = [];
    const counts = {};
    var countsarray = [];
    for (const num of this.countries) {
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    for(let i=0;i<this.countries.length;i++){
      if(ucountries.indexOf(this.countries[i]) === -1){
        ucountries.push(this.countries[i]);
      }  
    }
    for(let i=0;i<ucountries.length;i++){
      countsarray.push(counts[ucountries[i]]);
    }
    //console.log(countsarray);

    this.RegionsChart = new Chart("regions", { 
      type: 'pie', 
      data: {
        labels: ucountries,
        datasets: [{
          data: countsarray,
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
          legend: {
            display: true,
            labels:{
              color: "white"
            }
          },
          title: {
            display: true,
            text: 'Страны',
            color: "white"
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

  }

  constructPieDevices(){
    var udevices = [];
    const counts = {};
    var countsarray = [];
    for (const num of this.devices) {
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    for(let i=0;i<this.devices.length;i++){
      if(udevices.indexOf(this.devices[i]) === -1){
        udevices.push(this.devices[i]);
      }  
    }
    for(let i=0;i<udevices.length;i++){
      countsarray.push(counts[udevices[i]]);
    }

    this.DevicesChart = new Chart("devices", { 
      type: 'pie', 
      data: {
        labels: udevices,
        datasets: [{
          data: countsarray,
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
            labels:{
              color: "white"
            }
          },
          title: {
            display: true,
            text: 'Устройства',
            color: "white"
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
  }

  constructLineChart(){
    this.lineChart = new Chart("SlineChart", { 
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.Gdata,
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Активность за 24 часа',
            color: "white"
          }
        },
        elements: {
          line: {
              tension: 0.5,
              backgroundColor: 'rgb(255,255,255)',
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        
        scales: {
          y: {
            grid: {
              color: 'rgba(255,255,255,0.5)'
            },
            ticks: {
              color: 'white',
            }
          },
          x: {
            grid: {
              color: 'rgba(255,255,255,0.5)'
              
            },
            ticks: {
              color: 'white',
              font: {
                size: 17,
              }
            },
            time: {
              unit: 'day'
            }
          }
        }
      }
    });
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: [className]
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LinkInviteComponent, {
      data: {id: this.data.id},
      width: "40%",
      height: "30%"
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.invitees = result;
      console.log(this.invitees);
    });
  }




  
  

}
