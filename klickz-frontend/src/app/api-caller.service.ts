import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiCallerService {

  myjwt: any;
  router: any;

  constructor(public http: HttpClient) {

  }

  const_url = "https://klic.kz/web" //"https://saktan.kz/api"

  ngOnInit(){}

  sendPostRequest(data: any, url: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json',
        })
      };

    return this.http.post(this.const_url+url, data, httpOptions)

  }

  sendPostRequestWithAuth(data: any, url: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json',
        'Akis-Jwt-Token': this.myjwt
        })
      };

    return this.http.post(this.const_url+url, data, httpOptions)
  }

  sendPatchRequest(data: any, url: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json',
        })
      };

    return this.http.patch(this.const_url+url, data, httpOptions)

  }

  sendPatchRequestWithAuth(data: any, url: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json',
        'Akis-Jwt-Token': this.myjwt
        })
      };

    return this.http.patch(this.const_url+url, data, httpOptions)
  }


  sendGetRequest(url: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json',
        })
      };

    return this.http.get(this.const_url+url, httpOptions)
  }


  sendGetRequestCustomUrl(url: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json',
        })
      };

    return this.http.get(url, httpOptions)
  }

  sendGetRequestWithAuth(url: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json',
        'Akis-Jwt-Token': this.myjwt
        })
      };

    return this.http.get(this.const_url+url, httpOptions)
  }

  // getRequest(url: string): Promise<any> {
  //   return new Promise<any>(
  //     function (resolve, reject) {
  //       const request = new XMLHttpRequest();
  //       request.onload = function () {
  //         if (this.status === 200) {
  //           resolve(this.response);
  //         } else {
  //           reject(new Error(this.statusText));
  //         }
  //       };
  //       request.onerror = function () {
  //         reject(new Error('XMLHttpRequest Error: ' + this.statusText));
  //       };
  //       request.open('GET', url);
  //       request.send();
  //     })
  //   }

  errorHandler(errorcode: number){
    // if (errorcode == 500) {
    //   return "Произошла серверная ошибка!"
    // }
    // if (errorcode == 404){
    //   return "Не найдено!"
    // }
    // if (errorcode == 400){
    //   return "Неправильный запрос!"
    // }
  }

  apiErrorHandlingManager(error: any) {
    if (error.status == 401 || error.status == 403 || error.status == 405) {
      sessionStorage.removeItem("manager_access_data");
      console.log(error.status)
      this.router.navigateByUrl('/gate');
    }
  }
  apiErrorHandlingUser(error: any) {
    if (error.status == 401 || error.status == 403 || error.status == 405) {
      sessionStorage.removeItem("user_access_data");
      console.log(error.status)
      this.router.navigateByUrl('/auth');
    }
  }

}
