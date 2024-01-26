import * as $ from 'jquery';
import { World } from '../world/World';
import * as THREE from 'three';

// import { SciTuReport } from './SciTuReport';
import { InteractiveRoom } from './InteractiveRoom';
import { Popup_Data } from './Popup_Data';
import { MenuObjectMode } from './Menu/MenuObjectMode';
import { MenuFloor } from './Menu/MenuFloor';
import { MenuLabel } from './Menu/MenuLabel';
import { MenuSearchARoom } from './Menu/MenuSearchARoom';
import { MenuView } from './Menu/MenuView';

import { CameraView } from './CameraView';
import { Server } from './Server';
import { UIManager } from '../core/UIManager';
import { data } from 'jquery';

import { BookMark } from './Menu/BookMark';
import { forEach } from 'lodash';

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import * as Plotly from 'plotly.js';

export class Main {

    public world: World;
    public server: Server;

	// public scitureports: SciTuReport;
	public interactiveRoom: InteractiveRoom;
    public popup_Data: Popup_Data;

	public menuObjectMode: MenuObjectMode;
	public menuFloor: MenuFloor;
    public menuLabel: MenuLabel;
    public menuSearchARoom: MenuSearchARoom;
    public menuView: MenuView;
    
    public cameraView: CameraView;
    public roomData: any;
    public roomProblems: any;
    public roomIOT: any;
    public roomOccupant: any;

    public domElement: any;
	
    public urlBackend: string = 'http://ec2-52-76-230-108.ap-southeast-1.compute.amazonaws.com:8081';
    public urlS3Bucket: string = 'https://publicdigitaltwin.s3.ap-southeast-1.amazonaws.com';
    // public urlGrafana: string = 'http://ec2-52-76-230-108.ap-southeast-1.compute.amazonaws.com:3000';
    public fetchTimeMilliseconds: number = 10000;
    // public fetchTimeMilliseconds: number = 600000;

    public urlGrafana: string = 'https://grafana.cstu-app.com';
    public urlGetLatestData: string = 'https://wubwpgmwvt72cf66hukl5ggrja0pmpgh.lambda-url.ap-southeast-1.on.aws';
    // public urlSurveillanceSearch: string = 'https://d34acvi0xw8v7l.cloudfront.net/';
    public urlSurveillanceSearch: string = 'https://d5ejfggr87qsf.cloudfront.net/';

    public isCurrentTime: boolean;
	// public displayon: string;
    private currentStatusOfView: string;
    public isLoadedModel: boolean;

    public bookMark: BookMark;
    public intervalPlayBack: any;
    public minTimestampPlayback: number;
    public maxTimestampPlayback: number;
    public lastTimestampPlaybackForStop: number;

    public cameraObjectArr: Array<CSS2DObject>;
    
