// Import for Vec3-Use
import * as BABYLON from 'babylonjs';

export default {

	// ##################
	// Current State
	// ##################
	currentState: "Game",

	// ##################
	// forceBestQuality / No Adaption
	// ##################
	forceBestQuality: false,

	// ##################
	// Show Debug Layer
	// ##################
	showDebugLayer: false,

	// ##################
	// Diable Music
	// ##################
	disableMusic: false,

	// ##################
	// Diable Post Process
	// ##################
	disablePostProcess: true,

	// ##################
	// Diable Asteroids
	// ##################
	disableAsteroids: true,

	// ##################
	// Diable Skybox
	// ##################
	disableSkybox: false,

	// ##################
	// Spacestation Config
	// ##################	
	disableSpacestation: false,
	spaceStationPosition: new BABYLON.Vector3(0, 0, 0),
	spaceStationScaling: 1,

	// ##################
	// Diable Planet Mars
	// ##################
	disablePlanet: false,

	// ##################
	// Jumpgate Config
	// ##################
	disableJumpGate: false,
	jumpGateScaling: 0.5,


	// Follow Cam: 
	// planetInfiniteDistance: false,
	// skyBoxInfiniteDistance: false,
	// skyBoxSize: 1115000,

	// Cockpit Cam:
	planetInfiniteDistance: true,
	skyBoxInfiniteDistance: true,
	skyBoxSize: 115000,


	// ##################
	// Camera Config
	// ##################
	CameraMaxZ: 100000,
	gamepadViewCameraSpeed: 0.015,

	// ##################
	// Spaceship Controll Config
	// ##################
	airSpeed: 0,
	maxSpeed: 100,
	turnSpeed: 0.01,
	accValue: 0.01,

	// ##################
	// Enable Wormhole
	// ##################
	createSpaceTunnel: false,
	spaceTunnelQuality: 2048,
	// spaceTunnelQuality: 512,


	// ##################
	// Cockpit Positions
	// ##################

	// Hangar Position
	// cockpitPosition: new BABYLON.Vector3(-900, 180, 0)

	// JumpGate ViewPosition
	cockpitPosition: new BABYLON.Vector3(14000, 0, 8000)

};
