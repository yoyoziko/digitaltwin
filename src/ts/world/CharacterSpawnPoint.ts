import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import * as THREE from 'three';
import { World } from './World';
import { Character } from '../characters/Character';
import { LoadingManager } from '../core/LoadingManager';
import * as Utils from '../core/FunctionLibrary';

export class CharacterSpawnPoint implements ISpawnPoint
{
	private object: THREE.Object3D;

	constructor(object: THREE.Object3D)
	{
		this.object = object;
	}
	
	public spawn(loadingManager: LoadingManager, world: World): void
	{
		loadingManager.loadGLTF('build/assets/boxman.glb', (model) =>
		// loadingManager.loadGLTF('https://publicdigitaltwin.s3.ap-southeast-1.amazonaws.com/boxman.glb', (model) =>
		{
			// console.log(model)
			// model.scene.visible = false;
			let player = new Character(model);
			
			let worldPos = new THREE.Vector3();

			// console.log(worldPos)
			this.object.getWorldPosition(worldPos);
			// console.log(worldPos)
			// worldPos.x = 10;
			// worldPos.y = 5;
			// worldPos.z = 10;			
			player.setPosition(worldPos.x, worldPos.y, worldPos.z);
			// console.log(worldPos)
			let forward = Utils.getForward(this.object);
			player.setOrientation(forward, true);
			// console.log(player)
			player.visible = false;
			world.add(player);
			
			//walk
			//player.takeControl();
			
			//fly
			player.resetControls();
            world.cameraOperator.characterCaller = player;          
            world.inputManager.setInputReceiver(world.cameraOperator);  
			
		});
	}
}