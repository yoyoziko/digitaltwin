import * as $ from 'jquery';

export class BookMark {

    private currentWindow: string;

    constructor() {
        this.setZIndex(90);
        // this.dragElement(document.getElementById("bookMarkEnvContentBox"));
        // this.dragElement(document.getElementById("bookMarkOccuContentBox"));
        // this.dragElement(document.getElementById("bookMarkReportContentBox"));

        this.dragElement("bookMarkEnvContentBox");
        this.dragElement("bookMarkOccuContentBox");
        this.dragElement("bookMarkReportContentBox");

        this.dragElement("settingsEnvContentBox");

    }

    private setZIndex(num: number): void{
      sessionStorage.setItem('currentZIndex', num + "");
    }

    // public dragElement(elmnt: any): void {
    public dragElement(id: string): void {

      let elmnt = document.getElementById(id);

        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          /* if present, the header is where you move the DIV from:*/
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
          // elmnt.onmousedown = dragMouseDown;
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
          
          if(this.currentWindow != elmnt.id){
            this.currentWindow = elmnt.id;

            

            if(parseInt($('#' + id).css('z-index')) >= parseInt(sessionStorage.getItem('currentZIndex'))){
              let zIndex = parseInt($('#' + id).css('z-index'));
              zIndex++;
              sessionStorage.setItem('currentZIndex', zIndex + "");
            }else{
              let zIndex = parseInt(sessionStorage.getItem('currentZIndex'));
              zIndex++;
              sessionStorage.setItem('currentZIndex', zIndex + "");
            }

            $('#' + id).css('z-index', parseInt(sessionStorage.getItem('currentZIndex')));
            // console.log($('#' + id).css('z-index'));

            // $('#' + id).css('z-index', _countZIndex);
            // console.log($('#' + id).css('z-index'), _countZIndex)

            // if($('#' + id).css('z-index') > this.countZIndex){
            //   this.countZIndex = $('#' + id).css('z-index');
            // }



          }

        }
      
        function closeDragElement() {
          /* stop moving when mouse button is released:*/
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }

  }