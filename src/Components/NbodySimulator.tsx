import React from 'react';
import Sketch from 'react-p5';
import type p5Types from 'p5';
import {isMobile} from 'react-device-detect';
import {NBODY_COUNT_COMPUTER, NBODY_COUNT_MOBILE} from '../Constants/constant-nbody-simulator';

type Quadruplet = [number, number, number, number];

type ComponentProps = {
	parentRef: React.RefObject<HTMLElement>;
	nbodyCountMobile?: number;
	nbodyCountComputer?: number;
	frameRate?: number;
	fixedUpdate?: number;
	spawnAreaRadius?: number;
	gravitationalConstant?: number;
	particlesMass?: number;
	attractorMass?: number;
	friction?: number;
	distanceOffset?: number;
	pixelsPerMeter?: number;
	initColor?: Quadruplet;
	finalColor?: Quadruplet;
	maxColorVelocity?: number;
	maxVelocityColor?: number;
	backColor?: Quadruplet;
};

const ParticleSimulator: React.FC<ComponentProps> = (props: ComponentProps) => {
	const {
		parentRef,
		nbodyCountMobile = NBODY_COUNT_MOBILE,
		nbodyCountComputer = NBODY_COUNT_COMPUTER,
		frameRate = 60,
		fixedUpdate = 60,
		spawnAreaRadius = 100,
		gravitationalConstant = 1,
		particlesMass = 50,
		attractorMass = 250,
		friction = 0.99,
		distanceOffset = 10,
		pixelsPerMeter = 100,
		initColor = [0, 255, 255, 200],
		finalColor = [255, 0, 255, 200],
		maxColorVelocity = 5,
		backColor = [0, 0, 0, 255],
	} = props;

	// Time variables
	let previousTime = 0;
	let fixedUpdateAccum = 0;
	const fixedDeltaTime = 1 / fixedUpdate;

	// P5 variables
	let screenBuffer: p5Types.Graphics;

	// Sketch setup
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		// Create canvas
		const canvas = p5.createCanvas(props.parentRef.current!.clientWidth, props.parentRef.current!.clientHeight, p5.P2D)
			.parent(canvasParentRef);

		// Create graphics
		screenBuffer = p5.createGraphics(parentRef.current!.clientWidth, parentRef.current!.clientHeight, p5.P2D);

		// Set frame rate to 60
		p5.frameRate(frameRate);

		// Set up init mouse position
		p5.mouseX = p5.width / 2;
		p5.mouseY = p5.height / 2;

		for (let i = 0; i < (isMobile ? nbodyCountMobile : nbodyCountComputer); i++) {
			// // Define particles spawn in a circle
			// const randomFloat = (min: number, max: number) => min + ((max - min) * Math.random());
			// const randomAngle1 = randomFloat(0, 2 * Math.PI);
			// const randomAngle2 = randomFloat(0, 2 * Math.PI);
			// const posX = (p5.width / 2) + (spawnAreaRadius * Math.cos(randomAngle1) * Math.sin(randomAngle2));
			// const posY = (p5.height / 2) + (spawnAreaRadius * Math.sin(randomAngle1) * Math.sin(randomAngle2));
			//
			// // Create particle
			// particleArray.push(new Particle(p5,
			// 	posX,
			// 	posY),
			// );
		}
	};

	// Sketch draw call every frame (60 fps) game loop
	const draw = (p5: p5Types) => {
		/* Calculate deltaTime and update fixedUpdateAccum */
		const currentTime = p5.millis();
		const deltaTime = (currentTime - previousTime) / 1000;// in seconds
		previousTime = currentTime;
		fixedUpdateAccum += deltaTime;

		/* Update physics (fixed update) */
		if (fixedUpdateAccum >= fixedDeltaTime) {
			// // Update attractor
			// attractor.update(p5);
			// // Update particles
			// particleArray.forEach(particle => {
			// 	particle.update(p5, attractor, fixedDeltaTime, gravitationalConstant, pixelsPerMeter);
			// });
			fixedUpdateAccum = 0;
		}

		/* Update canvas */
		// Clear canvas
		screenBuffer.background(backColor[0], backColor[1], backColor[2], backColor[3]);

		// // Draw objects
		// attractor.show(screenBuffer);
		// particleArray.forEach(particle => {
		// 	particle.show(screenBuffer);
		// });

		// Swap buffers
		p5.image(screenBuffer, 0, 0);
	};

	// Sketch window resize
	const windowResized = (p5: p5Types) => {
		p5.resizeCanvas(props.parentRef.current!.clientWidth, props.parentRef.current!.clientHeight);
		screenBuffer.resizeCanvas(props.parentRef.current!.clientWidth, props.parentRef.current!.clientHeight);
	};

	return (
		<Sketch setup={setup} draw={draw} windowResized={windowResized}/>
	);
};

export default ParticleSimulator;
