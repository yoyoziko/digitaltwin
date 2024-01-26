import * as THREE from 'three';
import { World } from '../world/World';
export declare class InteractiveRoom {
    world: World;
    pointer: THREE.Vector2;
    raycaster: THREE.Raycaster;
    INTERSECTED: any;
    domElement: any;
    currentRoom: string;
    isMouseOnRoom: boolean;
    constructor(world: World, domElement: HTMLElement);
    onPointerMove(event: MouseEvent): void;
    render(): void;
}