    constructor(world: World, domElement: HTMLElement) {

        this.domElement = domElement || document.body;
        this.world = world;
        this.server = new Server(this.urlBackend, this.urlS3Bucket, this.urlGetLatestData, 'fakeToken');
        // let urlBackend = 'http://ec2-52-76-230-108.ap-southeast-1.compute.amazonaws.com:8081';
        // let urlS3Bucket = 'https://publicdigitaltwin.s3.ap-southeast-1.amazonaws.com/';
        // let urlGrafana = 'http://ec2-52-76-230-108.ap-southeast-1.compute.amazonaws.com:3000';

        this.cameraView = new CameraView(this.world);
        this.interactiveRoom = new InteractiveRoom(this.world, domElement);
        // this.scitureports = new SciTuReport(this.world);
        this.popup_Data = new Popup_Data(this.world);

        this.menuObjectMode = new MenuObjectMode(domElement);
        this.menuLabel = new MenuLabel(this.world);
        this.menuFloor = new MenuFloor(this.world);
        this.menuSearchARoom = new MenuSearchARoom();
        this.menuView = new MenuView(this.world);

        this.roomProblems = null;
        this.roomIOT = null;
        this.roomOccupant = null;
        
        this.isLoadedModel = false;
        
        this.setEvent();
        this.cameraView.initCameraView();
        this.currentStatusOfView = "";

        this.cameraObjectArr = new Array<CSS2DObject>();

        let onceTime = setInterval(async () => {
            if(this.isLoadedModel){


                
                //this.server = new Server('http://localhost:8081', 'fakeToken');




                
                
                // if(sessionStorage.getItem("display") === "sage"){
                //     this.menuClick();
                //     this.isCurrentTime = false;
                // }else{
                //     this.isCurrentTime = true;
                // }

                this.isCurrentTime = document.getElementById("playbackBox").style.display === 'none';
                // console.log(this.isCurrentTime)
                // this.updateComponents();
                this.realTimeData();

                this.bookMark = new BookMark();
                this.minTimestampPlayback = 1638604140436;
                this.maxTimestampPlayback = new Date().getTime();

                this.lastTimestampPlaybackForStop = this.minTimestampPlayback;



                // console.log("done")
                this.setAboutHTML();
                this.analyzIndoorEnv();


                this.loadSCITUReport();

                clearInterval(onceTime);
            }
            // console.log(".")
            
        }, 1000);

        // sessionStorage.setItem("display", new URLSearchParams(window.location.search).get('display') || null);
        // sessionStorage.setItem("data", new URLSearchParams(window.location.search).get('data') || null);
		
        // this.displayon = new URLSearchParams(window.location.search).get('displayon') || null;


		//console.log(this.world.mainDigitalTwin.action);

        // setInterval(async ()=> {
        //     console.log('refresh');
        //     await this.loadDataLabel("Label1");
        //     document.getElementById('refreshDataSCITUReport').click();
        // }, 3000);
        // setRealTime
    }

    public menuClick(): void{
    
        // let isSAGE = sessionStorage.getItem("display") === "sage" ? true: false;
        // if(!isSAGE) return;

        document.getElementById('refreshComponents').onclick = async () => {
            // console.log("updateComponentsx 1");
            this.updateComponents();
        }

        document.getElementById("toggleRealTime").onclick = () => {
            // this.isCurrentTime = !this.isCurrentTime;
            let isCurrentTimeBoolean = (document.getElementById("isCurrentTimeBoolean") as HTMLInputElement).value;
            isCurrentTimeBoolean === "true" ? this.isCurrentTime = true: this.isCurrentTime = false;

            if(!this.isCurrentTime){
                // console.log("updateComponentsx 2");
                this.updateComponents();
            }
        }
    }

    public async setUpDataFromServer(): Promise<boolean>{
        try{
            const isServerOpen = await this.server.checkServer();
            // console.log(isServerOpen)
            if(isServerOpen){
                let dataRoom = await this.server.getAllRoom();
                // console.log(dataRoom)
                // let a = await this.server.getSciTUReports();
                // console.log(a)
                this.roomData = dataRoom['data'];
                // console.log(this.roomData)
				//let devicec = await this.server.getDeviceOfRoomForSAGE('109');
				//console.log(devicec)
				// if(this.displayon === 'sage'){
				
                // if (sessionStorage.getItem("display") !== "sage") return isServerOpen;

                let valueRooms = {};
                for(let room_id in this.roomData){
                    let element = this.roomData[room_id];
                    valueRooms[room_id] = element['device'];
                };
                
                // console.log(valueRooms);
                if (sessionStorage.getItem("display") === "sage"){
                    let f1_rooms = '';
                    let f2_rooms = '';
                    let f3_rooms = '';

                    for(let room_id in this.roomData){
                        let room = this.roomData[room_id];

                        //console.log(room['room_id']);
                        if(room['floor'] === "1"){
                            f1_rooms += room_id + '@' + valueRooms[room_id] + ',';
                        }else if(room['floor'] === "2"){
                            f2_rooms += room_id + '@' + valueRooms[room_id] + ',';
                        }else if(room['floor'] === "3"){
                            f3_rooms += room_id + '@' + valueRooms[room_id] + ',';
                        }
                        
                    }
                    
                    console.log('sage_setRoomID_1_' + f1_rooms);
                    console.log('sage_setRoomID_2_' + f2_rooms);
                    console.log('sage_setRoomID_3_' + f3_rooms);                    
                }

				// }
				
                this.menuSearchARoom.setupLoadOption({
                    floor1: dataRoom['floor1'],
                    floor2: dataRoom['floor2'],
                    floor3: dataRoom['floor3'],
                    site: dataRoom['site'],
                });
                this.menuSearchARoom.setOption('site');


                for(let roomId in this.roomData){
                    let roomElement = this.roomData[roomId];
                    if(roomElement['camera'].length > 0){
                        // console.log(roomElement['camera']);
                        for(let i = 0; i < roomElement['camera'].length; i++){
                            let cameraElement = roomElement['camera'][0];
                            this.addNewEntryToWorld(cameraElement);
                        }
                    }

                }

            }else{

            }
            return isServerOpen;            
        }catch(err){
            return false;
        }

    }

