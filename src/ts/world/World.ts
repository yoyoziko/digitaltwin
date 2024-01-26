import * as THREE from 'three';
import * as CANNON from 'cannon';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

import { CameraOperator } from '../core/CameraOperator';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader  } from 'three/examples/jsm/shaders/FXAAShader';

import { Detector } from '../../lib/utils/Detector';
import { Stats } from '../../lib/utils/Stats';
import * as GUI from '../../lib/utils/dat.gui';
import { CannonDebugRenderer } from '../../lib/cannon/CannonDebugRenderer';
import * as _ from 'lodash';

import { InputManager } from '../core/InputManager';
import * as Utils from '../core/FunctionLibrary';
import { LoadingManager } from '../core/LoadingManager';
import { InfoStack } from '../core/InfoStack';
import { UIManager } from '../core/UIManager';
import { IWorldEntity } from '../interfaces/IWorldEntity';
import { IUpdatable } from '../interfaces/IUpdatable';
import { Character } from '../characters/Character';
import { Path } from './Path';
import { CollisionGroups } from '../enums/CollisionGroups';
import { BoxCollider } from '../physics/colliders/BoxCollider';
import { TrimeshCollider } from '../physics/colliders/TrimeshCollider';
import { Vehicle } from '../vehicles/Vehicle';
import { Scenario } from './Scenario';
import { Sky } from './Sky';
import { Ocean } from './Ocean';

// import { RenderRoomArea } from '../digital_twin/RenderRoomArea';
// import { SciTuReport } from '../digital_twin/SciTuReport';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
// import { InteractiveRoom } from '../digital_twin/InteractiveRoom';
// import { PickObject } from '../digital_twin/PickObject';
// import { MenuObjectMode } from '../digital_twin/MenuObjectMode';
// import { MenuFloor } from '../digital_twin/MenuFloor';
import { GenerateHTML } from '../digital_twin/GenerateHTML';
// import { Popup_Data } from '../digital_twin/Popup_Data';
// import { MenuLabel } from '../digital_twin/MenuLabel';
// import { CameraView } from '../digital_twin/CameraView';

import { Main } from '../digital_twin/Main';

export class World
{
	public renderer: THREE.WebGLRenderer;
	public camera: THREE.PerspectiveCamera;
	public composer: any;
	public stats: Stats;
	public graphicsWorld: THREE.Scene;
	public sky: Sky;
	public physicsWorld: CANNON.World;
	public parallelPairs: any[];
	public physicsFrameRate: number;
	public physicsFrameTime: number;
	public physicsMaxPrediction: number;
	public clock: THREE.Clock;
	public renderDelta: number;
	public logicDelta: number;
	public requestDelta: number;
	public sinceLastFrame: number;
	public justRendered: boolean;
	public params: any;
	public inputManager: InputManager;
	public cameraOperator: CameraOperator;
	public timeScaleTarget: number = 1;
	public console: InfoStack;
	public cannonDebugRenderer: CannonDebugRenderer;
	// public renderRoomArea: RenderRoomArea;
	public scenarios: Scenario[] = [];
	public characters: Character[] = [];
	public vehicles: Vehicle[] = [];
	public paths: Path[] = [];
	public scenarioGUIFolder: any;
	public updatables: IUpdatable[] = [];

	public currentRoom: String;

	private lastScenarioID: string;

	// public scitureports: SciTuReport;
	// public interactiveRoom: InteractiveRoom;
	public labelRenderer: CSS2DRenderer;
	public generateHTML: GenerateHTML;

	// public menuObjectMode: MenuObjectMode;
	// public menuFloor: MenuFloor;
	// public popup_Data: Popup_Data;
	// public menuLabel: MenuLabel;
	// public cameraView: CameraView;
	public mainDigitalTwin: Main;

