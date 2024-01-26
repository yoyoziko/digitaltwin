export declare class Server {
    private urlBackend;
    private urlS3Bucket;
    private urlGetLatestData;
    private token;
    private CSTUData;
    constructor(urlBackend: string, urlS3Bucket: string, urlGetLatestData: string, token: string);
    checkServer(): Promise<boolean>;
    getSciTUReports(): Promise<any>;
    getActiveProblems(rawStartDate: string, rawEndDate: string): Promise<any>;
    getSCITUReportProblems(): Promise<any>;
    getCurrentOccupant(rawStartDate: string, rawEndDate: string): Promise<any>;
    getCurrentIOT(rawStartDate: string, rawEndDate: string): Promise<any>;
    getTestData(): Promise<any>;
    getAllRoom(): Promise<any>;
    addNewRoom(room_id: string, name: string, position_floor: string, position_site: string): Promise<any>;
    getRoomPosition(room_id: string, whichposition: String): Promise<any>;
    getDeviceOfRoom(room_id: string): Promise<any>;
    fetchData(method: string, service: string, data: any): Promise<any>;
    fetchRealTimeData(method: string, url: string): Promise<any>;
    fetchDataFromS3(method: string, fileName: string): Promise<any>;
}