    public async loadDataLabel(label: string) : Promise<void>{

        // console.log("label = ", label);

        //millisecond
        //RealTime
        let startdate = '0';
        let enddate = new Date().getTime() + '';
        
        //No RealTime
        if(!this.isCurrentTime){
            startdate = (document.getElementById("startDate") as HTMLInputElement).value || '0';
            enddate = (document.getElementById("endDate") as HTMLInputElement).value || new Date().getTime() + '';
        }
        // console.log("startDate = ", startdate, ", enddate = ", enddate);
        // console.log(this.isCurrentTime, startdate, enddate);
        // if(parseInt(enddate) >= new Date().getTime())
        //     this.isCurrentTime = true;
        // else
        //     this.isCurrentTime = false;

        if(label === 'Label1'){
            // console.log("send request to backend")
            // if(!this.roomProblems){
                // UIManager.setLoadingScreenVisible(true);
                document.getElementById('sync_label').style.display = 'inline';
                await this.server.getSciTUReports();
                // let startdate = (document.getElementById("startDate") as HTMLInputElement).value || '0';
                // let enddate = (document.getElementById("endDate") as HTMLInputElement).value || new Date().getTime() + '';
                // console.log(startdate)
                // console.log(enddate)
                this.roomProblems = await this.server.getActiveProblems(startdate, enddate);
                document.getElementById('sync_label').style.display = 'none';
                // UIManager.setLoadingScreenVisible(false);
                // console.log(this.roomProblems)
            // }
        }else if(label === 'Label2' || label === 'Label3' || label === 'Label4'){
            
            document.getElementById('sync_label').style.display = 'inline';
            // if(!this.roomIOT){
                // UIManager.setLoadingScreenVisible(true);
                // console.log(document.getElementById('sync_label').style.display)
            // console.log("load new data");
            this.roomIOT = await this.server.getCurrentIOT(startdate, enddate);
            // this.roomOccupant = await this.server.getCurrentOccupant(startdate, enddate);

                // document.getElementById('sync_label').style.display = 'none';
                // document.getElementById('sync_label').style.display = 'none';
                // console.log(this.roomIOT)
                // UIManager.setLoadingScreenVisible(false);
            // }

            // if(!this.roomOccupant){
            //     this.roomOccupant = await this.server.getCurrentOccupant();
            // }

            document.getElementById('sync_label').style.display = 'none';
        }else if(label === 'Label5'){
            document.getElementById('sync_label').style.display = 'inline';
            this.roomOccupant = await this.server.getCurrentOccupant(startdate, enddate);
            document.getElementById('sync_label').style.display = 'none';

        }
    }

    public async realTimeData(): Promise<void>{

        // let isSAGE = sessionStorage.getItem("display") === "sage" ? true: false;
        // if(!isSAGE) return;

        // let labels = ["Label1", "Label4", "Label5"];
        // let labelsUpdate = this.menuLabel.labelArr;
        // console.log(labelsUpdate);

        setInterval(async () => {
            // console.log("Fetch new data", this.isLoadedModel, this.isCurrentTime);
            this.isCurrentTime = document.getElementById("playbackBox").style.display === 'none';

            if(this.isLoadedModel && this.isCurrentTime){
                // console.log("Update components by interval");
                // console.log("updateComponentsx 3");
                await this.updateComponents();
                this.analyzIndoorEnv();
                this.loadSCITUReport();
            }
            
        }, this.fetchTimeMilliseconds);

    }