	constructor(worldScenePath?: any)
	{
		const scope = this;

		// WebGL not supported
		if (!Detector.webgl)
		{
			Swal.fire({
				icon: 'warning',
				title: 'WebGL compatibility',
				text: 'This browser doesn\'t seem to have the required WebGL capabilities. The application may not work correctly.',
				footer: '<a href="https://get.webgl.org/" target="_blank">Click here for more information</a>',
				showConfirmButton: false,
				buttonsStyling: false
			});
		}

		// Renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1.0;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.labelRenderer = new CSS2DRenderer();
		this.labelRenderer.setSize( window.innerWidth, window.innerHeight );
		this.labelRenderer.domElement.style.position = 'absolute';
		this.labelRenderer.domElement.style.top = '0px';
		
		document.body.appendChild( this.labelRenderer.domElement );

		// this.generateHTML();
		this.generateHTML = new GenerateHTML(this.renderer);

		// this.menuObjectMode = new MenuObjectMode();
		// this.menuFloor = new MenuFloor(this);
		// this.renderer.domElement.appendChild( this.labelRenderer.domElement );

		// Auto window resize
		function onWindowResize(): void
		{
			scope.camera.aspect = window.innerWidth / window.innerHeight;
			scope.camera.updateProjectionMatrix();
			scope.renderer.setSize(window.innerWidth, window.innerHeight);
			fxaaPass.uniforms['resolution'].value.set(1 / (window.innerWidth * pixelRatio), 1 / (window.innerHeight * pixelRatio));
			scope.composer.setSize(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio);
			scope.labelRenderer.setSize( window.innerWidth, window.innerHeight );
		}
		window.addEventListener('resize', onWindowResize, false);

		// Three.js scene
		this.graphicsWorld = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1010);

		// Passes
		let renderPass = new RenderPass( this.graphicsWorld, this.camera );
		let fxaaPass = new ShaderPass( FXAAShader );

		// FXAA
		let pixelRatio = this.renderer.getPixelRatio();
		fxaaPass.material['uniforms'].resolution.value.x = 1 / ( window.innerWidth * pixelRatio );
		fxaaPass.material['uniforms'].resolution.value.y = 1 / ( window.innerHeight * pixelRatio );

		// Composer
		this.composer = new EffectComposer( this.renderer );
		this.composer.addPass( renderPass );
		this.composer.addPass( fxaaPass );

		// Physics
		this.physicsWorld = new CANNON.World();
		this.physicsWorld.gravity.set(0, -9.81, 0);
		this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
		this.physicsWorld.solver.iterations = 10;
		this.physicsWorld.allowSleep = true;

		this.parallelPairs = [];
		this.physicsFrameRate = 60;
		this.physicsFrameTime = 1 / this.physicsFrameRate;
		this.physicsMaxPrediction = this.physicsFrameRate;

		// RenderLoop
		this.clock = new THREE.Clock();
		this.renderDelta = 0;
		this.logicDelta = 0;
		this.sinceLastFrame = 0;
		this.justRendered = false;

		// Stats (FPS, Frame time, Memory)
		this.stats = Stats();
		// Create right panel GUI
		this.createParamsGUI(scope);

		// Initialization
		// this.interactiveRoom = new InteractiveRoom(this, this.labelRenderer.domElement);
		this.inputManager = new InputManager(this, this.labelRenderer.domElement);
		this.cameraOperator = new CameraOperator(this, this.camera, this.params.Mouse_Sensitivity);
		
		this.sky = new Sky(this);
		
