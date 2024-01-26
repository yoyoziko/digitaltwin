// import * as $ from 'jquery';
// import { World } from '../world/World';
// import * as THREE from 'three';
// import { indexOf } from 'lodash';

export class Server {

    private urlBackend: string;
    private urlS3Bucket: string;
    // private urlGrafana: string;
    private urlGetLatestData: string;

    private token: string;
    private CSTUData: any;

    constructor(urlBackend: string, urlS3Bucket: string, urlGetLatestData: string, token: string) {
        this.urlBackend = urlBackend;
        this.urlS3Bucket = urlS3Bucket;
        // this.urlGrafana = urlGrafana;
        this.urlGetLatestData = urlGetLatestData;

        this.token = token;


        // setInterval(() => {
        //   console.log("Fetch new");
        // }, fetchTimeMilliseconds);


    }

    public async checkServer(): Promise<boolean>{
        try{
            // const data = await this.fetchData('POST', '/checkserver', {token: this.token});
            return true;
        }catch(err){
            return false;
        }

    }

    public async getSciTUReports(): Promise<any>{
        // const data = await this.fetchData('POST', '/getSciTUReports', {token: this.token});
        return {};
    }

    public async getActiveProblems(rawStartDate: string, rawEndDate: string): Promise<any>{
        // const data = await this.fetchData('POST', '/getActiveProblems', {token: this.token, startDate: parseInt(startDate), endDate: parseInt(endDate)});

        let startDate = parseInt(rawStartDate) / 1000;
        let endDate = parseInt(rawEndDate) / 1000;
    
        let result = {};

        const oldDataSciTuReport = await this.fetchDataFromS3('GET', 'data_scitureports.json');

        for (let room_id in oldDataSciTuReport) {
          if (room_id.length > 0) {
            for (let i = 0; i < oldDataSciTuReport[room_id].length; i++) {
              let problem = oldDataSciTuReport[room_id][i];
              if (
                problem["status"] === 1 ||
                problem["status"] === 2 ||
                problem["status"] === 3
              ) {
                if (
                  problem["lastModified"]["_seconds"] >= startDate &&
                  problem["lastModified"]["_seconds"] <= endDate
                ) {
                  result[room_id] = 1;
                  break;
                }
              }
            }
          } else {
            result[room_id] = 0;
          }
        }
    
        return result;
    }


    public async getSCITUReportProblems(): Promise<any>{
      // const data = await this.fetchData('POST', '/getActiveProblems', {token: this.token, startDate: parseInt(startDate), endDate: parseInt(endDate)});
      const dataSciTuReport = await this.fetchDataFromS3('GET', 'data_scitureports.json');
  
      return dataSciTuReport;
  }

    public async getCurrentOccupant(rawStartDate: string, rawEndDate: string): Promise<any>{

        let startDate = parseInt(rawStartDate);
        let endDate = parseInt(rawEndDate);

        let result = {};
        for(let room_id in this.CSTUData){
          
          if(room_id !== "108") continue;

          // let query = "SELECT person FROM \"" + "aistoccupant" + "\" WHERE time >= " + startDate + "ms AND time <= " + endDate + "ms ORDER BY time DESC LIMIT 1";
          let localURL = this.urlGetLatestData;
          localURL += "?db=" + "occupant";
          localURL += "&from=" + "aistoccupant";
          localURL += "&startDateMS=" + startDate;
          localURL += "&endDateMS=" + endDate;

          // localURL += "?db=" + "occupant";
          // localURL += "&q=" + query;
          // console.log(localURL);

          let data = await this.fetchRealTimeData('GET',  localURL);
          result[room_id] = data;

          // let data = await this.fetchDataFromS3('GET',  "testFetchOccupantData.json");
          // const data = await this.fetchDataFromS3('GET', 'latestSensorValue/device' + devices[i] + '.json');
          // let cleanData = data["results"][0]["series"][0]["values"][0];
          // let convertToJson = {
          //   person: cleanData[2],
          // }

          // let convertToJson = {
          //   person: Math.floor(Math.random() * 100),
          // }

          // console.log(convertToJson);
          
          // result[room_id] = convertToJson;
          // this.pTest++;
            
          
        }
        // let dataTest = await this.fetchRealTimeData('GET',  'https://wubwpgmwvt72cf66hukl5ggrja0pmpgh.lambda-url.ap-southeast-1.on.aws/');
        // console.log('**********', dataTest);
        return result;
    }

