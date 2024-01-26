import * as $ from 'jquery';
import { Menu } from './Menu';
import { World } from '../../world/World';

export class MenuLabel extends Menu{

    public amountLabel: Number;

    // private selectTempColor1: string;
    // private selectTempColor2: string;
    // private selectTempColor3: string;

    // private tempSettings1: number;
    // private tempSettings2: number;
    // private tempSettings3: number;
    // private tempSettings4: number;

    private envSelectColor: any;
    private envValueOfSettings: any;

    // private selectHumidityColor1: string;
    // private selectHumidityColor2: string;
    // private selectHumidityColor3: string;

    // private humiditySettings1: number;
    // private humiditySettings2: number;
    // private humiditySettings3: number;
    // private humiditySettings4: number;

    constructor(world: World) {
        
        let labels = ["menu_Label0", "menu_Label1", "menu_Label2", "menu_Label3", "menu_Label4", "menu_Label5", "menu_Label6"];
        
        super(world, 'menuLabel', labels, null);
        this.amountLabel = labels.length;
        this.colorSelected = "rgb(0, 153, 20)";

        this.envSelectColor = {};
        this.envValueOfSettings = {};
        // document.getElementById('refreshDataSCITUReport').onclick = async () => {
        //     await this.setLabel('Label1', false);
        //     this.setLabel('Label1', true);
        // }
    }

    public setStatus(newLabel: String): void{
        if(!!newLabel){

            // console.log(document.getElementById('sync_label').style.display)
            if(document.getElementById('sync_label').style.display === 'inline'){

            }else{
                let id = "menu_" + newLabel;
                let color = $("#" + id).css("background-color");
                if(color === this.colorSelected){
                    $("#" + id).attr("style", "background-color: " + this.colorNormal + ";");
                    this.setLabel(newLabel, false);
                }else{
                    $("#" + id).attr("style", "background-color: " + this.colorSelected +";");
                    // console.log(newLabel, true)
                    this.setLabel(newLabel, true);
                }
            }


        }

    }

    public changeEnable(newLabel: String): void{
        let id = "menu_" + newLabel;
        let color = $("#" + id).css("background-color");
        if(color === this.colorSelected){
            $("#" + id).attr("style", "background-color: " + this.colorNormal + ";");
        }else{
            $("#" + id).attr("style", "background-color: " + this.colorSelected +";");
        }
        
    }

    public async setLabel(newLabel: String, isEnable: boolean): Promise<void>{

        if(this.isSelected(newLabel)){
            // console.log("Load " + newLabel)
            // this.changeEnable(newLabel);
            await this.world.mainDigitalTwin.loadDataLabel(<string>newLabel)
            // this.changeEnable(newLabel);
        }
        this.updateComponents(newLabel, isEnable);
        
    }

    public updateComponents(newLabel: String, isEnable: boolean){



        this.loadIndoorEnvSettings();
        if(newLabel === 'Label6'){
            this.updateCameraField();
            return;
        }
        // return;
        // console.log("updateComponents", newLabel);

        let currentFloor = this.world.mainDigitalTwin.menuFloor.getStatus();
        this.world.graphicsWorld.children.forEach(element => {
            element.children.forEach(ele2 => {
                if(ele2.hasOwnProperty('userData') && ele2.userData.hasOwnProperty('floor')){
                    if("floor" + ele2.userData.floor === currentFloor || currentFloor === "site"){
                        ele2.children.forEach(eleLabel => {
                            if(eleLabel.userData.type === "label"){
                                eleLabel.visible = true;
                                this.loadValue(isEnable, newLabel, eleLabel, ele2.userData.name);
                            }
                        });
                    }else{
                        //Hide label entire a floor that don't selected
                        ele2.children.forEach(eleLabel => {
                            eleLabel.visible = false;
                        });
                    }

                }
            });
        });
    }

