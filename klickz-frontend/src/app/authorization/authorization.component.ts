import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiCallerService } from '../api-caller.service';
import {
  CSS3DRenderer,
  CSS3DObject
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import * as THREE from "three";
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  //loginForm: FormGroup;

  login;
  password;
  phone;

  camera;
  scene;
  renderer;

  showLogin = true;

  switch(){
    if (this.showLogin) {
      this.showLogin=false;
    } else {
      this.showLogin=true;
    } 
    var card = document.querySelector('.card');
    card.classList.toggle('is-flipped');
  }

  validation_messages = {
    'login': [
      { type: 'required', message: 'Необходимо ввести почту.' },
      { type: 'pattern', message: 'Введите правильную почту.' }
    ],
    'password': [
      { type: 'required', message: 'Необходимо ввести пароль.' },
      { type: 'minlength', message: 'Пароль не может быть короче 5 символов.' }
      // { type: 'pattern', message: 'Пароль должен содержать как минимум 1 заглавную букву, 1 строчную букву и 1 число.' }
    ],
  }

  error_code: number = 0;
  error_message: string = "";

  constructor(private api: ApiCallerService, public router: Router) {

    // this.loginForm = this.formBuilder.group({
    //   login: new FormControl('', Validators.compose([
    //     Validators.required,
    //     //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    //   ])),
    //   password: new FormControl('', Validators.compose([
    //     Validators.minLength(5),
    //     Validators.required,
    //     // Only Latin alphabet and numbers
    //     //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    //   ]))
    // });
  }

  ngOnInit(): void { 
    // this.camera = new THREE.PerspectiveCamera(40,window.innerWidth / window.innerHeight,1,10000);
    // this.camera.position.z = 1000;
  
    // this.scene = new THREE.Scene();

    // const main = document.createElement("div");
    // main.className = "main";


    // const head = document.createElement("div");
    // head.className = "fadeIn first";
    // head.innerHTML= '<div><h2>Регистрация</h2></div>';
    // main.appendChild(head);

    // const form = document.createElement("div");
    // form.className = "form";
    // form.innerHTML = "<input type='text' [(ngModel)]='login' class='fadeIn second' id='email' placeholder='Почта'><input type='password' [(ngModel)]='password' class='fadeIn third' id='password' placeholder='Пароль'><input type='button' (click)='console.log(1)' id='btn-login' class='fadeIn fourth' value='Войти'>";
    // main.appendChild(form);

    // const foot = document.createElement("div");
    // foot.id = "formFooter";
    // main.appendChild(foot);

    // const symbol = document.createElement("div");
    // symbol.className = "symbol";
    // symbol.textContent = table[i];
    // element.appendChild(symbol);

    // const details = document.createElement("div");
    // details.className = "details";
    // details.innerHTML = table[i + 1] + "<br>" + table[i + 2];
    // element.appendChild(details);

    // const objectCSS = new CSS3DObject(main);
    // objectCSS.position.x = 0;//Math.random() * 4000 - 2000;
    // objectCSS.position.y = 0;//Math.random() * 4000 - 2000;
    // objectCSS.position.z = 0;//Math.random() * 4000 - 2000;
    // this.scene.add(objectCSS);


    // this.renderer = new CSS3DRenderer();
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.render(this.scene, this.camera);
    // const container = document.getElementById("formContent");
    //if (container) container.appendChild(this.renderer.domElement);

    
    // var input = document.querySelector('#tmp');
    // card.addEventListener( 'click', function() {
    //   card.classList.toggle('is-flipped');
    //   //alert(input.value);
    // });
  }

  ngAfterViewInit() {
    
 
    
  }

  

  onSubmit(login: any, password: any){
    console.log(login,password);
    var data = {
      "login":login,
      "password":password
    }
    var response = this.api.sendPostRequest(data, "/common/login")
    response.subscribe(data => {
      sessionStorage.setItem('token', data['payload']);
      console.log(data['payload']);
      this.router.navigateByUrl('/dashboard/links');
    }, error => {
      // Add if login and password is incorrect.
      this.api.errorHandler(error.status);
    })
  }

  linkFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  matcher = new MyErrorStateMatcher();

  register(login: any, password: any, phone: any){
    var data = {
      "login":login,
      "password":password,
      "phone":phone
    }
    var response = this.api.sendPostRequest(data, "/common/registration")
    response.subscribe(data => {
      sessionStorage.setItem('phone', phone);
      console.log(data['payload']);
      this.router.navigateByUrl('/verification');
    }, error => {
      // Add if login and password is incorrect.
      this.api.errorHandler(error.status);
    })
  }

}