		// Load scene if path is supplied
		this.serverInit(worldScenePath);

	}

	// Update
	// Handles all logic updates.
	public update(timeStep: number, unscaledTimeStep: number): void
	{
		this.updatePhysics(timeStep);

		// Update registred objects
		this.updatables.forEach((entity) => {
			entity.update(timeStep, unscaledTimeStep);
		});

		// Lerp time scale
		this.params.Time_Scale = THREE.MathUtils.lerp(this.params.Time_Scale, this.timeScaleTarget, 0.2);

		// Physics debug

		// if (this.params.Room_Area) {
		// 	this.renderRoomArea.update();
		// }

		// if (this.params.Debug_Physics) {
		// 	this.cannonDebugRenderer.update();
		// }
	}

	public updatePhysics(timeStep: number): void
	{
		// Step the physics world
		this.physicsWorld.step(this.physicsFrameTime, timeStep);

		this.characters.forEach((char) => {
			if (this.isOutOfBounds(char.characterCapsule.body.position))
			{
				this.outOfBoundsRespawn(char.characterCapsule.body);
			}
		});

		this.vehicles.forEach((vehicle) => {
			if (this.isOutOfBounds(vehicle.rayCastVehicle.chassisBody.position))
			{
				let worldPos = new THREE.Vector3();
				vehicle.spawnPoint.getWorldPosition(worldPos);
				worldPos.y += 1;
				this.outOfBoundsRespawn(vehicle.rayCastVehicle.chassisBody, Utils.cannonVector(worldPos));
			}
		});
	}

	public isOutOfBounds(position: CANNON.Vec3): boolean
	{
		let inside = position.x > -211.882 && position.x < 211.882 &&
					position.z > -169.098 && position.z < 153.232 &&
					position.y > 0.107;
		let belowSeaLevel = position.y < 14.989;

		return !inside && belowSeaLevel;
	}

	public outOfBoundsRespawn(body: CANNON.Body, position?: CANNON.Vec3): void
	{
		// let newPos = position || new CANNON.Vec3(-67.5867871393042, 22.961888031566378, 30.693521780679333);
		let newPos = position || new CANNON.Vec3(0, 22, 0);
		let newQuat = new CANNON.Quaternion(0, 0, 0, 1);

		body.position.copy(newPos);
		body.interpolatedPosition.copy(newPos);
		body.quaternion.copy(newQuat);
		body.interpolatedQuaternion.copy(newQuat);
		body.velocity.setZero();
		body.angularVelocity.setZero();
	}

	/**
	 * Rendering loop.
	 * Implements fps limiter and frame-skipping
	 * Calls world's "update" function before rendering.
	 * @param {World} world 
	 */
	public render(world: World): void
	{
		this.requestDelta = this.clock.getDelta();

		requestAnimationFrame(() =>
		{
			world.render(world);
		});

		// Getting timeStep
		let unscaledTimeStep = (this.requestDelta + this.renderDelta + this.logicDelta) ;
		let timeStep = unscaledTimeStep * this.params.Time_Scale;
		timeStep = Math.min(timeStep, 1 / 30);    // min 30 fps

		// Logic
		world.update(timeStep, unscaledTimeStep);

		// Measuring logic time
		this.logicDelta = this.clock.getDelta();

		// Frame limiting
		let interval = 1 / 60;
		this.sinceLastFrame += this.requestDelta + this.renderDelta + this.logicDelta;
		this.sinceLastFrame %= interval;

		// Stats end
		this.stats.end();
		this.stats.begin();

		// Actual rendering with a FXAA ON/OFF switch
		if (this.params.FXAA) this.composer.render();
		else this.renderer.render(this.graphicsWorld, this.camera);
		// this.labelRenderer.render(this.graphicsWorld, this.camera);
		this.mainDigitalTwin.interactiveRoom.render();
		// this.interactiveRoom.render();
		this.labelRenderer.render(this.graphicsWorld, this.camera);
		// console.log(this.menuLabel.getSelectedLabel());
		// console.log(this.camera.position)
		// Measuring render time
		this.renderDelta = this.clock.getDelta();
		
		// console.log(this.menuBottom.getStatus())
	}

	public setTimeScale(value: number): void
	{
		this.params.Time_Scale = value;
		this.timeScaleTarget = value;
	}

	public add(worldEntity: IWorldEntity): void
	{
		worldEntity.addToWorld(this);
		this.registerUpdatable(worldEntity);
	}

	public registerUpdatable(registree: IUpdatable): void
	{
		this.updatables.push(registree);
		this.updatables.sort((a, b) => (a.updateOrder > b.updateOrder) ? 1 : -1);
	}

	public remove(worldEntity: IWorldEntity): void
	{
		worldEntity.removeFromWorld(this);
		this.unregisterUpdatable(worldEntity);
	}

	public unregisterUpdatable(registree: IUpdatable): void
	{
		_.pull(this.updatables, registree);
	}

    public async serverInit(worldScenePath?: any): Promise<void>{

		console.log('before load');
		this.mainDigitalTwin = new Main(this, this.labelRenderer.domElement);
		const isOpen = await this.mainDigitalTwin.setUpDataFromServer();
		// let arrRoom = this.mainDigitalTwin.roomData;
		// console.log('Success: ', arrRoom)
		


		if (isOpen && worldScenePath !== undefined)
		{


			let loadingManager = new LoadingManager(this);
			// console.log("xx ", loadingManager)
			loadingManager.onFinishedCallback = () =>
			{
				// sessionStorage.setItem('loadingManager', JSON.parse(loadingManager));
				// console.log('onFinishedCallback')
				this.update(1, 1);
				this.setTimeScale(1);
	
				// Swal.fire({
				// 	title: 'Welcome to Sketchbook!',
				// 	text: 'Feel free to explore the world and interact with available vehicles. There are also various scenarios ready to launch from the right panel.',
				// 	footer: '<a href="https://github.com/swift502/Sketchbook" target="_blank">GitHub page</a><a href="https://discord.gg/fGuEqCe" target="_blank">Discord server</a>',
				// 	confirmButtonText: 'Okay',
				// 	buttonsStyling: false,
				// 	onClose: () => {
				// 		UIManager.setUserInterfaceVisible(true);
				// 	}
				// });
				UIManager.setUserInterfaceVisible(true);
				
				// if(this.mainDigitalTwin.displayon === 'sage'){
				this.mainDigitalTwin.isLoadedModel = true;
				console.log("sage_onLoaded_model");
				// }
				
				
			};
			// let partOfGltfWorld = JSON.parse(localStorage.getItem('partOfGltfWorld'));
			// if(!!partOfGltfWorld){
			// 	console.log(partOfGltfWorld)
			// 	let rawData = '';
			// 	for(let iPart = 0; iPart < partOfGltfWorld; iPart++){
			// 		let strLocal = JSON.parse(localStorage.getItem('gltfWorld' + iPart));
			// 		rawData += strLocal;
			// 	}
			// 	let cleanData = JSON.parse(rawData);
			// 	console.log(cleanData);
			// 	this.loadScene(loadingManager, cleanData);
			// }else{
				loadingManager.loadGLTF(worldScenePath, (gltf) =>
					{
						// let strGltfWorld = JSON.stringify(gltf)
						// console.log(strGltfWorld.length)
						// const lengthOfData = strGltfWorld.length/100;
						// let lengthStart = 0;
						// let lengthEnd = lengthOfData;
						// console.log(lengthOfData)
						// let part = 0;
						// while(true) {
						// 	let data = strGltfWorld.slice(lengthStart, lengthEnd)

						// 	console.log("xyz>>>> ", data.length);
						// 	localStorage.setItem('gltfWorld' + part, data);

						// 	lengthStart = lengthEnd + 1;
						// 	lengthEnd += lengthOfData;
						// 	console.log(">>>> ", lengthStart, lengthEnd);

						// 	part++;

						// 	if(lengthEnd >= strGltfWorld.length){
						// 		break;
						// 	}
						// }
						// localStorage.setItem('partOfGltfWorld', JSON.stringify(part));

						this.loadScene(loadingManager, gltf);
						
					});				
			}else{
			UIManager.setUserInterfaceVisible(true);
			UIManager.setLoadingScreenVisible(false);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
				buttonsStyling: false
			});
			document.getElementsByTagName("BODY")[0].innerHTML = '<CENTER style="font-size: 48px;">UNDER CONSTRUCTION</CENTER>';
		}

		// this.cameraView = new CameraView(this);
		// this.scitureports = new SciTuReport(this);
		// this.menuLabel = new MenuLabel(this);
		// this.menuFloor = new MenuFloor(this);
		// this.popup_Data = new Popup_Data();
		// this.mainDigitalTwin = new Main(this, this.labelRenderer.domElement);
		// this.mainDigitalTwin.setUpDataFromServer();
		// this.labelRenderer = new CSS2DRenderer();
		// this.labelRenderer.setSize( window.innerWidth, window.innerHeight );
		// this.labelRenderer.domElement.style.position = 'absolute';
		// this.labelRenderer.domElement.style.top = '0px';
		// this.renderer.domElement.appendChild( this.labelRenderer.domElement );

		this.render(this);
    }

	public loadScene(loadingManager: LoadingManager, gltf: any): void
	{
		// console.log(this.mainDigitalTwin.roomName)
		// console.log(gltf.scene.children)
		
		// gltf.scene.children.forEach(element => {
		// 	// console.log(element)
		// 	if(element.name === "model_floor1"){
		// 		element.visible = false;
		// 	}

		// 	if(element.name === "model_floor2"){
		// 		element.visible = false;
		// 	}

		// 	if(element.name === "model_floor3"){
		// 		element.visible = false;
		// 	}
		// });

		gltf.scene.traverse((child) => {
			// console.log(child.name);
			if (child.hasOwnProperty('userData'))
			{
				
				if (child.userData.hasOwnProperty('type') && child.userData.type === "room")
				{
					// console.log(child);

					let material = new THREE.MeshStandardMaterial({
						opacity: 0,
						transparent: true
					});
					
					child.material = material;
					child.isOpenDashboardOnSAGE = false;

					const label = document.createElement('div');
					const roomName = document.createElement('div');
					// const reportProblem = document.createElement('div');
					const temp = document.createElement('div');
					const humidity = document.createElement('div');
					const light = document.createElement('div');
					const occupant = document.createElement('div');

					roomName.id = 'headerlabel';
					temp.id = 'idtemp';
					humidity.id = 'idhumidity';
					light.id = 'idlight';
					occupant.id = 'idoccupant';

					roomName.style.display = 'none';
					temp.style.display = 'none';
					humidity.style.display = 'none';
					light.style.display = 'none';
					occupant.style.display = 'none';

					light.className = 'label-light';

					// roomName.textContent = this.mainDigitalTwin.getLabelRoomName(child.name);
					// let name = this.mainDigitalTwin.getLabelRoomName(child.name);

					roomName.innerHTML = '<div>' + this.mainDigitalTwin.getLabelRoomName(child.name) + '<span id="idreportproblem" style="display: none;" class="label_circle_red">!</span></div>';

					
					// reportProblem.className = "label_circle_red";
					// reportProblem.textContent = "!";


					// const labelObject = new CSS2DObject( label );

					//iot label//////////////////////////////////////////////////////

					//temp
					// const labelTemp = document.createElement( 'div' );
					// let temp = parseFloat((Math.floor(Math.random() * 21) + 18) + '.' + (Math.floor(Math.random() * 9) + 1));
					// let temp = 0;
					// let latempName = 'label_square_red';
					// if(temp >= 18 && temp <= 27){
					// 	latempName = 'label_square_blue'
					// }
					// labelTemp.className = latempName;
					// labelTemp.innerHTML = '<i class="fas fa-thermometer-half"></i> ' + temp + ' °C';
					// const labelObjectTemp = new CSS2DObject( labelTemp );
					// labelObjectTemp.position.set( -0.5, -0.5, -0.5 );
					
					//humidity
					// const labelHumidity = document.createElement( 'div' );
					// let humidity = Math.floor(Math.random() * 70) + 30;
					// let lahumiName = 'label_square_red';
					// if(humidity >= 40 && humidity <= 60){
					// 	lahumiName = 'label_square_green'
					// }
					// labelHumidity.className = lahumiName;
					// labelHumidity.innerHTML = '<i class="fas fa-tint"></i> ' + humidity + ' %';
					// const labelObjectHumidity = new CSS2DObject( labelHumidity );
					// labelObjectHumidity.position.set( 0.5, -0.5, 0.5 );

					//light
					// const labelLight = document.createElement( 'div' );
					// let light = Math.floor(Math.random() * 900) + 100;
					// let laligName = 'label_dark';
					// if(light >= 100 && light <= 500){
					// 	laligName = 'label_bright'
					// }
					// labelLight.className = laligName;
					// labelLight.innerHTML = '<i class="' + laligName + ' fas fa-lightbulb"></i> ';
					// const labelObjectLight = new CSS2DObject( labelLight );
					// labelObjectLight.position.set( 0, 0.5, 0.1 );
					////////////////////////////////////////////////////////////


					label.appendChild(roomName);
					// label.appendChild(reportProblem);
					label.appendChild(temp);
					label.appendChild(humidity);
					label.appendChild(light);
					label.appendChild(occupant);

					const labelObject = new CSS2DObject( label );
					// labelObject.position.set( 0, 0, 0);
					let x = 0;
					let z = 1;
					if(child.name === '106' || child.name === '107' || child.name === '108'){
						z = 0;
						x = 1;
					}
					if(child.name === '211'){
						z = -1;
						x = 0.75;
					}
					if(child.name === '212'){
						z = 0.6;
						x = 1;
					}
					if(child.name === '213'){
						z = 1;
						x = 0.75;
					}
					labelObject.position.set( x, 0, z );
					// const labelSciTU = document.createElement('div');
					// labelSciTU.className = "label_circle_red";
					// labelSciTU.textContent = "!";
					// const labelSciTUObject = new CSS2DObject( labelSciTU );
					// labelSciTUObject.position.set( 0, -0.5, 0 );

					// labelObject.visible = false;
					// labelSciTUObject.visible = false;
					// labelObjectTemp.visible = false;
					// labelObjectHumidity.visible = false;
					// labelObjectLight.visible = false;

					// labelObject.userData.type = "label";
					labelObject.userData.type = "label";
					// labelObject.userData.type = "room_name";
					// labelSciTUObject.userData.type = "scitu_report";
					// labelObjectTemp.userData.type = "iot_temp";
					// labelObjectHumidity.userData.type = "iot_humidity";
					// labelObjectLight.userData.type = "iot_light";
					// console.log(labelObject)

					child.add(labelObject);
					// child.add(labelSciTUObject);
					// child.add(labelObjectTemp);
					// child.add(labelObjectHumidity);
					// child.add(labelObjectLight);
				}

				if (child.type === 'Mesh')
				{
					Utils.setupMeshProperties(child);
					this.sky.csm.setupMaterial(child.material);

					if (child.material.name === 'ocean')
					{

						this.registerUpdatable(new Ocean(child, this));
					}

				}

				if (child.userData.hasOwnProperty('data'))
				{
					if (child.userData.data === 'physics')
					{
						if (child.userData.hasOwnProperty('type')) 
						{
							// Convex doesn't work! Stick to boxes!
							if (child.userData.type === 'box')
							{
								// console.log(child)
								let phys = new BoxCollider({size: new THREE.Vector3(child.scale.x, child.scale.y, child.scale.z)});
								phys.body.position.copy(Utils.cannonVector(child.position));
								phys.body.quaternion.copy(Utils.cannonQuat(child.quaternion));
								phys.body.computeAABB();

								phys.body.shapes.forEach((shape) => {
									shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders;
								});
								
								// console.log(phys.body);
								this.physicsWorld.addBody(phys.body);
							}
							else if (child.userData.type === 'trimesh')
							{
								let phys = new TrimeshCollider(child, {});
								this.physicsWorld.addBody(phys.body);
							}

							child.visible = false;
						}
					}

					if (child.userData.data === 'path')
					{
						this.paths.push(new Path(child));
					}

					if (child.userData.data === 'scenario')
					{
						this.scenarios.push(new Scenario(child, this));
					}
				}

			}
		});

		this.graphicsWorld.add(gltf.scene);
		this.mainDigitalTwin.menuFloor.manageModel('site');
		// Launch default scenario
		let defaultScenarioID: string;
		for (const scenario of this.scenarios) {
			if (scenario.default) {
				defaultScenarioID = scenario.id;
				break;
			}
		}
		if (defaultScenarioID !== undefined) this.launchScenario(defaultScenarioID, loadingManager);
	}
	
	public launchScenario(scenarioID: string, loadingManager?: LoadingManager): void
	{
		this.lastScenarioID = scenarioID;

		this.clearEntities();

		// Launch default scenario
		if (!loadingManager) loadingManager = new LoadingManager(this);
		for (const scenario of this.scenarios) {
			if (scenario.id === scenarioID || scenario.spawnAlways) {
				scenario.launch(loadingManager, this);
			}
		}
	}

	public restartScenario(): void
	{
		if (this.lastScenarioID !== undefined)
		{
			document.exitPointerLock();
			this.launchScenario(this.lastScenarioID);
		}
		else
		{
			console.warn('Can\'t restart scenario. Last scenarioID is undefined.');
		}
	}

	public clearEntities(): void
	{
		for (let i = 0; i < this.characters.length; i++) {
			this.remove(this.characters[i]);
			i--;
		}

		for (let i = 0; i < this.vehicles.length; i++) {
			this.remove(this.vehicles[i]);
			i--;
		}
	}

	public scrollTheTimeScale(scrollAmount: number): void
	{
		// Changing time scale with scroll wheel
		const timeScaleBottomLimit = 0.003;
		const timeScaleChangeSpeed = 1.3;
	
		if (scrollAmount > 0)
		{
			this.timeScaleTarget /= timeScaleChangeSpeed;
			if (this.timeScaleTarget < timeScaleBottomLimit) this.timeScaleTarget = 0;
		}
		else
		{
			this.timeScaleTarget *= timeScaleChangeSpeed;
			if (this.timeScaleTarget < timeScaleBottomLimit) this.timeScaleTarget = timeScaleBottomLimit;
			this.timeScaleTarget = Math.min(this.timeScaleTarget, 1);
		}
	}

	public updateControls(controls: any): void
	{
		let html = '';
		html += '<h2 class="controls-title">Controls:</h2>';

		controls.forEach((row) =>
		{
			html += '<div class="ctrl-row">';
			row.keys.forEach((key) => {
				if (key === '+' || key === 'and' || key === 'or' || key === '&') html += '&nbsp;' + key + '&nbsp;';
				else html += '<span class="ctrl-key">' + key + '</span>';
			});

			html += '<span class="ctrl-desc">' + row.desc + '</span></div>';
		});

		document.getElementById('controls').innerHTML = html;
	}

	// private generateHTML(): void
	// {

	// }

	// private createParamsGUI(scope: World): void
	// {
	// 	this.params = {
	// 		Pointer_Lock: true,
	// 		Mouse_Sensitivity: 0.3,
	// 		Time_Scale: 1,
	// 		Shadows: true,
	// 		FXAA: true,
	// 		Debug_Physics: false,
	// 		Debug_FPS: false,
	// 		Sun_Elevation: 50,
	// 		Sun_Rotation: 145,
	// 	};

	// 	const gui = new GUI.GUI();

	// 	// Scenario
	// 	this.scenarioGUIFolder = gui.addFolder('Scenarios');
	// 	this.scenarioGUIFolder.open();

	// 	// World
	// 	let worldFolder = gui.addFolder('World');
	// 	worldFolder.add(this.params, 'Time_Scale', 0, 1).listen()
	// 		.onChange((value) =>
	// 		{
	// 			scope.timeScaleTarget = value;
	// 		});
	// 	worldFolder.add(this.params, 'Sun_Elevation', 0, 180).listen()
	// 		.onChange((value) =>
	// 		{
	// 			scope.sky.phi = value;
	// 		});
	// 	worldFolder.add(this.params, 'Sun_Rotation', 0, 360).listen()
	// 		.onChange((value) =>
	// 		{
	// 			scope.sky.theta = value;
	// 		});

	// 	// Input
	// 	let settingsFolder = gui.addFolder('Settings');
	// 	settingsFolder.add(this.params, 'FXAA');
	// 	settingsFolder.add(this.params, 'Shadows')
	// 		.onChange((enabled) =>
	// 		{
	// 			if (enabled)
	// 			{
	// 				this.sky.csm.lights.forEach((light) => {
	// 					light.castShadow = true;
	// 				});
	// 			}
	// 			else
	// 			{
	// 				this.sky.csm.lights.forEach((light) => {
	// 					light.castShadow = false;
	// 				});
	// 			}
	// 		});
	// 	settingsFolder.add(this.params, 'Pointer_Lock')
	// 		.onChange((enabled) =>
	// 		{
	// 			scope.inputManager.setPointerLock(enabled);
	// 		});
	// 	settingsFolder.add(this.params, 'Mouse_Sensitivity', 0, 1)
	// 		.onChange((value) =>
	// 		{
	// 			scope.cameraOperator.setSensitivity(value, value * 0.8);
	// 		});
	// 	settingsFolder.add(this.params, 'Debug_Physics')
	// 		.onChange((enabled) =>
	// 		{
	// 			if (enabled)
	// 			{
	// 				this.cannonDebugRenderer = new CannonDebugRenderer( this.graphicsWorld, this.physicsWorld );
	// 			}
	// 			else
	// 			{
	// 				this.cannonDebugRenderer.clearMeshes();
	// 				this.cannonDebugRenderer = undefined;
	// 			}

	// 			scope.characters.forEach((char) =>
	// 			{
	// 				char.raycastBox.visible = enabled;
	// 			});
	// 		});
	// 	settingsFolder.add(this.params, 'Debug_FPS')
	// 		.onChange((enabled) =>
	// 		{
	// 			UIManager.setFPSVisible(enabled);
	// 		});

	// 	gui.open();
	// }


	private createParamsGUI(scope: World): void
	{
		this.params = {
			Pointer_Lock: false,
			Mouse_Sensitivity: 0.3,
			Time_Scale: 1,
			Shadows: true,
			FXAA: true,
			Debug_Physics: true,
			Debug_FPS: false,
			Sun_Elevation: 50,
			Sun_Rotation: 145,
			Room_Area: false
		};
		this.cannonDebugRenderer = new CannonDebugRenderer( this.graphicsWorld, this.physicsWorld );
		// this.renderRoomArea = new RenderRoomArea( this.graphicsWorld, this.physicsWorld);
		// const gui = new GUI.GUI();

		// Scenario
		// this.scenarioGUIFolder = gui.addFolder('Scenarios');
		// this.scenarioGUIFolder.open();

		// World
		// scope.timeScaleTarget = 1;
	// scope.sky.phi = 50;
// scope.sky.theta = 145;

// UIManager.setFPSVisible(true);


		// gui.open();
	}
}