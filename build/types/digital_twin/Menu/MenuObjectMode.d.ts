import { Menu } from './Menu';
export declare class MenuObjectMode extends Menu {
    domElement: any;
    boundOnMouseDown: (evt: any) => void;
    boundOnMouseUp: (evt: any) => void;
    constructor(domElement: HTMLElement);
    executeNewStatus(newStatus: string): void;
    onMouseDown(): void;
    onMouseUp(): void;
}