    public loadValue(isEnable: boolean, label: String, eleLabel: any, nameOfRoom: string){



        // console.log(this.isSelected("Label0"), this.isSelected("Label1"),
        // this.isSelected("Label2"), this.isSelected("Label3"), this.isSelected("Label4")
        // , this.isSelected("Label5"));

        if(label === "Label0" || label === "Label1"){
            
            let children = eleLabel.element.children;
            for(let i = 0; i < children.length; i++){
                let child = children[i];
                if(child.id === 'headerlabel'){
                    
                    if(label === "Label0"){
                        isEnable && this.isSelected("Label0") ? child.style.display = 'block': child.style.display = 'none';

                        if(!isEnable && this.isSelected("Label1")){
                            console.log('detect disable roomname, enable problem!');
                            if(this.world.mainDigitalTwin.roomProblems[nameOfRoom] === 1){
                                // if(this.isSelected("Label1")){
                                    child.style.display = 'block';
                                    child.childNodes[0].childNodes[1].style.display = 'inline-block';                                    
                                // }
                            }else{
                                child.childNodes[0].childNodes[1].style.display = 'none';
                            }
                        }

                        if(this.isSelected("Label2") || this.isSelected("Label3") || this.isSelected("Label4")){
                            // console.log(1);
                            if(!!this.world.mainDigitalTwin.roomIOT && !!this.world.mainDigitalTwin.roomIOT[nameOfRoom]){
                                child.style.display = 'block';
                            }
                        }

                        if(this.isSelected("Label5")){
                            // console.log(2);
                            if(!!this.world.mainDigitalTwin.roomOccupant && !!this.world.mainDigitalTwin.roomOccupant[nameOfRoom]){
                                child.style.display = 'block';
                            }
                        }

                    }

                    if(label === "Label1"){
                        if(isEnable && this.isSelected("Label1") && this.world.mainDigitalTwin.roomProblems[nameOfRoom] === 1){
                            // if(this.isSelected("Label1")){
                                child.style.display = 'block';
                                child.childNodes[0].childNodes[1].style.display = 'inline-block';
                            // }
                        }else{
                            child.childNodes[0].childNodes[1].style.display = 'none';
                        }
                        if(!isEnable && this.isSelected("Label0")){
                            console.log('detect disable problem, enable roomname!');
                        }

                        if(!isEnable && !this.isSelected("Label0")){
                            child.style.display = 'none';
                        }

                        if(this.isSelected("Label2") || this.isSelected("Label3") || this.isSelected("Label4")){
                            if(!!this.world.mainDigitalTwin.roomIOT && !!this.world.mainDigitalTwin.roomIOT[nameOfRoom]){
                                child.style.display = 'block';
                            }
                        }

                        if(this.isSelected("Label5")){
                            // console.log(3);
                            if(!!this.world.mainDigitalTwin.roomOccupant && !!this.world.mainDigitalTwin.roomOccupant[nameOfRoom]){
                                child.style.display = 'block';
                            }
                        }

                    }
                }
            }
        }else if(label === "Label2" || label === "Label3" || label === "Label4"){

            
            if(!!this.world.mainDigitalTwin.roomIOT && !!this.world.mainDigitalTwin.roomIOT[nameOfRoom]){
                let newValueIoTSensor = this.world.mainDigitalTwin.roomIOT[nameOfRoom];
                // let newValueOccupant = this.world.mainDigitalTwin.roomOccupant[nameOfRoom];


                // this.selectTempColor1
                // this.tempSettings1

                // let temp = newValueIoTSensor['avgTemp'];
                // let temp = parseFloat(newValueIoTSensor['Temp']);
                // let latempName = 'label_square_red';
                // if(temp >= 0 && temp < 30){
                //     latempName = 'label_square_blue'
                // }

                // let temp = parseFloat(newValueIoTSensor['Temp']);
                // let latempName = 'label_square_template';
                // let styleTempBGC = '';
                // if(temp < this.tempSettings1){
                //     styleTempBGC = this.selectTempColor1;
                // }else if(temp >= this.tempSettings2 && temp <= this.tempSettings3){
                //     styleTempBGC = this.selectTempColor2;
                // }else if(temp > this.tempSettings4){
                //     styleTempBGC = this.selectTempColor3;
                // }

                // this.envSelectColor
                // this.envValueOfSettings

                let field = "Temp";
                let temp = parseFloat(newValueIoTSensor[field]);
                let latempName = 'label_square_template';
                let styleTempBGC = '';
                if(temp < this.envValueOfSettings[field][0]){
                    styleTempBGC = this.envSelectColor[field][0];
                }else if(temp >= this.envValueOfSettings[field][1] && temp <= this.envValueOfSettings[field][2]){
                    styleTempBGC = this.envSelectColor[field][1];
                }else if(temp > this.envValueOfSettings[field][3]){
                    styleTempBGC = this.envSelectColor[field][2];
                }

                // let humidity = newValueIoTSensor['avgHumidity'];
                // let humidity = newValueIoTSensor['RelH'];
                // let lahumiName = 'label_square_red';
                // if(humidity >= 40 && humidity <= 60){
                //     lahumiName = 'label_square_green'
                // }else if(humidity > 60){
                //     lahumiName = 'label_square_blue'
                // }



                field = "Humidity";
                let humidity = newValueIoTSensor['RelH'];
                let lahumiName = 'label_square_template';
                let styleHumidityBGC = '';
                // console.log(humidity, this.envValueOfSettings[field][0], this.envValueOfSettings[field][1]);
                if(humidity < this.envValueOfSettings[field][0]){
                    styleHumidityBGC = this.envSelectColor[field][0];
                }else if(humidity >= this.envValueOfSettings[field][1] && humidity <= this.envValueOfSettings[field][2]){
                    styleHumidityBGC = this.envSelectColor[field][1];
                }else if(humidity > this.envValueOfSettings[field][3]){
                    styleHumidityBGC = this.envSelectColor[field][2];
                }


                // let light = newValueIoTSensor['avgLight'];
                let light = newValueIoTSensor['Light'];
                let textOfLight = 'OFF';
                let laligName = 'label_dark';
                if(light >= 0 && light <= 600){
                    laligName = 'label_bright';
                    textOfLight = 'ON';
                }

                // let occupantAmount = !!newValueOccupant['person'] ? newValueOccupant['person'] : 0;
                // let occupantName = 'label_square_red';
                
                let children = eleLabel.element.children;
                for(let i = 0; i < children.length; i++){
                    let child = children[i];

                    // console.log("label = ", label + ", child.id = ", child.id, ", occupantAmount = ", occupantAmount)

                    // console.log('create iot', child.id);
                    if(child.id === 'headerlabel'){
                        if(this.isSelected("Label0") || this.isSelected("Label2") || this.isSelected("Label3") || this.isSelected("Label4")){
                            child.style.display = 'block';
                        }else if(this.isSelected("Label1") && this.world.mainDigitalTwin.roomProblems[nameOfRoom] === 1){
                            child.style.display = 'block';
                            child.childNodes[0].childNodes[1].style.display = 'inline-block';
                        }else{
                            child.style.display = 'none';
                        }
                    }else if(label === "Label2" && child.id === 'idtemp'){
                        child.className = latempName;
                        $(child).css("background-color", styleTempBGC);
                        isEnable && this.isSelected("Label2") ? child.style.display = 'block': child.style.display = 'none';
                        let o = '\xb0C';
                        // let oResult = o.length == 3 ? o.slice(1) : o;
                        // console.log(o + " " + o.length);
                        child.innerHTML = `<i class="fas fa-thermometer-half"></i> ${temp} ${o.length == 3 ? o.slice(1) : o}`;

                        if(isNaN(temp)){
                            child.style.display = 'none';
                        }
                    }else if(label === "Label3" && child.id === 'idhumidity'){
                        child.className = lahumiName;
                        $(child).css("background-color", styleHumidityBGC);
                        // child.style.display = 'block';
                        isEnable && this.isSelected("Label3") ? child.style.display = 'block': child.style.display = 'none';
                        child.innerHTML = '<i class="fas fa-tint"></i> ' + humidity + ' %';

                        if(isNaN(humidity)){
                            child.style.display = 'none';
                        }

                    }else if(label === "Label4" && child.id === 'idlight'){
                        isEnable && this.isSelected("Label4") ? child.style.display = 'block': child.style.display = 'none';
                        child.innerHTML = '<i class="' + laligName + ' fas fa-lightbulb"> ' + textOfLight + '</i> ';

                        if(isNaN(light)){
                            child.style.display = 'none';
                        }

                    }
                    
                    // else if(label === "Label5" && child.id === 'idoccupant'){
                    //     isEnable ? child.style.display = 'block': child.style.display = 'none';
                    //     child.innerHTML = '<i class="' + occupantName + ' fas fa-lightbulb"></i> ';

                    //     child.className = occupantName;
                    //     isEnable ? child.style.display = 'block': child.style.display = 'none';
                    //     child.innerHTML = '<i class="fas fa-thermometer-half"></i> ' + occupantAmount + ' Person';

                    // }
                    

                }                
            }

        }else if(label === "Label5"){
            // console.log(this.world.mainDigitalTwin.roomOccupant);
            // console.log(this.world.mainDigitalTwin.roomOccupant[nameOfRoom]);
            // console.log(nameOfRoom);


            if(!!this.world.mainDigitalTwin.roomOccupant && !!this.world.mainDigitalTwin.roomOccupant[nameOfRoom]){
                let newValueOccupant = this.world.mainDigitalTwin.roomOccupant[nameOfRoom];
                
                let occupantAmount = !!newValueOccupant['person'] ? newValueOccupant['person'] : 0;
                // console.log("", occupantAmount);
                let occupantName = 'label_square_blue';
                if(occupantAmount > 10){
                    occupantName = 'label_square_red';
                }
                
                let children = eleLabel.element.children;
                for(let i = 0; i < children.length; i++){
                    let child = children[i];
                    // console.log("label = ", label + ", child.id = ", child.id, ", occupantAmount = ", occupantAmount)
                    // console.log("label = ", label + ", child.id = ", child.id, ", occupantAmount = ", occupantAmount)

                    // console.log('create iot', child.id);
                    if(child.id === 'headerlabel'){
                        if(this.isSelected("Label0") || this.isSelected("Label2") || this.isSelected("Label3") || this.isSelected("Label4") || this.isSelected("Label5")){
                            child.style.display = 'block';
                        }else if(this.isSelected("Label1") && this.world.mainDigitalTwin.roomProblems[nameOfRoom] === 1){
                            child.style.display = 'block';
                            child.childNodes[0].childNodes[1].style.display = 'inline-block';
                        }else{
                            child.style.display = 'none';
                        }
                    }else if(label === "Label5" && child.id === 'idoccupant'){
                        child.className = occupantName;
                        isEnable && this.isSelected("Label5") ? child.style.display = 'block': child.style.display = 'none';
                        child.innerHTML = '<i class="fas fa-male"></i> ' + occupantAmount + ' Person';

                    }
                    

                }                
            }
        }

        
    }

