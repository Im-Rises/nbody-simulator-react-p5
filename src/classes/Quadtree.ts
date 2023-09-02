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

    // intersects(range: Rectangle) {
    //     return !(range.x - range.w > this.x + this.w ||
    //         range.x + range.w < this.x - this.w ||
    //         range.y - range.h > this.y + this.h ||
    //         range.y + range.h < this.y - this.h);
    // }
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
            return;
        }
        if (this.points.length < this.capacity) {
            this.points.push(point);
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northWest.boundary.contains(point)) {
                this.northWest.insert(point);
            }
            if (this.northEast.boundary.contains(point)) {
                this.northEast.insert(point);
            }
            if (this.southWest.boundary.contains(point)) {
                this.southWest.insert(point);
            }
            if (this.southEast.boundary.contains(point)) {
                this.southEast.insert(point);
            }
        }

    }

    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.w;
        const h = this.boundary.h;

        this.northWest = new Quadtree(new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2), this.capacity);
        this.northEast = new Quadtree(new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2), this.capacity);
        this.southWest = new Quadtree(new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2), this.capacity);
        this.southEast = new Quadtree(new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2), this.capacity);

        this.divided = true;
    }

    show(p5: p5Types) {
        p5.stroke(255);
        p5.noFill();
        p5.rectMode(p5.CENTER);
        p5.rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
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
