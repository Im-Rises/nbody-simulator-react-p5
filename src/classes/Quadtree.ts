import p5Types from "p5";

class Point {
    public x: number;
    public y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
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
    private capacity: number;
    private points: Point[];
    private northWest: Quadtree;
    private northEast: Quadtree;
    private southWest: Quadtree;
    private southEast: Quadtree;
    private divided: boolean;

    constructor(boundary: Rectangle, capacity: number) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
    }

    insert(point: Point) {
        if (!this.boundary.contains(point)) {
            return false;
        }
        if (this.points.length < this.capacity) {
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

    query(range: Rectangle, found: Point[]) {
        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (const p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided) {
                this.northWest.query(range, found);
                this.northEast.query(range, found);
                this.southWest.query(range, found);
                this.southEast.query(range, found);
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
