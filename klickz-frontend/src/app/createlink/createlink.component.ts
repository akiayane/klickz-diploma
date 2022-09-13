import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ApiCallerService } from '../api-caller.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-createlink',
  templateUrl: './createlink.component.html',
  styleUrls: ['./createlink.component.scss']
})
export class CreatelinkComponent implements OnInit {

  linkFormControl = new FormControl('', [Validators.required, Validators.pattern('https://.*')]);

  matcher = new MyErrorStateMatcher();

  link;

  constructor(private api: ApiCallerService, public router: Router) { 
    //this.api.myjwt =  sessionStorage.getItem('token');
    //console.log(this.api);
    //console.log(sessionStorage.getItem('token'));
    //console.log(sessionStorage.getItem('token'));
  }

  ngOnInit(): void {
  }

  submit(link){
    if (!this.isHttpUrl(this.link)){
      console.log("safe");
      var data = {
        "address":link
      }
      var response = this.api.sendPostRequestWithAuth(data, "/auth/link/create")
      response.subscribe(data => {
        console.log(link);
        // console.log("work");
        console.log(data['payload']);
        window.location.reload();
      }, error => {
        // Add if login and password is incorrect.
        this.api.errorHandler(error.status);
        this.router.navigateByUrl('/');
      })
    } else {
      console.log("not safe");
    }
    
  }

  isHttpUrl(url) {
    var pattern = "http://";
    if (url.includes(pattern)){
        return true;
    }else{
        return false;
    }
}

}
