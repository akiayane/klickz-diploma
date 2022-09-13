import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiCallerService } from '../api-caller.service';
import { InviteComponent } from '../invite/invite.component';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {

  pendingLinks;

  constructor(private api: ApiCallerService, public router: Router, public dialog: MatDialog) {
    var response = this.api.sendGetRequestWithAuth("/auth/userdata/invites")
    response.subscribe(data => {
      console.log(data['payload']);
      this.pendingLinks = data['payload'];
      // for(let i=0;i<this.pendingLinks.length;i++){
        
      //   if(this.pendingLinks[i].user.name != ""){

      //   }
      // }
    }, error => {
      // Add if login and password is incorrect.
      this.api.errorHandler(error.status);
      this.router.navigateByUrl('/');
    })
  }

  accept(id){
    console.log(id);
    //console.log(this.pendingLinks);
    // for(let i=0;i<this.pendingLinks.length;i++){
    //   if(this.pendingLinks[i].link.id == id){
    //     alert("g");
    //     delete this.pendingLinks[i];
    //   }
    // }
    var response = this.api.sendGetRequestWithAuth("/auth/link/"+id+"/accept")
    response.subscribe(data => {
      console.log(data['payload']);
      window.location.reload();
    }, error => {
      this.api.errorHandler(error.status);
     
    })
  };

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

  openDialog(link): void {
  
    const dialogRef = this.dialog.open(InviteComponent, {
      data: {linkdata: link},
      panelClass: 'invite',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The invite dialog was closed');
    });
  }

  ngOnInit(): void {
  }

}
