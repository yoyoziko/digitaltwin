import { Menu } from './Menu';
import { World } from '../../world/World';
export declare class MenuLabel extends Menu {
    amountLabel: Number;
    private envSelectColor;
    private envValueOfSettings;
    constructor(world: World);
    setStatus(newLabel: String): void;
    changeEnable(newLabel: String): void;
    setLabel(newLabel: String, isEnable: boolean): Promise<void>;
    updateComponents(newLabel: String, isEnable: boolean): void;
    loadValue(isEnable: boolean, label: String, eleLabel: any, nameOfRoom: string): void;
    private loadIndoorEnvSettings;
    isSelected(newLabel: String): boolean;
    private updateCameraField;
}
