/*eslint no-undef: */
import * as BABYLON from 'babylonjs';

export default {
	showDebugLayer: false,
	enableVR: false,
	disableMusic: false,

	disablePostProcess: false,
	disableAsteroids: false,
	disableSpacestation: false,
	disablePlanet: false,
	disableJumpGate: false,
											
	spaceStationPosition: new BABYLON.Vector3(0, 0, 0),
	spaceStationScaling: 1,

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



	CameraMaxZ: 100000,

	airSpeed: 0,
	maxSpeed: 100,
	turnSpeed: 0.01,
	accValue: 0.01,
	gamepadViewCameraSpeed: 0.015,

	createSpaceTunnel: false,
	spaceTunnelQuality: 2048,

	// Hangar Position
	// cockpitPosition: new BABYLON.Vector3(-900, 180, 0)

	// JumpGate ViewPosition
	cockpitPosition: new BABYLON.Vector3(14000, 0, 8000)

	// cockpitPosition: new BABYLON.Vector3(0, 0, 0)

};
