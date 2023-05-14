import type p5Types from 'p5';

class Particle {
	static mass = 50;
	static initColor: p5Types.Color;
	static finalColor: p5Types.Color;
	static maxForceMagColor: number;

	static setInitialColor(initialColor: p5Types.Color) {
		Particle.initColor = initialColor;
	}

	static setFinalColor(centerColor: p5Types.Color) {
		Particle.finalColor = centerColor;
	}

	static setMaxForceMagColor(value: number) {
		this.maxForceMagColor = value;
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
		for (const particle of particles) {
			if (particle !== this) {
				const positionNormalized = this.position.copy().div(pixelPerMeter);
				const particlePositionNormalized = particle.position.copy().div(pixelPerMeter);
				const distance = positionNormalized.dist(particlePositionNormalized);
				const force = G * (Particle.mass * Particle.mass) / (distance * distance);
				const direction = particlePositionNormalized.copy().sub(positionNormalized).normalize();
				const acceleration = direction.copy().mult(force / Particle.mass);
				this.velocity.add(acceleration.copy().mult(deltaTime));
				this.position.add(this.velocity.copy().mult(deltaTime));
			}
		}

		this.color = p5.lerpColor(Particle.initColor, Particle.finalColor, this.velocity.mag() / Particle.maxForceMagColor);
	}

	show(p5: p5Types) {
		p5.stroke(this.color);
		p5.strokeWeight(4);
		p5.point(this.position.x, this.position.y);
	}
}

export default Particle;
