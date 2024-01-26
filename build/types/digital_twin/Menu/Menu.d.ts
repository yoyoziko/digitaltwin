import { World } from '../../world/World';
export declare class Menu {
    private status;
    protected colorSelected: string;
    protected colorNormal: string;
    private idMenu;
    labelArr: string[];
    world: World;
    constructor(world: World, menuID: string, optionIdOfMenu: string[], defaultOption: string);
    menuClick(): void;
    setStatus(newStatus: string): void;
    executeNewStatus(newStatus: string): void;
    getStatus(): string;
    dragElement(elmnt: any): void;
}
