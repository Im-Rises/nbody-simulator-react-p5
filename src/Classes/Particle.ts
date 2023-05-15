import type p5Types from 'p5';

class Particle {
	static mass = 50;
	static initColor: p5Types.Color;
	static finalColor: p5Types.Color;
	static maxForceMagColor: number;
	static softening = 0.1;

	static setInitialColor(initialColor: p5Types.Color) {
		Particle.initColor = initialColor;
	}

	static setFinalColor(centerColor: p5Types.Color) {
		Particle.finalColor = centerColor;
	}

	static setMaxForceMagColor(value: number) {
		this.maxForceMagColor = value;
	}

	static setSoftening(value: number) {
		this.softening = value;
	}

	position: p5Types.Vector;
	velocity: p5Types.Vector;
	color: p5Types.Color;

	constructor(p5: p5Types, x: number, y: number) {
		this.position = p5.createVector(x, y);
		this.velocity = p5.createVector(0, 0);
		this.color = Particle.initColor;
	}

	update(p5: p5Types, particles: Particle[], deltaTime: number, G: number, pixelPerMeter: number) {
		const positionNormalized = this.position.copy().div(pixelPerMeter);
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

		const acceleration = force.copy().div(Particle.mass);
		positionNormalized.add(this.velocity.copy().div(pixelPerMeter).mult(deltaTime))
			.add(acceleration.copy().div(2).mult(deltaTime ** 2));
		this.velocity.add(acceleration.copy().mult(deltaTime));
		// this.velocity.mult(friction);
		this.position = positionNormalized.copy().mult(pixelPerMeter);

		this.color = p5.lerpColor(Particle.initColor, Particle.finalColor, this.velocity.mag() / Particle.maxForceMagColor);
	}

	show(p5: p5Types) {
		p5.stroke(this.color);
		p5.strokeWeight(4);
		p5.point(this.position.x, this.position.y);
	}
}

export default Particle;
