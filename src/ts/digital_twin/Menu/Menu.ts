import * as $ from 'jquery';
import { World } from '../../world/World';

export class Menu {

    private status: string;
    protected colorSelected: string = "rgb(48, 141, 252)";
    protected colorNormal: string = "#464646";
    private idMenu: string[];
    public labelArr: string[];
    public world: World;

    constructor(world: World, menuID: string, optionIdOfMenu: string[], defaultOption: string) {
        this.world = world;
        this.dragElement(document.getElementById(menuID));
        this.idMenu = optionIdOfMenu;
        let labelArr = [];
        for(let i = 0; i < this.idMenu.length; i++){
          let label = this.idMenu[i].split("_");
          labelArr.push(label[1]);
        }
        this.labelArr = labelArr;
        this.menuClick();
        this.setStatus(defaultOption);
    }

    public menuClick(): void{
        for(let i = 0; i < this.labelArr.length; i++){
            // let arrOption = this.idMenu[i].split('_');
            document.getElementById(this.idMenu[i]).onclick = () => this.setStatus(this.labelArr[i]);
        }
    }

    public setStatus(newStatus: string): void{
        this.status = newStatus;
        let id = "menu_" + newStatus;
        let color = $(id).css("background-color");
        if(color !== this.colorSelected){
          $("#" + id).attr("style", "background-color: " + this.colorSelected +";");
          for(let i = 0; i < this.idMenu.length; i++){
              if(this.idMenu[i] != id){
                  $("#" + this.idMenu[i]).attr("style", "background-color: " + this.colorNormal + ";");
              }
          }          
        }
        this.executeNewStatus(newStatus);
    }

    public executeNewStatus(newStatus: string): void{

    }


    public getStatus(): string{
        return this.status;
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