    public async updateComponents(): Promise<void>{

        // let dataTest = await this.server.getTestData();
        // console.log('**********', dataTest);
        // console.log("Update components");

        //download SCI-TU Report, IoT Sensor, Occupant
        let labels = ["Label1", "Label4", "Label5"];
        let labelsUpdate = this.menuLabel.labelArr;

        for(let i = 0; i < labels.length; i++){
            await this.loadDataLabel(labels[i]);
        }

        for(let i = 0; i < labelsUpdate.length; i++){
            this.menuLabel.updateComponents(labelsUpdate[i], true);
        }
        
        // console.log(this.currentStatusOfView, this.menuView.getStatus());
        if(this.currentStatusOfView !== this.menuView.getStatus()){
            // console.log("Change view");
            this.menuView.changeView(this.menuView.getStatus());
            this.currentStatusOfView = this.menuView.getStatus();
        }
    }

    public getLabelRoomName(room_id: string) : string{
        // let result = room_id;
        // this.roomData.forEach(element => {
        //     if(element['room_id'] === room_id){
        //         result = element['name'];
        //     }
        // });
        // return result;
        // console.log(room_id)
        let result = room_id;
        if(!!this.roomData[room_id] && !!this.roomData[room_id]['name']){
            result = this.roomData[room_id]['name'];
        }
        // return !!this.roomData[room_id].name ? 'Grill' : room_id;
        return result;
    }

    public setEvent(): void{
        document.addEventListener('mousemove', (evt) => this.interactiveRoom.onPointerMove(evt));
    }

    public async analyzIndoorEnv(): Promise<void>{
        
        // console.log("updateComponentsx 4");
        // await this.updateComponents();
        // let currentFloor = this.menuFloor.getStatus();
        let countRoomTempAbnormal = 0;
        let countRoomHumidityAbnormal = 0;
        // let listRoomAbnormal = {};
        let notiToggleTemp1 = $('#notiToggleTemp1').css('color') === 'rgb(255, 208, 0)';
        let notiToggleTemp2 = $('#notiToggleTemp2').css('color') === 'rgb(255, 208, 0)';
        let notiToggleTemp3 = $('#notiToggleTemp3').css('color') === 'rgb(255, 208, 0)';

        let colorTemp1 = parseFloat((document.getElementById("setColorTemp1") as HTMLInputElement).value);
        let colorTemp2 = parseFloat((document.getElementById("setColorTemp2") as HTMLInputElement).value);
        let colorTemp3 = parseFloat((document.getElementById("setColorTemp3") as HTMLInputElement).value);
        let colorTemp4 = parseFloat((document.getElementById("setColorTemp4") as HTMLInputElement).value);

        let notiToggleHumidity1 = $('#notiToggleHumidity1').css('color') === 'rgb(255, 208, 0)';
        let notiToggleHumidity2 = $('#notiToggleHumidity2').css('color') === 'rgb(255, 208, 0)';
        let notiToggleHumidity3 = $('#notiToggleHumidity3').css('color') === 'rgb(255, 208, 0)';

        let colorHumidity1 = parseFloat((document.getElementById("setColorHumidity1") as HTMLInputElement).value);
        let colorHumidity2 = parseFloat((document.getElementById("setColorHumidity2") as HTMLInputElement).value);
        let colorHumidity3 = parseFloat((document.getElementById("setColorHumidity3") as HTMLInputElement).value);
        let colorHumidity4 = parseFloat((document.getElementById("setColorHumidity4") as HTMLInputElement).value);

        // console.log('notiToggleTemp1 = ', notiToggleTemp1, ', notiToggleTemp2 = ', notiToggleTemp2, ', notiToggleTemp3 = ', notiToggleTemp3);

        for (let roomID in this.roomIOT) {

            
            if(this.menuFloor.getStatus() === 'site'){

            }else{
                let floor = 'floor' + this.roomData[roomID]['floor'];
                if(floor !== this.menuFloor.getStatus()){
                    continue;
                }
            }
            // console.log(this.menuFloor.getStatus(), this.roomData[roomID]['floor']);

            let temp = this.roomIOT[roomID]["Temp"];
            let humidity = this.roomIOT[roomID]["RelH"];

            if(notiToggleTemp1){
                if(temp < colorTemp1){
                    countRoomTempAbnormal++;
                }
            }

            if(notiToggleTemp2){
                if(temp >= colorTemp2 && temp <= colorTemp3){
                    countRoomTempAbnormal++;
                }
            }

            if(notiToggleTemp3){
                if(temp > colorTemp4){
                    countRoomTempAbnormal++;
                }
            }



            if(notiToggleHumidity1){
                if(humidity < colorHumidity1){
                    countRoomHumidityAbnormal++;
                }
            }

            if(notiToggleHumidity2){
                if(humidity >= colorHumidity2 && humidity <= colorHumidity3){
                    countRoomHumidityAbnormal++;
                }
            }

            if(notiToggleHumidity3){
                if(humidity > colorHumidity4){
                    countRoomHumidityAbnormal++;
                }
            }


        }

        // let sum = countRoomTempAbnormal + countRoomHumidityLowAbnormal + countRoomHumidityHighAbnormal;
        // countRoomTempAbnormal = 5;

        // console.log("analyzIndoorEnv,", this.roomIOT , ", countRoomTempAbnormal = ", countRoomTempAbnormal, 
        // ", countRoomHumidityLowAbnormal = ", countRoomHumidityLowAbnormal, 
        // ", countRoomHumidityHighAbnormal = ", countRoomHumidityHighAbnormal);

        let sum = countRoomTempAbnormal + countRoomHumidityAbnormal;

        let notiEnvOnBookMark = document.getElementById("notiEnvOnBookMark");
        let envContentBox = document.getElementById("envContentBox");

        if(sum === 0){
            notiEnvOnBookMark.style.display = 'none';
            envContentBox.innerHTML = 'Everything seem to be ok.';
        }else{
            notiEnvOnBookMark.style.display = 'block';
            notiEnvOnBookMark.innerHTML = sum + "";
            envContentBox.innerHTML = `
            <div>
                Temperature Abnormal: <span class="${countRoomTempAbnormal === 0 ? 'abnormalIndoorZero': 'abnormalIndoor'}">${countRoomTempAbnormal}</span> Room.
            </div>
            <div>
                Humidity Abnormal: <span class="${countRoomHumidityAbnormal === 0 ? 'abnormalIndoorZero': 'abnormalIndoor'}">${countRoomHumidityAbnormal}</span> Room.
            </div>
            `;
        }

    }


