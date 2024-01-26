import { World } from '../world/World';

export class Popup_Data {

    public world: World;

    constructor(world: World) {
      this.world = world;

      document.getElementById('updateModelRoom').onclick = async () => {
        let val = (document.getElementById("room_id_updateModelRoom") as HTMLInputElement).value || '';
        this.updateModelFromSAGE2(val);
    }


    }

    public async openPopUp(room_id: string): Promise<any>{

      let data = await this.world.mainDigitalTwin.server.getDeviceOfRoom(room_id);
      let url = this.world.mainDigitalTwin.urlGrafana + '/d/q8r1SPpnz/dashboard?orgId=1&refresh=5m&from=now-6h&to=now';
            
			let d = '';
			d += '&room=' + room_id;
      d += '&floor=' + data['floor'];
            
			let deviceIDForSage = '';
      for(let i = 1; i <= data['device'].length; i++){
        url += '&var-dv' + i + '=' + data['device'][i-1];
        deviceIDForSage += data['device'][i-1] + ',';
      }
			url += d;
			
            //console.log(this.world.mainDigitalTwin.action)
			// if(this.world.mainDigitalTwin.displayon === 'sage'){
			// 	console.log("sage_newWindow_" + d + '_' + deviceIDForSage + '_' + room_id);
			// }else{
			// 	window.open(url,'newwindow','width=1300, height=1000, popup');
			// }

      // console.log("sage_newWindow_" + d + '_' + deviceIDForSage + '_' + room_id);

      if (sessionStorage.getItem("display") === "sage"){
        this.world.graphicsWorld.children.forEach(element => {
          element.children.forEach(ele2 => {
            if(ele2.name === room_id){

              let object = <any>ele2;
              object.isOpenDashboardOnSAGE = !object.isOpenDashboardOnSAGE;

              if(object.isOpenDashboardOnSAGE){
                  console.log("sage_newWindow_" + d + '_' + deviceIDForSage + '_' + room_id);
                  object.material.color.setHex( 0x77ff22 );
                  object.material.opacity = 0.5;
              }else{
                  console.log("sage_terminateWindow_" + d + '_' + deviceIDForSage + '_' + room_id);
                  object.material.emissive.setHex( object.currentHex );
                  object.material.opacity = 0;
                // object.material.emissive.setHex( object.currentHex );
                // object.material.opacity = 0;
              }
              // console.log(object)
            }
            
          })
        })
      }else{
        window.open(url,'newwindow' + room_id,'width=1300, height=1000, popup');
      }



    }

    public async updateModelFromSAGE2(val: string): Promise<any>{

      let actions = val.split('&');
      this.world.graphicsWorld.children.forEach(element => {
        element.children.forEach(ele2 => {
          if(ele2.name === actions[1]){

            let object = <any>ele2;

            if(actions[0] === 'on'){
              object.isOpenDashboardOnSAGE = true;
              object.material.color.setHex( 0x77ff22 );
              object.material.opacity = 0.5;
            }else{
              object.isOpenDashboardOnSAGE = false;
              object.material.emissive.setHex( object.currentHex );
              object.material.opacity = 0;
            }
          }
          
        })
      })

}


  }