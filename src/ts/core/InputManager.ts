import { World } from '../world/World';
import { IInputReceiver } from '../interfaces/IInputReceiver';
import { EntityType } from '../enums/EntityType';
import { IUpdatable } from '../interfaces/IUpdatable';
import { random } from 'lodash';
// import * as THREE from 'three';
// import { InteractiveRoom } from '../digital_twin/InteractiveRoom';

export class InputManager implements IUpdatable
{
	public updateOrder: number = 3;

	public world: World;
	public domElement: any;
	public pointerLock: any;
	public isLocked: boolean;
	public inputReceiver: IInputReceiver;

	public isOpenMenu: boolean;
	public isClientXY: boolean;
	public currentClientX: number;
	public currentClientY: number;
	// public clickRoom: ClickRoom;

	public boundOnMouseDown: (evt: any) => void;
	public boundOnMouseMove: (evt: any) => void;
	public boundOnMouseUp: (evt: any) => void;
	public boundOnMouseWheelMove: (evt: any) => void;
	public boundOnPointerlockChange: (evt: any) => void;
	public boundOnPointerlockError: (evt: any) => void;
	public boundOnKeyDown: (evt: any) => void;
	public boundOnKeyUp: (evt: any) => void;
	
	constructor(world: World, domElement: HTMLElement)
	{
		this.world = world;
		this.pointerLock = world.params.Pointer_Lock;
		this.domElement = domElement || document.body;
		this.isLocked = false;
		this.isOpenMenu = false;
		this.isClientXY = true;
		// Bindings for later event use
		// Mouse
		this.boundOnMouseDown = (evt) => this.onMouseDown(evt);
		this.boundOnMouseMove = (evt) => this.onMouseMove(evt);
		this.boundOnMouseUp = (evt) => this.onMouseUp(evt);
		this.boundOnMouseWheelMove = (evt) => this.onMouseWheelMove(evt);

		// Pointer lock
		this.boundOnPointerlockChange = (evt) => this.onPointerlockChange(evt);
		this.boundOnPointerlockError = (evt) => this.onPointerlockError(evt);

		// Keys
		this.boundOnKeyDown = (evt) => this.onKeyDown(evt);
		this.boundOnKeyUp = (evt) => this.onKeyUp(evt);

		// Init event listeners
		// Mouse
		this.domElement.addEventListener('mousedown', this.boundOnMouseDown, false);
		document.addEventListener('wheel', this.boundOnMouseWheelMove, false);
		document.addEventListener('pointerlockchange', this.boundOnPointerlockChange, false);
		document.addEventListener('pointerlockerror', this.boundOnPointerlockError, false);

		// document.addEventListener('mousemove', evt => this.clickRoom.clickRoom(evt));

		// Keys
		document.addEventListener('keydown', this.boundOnKeyDown, false);
		document.addEventListener('keyup', this.boundOnKeyUp, false);

		// this.clickRoom = new ClickRoom(this.world);
		// window.onpointerdown = (evt) => this.clickRoom.clickRoom(evt);
		// document.addEventListener('mousedown', (evt) => this.clickRoom.clickRoom(evt));
		// document.addEventListener('mousemove', (evt) => this.world.interactiveRoom.onPointerMove(evt));

		world.registerUpdatable(this);
		
	}

	public update(timestep: number, unscaledTimeStep: number): void
	{
		if (this.inputReceiver === undefined && this.world !== undefined && this.world.cameraOperator !== undefined)
		{
			this.setInputReceiver(this.world.cameraOperator);
		}

		this.inputReceiver?.inputReceiverUpdate(unscaledTimeStep);
	}

	public setInputReceiver(receiver: IInputReceiver): void
	{
		this.inputReceiver = receiver;
		this.inputReceiver.inputReceiverInit();
	}

	public setPointerLock(enabled: boolean): void
	{
		this.pointerLock = enabled;
	}

