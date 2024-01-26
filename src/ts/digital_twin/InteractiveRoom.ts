
import * as THREE from 'three';
import { World } from '../world/World';
// import { SciTuReport } from './SciTuReport';

export class InteractiveRoom {

    public world: World;
    public pointer: THREE.Vector2;
    public raycaster: THREE.Raycaster;
    public INTERSECTED: any;
    public domElement: any;
    public currentRoom: string;
    public isMouseOnRoom: boolean;

    constructor(world: World, domElement: HTMLElement) {
      this.world = world;
      this.pointer = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();
      this.domElement = domElement || document.body;
    }

    public onPointerMove(event: MouseEvent): void {
      
      if ( event.button != 0 ) return;
      this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      
    }

    public render(): void {

      if(this.world.mainDigitalTwin.menuObjectMode.getStatus() === "click"){

        if (this.world !== undefined && this.world.camera !== undefined){
    
          this.raycaster.setFromCamera( this.pointer, this.world.camera );
    
          let intersects = this.raycaster.intersectObjects( this.world.graphicsWorld.children, true );

          if ( intersects.length ) {

            if(intersects[0].object.hasOwnProperty('userData') && 
            intersects[0].object.userData.hasOwnProperty('type') && 
            intersects[0].object.userData.type === "room"){
              // console.log('doing')

            if ( this.INTERSECTED != intersects[0].object ) {

                // console.log(intersects[0].object)
                if ( this.INTERSECTED && !(<any>this.INTERSECTED).isOpenDashboardOnSAGE){
                  // if((<any>intersects[0].object).isOpenDashboardOnSAGE){
                    this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                    this.INTERSECTED.material.opacity = 0; 
                  // }
                }

                this.INTERSECTED = intersects[0].object;

                if(!(<any>intersects[0].object).isOpenDashboardOnSAGE){
                  this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                  this.INTERSECTED.material.color.setHex( 0xff0000 );
                  this.INTERSECTED.material.opacity = 0.3;                     
                }

                this.domElement.style.cursor = "pointer";
                this.currentRoom = this.INTERSECTED.name;
                this.isMouseOnRoom = true;

              }


            }else{
              if ( this.INTERSECTED && !(<any>this.INTERSECTED).isOpenDashboardOnSAGE){
                // console.log((<any>this.INTERSECTED).isOpenDashboardOnSAGE)
                  this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                  this.INTERSECTED.material.opacity = 0;
                // this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
                // this.INTERSECTED.material.opacity = 0;
              }
              this.INTERSECTED = null;
              this.domElement.style.cursor = "default";
              this.isMouseOnRoom = false;
            }
      
          }

        }      

      }


    }
  }