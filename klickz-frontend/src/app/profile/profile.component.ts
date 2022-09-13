import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterOutlet } from '@angular/router';
import { ApiCallerService } from '../api-caller.service';
import { routeTransitionAnimations } from '../route-transition-animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [routeTransitionAnimations]
})
export class ProfileComponent implements OnInit {

  links = ['account', 'api', 'invites'];
  titles = ['Профиль', 'API', 'Приглашения'];
  activeLink;

  prepareRoute(outlet: RouterOutlet) {
    return outlet && 
      outlet.activatedRouteData && 
      outlet.activatedRouteData['animationState'];
  }




  pendingLinks = [];

  constructor(private api: ApiCallerService, public router: Router, private cdRef:ChangeDetectorRef, private _snackBar: MatSnackBar) { 
    //this.api.myjwt =  sessionStorage.getItem('token');

    
    for (let i=0;i<this.links.length;i++){
      //console.log(this.links[i]);
      console.log(this.router.url.slice(19));
      if (this.router.url.slice(19) == this.links[i]){
        this.activeLink = this.links[i];
        break
      }
    }

    // var response = this.api.sendGetRequestWithAuth("/auth/userdata")
    // response.subscribe(data => {
    //   console.log(data['payload']);
    //   // this.userdata = data['payload'];
    //   // this.Api = this.userdata.apitoken;
    //   // this.id = this.userdata.id;
    //   // this.login = this.userdata.login;
    //   // this.phone = this.userdata.phone;
    //   // this.email = this.userdata.email;
    //   // this.name = this.userdata.name;
    //   // this.surname = this.userdata.surname;
    //   sessionStorage.setItem('userdata', data['payload']);
    // }, error => {
    //   // Add if login and password is incorrect.
    //   this.api.errorHandler(error.status);
    //   this.router.navigateByUrl('/');
    // })
    

    
    
    
    
    
  }

  


  

  ngOnInit() {

  }

  ngAfterViewInit(){
    // this.oldemail = this.email;
    // this.oldname = this.name;
    // this.oldsurname = this.surname;
    
  }

  exit(){
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }






  openSnackBar() {
    this._snackBar.open("Обновлено", "action");
    setTimeout(() => {
      this._snackBar.dismiss();
    },4000)
  }


}
