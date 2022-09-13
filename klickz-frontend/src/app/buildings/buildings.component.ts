import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from "three";

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss']
})
export class BuildingsComponent implements OnInit, AfterViewInit {
  brick: THREE.Group;
  glass: THREE.Group;

  mixer;
  clock = new THREE.Clock();

  constructor() {  }  

  @ViewChild('canvas') private canvasRef: ElementRef = ViewChild('canvas');

  @Input() public rotationSpeedX: number = 0.05;

  @Input() public rotationSpeedY: number = 0.01;

  @Input() public size: number = 600;

  @Input() public texture: string = "bruh";

  @Input() public cameraZ: number = 400;

  @Input() public filedOfView: number = 1;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 1000;

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement{
    return this.canvasRef.nativeElement;
  };

  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(1,1,1);
  //private biggeometry = new THREE.BoxGeometry(2,2,2);
  private biggergeometry = new THREE.BoxGeometry(4,4,4);
  private material = new THREE.MeshBasicMaterial({/*map: this.loader.load(this.texture)*/color: 0xF7F7F7,
  wireframe: true,
  wireframeLinewidth: 2});

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  //private bigcube: THREE.Mesh = new THREE.Mesh(this.biggeometry, this.material);

  private biggercube: THREE.Mesh = new THREE.Mesh(this.biggergeometry, this.material);

  private renderer = new THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private controls;

  private gltfloader = new GLTFLoader();


  private createScene(){
    this.scene = new THREE.Scene;
    this.scene.add(this.cube);
    //this.scene.add(this.bigcube);
    this.scene.add(this.biggercube);

    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.filedOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    var lightAmb = new THREE.AmbientLight(0xFFFFFF, 1);
    this.scene.add(lightAmb);
    this.camera.position.z = this.cameraZ;
    // this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    // this.controls.update();
  }

  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  

  private animate(){
    this.cube.rotation.x += this.rotationSpeedX/2;
    this.cube.rotation.y += this.rotationSpeedY/2;

    //this.bigcube.rotation.x += this.rotationSpeedX/4;
    //this.bigcube.rotation.y += this.rotationSpeedY/4;

    this.biggercube.rotation.x += this.rotationSpeedX/8;
    this.biggercube.rotation.y += this.rotationSpeedY/8;
    // this.controls.update();

    //requestAnimationFrame( this.animate );
    // var delta = this.clock.getDelta();
    // if ( this.mixer ) this.mixer.update( delta );
    // this.renderer.render( this.scene, this.camera );
  }


  startRenderingLoop() {
    this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,alpha: true, antialias: true});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth,this.canvas.clientHeight);
    this.renderer.setAnimationLoop(() => {
    this.animate();
    this.renderer.render(this.scene, this.camera);
    });
    }


  ngOnInit(): void {
    // this.gltfloader.load('/assets/models/house_brick.gltf', (gltf) => {
    //   //gltf.scene.scale.set(0.3,0.3,0.3);
    //   gltf.scene.position.x = 2;
    //   gltf.scene.rotation.y = 1.3;
    //   gltf.scene.rotation.x = 0.5;  
    //   this.brick = gltf.scene;
    //   this.brick.position.y = -2.7;
    //   this.scene.add(this.brick);
    // });
    // this.gltfloader.load('/assets/models/glass_house.gltf', (gltf) => {
    //   gltf.scene.scale.set(0.5,0.5,0.5);
    //   gltf.scene.position.x = 3;
    //   gltf.scene.position.y = 2;
    //   gltf.scene.position.z = -6;
    //   // gltf.scene.position.y = 5;
    //   gltf.scene.rotation.y = -0.25;
    //   gltf.scene.rotation.x = 0.5;  
    //   gltf.scene.rotation.z = 0; 

    //   this.mixer = new THREE.AnimationMixer( gltf.scene );
    //   //var action = this.mixer.clipAction( gltf.animations[0] );
    //   //action.play();

    //   this.glass = gltf.scene;
    //   this.glass.position.y = -1;
    //   this.scene.add(this.glass);
    // });
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }

}
