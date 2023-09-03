import p5Types from "p5";

class Point {
    public x: number;
    public y: number;
    public weight: number;
    public sumForces: p5Types.Vector;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.weight = 10;
        this.sumForces = new p5Types.Vector();
    }
}

class Rectangle {
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point: Point) {
        return (point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h);
    }

    intersects(range: Rectangle) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h);
    }
}

class Quadtree {
    private boundary: Rectangle;
    private readonly capacity: number;
    private divided: boolean;
    // private depth: number;
    // private readonly maxDepth: number;
    private weight: number;
    private attractionCenter: Point;
    private
    private points: Point[];
    private northWest: Quadtree;
    private northEast: Quadtree;
    private southWest: Quadtree;
    private southEast: Quadtree;

    constructor(boundary: Rectangle, capacity: number) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.divided = false;
        // this.depth = 0;
        // this.maxDepth = 10;
        this.weight = 0;
        this.attractionCenter = new Point(0, 0);
        this.points = [];
    }

    insert(point: Point) {
        if (!this.boundary.contains(point)) {
            return false;
        }
        if (this.points.length < this.capacity && !this.divided) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
                // Move points in current quad to the new quads
                for (const p of this.points) {
                    if (this.northWest.insert(p)) {
                        continue;
                    }
                    if (this.northEast.insert(p)) {
                        continue;
                    }
                    if (this.southWest.insert(p)) {
                        continue;
                    }
                    if (this.southEast.insert(p)) {
                        continue;
                    }
                }
                this.points = [];
            }

            if (this.northWest.boundary.contains(point)) {
                return this.northWest.insert(point);
            }
            if (this.northEast.boundary.contains(point)) {
                return this.northEast.insert(point);
            }
            if (this.southWest.boundary.contains(point)) {
                return this.southWest.insert(point);
            }
            if (this.southEast.boundary.contains(point)) {
                return this.southEast.insert(point);
            }

            return false;
        }

    }

    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.w;
        const h = this.boundary.h;

        this.northWest = new Quadtree(new Rectangle(x, y, w / 2, h / 2), this.capacity);
        this.northEast = new Quadtree(new Rectangle(x + w / 2, y, w / 2, h / 2), this.capacity);
        this.southWest = new Quadtree(new Rectangle(x, y + h / 2, w / 2, h / 2), this.capacity);
        this.southEast = new Quadtree(new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2), this.capacity);

        this.divided = true;
    }

    // Recursively calculate the weight of each node and the attraction center
    calculateWeightAttractionCenter() {
        if (this.divided) {
            this.northWest.calculateWeightAttractionCenter();
            this.northEast.calculateWeightAttractionCenter();
            this.southWest.calculateWeightAttractionCenter();
            this.southEast.calculateWeightAttractionCenter();
            this.weight = this.northWest.weight + this.northEast.weight + this.southWest.weight + this.southEast.weight;
            this.attractionCenter = new Point(
                (this.northWest.attractionCenter.x +
                    this.northEast.attractionCenter.x +
                    this.southWest.attractionCenter.x +
                    this.southEast.attractionCenter.x) / 4,
                (this.northWest.attractionCenter.y +
                    this.northEast.attractionCenter.y +
                    this.southWest.attractionCenter.y +
                    this.southEast.attractionCenter.y) / 4,
            );
        } else {
            for (const p of this.points) {
                this.weight += p.weight;
                this.attractionCenter.x += p.x;
                this.attractionCenter.y += p.y;
            }
        }
    }

    // Recursively calculate the sum of forces for each node
    calculateSumForces(point: Point, theta: number) {
        const s = this.boundary.w;
        const d = Math.sqrt(Math.pow(this.attractionCenter.x - point.x, 2) + Math.pow(this.attractionCenter.y - point.y, 2));

        if (this.divided) {
            if (s / d < theta) {
                const force = new p5Types.Vector(this.attractionCenter.x - point.x, this.attractionCenter.y - point.y);
                force.setMag(0.1 * this.weight / d);
                point.sumForces.add(force);
            } else {
                this.northWest.calculateSumForces(point, theta);
                this.northEast.calculateSumForces(point, theta);
                this.southWest.calculateSumForces(point, theta);
                this.southEast.calculateSumForces(point, theta);
            }
        } else {
            for (const p of this.points) {
                if (p.x === point.x && p.y === point.y) {
                    continue;
                }
                const force = new p5Types.Vector(p.x - point.x, p.y - point.y);
                // force.setMag(0.1 * p.weight / d);
                point.sumForces.add(force);
            }
        }
    }

    show(p5: p5Types) {
        p5.stroke(255);
        p5.noFill();
        // p5.rectMode(p5.CENTER);
        p5.rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
        if (this.divided) {
            this.northWest.show(p5);
            this.northEast.show(p5);
            this.southWest.show(p5);
            this.southEast.show(p5);
        }
        p5.stroke(0, 255, 255);
        for (const point of this.points) {
            p5.strokeWeight(4);
            p5.point(point.x, point.y);
        }
    }
}

export {Point, Rectangle, Quadtree};
