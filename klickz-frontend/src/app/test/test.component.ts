import { Component } from "@angular/core";
import * as ChartGeo from "chartjs-chart-geo";
import { Chart, registerables } from 'chart.js'; 
import { ApiCallerService } from "../api-caller.service";
import { FeatureCollection } from "geojson";
import * as d3 from "d3";
Chart.register( ...registerables);

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"]
})
export class TestComponent {

    private margin = {top: 0, right: 0, bottom: 0, left: 0};
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    private svg: any;
    graphdata = [];
    chartId: string;

    dataGeo = [];
    

    constructor(private api: ApiCallerService){
        // var response = this.api.sendGetRequestWithAuth(`/auth/link/get/1/data`)
        // response.subscribe(data => {
        // this.alldata = data['payload'];
        // console.log(this.alldata);


        // }, error => {
        // this.api.errorHandler(error.status);
        // // this.router.navigateByUrl('/');
        // })

        var files = ["https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"];
        var promises = [];

        files.forEach(function(url) {
            promises.push(d3.json(url))
        });

        Promise.all(promises).then(function(values) {
            console.log(this.dataGeo);
            this.dataGeo=values[0].features;
            //this.ready(values);
            //console.log(values[0].features);
        });
    }

    ngOnInit() { 
        
        //https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson
        

        
    
    }

    ngAfterViewInit(){
        this.svg = d3.select("#my_dataviz")
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        var projection = d3.geoMercator().center([0,20]).scale(99).translate([this.width/2,this.height/2]);

        var pathBuilder = d3.geoPath(projection);
        this.svg = d3.select("#my_dataviz")
            .append('g').selectAll("path").data(this.dataGeo)
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')').enter().append('path').attr("d", function(t:any){
                return pathBuilder(t);
            });
    }

    

      
   

}
