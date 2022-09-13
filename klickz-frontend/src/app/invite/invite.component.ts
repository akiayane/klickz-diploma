import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiCallerService } from '../api-caller.service';

export interface DialogData {
  linkdata: any;
}

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})

export class InviteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private api: ApiCallerService) {
    console.log(data.linkdata);
  }

  format(tmp): string{
    if(tmp!=null){
      let HM = tmp.substring(tmp.indexOf('T')+1,tmp.indexOf('T')+6);
      let gd = tmp.substring(0,tmp.indexOf('T'));
      let year = gd.substring(0,4);
      let month = gd.substring(5,7);
      let day = gd.substring(8,10);
      
      gd = day+"/"+month+"/"+year;
      return gd;
    } else {
      let gd = "";
      return gd;
    }
  }

  formatInvite(tmp): string{
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

  ngOnInit(): void {
  }

}
