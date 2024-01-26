import { World } from '../../world/World';
import { Menu } from './Menu';
export declare class MenuView extends Menu {
    constructor(world: World);
    executeNewStatus(newStatus: string): void;
    changeView(newView: String): void;
}
