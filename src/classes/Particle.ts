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

	constructor(p5: p5Types, x: number, y: number, vx: number, vy: number) {
		this.position = p5.createVector(x, y);
		this.velocity = p5.createVector(vx, vy);
		this.sumForces = p5.createVector(0, 0);
		this.color = Particle.initColor;
	}

	updateForce(p5: p5Types, otherParticle: Particle, G: number) {
		const distance = this.position.dist(otherParticle.position);
		const direction = (otherParticle.position.copy().sub(this.position)).normalize();
		const forceMag = (G * Particle.mass * Particle.mass) / (((distance ** 2) + (Particle.softening ** 2)) ** (3 / 2));
		this.sumForces.add(direction.mult(forceMag));
	}

	updateForceWithValue(p5: p5Types, particlePosition: p5Types.Vector, particleMass: number, G: number) {
		const distance = this.position.dist(particlePosition);
		const direction = (particlePosition.copy().sub(this.position)).normalize();
		const forceMag = (G * Particle.mass * particleMass) / (((distance ** 2) + (Particle.softening ** 2)) ** (3 / 2));
		this.sumForces.add(direction.mult(forceMag));
	}

	updateForces(p5: p5Types, particles: Particle[], G: number) {
		// Calculate sum of forces
		for (const particle of particles) {
			if (particle !== this) {
				this.updateForce(p5, particle, G);
			}
		}
	}

	updatePhysic(p5: p5Types, deltaTime: number) {
		// Calculate acceleration
		const acceleration = this.sumForces.copy().div(Particle.mass);

		// Update position and velocity
		this.position.add(this.velocity.copy().mult(deltaTime)).add(acceleration.copy().mult(deltaTime * deltaTime / 2));
		this.velocity.add(acceleration.copy().mult(deltaTime));
		this.velocity.mult(Particle.friction);

		// Reset sum of forces
		this.sumForces = p5.createVector(0, 0);
	}

	show(p5: p5Types, pixelPerMeter: number) {
		// Update color
		this.color = p5.lerpColor(Particle.initColor, Particle.finalColor, this.velocity.mag() / Particle.maxForceMagColor);

		// Convert position to screen
		const positionScreen = this.position.copy().mult(pixelPerMeter);

		// Draw particle
		p5.stroke(this.color);
		p5.strokeWeight(15);
		p5.point(positionScreen.x, positionScreen.y);
	}
}

export default Particle;
