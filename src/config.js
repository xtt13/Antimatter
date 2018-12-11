/*eslint no-undef: */
import * as BABYLON from 'babylonjs';

export default {
	enableVR: true,
	disableMusic: false,

	disablePostProgress: false,
	disableAsteroids: false,
	disableSpacestation: false,
	disablePlanet: false,
	disableJumpGate: false,

	spaceStationScaling: 1,

	disableJumpGate: false,
	jumpGateScaling: 0.5,


	planetInfiniteDistance: true,
	skyBoxInfiniteDistance: true,

	skyBoxSize: 105000,

	CameraMaxZ: 100000,

	airSpeed: 0,
	maxSpeed: 100,
	turnSpeed: 0.01,
	accValue: 0.01,
	gamepadViewCameraSpeed: 0.015,

	// Hangar Position
	// cockpitPosition: new BABYLON.Vector3(-900, 180, 0)

	// JumpGate ViewPosition
	cockpitPosition: new BABYLON.Vector3(12000, 0, 8000)

};