    private loadIndoorEnvSettings(): void{
        //rgb(80, 80, 80)
        //selectTempColor1.slice(0, 3) + "a" + txt1.slice(3);
        let temp = '';

        // this.selectTempColor1 = $('#selectTempColor1').css('background-color');
        // this.selectTempColor2 = $('#selectTempColor2').css('background-color');
        // this.selectTempColor3 = $('#selectTempColor3').css('background-color');

        // this.tempSettings1 = parseFloat((document.getElementById("setColorTemp1") as HTMLInputElement).value);
        // this.tempSettings2 = parseFloat((document.getElementById("setColorTemp2") as HTMLInputElement).value);
        // this.tempSettings3 = parseFloat((document.getElementById("setColorTemp3") as HTMLInputElement).value);
        // this.tempSettings4 = parseFloat((document.getElementById("setColorTemp4") as HTMLInputElement).value);

        // temp = this.selectTempColor1.slice(0, 3) + "a" + this.selectTempColor1.slice(3);
        // temp = temp.slice(0, -1) + ', 0.5)';
        // this.selectTempColor1 = temp;
        // temp = this.selectTempColor2.slice(0, 3) + "a" + this.selectTempColor2.slice(3);
        // temp = temp.slice(0, -1) + ', 0.5)';
        // this.selectTempColor2 = temp;
        // temp = this.selectTempColor3.slice(0, 3) + "a" + this.selectTempColor3.slice(3);
        // temp = temp.slice(0, -1) + ', 0.5)';
        // this.selectTempColor3 = temp;
        // console.log(this.selectTempColor1, this.tempSettings1);
        // console.log(this.selectTempColor2, this.tempSettings2, this.tempSettings3);
        // console.log(this.selectTempColor3, this.tempSettings4);

        let arrSettingsEnv = ["Temp", "Humidity"];
        for(let index = 0; index < arrSettingsEnv.length; index++){
            let field = arrSettingsEnv[index];

            if(!this.envSelectColor.hasOwnProperty(field)){
                this.envSelectColor[field] = [];
            }
            for(let i = 0; i < 3; i++){
                this.envSelectColor[field][i] = $('#select' + field + 'Color' + (i+1)).css('background-color');
                temp = this.envSelectColor[field][i].slice(0, 3) + "a" + this.envSelectColor[field][i].slice(3);
                temp = temp.slice(0, -1) + ', 0.5)';
                this.envSelectColor[field][i] = temp;
            }

            if(!this.envValueOfSettings.hasOwnProperty(field)){
                this.envValueOfSettings[field] = [];
            }
            for(let i = 0; i < 4; i++){
                this.envValueOfSettings[field][i] = parseFloat((document.getElementById("setColor" + field + (i+1)) as HTMLInputElement).value);
            }

        }

        // console.log(this.envSelectColor, this.envValueOfSettings);


    }

    public isSelected(newLabel: String): boolean{
        let id = "menu_" + newLabel;
        let color = $("#" + id).css("background-color");

        if(color === this.colorSelected){
            return true;
        }else{
            return false;
        }
    }

    private updateCameraField(): void{
        // return;
        // console.log('updateCameraField');

        let cameraObjectArr = this.world.mainDigitalTwin.cameraObjectArr;
        for(let i = 0; i < cameraObjectArr.length; i++){
            cameraObjectArr[i].visible = this.isSelected("Label6");
            // console.log(cameraObjectArr[i]);
        }
    }


  }