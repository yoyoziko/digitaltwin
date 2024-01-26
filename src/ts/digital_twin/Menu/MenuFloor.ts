import { World } from '../../world/World';
import { Menu } from './Menu';

export class MenuFloor extends Menu{

    constructor(world: World) {
        super(world, 'menuFloor', ["menu_floor1", "menu_floor2", "menu_floor3", "menu_site"], "site");
    }

    public executeNewStatus(newStatus: string): void{
        this.manageModel(newStatus);
        (document.getElementById('selected_room_search') as HTMLInputElement).value = '';
    }

    public async manageModel(floor: String): Promise<any>{

      if(this.world.mainDigitalTwin === undefined){

        this.world.graphicsWorld.children.forEach(element => {
          if(element.name === "Scene"){
            element.children.forEach(ele2 => {
              if(ele2.name === "model_site"){
                ele2.visible = true;
              }
            })
          }
        })


        return;
      }


        let f1 = false, f2 = false, f3 = false, s = false;

        if(floor === "floor1"){
          f1 = true;
        }else if(floor === "floor2"){
          f2 = true;
        }else if(floor === "floor3"){
          f3 = true;
        }else if(floor === "site"){
          s = true;
          f1 = true;
          f2 = true;
          f3 = true;
        }

        let postion = await this.world.mainDigitalTwin.server.getRoomPosition(JSON.stringify(floor), !this.world.cameraOperator.characterCaller ? 'site': (floor === 'site' ? 'floor1': floor));
        if(!!this.world.cameraOperator.characterCaller){
          this.world.mainDigitalTwin.cameraView.setCameraPosition(postion.target, postion.radius, postion.theta, postion.phi);
        }else{
          if(!!this.world.characters[0]){
            this.world.characters[0].setPosition(postion.target.x, postion.target.y, postion.target.z);
          }
        }

        this.world.mainDigitalTwin.menuSearchARoom.setOption(floor);

        //hide & unhide Label
        for(let i = 0; i < this.world.mainDigitalTwin.menuLabel.amountLabel; i++){
          this.world.mainDigitalTwin.menuLabel.setLabel('Label' + i , this.world.mainDigitalTwin.menuLabel.isSelected('Label' + i)? true: false);
        }
        
        this.world.graphicsWorld.children.forEach(element => {
          if(element.name === "Scene"){
            element.children.forEach(ele2 => {

              //hide & unhide entire model
              if(ele2.name === "model_floor1"){
                ele2.visible = f1;
              }

              if(ele2.name === "model_floor2"){
                ele2.visible = f2;
              }

              if(ele2.name === "model_floor3"){
                ele2.visible = f3;
              }

              if(ele2.name === "model_site"){
                ele2.visible = s;
              }
            });

            //check what box area room in floor?
            element.children.forEach(ele2 => {
              if(ele2.hasOwnProperty('userData') && ele2.userData.hasOwnProperty('floor')){
    
                if(floor === "site"){
                  ele2.visible = true;

                }else{

                  //hide & unhide box area room
                  if(ele2.userData.floor === 1){
                    ele2.visible = f1;
                  }

                  if(ele2.userData.floor === 2){
                    ele2.visible = f2;
                  }

                  if(ele2.userData.floor === 3){
                    ele2.visible = f3;
                  }
                  
                }


              }
              
            });


          }
        });
    }


  }