import { Component, OnInit } from '@angular/core';
import { ApiCallerService } from '../api-caller.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-startverification',
  templateUrl: './startverification.component.html',
  styleUrls: ['./startverification.component.scss']
})
export class StartverificationComponent implements OnInit {

  phone;
  code;
  verification_code;

  timerCheck: boolean = false;

  constructor(private api: ApiCallerService, public router: Router) { 
    this.phone = sessionStorage.getItem('phone');
    var data = {
      "phone":this.phone
    }
    var response = this.api.sendPostRequest(data, "/common/startverification")
    response.subscribe(data => {
      console.log(data['payload']);
      this.verification_code = data['payload'];
      //this.router.navigateByUrl('/verify');
    }, error => {
      // Add if login and password is incorrect.
      this.api.errorHandler(error.status);
    })
  }

  ngOnInit(): void {
    setTimeout(() => this.timerCheck = true, 60000);
  }

  // this called every time when user changed the code
  onCodeChanged(code: string) { }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
    if (code == this.verification_code){
      var data = {
        "phone":this.phone
      }
      var response = this.api.sendPostRequest(data ,"/common/verify")
      response.subscribe(data=> {
        console.log(data['payload'])
        this.router.navigateByUrl('/dashboard')
      }, error=> {
        if (error.staus == 401) {
          //this.login_message = "Неверный код"
        }
      });
    } else {
      alert("no");
      this.code = "";
    }
  }

  reCall() {
    var data = {
      "phone" : this.phone
    }
    var response = this.api.sendPostRequest(data ,"/common/startverification")
    response.subscribe(data => {
      this.verification_code = data['payload'];
    }, error=> {
      //this.error_message = this.api.errorHandler(error.status)
    });

    this.timerCheck = false;
    setTimeout(() => this.timerCheck = true, 60000);
  }

}
