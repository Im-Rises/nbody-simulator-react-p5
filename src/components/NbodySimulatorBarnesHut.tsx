// import Particle from "../classes/Particle";
import {Point, Rectangle, Quadtree} from "../classes/Quadtree";
import p5Types from "p5";
import Sketch from "react-p5";

type Props = {
    particlesCount: number;
}

const defaultProps: Props = {
    particlesCount: 10,
}
const NbodySimulatorBarnesHut = (props: Props) => {
    const mergedProps = {...defaultProps, ...props};

    const widthHeight = 500;
    const quadtree = new Quadtree(new Rectangle(0, 0, widthHeight, widthHeight), 4);

    const points = [];
    for (let i = 0; i < mergedProps.particlesCount; i++) {
        points.push(new Point(Math.random() * widthHeight, Math.random() * widthHeight));
        console.log(quadtree.insert(points[i]));
    }

    // console.log(quadtree);

    // Intersecting rectangle
    const range = new Rectangle(250, 250, 100, 100);
    const pointsIntIntersection = [];
    quadtree.query(range, pointsIntIntersection);
    console.log(pointsIntIntersection);


    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(widthHeight, widthHeight).parent(canvasParentRef);
    };


    const draw = (p5: p5Types) => {
        p5.background(100);
        quadtree.show(p5);

        // Draw the rectangle of intersection
        p5.strokeWeight(1);
        p5.stroke(0, 255, 0);
        p5.rect(range.x - range.w, range.y - range.h, range.w * 2, range.h * 2);
        // Draw all the points which are in the intersection
        for (const p of pointsIntIntersection) {
            p5.strokeWeight(4);
            p5.stroke(0, 255, 0);
            p5.point(p.x, p.y);
        }
    };

    return <Sketch setup={setup} draw={draw}/>;
};

export default NbodySimulatorBarnesHut;