	public onPointerlockChange(event: MouseEvent): void
	{
		if (document.pointerLockElement === this.domElement)
		{
			this.domElement.addEventListener('mousemove', this.boundOnMouseMove, false);
			this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false);
			this.isLocked = true;
		}
		else
		{
			this.domElement.removeEventListener('mousemove', this.boundOnMouseMove, false);
			this.domElement.removeEventListener('mouseup', this.boundOnMouseUp, false);
			this.isLocked = false;
		}
	}

	public onPointerlockError(event: MouseEvent): void
	{
		console.error('PointerLockControls: Unable to use Pointer Lock API');
	}

	public onMouseDown(event: MouseEvent): void
	{
		// console.log('event onMouseDown');
		// if(event.button == 1){
			// console.log(this.world.mainDigitalTwin.menuObjectMode.getStatus())
			// console.log(this.world.mainDigitalTwin.menuObjectMode.getStatus() === "rotate")
		if(this.world.mainDigitalTwin.menuObjectMode.getStatus() === "rotate"){
			// console.log(this.domElement.style.cursor)
			// console.log('onMouseDown')
			// this.domElement.style.cursor = 'grabbing';
			// console.log(this.domElement.style.cursor)
			if (this.pointerLock)
			{
				this.domElement.requestPointerLock();
			}
			else
			{
				this.domElement.addEventListener('mousemove', this.boundOnMouseMove, false);
				this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false);
			}

			if (this.inputReceiver !== undefined)
			{
				this.inputReceiver.handleMouseButton(event, 'mouse' + event.button, true);
			}	
		}else if(this.world.mainDigitalTwin.menuObjectMode.getStatus() === "click"){
			if(this.world.mainDigitalTwin.interactiveRoom.isMouseOnRoom){
				this.world.mainDigitalTwin.popup_Data.openPopUp(this.world.mainDigitalTwin.interactiveRoom.currentRoom);
			}
			// console.log(this.world.interactiveRoom.isMouseOnRoom, this.world.interactiveRoom.currentRoom);
		}
		// }

	}

	public onMouseMove(event: MouseEvent): void
	{

		let x = event.clientX
		let y = event.clientY;
		let movementX = event.movementX;
		let movementY = event.movementY;

		// if(event.screenX == 0 && event.screenY == 0){
		// 	if(this.isClientXY){
		// 		this.currentClientX = x;
		// 		this.currentClientY = y;
		// 		this.isClientXY = false;
		// 		return;
		// 	}else{
		// 		this.isClientXY = true;
		// 	}

		// 	x = this.currentClientX;
		// 	y = this.currentClientY;
		// 	movementX = event.clientX;
		// 	movementY = event.clientY;
		// }

		// console.log('onMouseMove client raw =', event, event.clientX, event.clientY, ', movement=', event.movementX, event.movementY, ', button=', event.button)

		// let e = <any>event;
		// e.screenX = 0;
		// e.screenY = 0;

		if (this.inputReceiver !== undefined)
		{
			let e = new MouseEvent('mousemove', {
				clientX: x,
				clientY: y,
				// movementX: event.movementX,
				// movementY: event.movementY
				movementX: movementX,
				movementY: movementY
			});

			// console.log('onMouseMove client cleaned =', e, e.clientX, e.clientY, ', movement=', e.movementX, e.movementY)
			this.inputReceiver.handleMouseMove(e, e.movementX, e.movementY);
		}
	}

	public onMouseUp(event: MouseEvent): void
	{
		//console.log('onMouseUp')
		// console.log('onMouseUp')
		// this.domElement.style.cursor = 'grab';
		// console.log('onMouseUp')
		if (!this.pointerLock)
		{
			this.domElement.removeEventListener('mousemove', this.boundOnMouseMove, false);
			this.domElement.removeEventListener('mouseup', this.boundOnMouseUp, false);
		}

		if (this.inputReceiver !== undefined)
		{
			this.inputReceiver.handleMouseButton(event, 'mouse' + event.button, false);
		}
	}

	public onKeyDown(event: KeyboardEvent): void
	{
		//console.log('onKeyDown')
		if (this.inputReceiver !== undefined)
		{
			this.inputReceiver.handleKeyboardEvent(event, event.code, true);
		}
	}

	public onKeyUp(event: KeyboardEvent): void
	{
		//console.log('onKeyUp')
		if (this.inputReceiver !== undefined)
		{
			this.inputReceiver.handleKeyboardEvent(event, event.code, false);
		}
	}

	public onMouseWheelMove(event: WheelEvent): void
	{
		//console.log('onMouseWheelMove')
		if (this.inputReceiver !== undefined)
		{
			this.inputReceiver.handleMouseWheel(event, event.deltaY);
		}
	}

}