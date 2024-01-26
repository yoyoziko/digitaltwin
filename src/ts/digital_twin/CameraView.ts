import * as $ from 'jquery';
import { World } from '../world/World';
import * as THREE from 'three';

export class CameraView {

    public world: World;
    public setNewPosition: (evt: any) => void;

    constructor(world: World) {
        this.world = world;
        this.dragElement(document.getElementById("menu_search_room"));
        this.setOnClick();
    }

    private setOnClick(): void{
      this.setNewPosition = (evt) => this.searchAndSetNewPosition(evt);

      document.getElementById("selected_room_search").addEventListener('click', this.setNewPosition);
    }

    public async searchAndSetNewPosition(event: MouseEvent): Promise<any>{
        if((<any>event).pointerId === 0){
          let room = (document.getElementById('selected_room_search') as HTMLInputElement).value;
          let currentFloor = this.world.mainDigitalTwin.menuFloor.getStatus();
          if(!this.world.cameraOperator.characterCaller){
            currentFloor = 'site';
          }
          try{
            let postion = await this.world.mainDigitalTwin.server.getRoomPosition(room, currentFloor);
            
            if(!this.world.cameraOperator.characterCaller){
              this.world.characters[0].setPosition(postion.target.x, postion.target.y, postion.target.z);
            }

            this.setCameraPosition(postion.target, postion.radius, postion.theta, postion.phi);
          }catch(err){
            console.log('error: you can\'t goto this position');
          } 
          
        }
    }

    public setCameraPosition(target: any, radius: number, theta: number, phi: number): void{

        this.world.cameraOperator.target = new THREE.Vector3(target.x, target.y, target.z);
        this.world.cameraOperator.radius = radius;
        this.world.cameraOperator.theta = theta;
        this.world.cameraOperator.phi = phi;
    }

    public initCameraView(): void{

      this.world.cameraOperator.camera.position.x = -7.458045225567071;
      this.world.cameraOperator.camera.position.y = 48.31028767606726;
      this.world.cameraOperator.camera.position.z = 67.02879209699724;
      
      this.world.cameraOperator.camera.updateMatrix();
    }

    public dragElement(elmnt: any): void {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          /* if present, the header is where you move the DIV from:*/
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
          /* otherwise, move the DIV from anywhere inside the DIV:*/
          elmnt.onmousedown = dragMouseDown;
        }
      
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
      
        function closeDragElement() {
          /* stop moving when mouse button is released:*/
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }

  }