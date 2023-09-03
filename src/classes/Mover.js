import p5Types from "p5";

class Mover {
    private position: p5Types.Vector;
    private velocity: p5Types.Vector;
    private sumForces: p5Types.Vector;
    private mass: number;

    constructor(mass: number, x: number, y: number) {
        this.mass = mass;
        this.position = p5Types.createVector(x, y);
        this.velocity = p5Types.createVector(0, 0);
        this.sumForces = p5Types.createVector(0, 0);
    }

    attract(mover: Mover): p5Types.Vector {
        const force = p5Types.Vector.sub(this.position, mover.position).normalize();
        let distance = force.mag();
        // distance = p5Types.constrain(distance, 5, 25);
        const softening = 1;
        const strength = (this.mass * mover.mass) / ((distance * distance) + softening);
        force.mult(strength);
        return force;
    }

    applyForce(force: p5Types.Vector): void {
        this.sumForces.add(force);
    }

    update(): void {
        this.velocity.add(this.sumForces);
        this.position.add(this.velocity);
        this.sumForces.mult(0);
    }

    show(p5: p5Types): void {
        p5.stroke(0, 255, 255);
        p5.strokeWeight(2);
        p5.point(this.position.x, this.position.y);
    }
}
