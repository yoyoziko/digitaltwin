import { World } from '../world/World';
export declare class Popup_Data {
    world: World;
    constructor(world: World);
    openPopUp(room_id: string): Promise<any>;
    updateModelFromSAGE2(val: string): Promise<any>;
}