    public async getCurrentIOT(rawStartDate: string, rawEndDate: string): Promise<any>{
        // const data = await this.fetchData('POST', '/getCurrentIOT', {token: this.token});

        let startDate = parseInt(rawStartDate);
        let endDate = parseInt(rawEndDate);
        // console.log("startDate = ", startDate, ", endDate = ", endDate);

        let result = {};
        for(let room_id in this.CSTUData){
          
          let element = this.CSTUData[room_id];
          if(!!element['device']){
            let devices = element['device'].split('&');
            for(let i = 0; i < devices.length; i++){

              // let query = "SELECT * FROM \"" + devices[i] + "\" WHERE time >= " + startDate + "ms AND time <= " + endDate + "ms ORDER BY time DESC LIMIT 1";
              // let localURL = this.urlGetLatestData;
              // localURL += "/api/datasources/";
              // localURL += "proxy/9/query?" + "db=" + "iot" + "&q=" + query + "&epoch=ms";

              // let data = await this.fetchRealTimeData('GET',  localURL);

              // let cleanData = data["results"][0]["series"][0]["values"][0];
              // let convertToJson = {
              //   Temp: cleanData[3],
              //   RelH: cleanData[2],
              //   Light: cleanData[1],
              // }
              // let query = "SELECT * FROM \"" + devices[i] + "\" WHERE time >= " + startDate + "ms AND time <= " + endDate + "ms ORDER BY time DESC LIMIT 1";
              let localURL = this.urlGetLatestData;
              localURL += "?db=" + "iot";
              localURL += "&from=" + devices[i];
              localURL += "&startDateMS=" + startDate;
              localURL += "&endDateMS=" + endDate;
              // console.log(localURL);
              // console.log("before = ", startDate, ", GET = ", endDate);
              let data = await this.fetchRealTimeData('GET',  localURL);
              // console.log("after = ", startDate, ", GET = ", endDate);
              // result[room_id] = data["person"];
              let convertToJson = {
                Temp: data["Temp"],
                RelH: data["RelH"],
                Light: data["Light"],
              }
              // let convertToJson = {
              //   Temp: Math.floor(Math.random() * 101),
              //   RelH: Math.floor(Math.random() * 101),
              //   Light: Math.floor(Math.random() * 1025),
              // }

              // console.log(convertToJson);
              
              result[room_id] = convertToJson;
            }
          }
        }

        // let dataTest = await this.fetchRealTimeData('GET',  'https://wubwpgmwvt72cf66hukl5ggrja0pmpgh.lambda-url.ap-southeast-1.on.aws/');
        // console.log('**********', dataTest);

        // const data = await this.fetchDataFromS3('GET', 'latestSensorValue/device000.json');
        // console.log(result)
        return result;
    }

    public async getTestData(): Promise<any>{
      let dataTest = await this.fetchRealTimeData('GET',  'https://wubwpgmwvt72cf66hukl5ggrja0pmpgh.lambda-url.ap-southeast-1.on.aws/');
      // console.log('**********', dataTest);
      return dataTest;
    }

    public async getAllRoom(): Promise<any>{
        // const data = await this.fetchData('POST', '/getallroom', {token: this.token});
        // return {};

        const data = await this.fetchDataFromS3('GET', 'CSTUData.json');
        // console.log(data)
        this.CSTUData = data;
        let floor1 = '', floor2 = '', floor3 = '', site = '';
        // let map = {
        //     'id': 0,
        //     'floor': 1,
        //     'room_id': 2,
        //     'keyword': 3,
        //     'name': 4,
        //     'position_floor': 5,
        //     'position_site': 6,
        //     'device': 7,
        //     'created_at': 8,
        //     'updated_at': 9
        // }

        for(let room_id in this.CSTUData){
            let element = this.CSTUData[room_id];
            if(!!element['position_floor']){
              if(element['floor'] === '1'){
                floor1 += '<option value="' + room_id + '">' + element['name'] + '</option>'
              }else if(element['floor'] === '2'){
                floor2 += '<option value="' + room_id + '">' + element['name'] + '</option>'
              }else if(element['floor'] === '3'){
                floor3 += '<option value="' + room_id + '">' + element['name'] + '</option>'
              }
            }
    
          }
          for(let room_id in this.CSTUData){
            let element = this.CSTUData[room_id];
            if(!!element['position_site']){
              if(element['floor'] === '1' || element['floor'] === '2' || element['floor'] === '3'){
                site += '<option value="' + room_id + '">' + element['name'] + '</option>'
              }
            }
        };

        return {
            floor1: floor1,
            floor2: floor2,
            floor3: floor3,
            site: site,
            data: this.CSTUData
        }

    }

