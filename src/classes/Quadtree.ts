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
    }

    insert(point: Point) {
        if (this.points.length < this.capacity) {
            this.points.push(point);
        } else if (!this.divided) {
            this.subdivide();
            this.divided = true;
        }
    }

    subdivide() {
        // this.northWest = new Quadtree(new Rectangle(this.boundary.x, this.boundary.y, this.boundary.w / 2,
        //     this.boundary.h / 2), this.capacity);
        // this.northEast = new Quadtree(new Rectangle(this.boundary.x + this.boundary.w / 2, this.boundary.y,
        //     this.boundary.w / 2, this.boundary.h / 2), this.capacity);
        // this.southWest = new Quadtree(new Rectangle(this.boundary.x, this.boundary.y + this.boundary.h / 2,
        //     this.boundary.w / 2, this.boundary.h / 2), this.capacity);
        // this.southEast = new Quadtree(new Rectangle(this.boundary.x + this.boundary.w / 2, this.boundary.y + this.boundary.h / 2,
        //     this.boundary.w / 2, this.boundary.h / 2), this.capacity);
    }
}
