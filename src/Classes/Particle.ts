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
	acceleration: p5Types.Vector;
	velocity: p5Types.Vector;
	color: p5Types.Color;

	constructor(p5: p5Types, x: number, y: number) {
		this.position = p5.createVector(x, y);
		this.acceleration = p5.createVector(0, 0);
		this.velocity = p5.createVector(0, 0);
		this.color = Particle.initColor;

		// const position = p5Types.Vector.random2D();
		// const velocity = position.copy();
		// velocity.setMag(p5.random(1, 5));
		// position.setMag(p5.random(100, 200));
		// velocity.rotate(p5.HALF_PI);
		// this.position = p5.createVector(p5.width / 2, p5.height / 2).add(position);
		// this.velocity = velocity;
	}

	updateAcceleration(p5: p5Types, particles: Particle[], deltaTime: number, G: number, pixelPerMeter: number) {
		// Normalize position to meters not pixels
		const positionNormalized = this.position.copy().div(pixelPerMeter);

		// Calculate force
		const force = p5.createVector(0, 0);
		for (const particle of particles) {
			if (particle !== this) {
				const otherPositionNormalized = particle.position.copy().div(pixelPerMeter);
				const distance = positionNormalized.dist(otherPositionNormalized);
				const direction = otherPositionNormalized.copy().sub(positionNormalized).normalize();
				const forceMag = (G * Particle.mass * Particle.mass) / ((distance ** 2) + Particle.softening);
				force.add(direction.mult(forceMag));
			}
		}

		// Update acceleration
		this.acceleration = force.copy().div(Particle.mass);

		// Update color
		this.color = p5.lerpColor(Particle.initColor, Particle.finalColor, this.velocity.mag() / Particle.maxForceMagColor);
	}

	updateVelocityAndPosition(p5: p5Types, deltaTime: number, pixelPerMeter: number) {
		// Normalize position to meters not pixels
		const positionNormalized = this.position.copy().div(pixelPerMeter);

		positionNormalized.add(this.velocity.copy().div(pixelPerMeter).mult(deltaTime))
			.add(this.acceleration.copy().div(2).mult(deltaTime ** 2));
		this.velocity.add(this.acceleration.copy().mult(deltaTime));
		this.position = positionNormalized.copy().mult(pixelPerMeter);

		if (this.position.x < 0) {
			this.position.x = p5.width;
		}

		if (this.position.x > p5.width) {
			this.position.x = 0;
		}

		if (this.position.y < 0) {
			this.position.y = p5.height;
		}

		if (this.position.y > p5.height) {
			this.position.y = 0;
		}
	}

	show(p5: p5Types) {
		p5.stroke(this.color);
		p5.strokeWeight(15);
		p5.point(this.position.x, this.position.y);
	}
}

export default Particle;
