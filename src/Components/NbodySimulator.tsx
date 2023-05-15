import React from 'react';
import Sketch from 'react-p5';
import type p5Types from 'p5';
import {isMobile} from 'react-device-detect';
import {NBODY_COUNT_COMPUTER, NBODY_COUNT_MOBILE} from '../Constants/constant-nbody-simulator';
import Particle from '../Classes/Particle';

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
	softening?: number;
	friction?: number;
	pixelsPerMeter?: number;
	initColor?: Quadruplet;
	finalColor?: Quadruplet;
	maxForceMagColor?: number;
	backColor?: Quadruplet;
};

const ParticleSimulator = (props: ComponentProps) => {
	const {
		parentRef,
		nbodyCountMobile = 2,
		nbodyCountComputer = 2,
		frameRate = 60,
		fixedUpdate = 60,
		spawnAreaRadius = 300,
		gravitationalConstant = 1,
		particlesMass = 50,
		softening = 1,
		friction = 1,
		pixelsPerMeter = 100,
		initColor = [0, 255, 255, 200],
		finalColor = [255, 0, 255, 200],
		maxForceMagColor = 5,
		backColor = [0, 0, 0, 255],
	} = props;

	// Time variables
	let previousTime = 0;
	let fixedUpdateAccum = 0;
	const fixedDeltaTime = 1 / fixedUpdate;

	// P5 variables
	let screenBuffer: p5Types.Graphics;

	// Simulation variables
	const particles: Particle[] = [];

	// Sketch setup
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		// Create canvas
		const canvas = p5.createCanvas(props.parentRef.current!.clientWidth, props.parentRef.current!.clientHeight, p5.P2D)
			.parent(canvasParentRef);

		// Create graphics
		screenBuffer = p5.createGraphics(parentRef.current!.clientWidth, parentRef.current!.clientHeight, p5.P2D);

		// Set frame rate to 60
		p5.frameRate(frameRate);

		// Create particles
		Particle.setMass(particlesMass);
		Particle.setMaxForceMagColor(maxForceMagColor);
		Particle.setSoftening(softening);
		Particle.setFriction(friction);
		Particle.setInitialColor(p5.color(initColor[0], initColor[1], initColor[2], initColor[3]));
		Particle.setFinalColor(p5.color(finalColor[0], finalColor[1], finalColor[2], finalColor[3]));
		for (let i = 0; i < (isMobile ? nbodyCountMobile : nbodyCountComputer); i++) {
			// Define particles spawn in a circle
			const randomFloat = (min: number, max: number) => min + ((max - min) * Math.random());
			const randomAngle1 = randomFloat(0, 2 * Math.PI);
			const randomAngle2 = randomFloat(0, 2 * Math.PI);
			const posX = (p5.width / 2) + (spawnAreaRadius * Math.cos(randomAngle1) * Math.sin(randomAngle2));
			const posY = (p5.height / 2) + (spawnAreaRadius * Math.sin(randomAngle1) * Math.sin(randomAngle2));
			particles.push(new Particle(p5, posX, posY));
		}
	};

	// Sketch draw call every frame (60 fps) game loop
	const draw = (p5: p5Types) => {
		/* Calculate deltaTime and update fixedUpdateAccum */
		const currentTime = p5.millis();
		const deltaTime = (currentTime - previousTime) / 1000;
		previousTime = currentTime;
		fixedUpdateAccum += deltaTime;

		/* Update physics (fixed update) */
		if (fixedUpdateAccum >= fixedDeltaTime) {
			fixedUpdateAccum = 0;

			// Update particles acceleration
			for (const particle of particles) {
				particle.updateAcceleration(p5, particles, fixedDeltaTime, gravitationalConstant, pixelsPerMeter);
			}

			// Update particles velocity and position
			for (const particle of particles) {
				particle.updateVelocityAndPosition(p5, fixedDeltaTime, pixelsPerMeter);
			}
		}

		/* Update canvas */
		// Clear canvas
		screenBuffer.background(backColor[0], backColor[1], backColor[2], backColor[3]);

		// Draw objects
		for (const particle of particles) {
			particle.show(screenBuffer);
		}

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
