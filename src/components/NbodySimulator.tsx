import React from 'react';
import Sketch from 'react-p5';
import type p5Types from 'p5';
import {isMobile} from 'react-device-detect';
import {NBODY_COUNT_COMPUTER, NBODY_COUNT_MOBILE} from '../constants/constant-nbody-simulator';
import Particle from '../classes/Particle';

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

const defaultProps = {
	nbodyCountMobile: 2,
	nbodyCountComputer: 2,
	frameRate: 60,
	fixedUpdate: 60,
	spawnAreaRadius: 3,
	gravitationalConstant: 1,
	particlesMass: 50,
	softening: 1,
	friction: 1,
	pixelsPerMeter: 100,
	initColor: [0, 255, 255, 200],
	finalColor: [255, 0, 255, 200],
	maxForceMagColor: 5,
	backColor: [0, 0, 0, 255],
};

const ParticleSimulator = (props: ComponentProps) => {
	const mergedProps = {...defaultProps, ...props};

	// Time variables
	let previousTime = 0;
	let fixedUpdateAccum = 0;
	const fixedDeltaTime = 1 / mergedProps.fixedUpdate;

	// P5 variables
	let screenBuffer: p5Types.Graphics;

	// Simulation variables
	const particles: Particle[] = [];

	// Sketch setup
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		// Create canvas
		const canvas = p5.createCanvas(mergedProps.parentRef.current!.clientWidth, mergedProps.parentRef.current!.clientHeight, p5.P2D)
			.parent(canvasParentRef);

		// Create graphics
		screenBuffer = p5.createGraphics(mergedProps.parentRef.current!.clientWidth, mergedProps.parentRef.current!.clientHeight, p5.P2D);

		// Set frame rate to 60
		p5.frameRate(mergedProps.frameRate);

		// Create particles
		Particle.setMass(mergedProps.particlesMass);
		Particle.setMaxForceMagColor(mergedProps.maxForceMagColor);
		Particle.setSoftening(mergedProps.softening);
		Particle.setFriction(mergedProps.friction);
		Particle.setInitialColor(p5.color(
			mergedProps.initColor[0], mergedProps.initColor[1], mergedProps.initColor[2], mergedProps.initColor[3]));
		Particle.setFinalColor(p5.color(
			mergedProps.finalColor[0], mergedProps.finalColor[1], mergedProps.finalColor[2], mergedProps.finalColor[3]));
		for (let i = 0; i < (isMobile ? mergedProps.nbodyCountMobile : mergedProps.nbodyCountComputer); i++) {
			// Define particles spawn in a circle
			const randomFloat = (min: number, max: number) => min + ((max - min) * Math.random());
			const randomAngle1 = randomFloat(0, 2 * Math.PI);
			const randomAngle2 = randomFloat(0, 2 * Math.PI);
			const posX = ((p5.width / 2) / mergedProps.pixelsPerMeter)
                + (mergedProps.spawnAreaRadius * Math.cos(randomAngle1) * Math.sin(randomAngle2));
			const posY = ((p5.height / 2) / mergedProps.pixelsPerMeter)
                + (mergedProps.spawnAreaRadius * Math.sin(randomAngle1) * Math.sin(randomAngle2));
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
				particle.updateForces(p5, particles, fixedDeltaTime, mergedProps.gravitationalConstant);
			}

			// Update particles velocity and position
			for (const particle of particles) {
				particle.updateVelocityAndPosition(p5, fixedDeltaTime);
				particle.moveObjectOutOfScreen(p5, mergedProps.pixelsPerMeter);
			}
		}

		/* Update canvas */
		// Clear canvas
		screenBuffer.background(mergedProps.backColor[0], mergedProps.backColor[1], mergedProps.backColor[2], mergedProps.backColor[3]);

		// Draw objects
		for (const particle of particles) {
			particle.show(screenBuffer, mergedProps.pixelsPerMeter);
		}

		// Swap buffers
		p5.image(screenBuffer, 0, 0);
	};

	// Sketch window resize
	const windowResized = (p5: p5Types) => {
		p5.resizeCanvas(mergedProps.parentRef.current!.clientWidth, mergedProps.parentRef.current!.clientHeight);
		screenBuffer.resizeCanvas(mergedProps.parentRef.current!.clientWidth, mergedProps.parentRef.current!.clientHeight);
	};

	return (
		<Sketch setup={setup} draw={draw} windowResized={windowResized}/>
	);
};

export default ParticleSimulator;
