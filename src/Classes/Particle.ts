import type p5Types from 'p5';

class Particle {
	static mass = 50;
	position: p5Types.Vector;
	velocity: p5Types.Vector;

	constructor(p5: p5Types, x: number, y: number) {
		this.position = p5.createVector(0, 0);
		this.velocity = p5.createVector(0, 0);
	}

	update(p5: p5Types, particles: Particle[], deltaTime: number, G: number, pixelPerMeter: number) {
		for (const particle of particles) {
			if (particle !== this) {
				const force = p5.createVector(particle.position.x - this.position.x, particle.position.y - this.position.y);
				const distance = force.mag();
				const strength = (G * Particle.mass * Particle.mass) / (distance * distance);
				force.setMag(strength);
				this.velocity.add(force);
			}
		}
	}

	show(p5: p5Types) {
		p5.stroke(255, 255, 255);
		p5.strokeWeight(4);
		p5.point(this.position.x, this.position.y);
	}
}

export default Particle;
