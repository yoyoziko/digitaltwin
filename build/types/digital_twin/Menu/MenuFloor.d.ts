import { World } from '../../world/World';
import { Menu } from './Menu';
export declare class MenuFloor extends Menu {
    constructor(world: World);
    executeNewStatus(newStatus: string): void;
    manageModel(floor: String): Promise<any>;
}
