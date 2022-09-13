import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ApiCallerService } from '../api-caller.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  id: string;
}


@Component({
  selector: 'app-link-invite',
  templateUrl: './link-invite.component.html',
  styleUrls: ['./link-invite.component.scss']
})
export class LinkInviteComponent implements OnInit {
  

  myControl = new FormControl('');
  options = [];
  filteredOptions: Observable<string[]>;

  input = "";

  login;
  invitees = [];

  constructor(public invitedialogRef: MatDialogRef<LinkInviteComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,private api: ApiCallerService,private _snackBar: MatSnackBar) {}

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  search(tmp){
    this.options=[];
    if(tmp.data==null){
      this.input = this.input.slice(0, -1);
    } else {
      this.input += tmp.data;
    }
    // console.log(this.options);
    // console.log(tmp);
    // console.log(this.input);
    if(this.input.length>3){
      var data = {
        "login": this.input
      }
      var response = this.api.sendPostRequestWithAuth(data,"/auth/users/get")
          response.subscribe(data => {
            for(let i=0;i<data['payload'].length;i++){
              this.options.push(data['payload'][i].login);
            }
            //this.options = data['payload'];
            //console.log(data['payload']);
          }, error => {
            this.api.errorHandler(error.status);
          });
    }
  }

  invite(tmp){
    var data = {
      "id":tmp
    }
    //console.log(this.data.id);
    var response = this.api.sendPostRequestWithAuth(data, "/auth/link/"+this.data.id+"/invite")
    response.subscribe(data => {
      console.log(data['payload']);
      this.openSnackBar("Приглашение отправлено","","success");
    }, error => {
      // Add if login and password is incorrect.
      this.api.errorHandler(error.status);
      //this.router.navigateByUrl('/');
    })
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: [className]
    });
  }

  onNoClick(): void {
    this.invitedialogRef.close();
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

}