    public async setAboutHTML(): Promise<void>{
		document.getElementById("bookmarkIndoorEnvironmentBtn").addEventListener("click", (event) => {
			this.analyzIndoorEnv();
            //this.camTest.visible = !this.camTest.visible;
		});

		document.getElementById("playbackBtn").addEventListener("click", (event) => {
            let playbackBtn = document.getElementById("playbackBtn") as HTMLInputElement;
            let timeRangePlayBack = document.getElementById("timeRangePlayBack") as HTMLInputElement;
            let timeValue = document.getElementById("timeValue") as HTMLInputElement;
            // let minTimestamp = 1638604140436;
            let minTimestamp = this.minTimestampPlayback;
            let maxTimestamp = new Date().getTime();


            if(playbackBtn.innerHTML === '<i class="fas fa-play"></i>' || playbackBtn.innerHTML === '<i class="fas fa-undo"></i>'){
                this.isCurrentTime = false;

                let endDate = document.getElementById("endDate") as HTMLInputElement

                if(this.lastTimestampPlaybackForStop !== minTimestamp){
                    minTimestamp = this.lastTimestampPlaybackForStop;
                }

                let speedVal = 10000000;
                if($("#playbackSpeedX1").css("background-color") === 'rgb(255, 195, 31)'){
                    speedVal = 10000000;
                }else if($("#playbackSpeedX3").css("background-color") === 'rgb(255, 195, 31)'){
                    speedVal = 10000000*3;
                }else if($("#playbackSpeedX10").css("background-color") === 'rgb(255, 195, 31)'){
                    speedVal = 10000000*10;
                }

                playbackBtn.innerHTML = '<i class="fas fa-pause"></i>';
                let val = minTimestamp;
                this.intervalPlayBack = setInterval(async () => {
                    // console.log(speedVal);
                    timeRangePlayBack.value = val + "";
                    val += speedVal;

                    timeValue.innerHTML = new Date(val) + "";
                    this.lastTimestampPlaybackForStop = val;
                    endDate.value = val + "";

                    // console.log("updateComponentsx 5");
                    await this.updateComponents();
                    this.analyzIndoorEnv();
                    this.loadSCITUReport();

                    if(val >= maxTimestamp){
                        playbackBtn.innerHTML = '<i class="fas fa-undo"></i>';
                        clearInterval(this.intervalPlayBack);
                        timeRangePlayBack.value = new Date().getTime() + "";
                        timeValue.innerHTML = new Date() + "";
                        this.lastTimestampPlaybackForStop = this.minTimestampPlayback;
                        this.intervalPlayBack = null;
                    }

                }, 100);                
            }else{
                playbackBtn.innerHTML = '<i class="fas fa-play"></i>';
                // console.log("updateComponentsx 6");
                this.updateComponents();
                this.analyzIndoorEnv();
                this.loadSCITUReport();
                clearInterval(this.intervalPlayBack);
                this.intervalPlayBack = null;
            }

		});

		document.getElementById("bookmarkReportBtn").addEventListener("click", (event) => {
			this.loadSCITUReport();
		});


        $("#playbackSpeedX1").on( "click", function(e) {
            $("#playbackSpeedX1").css("background-color", '#ffc31f');
            $("#playbackSpeedX3").css("background-color", '#a8a8a8');
            $("#playbackSpeedX10").css("background-color", '#a8a8a8');
        })

        $("#playbackSpeedX3").on( "click", function(e) {
            $("#playbackSpeedX1").css("background-color", '#a8a8a8');
            $("#playbackSpeedX3").css("background-color", '#ffc31f');
            $("#playbackSpeedX10").css("background-color", '#a8a8a8');
        })

        $("#playbackSpeedX10").on( "click", function(e) {

            $("#playbackSpeedX1").css("background-color", '#a8a8a8');
            $("#playbackSpeedX3").css("background-color", '#a8a8a8');
            $("#playbackSpeedX10").css("background-color", '#ffc31f');
        })


        // playbackBtn.innerHTML = '<i class="fas fa-play"></i>';
        // clearInterval(this.intervalPlayBack);
        // timeRangePlayBack.value = minTimestamp + "";
        // timeValue.innerHTML = new Date(minTimestamp) + "";


    }

