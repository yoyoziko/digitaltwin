import { World } from '../../world/World';
import { Menu } from './Menu';

export class MenuView extends Menu{

  // private currentStatus: string;

    constructor(world: World) {
        super(world, 'menuView', ["menu_walk", "menu_fly", "menu_thirdperson"], "fly");
    }

    public executeNewStatus(newStatus: string): void{
        this.changeView(newStatus);
    }

    public changeView(newView: String){
      if(!!this.world.inputManager.inputReceiver){
        if(newView === 'fly' && !!this.world.cameraOperator){

          this.world.characters.forEach((char) => {
            char.resetControls();
            this.world.cameraOperator.characterCaller = char;          
            this.world.inputManager.setInputReceiver(this.world.cameraOperator);            
          });

          this.world.graphicsWorld.children.forEach(element => {
            element.children.forEach(ele2 => {
              if(ele2.hasOwnProperty('userData') && ele2.userData.hasOwnProperty('name') && ele2.userData.type === 'room'){
                ele2.children[0].position.x = 0;
                ele2.children[0].position.z = 0;
              }
            })
          })



        }else if(newView === 'walk'){

          this.world.cameraOperator.setRadius(0.1, true);

          this.world.characters.forEach((char) => {
            char.takeControl();
            char.visible = false;
            char.rayCastLength = 1.2;
            let currentPosition = sessionStorage.getItem('position').split(',');
            char.setPosition(parseFloat(currentPosition[0]), parseFloat(currentPosition[1]), parseFloat(currentPosition[2]));   
          });

          // this.world.inputManager.setInputReceiver(this.world.cameraOperator.characterCaller);
          this.world.cameraOperator.characterCaller = undefined;


          this.world.graphicsWorld.children.forEach(element => {
            element.children.forEach(ele2 => {
              if(ele2.hasOwnProperty('userData') && ele2.userData.hasOwnProperty('name') && ele2.userData.type === 'room'){
    
    
                let x = 0;
                let z = 1;
                if(ele2.userData.name === '106' || ele2.userData.name === '107' || ele2.userData.name === '108'){
                  z = 0;
                  x = 1;
                }
                if(ele2.userData.name === '211'){
                  z = -1;
                  x = 0.75;
                }
                if(ele2.userData.name === '212'){
                  z = 0.6;
                  x = 1;
                }
                if(ele2.userData.name === '213'){
                  z = 1;
                  x = 0.75;
                }
    
                ele2.children[0].position.x = x;
                ele2.children[0].position.z = z;
              }
            })
          })

          this.world.cameraOperator.setRadius(0.1, true);

        }else if(newView === 'thirdperson'){

          this.world.characters.forEach((char) => {
            char.takeControl();
            char.visible = true;
            char.rayCastLength = 0.57;
            let currentPosition = sessionStorage.getItem('position').split(',');
            char.setPosition(parseFloat(currentPosition[0]), parseFloat(currentPosition[1]), parseFloat(currentPosition[2]));
            // console.log(char)
          });

          // this.world.inputManager.setInputReceiver(this.world.cameraOperator.characterCaller);
          // this.world.cameraOperator.characterCaller = undefined;
          this.world.cameraOperator.setRadius(1.6, true);
        }
      }

    }


  }