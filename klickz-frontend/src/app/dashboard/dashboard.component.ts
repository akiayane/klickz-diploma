import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallerService } from '../api-caller.service';
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // private opened: boolean = true;
  // private mediaWatcher: Subscription;
  //private menu: NavItem[] = menu;

  constructor(private api: ApiCallerService, public router: Router, private media: MediaObserver) {
    // this.api.myjwt =  sessionStorage.getItem('token');
    // //console.log(this.api);
    // console.log(sessionStorage.getItem('token'));
    // var response = this.api.sendGetRequestWithAuth("/auth/userdata")
    // response.subscribe(data => {
    //   console.log(data['payload']);
    //   sessionStorage.setItem('user', JSON.stringify(data['payload']));
    // }, error => {
    //   // Add if login and password is incorrect.
    //   this.api.errorHandler(error.status);
    //   this.router.navigateByUrl('/');
    // })


    // this.mediaWatcher = this.media.media$.subscribe((mediaChange: MediaChange) => {
    //     this.handleMediaChange(mediaChange);
    // })
    
  }

  // private handleMediaChange(mediaChange: MediaChange) {
  //     if (this.media.isActive('lt-md')) {
  //         this.opened = false;
  //     } else {
  //         this.opened = true;
  //     }
  // }

  // ngOnDestroy() {
  //     this.mediaWatcher.unsubscribe();
  // }

  ngOnInit(): void {
  }
}