    private async loadSCITUReport(): Promise<void>{
        //RealTime
        let rawStartDate = '0';
        let rawEndDate = new Date().getTime() + '';
        
        //No RealTime
        if(!this.isCurrentTime){
            rawStartDate = (document.getElementById("startDate") as HTMLInputElement).value || '0';
            rawEndDate = (document.getElementById("endDate") as HTMLInputElement).value || new Date().getTime() + '';
        }


        if(!this.getSciTuReportData()){
            let res = await this.server.getSCITUReportProblems();
            this.setSciTuReportData(res);
        }

        let startDate = parseInt(rawStartDate);
        let endDate = parseInt(rawEndDate);

        let data = this.getSciTuReportData();
        if(data == null) return;

        // console.log("data = ", data);

        let startSeconds = Math.round(startDate / 1000);
        let endSeconds = Math.round(endDate / 1000);
        let sciTuDateRange = [];
        for(let key in data){
        // data.forEach(element => {
            let roomElement = data[key];
            for(let i = 0; i < roomElement.length; i++){
                let element = roomElement[i];
                if(element["timestamp"]["_seconds"] >= startSeconds && element["timestamp"]["_seconds"] <= endSeconds){
                    // console.log(element);
                    sciTuDateRange.push(element);
                }                
            }

        }

        let countActive = 0, countDone = 0;
        // await sciTuDateRange.forEach(element => {
        for(let key in sciTuDateRange){
            let element = sciTuDateRange[key];
            // console.log(element);
            if(element["status"] === 1 || element["status"] === 2 || element["status"] === 3){
                countActive++;
            }else if(element["status"] === 4){
                countDone++;
            }
        }
    

        if(countActive === 0 && countDone === 0){
            $('#plotly_pie_status').html('<CENTER><h3 style="color:#C7D0D9;">Hmm, your date range doesn\'t have enough data to show here.</h3></CENTER>');
        }else{
            $('#plotly_pie_status').html('');
            
            let dataPie = [{
                values: [countActive, countDone],
                labels: ["Didn't fix", 'Done'],
                marker: {
                    colors: ['rgb(255, 238, 82)', 'rgb(32, 34, 38)']
                },
                hole: .6,
                type: 'pie'
            }];
            
            let layout = {
                autosize: true,
                paper_bgcolor: "rgba(0,0,0,0)",
                annotations: [
                    {
                        font: {
                        size: 20
                        },
                        showarrow: false,
                        text: 'loading',
                        x: 0.5,
                        y: 0.5
                    }
                ],
                margin: {
                    l: 20,
                    r: 20,
                    b: 30,
                    t: 15,
                    pad: 0
                },
                legend: {
                    x: 0,
                    y: 1,
                    traceorder: 'normal',
                    font: {
                      family: 'sans-serif',
                      size: 20,
                      color: '#ffffff'
                    },
                },
                // showlegend: false
                  
            };
            
            await Plotly.newPlot('plotly_pie_status', dataPie, layout);
            $('#active_problems').html(countActive + "")
            $('#done_problems').html(countDone + "")
            let xActive = 5;
            let xTotal = 48;
            if(countActive < 10){
                xActive = 15;
                xTotal = 37;
            }
            $($('.cursor-pointer')[0]).html('<text class="text_active_in_pie" x="' + xActive + '" y="6">' + countActive + '</text>'+
            '<text class="text_total_in_pie" x="' + xTotal + '" y="5">/' + (countActive + countDone) + '</text><br>'+
            '<text class="text_des_in_pie" x="0" y="30">Didn\'t fix</text>'+
            '<text class="text_des_in_pie" x="0" y="50">Problems</text>')

            let notiReportOnBookMark = document.getElementById("notiReportOnBookMark");
            if(countActive === 0){
                notiReportOnBookMark.style.display = 'none';
            }else{
                notiReportOnBookMark.style.display = 'block';
                notiReportOnBookMark.innerHTML = countActive + "";
            }


        }

	}

