import { Component, OnInit } from '@angular/core';
import { ApiCallerService } from '../api-caller.service';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {

  Api;
  router: any;

  constructor(private api: ApiCallerService) {
    var response = this.api.sendGetRequestWithAuth("/auth/userdata")
    response.subscribe(data => {
      console.log(data['payload']);
      this.Api = data['payload'].apitoken;
    }, error => {
      // Add if login and password is incorrect.
      this.api.errorHandler(error.status);
      this.router.navigateByUrl('/');
    })

  }

  generate(){
    var response = this.api.sendGetRequestWithAuth("/auth/userdata/createtoken")
    response.subscribe(data => {
      this.Api = data['payload'].token;
      console.log(this.Api);
    }, error => {
      this.api.errorHandler(error.status);
      //this.router.navigateByUrl('/');
    })
  }

  ngOnInit(): void {
  }

}
