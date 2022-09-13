import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiCallerService } from '../api-caller.service';
import { catchError, tap } from "rxjs/operators";
import { throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isCollapsed1 = true;
  public isCollapsed2 = false;
  public isCollapsed3 = false;

  status;

  available = false;

  ipAddress = '';
  ipData;
  ip;

  constructor(private api: ApiCallerService, private http:HttpClient) {
    var response = this.api.sendGetRequest("/healthcheck")
    response.subscribe(data => {
      console.log(data['payload']);
      this.status = data['payload'];
      if(this.status.status != "available"){
        this.available = true;
      }
    }, error => {
      this.api.errorHandler(error.status);
    })
    
  }

  ngOnInit(): void {
    this.http.get("https://geolocation-db.com/json/'").subscribe((res:any)=>{
      this.ip = res.IPv4;
      
     //console.log(res);

     var response = this.api.sendGetRequestCustomUrl("https://klic.kz/ipparser/get/"+this.ip)
      response.subscribe(data => {
        this.ipData=data['payload'];
      console.log(data['payload']);
      }, error => {
        this.api.errorHandler(error.status);
      })
    });

    // this.http.get<any>('https://geolocation-db.com/json/')
    // .pipe(catchError(err => {
    // return throwError(err);
    // }),
    // tap(response => {
    // console.log(response.IPv4);
    // })
    // )
    
    //setTimeout(() => this.getIPAddress(),2000);
    
  }

  get(){
    
  }

  ngAfterContentInit() {
    // (() => {
    //   let nav = document.getElementById('#nav');
    //   window.addEventListener('scroll', () => {
    //     if (window.scrollY > 1.5) {
    //       nav!.classList.add("fixed-top");
    //       document.body.style.paddingTop = '70';
    //     } else {
    //       nav!.classList.remove("fixed-top");
    //       document.body.style.paddingTop = '0';
    //     }
    //   });
    //   console.log('Listner added');
    // })()
  }

}