    private getSciTuReportData(): any{
        return JSON.parse(sessionStorage.getItem("sciTuReport_Data"));
    }
    
    
    private setSciTuReportData(data: any): void{
        sessionStorage.setItem("sciTuReport_Data", JSON.stringify(data));
    }
    
    private addNewEntryToWorld(data: any): void{

        // console.log(data);
        const cam = document.createElement('div');
        // cam.id = 'id' + data.name;
        cam.style.display = 'block';
        cam.innerHTML = '<div class="camLabel"><i class="fad fa-video"></i> <br/>' + data.name + '</div>';

		cam.addEventListener("click", (event) => {

            //RealTime
            let startdate = '1577836800000';
            let enddate = new Date().getTime() + '';
            
            //No RealTime
            if(!this.isCurrentTime){
                startdate = (document.getElementById("startDate") as HTMLInputElement).value || '0';
                enddate = (document.getElementById("endDate") as HTMLInputElement).value || new Date().getTime() + '';
            }

            let intStartDate = (parseInt(startdate)/1000).toFixed();
            let intEnddate = (parseInt(enddate)/1000).toFixed();

			window.open(this.urlSurveillanceSearch + "?bucketname=" + data.bucketname + "&camid=" + data.name + "&start=" + intStartDate + "&end=" + intEnddate);
		});

        // cam.className = 'camLabel camLabelcamLabelHoverEffect';

        const labelObject = new CSS2DObject( cam );
        labelObject.position.set( data.position.x, data.position.y, data.position.z );
        // this.menuLabel.setLabel("Label6", true);
        labelObject.visible = this.menuLabel.isSelected("Label6");
        this.cameraObjectArr.push(labelObject)
       //scene is global
        // scene.add(mesh);

        this.world.graphicsWorld.add(<any>labelObject);
    }

    private getDateValue(get: string): string{
        //RealTime
        let startdate = '0';
        let enddate = new Date().getTime() + '';
        
        //No RealTime
        if(!this.isCurrentTime){
            startdate = (document.getElementById("startDate") as HTMLInputElement).value || '0';
            enddate = (document.getElementById("endDate") as HTMLInputElement).value || new Date().getTime() + '';
        }

        if(get == 'start'){
            return startdate;
        }else if(get == 'end'){
            return enddate;
        }else{
            return "0";
        }

    }


  }