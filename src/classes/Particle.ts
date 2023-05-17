import type p5Types from 'p5';

class Particle {
	static mass = 50;
	static maxForceMagColor: number;
	static softening: number;
	static friction: number;
	static initColor: p5Types.Color;
	static finalColor: p5Types.Color;

	static setMass(value: number) {
		this.mass = value;
	}

	static setMaxForceMagColor(value: number) {
		this.maxForceMagColor = value;
	}

	static setSoftening(value: number) {
		this.softening = value;
	}

	static setFriction(value: number) {
		Particle.friction = value;
	}

	static setInitialColor(initialColor: p5Types.Color) {
		Particle.initColor = initialColor;
	}

	static setFinalColor(centerColor: p5Types.Color) {
		Particle.finalColor = centerColor;
	}

	position: p5Types.Vector;
	velocity: p5Types.Vector;
	sumForces: p5Types.Vector;
	color: p5Types.Color;

	constructor(p5: p5Types, x: number, y: number) {
		this.position = p5.createVector(x, y);
		this.velocity = p5.createVector(0, 0);
		this.sumForces = p5.createVector(0, 0);
		this.color = Particle.initColor;
	}

	updateForces(p5: p5Types, particles: Particle[], deltaTime: number, G: number) {
		// Calculate force
		const force = p5.createVector(0, 0);
		for (const particle of particles) {
			if (particle !== this) {
				const distance = this.position.dist(particle.position);
				const direction = particle.position.copy().sub(this.position).normalize();
				const forceMag = (G * Particle.mass * Particle.mass) / ((distance ** 2) + Particle.softening);
				force.add(direction.mult(forceMag));
			}
		}

		this.sumForces = force;

		// Update color
		this.color = p5.lerpColor(Particle.initColor, Particle.finalColor, this.velocity.mag() / Particle.maxForceMagColor);
	}

	updateVelocityAndPosition(p5: p5Types, deltaTime: number) {
		// Calculate acceleration
		const acceleration = this.sumForces.copy().div(Particle.mass);

		// Update position and velocity
		this.position.add(this.velocity.copy().mult(deltaTime)).add(acceleration.copy().mult(deltaTime * deltaTime / 2));
		this.velocity.add(acceleration.copy().mult(deltaTime));
	}

	moveObjectOutOfScreen(p5: p5Types, pixelPerMeter: number) {
		/* Prevent particles from going out of the screen */
		if (this.position.x < 0) {
			this.position.x = p5.width / pixelPerMeter;
		}

		if (this.position.x > p5.width / pixelPerMeter) {
			this.position.x = 0;
		}

		if (this.position.y < 0) {
			this.position.y = p5.height / pixelPerMeter;
		}

		if (this.position.y > p5.height / pixelPerMeter) {
			this.position.y = 0;
		}
	}

	show(p5: p5Types, pixelPerMeter: number) {
		p5.stroke(this.color);
		p5.strokeWeight(15);
		const positionScreen = this.position.copy().mult(pixelPerMeter);
		p5.point(positionScreen.x, positionScreen.y);
	}
}

export default Particle;