    public async addNewRoom(room_id: string, name: string, position_floor: string, position_site: string, ): Promise<any>{
        let newData = {
            token: this.token,
            room_id: room_id,
            name: name,
            position_floor: position_floor,
            position_site: position_site
        }
        const data = await this.fetchData('POST', '/addNewRoom', newData);
        return data;
    }

    public async getRoomPosition(room_id: string, whichposition: String): Promise<any>{
        // let keySearchPosition = {
        //     token: this.token,
        //     room_id: room_id,
        //     whichposition: whichposition,
        // }
        // const data = await this.fetchData('POST', '/getroomposition', keySearchPosition);

        // console.log(whichposition, room_id)

        let jsonData = {};
        // console.log(this.CSTUData)
        let dataOfRoom = this.CSTUData[JSON.parse(room_id)];
        // console.log(dataOfRoom)
        if(!!dataOfRoom){
            if(whichposition === "floor1" || whichposition === "floor2" || whichposition === "floor3"){
            //   let data = await db.sequelize.query("SELECT position_floor FROM `rooms` WHERE room_id = " + room_id +"", { type: db.sequelize.QueryTypes.SELECT})
            // console.log('xxxxxxxxxxxxxxxx')
                if(!!dataOfRoom['position_floor']){
                    let position_floor = dataOfRoom['position_floor'].split(',');
                    // console.log('position_floor, ', position_floor)
                    jsonData = {
                        target: {x: parseFloat(position_floor[0]), y: parseFloat(position_floor[1]), z: parseFloat(position_floor[2])},
                        radius: parseFloat(position_floor[3]),
                        theta: parseFloat(position_floor[4]),
                        phi: parseFloat(position_floor[5])
                    }           
                }
            

    
            }else if(whichposition === "site"){
                // console.log('yyyyyyyyyyyyyyyy')
            //   let data = await db.sequelize.query("SELECT position_site FROM `rooms` WHERE room_id = " + room_id +"", { type: db.sequelize.QueryTypes.SELECT})
                if(!!dataOfRoom['position_site']){
                    let position_site = dataOfRoom['position_site'].split(',');
                    jsonData = {
                        target: {x: parseFloat(position_site[0]), y: parseFloat(position_site[1]), z: parseFloat(position_site[2])},
                        radius: parseFloat(position_site[3]),
                        theta: parseFloat(position_site[4]),
                        phi: parseFloat(position_site[5])
                    }
                }
            }else{
                console.log("Not have that position");
            }            
        }

  
        // console.log(jsonData)
        return jsonData;
    }

    public async getDeviceOfRoom(room_id: string): Promise<any>{
        // let body = {
        //     token: this.token,
        //     room_id: room_id
        // }
        let dataOfRoom = this.CSTUData[room_id];
        let arrDevice = ['', ''];
        try{
          if(!!dataOfRoom['device']){
            let device = dataOfRoom['device'].split('&');
            for(let i = 0; i < device.length; i++){
              arrDevice[i] = device[i];
            }
          }
          return {floor: dataOfRoom['floor'], device: arrDevice};
    
        }catch(err){
            return {floor: 0, device: arrDevice};
        }

        // const data = await this.fetchData('POST', '/getdataofroom', body);
        
    }

    public async fetchData(method: string, service: string, data: any): Promise<any>{
        try{
            const response = await fetch(this.urlBackend + service, {
                method: method,
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const dataResponse = await response.json();      
            return dataResponse;      
        }catch(err){
            console.log('error: ', err);
            throw err;
        }
    }

    public async fetchRealTimeData(method: string, url: string): Promise<any>{
      try{
          const response = await fetch(url, {
              method: method,
              headers: {
              // 'Content-Type': 'application/json',
              },
          })
          // console.log("response = ", response);
          const dataResponse = await response.json();
          // console.log("dataResponse = ", dataResponse);
          return dataResponse;      
      }catch(err){
          console.log('error: ', err);
          throw err;
      }
  }

    public async fetchDataFromS3(method: string, fileName: string): Promise<any>{
        try{
            const response = await fetch(this.urlS3Bucket + "/" + fileName, {
                method: method,
                headers: {
                'Content-Type': 'application/json',
                },
            })
            const dataResponse = await response.json();      
            return dataResponse;      
        }catch(err){
            console.log('error: ', err);
            throw err;
        }
    }

  }