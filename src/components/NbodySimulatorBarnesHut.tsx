// import Particle from "../classes/Particle";
import {Point, Rectangle, Quadtree} from "../classes/Quadtree";
import p5Types from "p5";
import Sketch from "react-p5";

type Props = {
    particlesCount: number;
}

const defaultProps: Props = {
    particlesCount: 1000,
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

    console.log(quadtree);


    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(widthHeight, widthHeight).parent(canvasParentRef);
    };

    const draw = (p5: p5Types) => {
        p5.background(100);
        quadtree.show(p5);
    };

    return <Sketch setup={setup} draw={draw}/>;
};

export default NbodySimulatorBarnesHut;
