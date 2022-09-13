import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiCallerService } from '../api-caller.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  userdata;
  id;
  login;
  phone;

  email;
  name;
  surname;

  oldemail;
  oldname;
  oldsurname;

  changes = false;

  url;
  allowchange = true;

  submit(){
    var data = {
      "name":this.name,
      "surname":this.surname,
      "email":this.email
    }
    var response = this.api.sendPostRequestWithAuth(data, "/auth/userdata/update")
    response.subscribe(data => {
      //sessionStorage.setItem('token', data['payload']);
      this.openSnackBar();
      //console.log(data['payload']);
      this.changes=false;
      //this.router.navigateByUrl('/dashboard/links');
    }, error => {
      // Add if login and password is incorrect.
      this.api.errorHandler(error.status);
    })
  }

  change(){
    this.cdRef.detectChanges();
    console.log(this.name + " - new; "+ this.oldname + " - old");
    //this.changes=+1;
    
    if(this.name!=this.oldname || this.email!=this.oldemail || this.surname!=this.oldsurname){
      this.changes=true;
    }
    
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0] && this.allowchange) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
    this.allowchange = false;
  }

  delete(){
    this.url = null;
    this.changes=true;
    setTimeout(() => this.allowchange = true, 100);
  }

  openSnackBar() {
    this._snackBar.open("Обновлено", "action");
    setTimeout(() => {
      this._snackBar.dismiss();
    },4000)
  }

  constructor(private api: ApiCallerService, public router: Router, private cdRef:ChangeDetectorRef, private _snackBar: MatSnackBar) { 

    var response = this.api.sendGetRequestWithAuth("/auth/userdata")
    response.subscribe(data => {
      //console.log(data['payload']);
      this.userdata = data['payload'];
      this.id = this.userdata.id;
      this.login = this.userdata.login;
      this.phone = this.userdata.phone;
      this.email = this.userdata.email;
      this.name = this.userdata.name;
      this.surname = this.userdata.surname;
      this.url = "https://klic.kz/web" + this.userdata.photoUrl;
    }, error => {
      // Add if login and password is incorrect.
      this.api.errorHandler(error.status);
      this.router.navigateByUrl('/');
    })

    

    sessionStorage.getItem('userdata')
  }

  exit(){
    //sessionStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }

  ngOnInit(): void {
    console.log(sessionStorage.getItem('userdata'));
  }

}
