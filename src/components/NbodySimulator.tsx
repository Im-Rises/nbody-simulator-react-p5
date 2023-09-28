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
	minSpawnRadius?: number;
	maxSpawnRadius?: number;
	minSpawnVelocity?: number;
	maxSpawnVelocity?: number;
	gravitationalConstant?: number;
	particlesMass?: number;
	softening?: number;
	friction?: number;
	mouseAttractorMass?: number;
	pixelsPerMeter?: number;
	initColor?: Quadruplet;
	finalColor?: Quadruplet;
	maxVelocityMagColor?: number;
	backColor?: Quadruplet;
};

const defaultProps = {
	nbodyCountMobile: NBODY_COUNT_MOBILE,
	nbodyCountComputer: NBODY_COUNT_COMPUTER,
	frameRate: 60,
	fixedUpdate: 60,
	minSpawnRadius: 3,
	maxSpawnRadius: 4,
	minSpawnVelocity: 5,
	maxSpawnVelocity: 10,
	gravitationalConstant: 1,
	particlesMass: 400,
	softening: 4,
	friction: 0.99,
	mouseAttractorMass: 10000,
	pixelsPerMeter: 100,
	initColor: [0, 255, 255, 200],
	finalColor: [255, 0, 255, 200],
	maxVelocityMagColor: 30,
	backColor: [0, 0, 0, 255],
};

const NbodySimulator = (props: ComponentProps) => {
	const mergedProps = {...defaultProps, ...props};

	// Time variables
	let previousTime = 0;
	let fixedUpdateAccum = 0;
	const fixedDeltaTime = 1 / mergedProps.fixedUpdate;

	// P5 variables
	let screenBuffer: p5Types.Graphics;

	// Simulation variables
	const particles: Particle[] = [];

	// Attractor center
	let mouseAttractorPosition: p5Types.Vector;

	const forceDivCanvasHolderAndCanvasStyle = (canvas: p5Types.Element, canvasParentRef: Element) => {
		// Set up canvas holder styles manually
		canvasParentRef.setAttribute('style', 'overflow: hidden; width: 100%; height: 100%;');
		// Set up canvas styles manually
		canvas.attribute('style', 'overflow: hidden; width: 100%; height: 100%;');
	};

	// Sketch setup
	const setup = (p5: p5Types, canvasParentRef: Element) => {
		// Create canvas
		const canvas = p5.createCanvas(mergedProps.parentRef.current!.clientWidth, mergedProps.parentRef.current!.clientHeight, p5.P2D)
			.parent(canvasParentRef);

		// Create graphics
		screenBuffer = p5.createGraphics(mergedProps.parentRef.current!.clientWidth, mergedProps.parentRef.current!.clientHeight, p5.P2D);

		// Set up canvas holder and canvas styles
		forceDivCanvasHolderAndCanvasStyle(canvas, canvasParentRef);

		// Set frame rate to 60
		p5.frameRate(mergedProps.frameRate);

		// Create attractor
		mouseAttractorPosition = p5.createVector(p5.width / 2, p5.height / 2).div(mergedProps.pixelsPerMeter);

		// Create particles
		Particle.setMass(mergedProps.particlesMass);
		Particle.setMaxForceMagColor(mergedProps.maxVelocityMagColor);
		Particle.setSoftening(mergedProps.softening);
		Particle.setFriction(mergedProps.friction);
		Particle.setInitialColor(p5.color(
			mergedProps.initColor[0], mergedProps.initColor[1], mergedProps.initColor[2], mergedProps.initColor[3]));
		Particle.setFinalColor(p5.color(
			mergedProps.finalColor[0], mergedProps.finalColor[1], mergedProps.finalColor[2], mergedProps.finalColor[3]));
		const posCentered = p5.createVector(p5.width / 2, p5.height / 2).div(mergedProps.pixelsPerMeter);
		for (let i = 0; i < (isMobile ? mergedProps.nbodyCountMobile : mergedProps.nbodyCountComputer); i++) {
			// Define particles spawn in a circle
			const randomFloat = (min: number, max: number) => min + ((max - min) * Math.random());
			const pos = (p5.createVector(randomFloat(-1, 1), randomFloat(-1, 1))
				.setMag(randomFloat(mergedProps.minSpawnRadius, mergedProps.maxSpawnRadius)));
			// const vel = pos.copy().rotate(Math.PI / 2).setMag(randomFloat(mergedProps.minSpawnVelocity, mergedProps.maxSpawnVelocity));
			// particles.push(new Particle(p5, posCentered.x + pos.x, posCentered.y + pos.y, vel.x, vel.y));
			particles.push(new Particle(p5, posCentered.x + pos.x, posCentered.y + pos.y, 0, 0));
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

			// Update mouse attractor position
			if (p5.mouseIsPressed) {
				mouseAttractorPosition = p5.createVector(p5.mouseX, p5.mouseY).div(mergedProps.pixelsPerMeter);
			}

			// Calculate forces applied to particles
			for (const particle of particles) {
				particle.updateForces(p5, particles, mergedProps.gravitationalConstant);
				particle.updateForceWithValue(
					p5, mouseAttractorPosition, mergedProps.mouseAttractorMass, mergedProps.gravitationalConstant);
			}

			// Update particles velocity and position
			for (const particle of particles) {
				particle.updatePhysic(p5, fixedDeltaTime);
			}
		}

		/* Update canvas */
		// Clear canvas
		screenBuffer.background(mergedProps.backColor[0], mergedProps.backColor[1], mergedProps.backColor[2], mergedProps.backColor[3]);

		// Draw attractor
		screenBuffer.stroke(mergedProps.finalColor[0], mergedProps.finalColor[1], mergedProps.finalColor[2], mergedProps.finalColor[3]);
		screenBuffer.strokeWeight(25);
		screenBuffer.point(mouseAttractorPosition.x * mergedProps.pixelsPerMeter, mouseAttractorPosition.y * mergedProps.pixelsPerMeter);

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
		<div style={{width: '100%', height: '100%', overflow: 'hidden'}}>
			<Sketch setup={setup} draw={draw} windowResized={windowResized}/>
		</div>
	);
};

export default NbodySimulator;
