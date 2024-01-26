import { World } from '../world/World';
export declare class CameraView {
    world: World;
    setNewPosition: (evt: any) => void;
    constructor(world: World);
    private setOnClick;
    searchAndSetNewPosition(event: MouseEvent): Promise<any>;
    setCameraPosition(target: any, radius: number, theta: number, phi: number): void;
    initCameraView(): void;
    dragElement(elmnt: any): void;
}
