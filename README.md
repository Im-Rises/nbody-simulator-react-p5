# nbody-simulator-react-p5

<p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="reactLogo" style="height:50px;">
    <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="javascriptLogo" style="height:50px;">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="typescriptLogo" style="height:50px;">
    <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="scssLogo" style="height:50px;">
    <img src="https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white" alt="cssLogo" style="height:50px;">
    <img src="https://img.shields.io/badge/p5%20js-ED225D?style=for-the-badge&logo=p5dotjs&logoColor=white" alt="cssLogo" style="height:50px;">
</p>

## Description

This is a n-body simulator package made with React Typescript and p5.js.

## 🚀🚀[You can try it online from your browser](https://im-rises.github.io/particle-simulator-react-p5-website/) 🚀🚀

It works on desktop and mobile as well with different controls (check the `controls` section).

## 🚀🚀 [The package is available on npm](https://www.npmjs.com/package/nbody-simulator-react-p5) 🚀🚀

> **Note**  
> I also made a C++ version for WebGL2 using OpenGL ES 3.0. You can check it
> out [here](https://github.com/Im-Rises/nbody-simulator-webgl).

## Screenshots

| Screenshot 1                                                                                                              | Screenshot 2                                                                                                              | 
|---------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| ![Screenshot1](https://github.com/Im-Rises/nbody-simulator-react-p5/assets/59691442/59dbae4f-bfe8-4923-ad06-cc6abf07db13) | ![Screenshot2](https://github.com/Im-Rises/nbody-simulator-react-p5/assets/59691442/ec62857c-fb48-4049-8a8c-32a0ccc5fa91) |

## Demo video

https://github.com/Im-Rises/nbody-simulator-react-p5/assets/59691442/20bc593e-7bd0-4d60-9470-a8caed1a45bd

## Package installation

To install it type the following command in your terminal:

```bash
npm install nbody-simulator-react-p5
```

Then you can import it in your project with:

```bash
import NbodySimulator from 'nbody-simulator-react-p5'
```

## Usage

To use it you can simply add the component in your project like this:

```tsx
import React, {useEffect, useState} from 'react';
import NbodySimulator from 'nbody-simulator-react-p5';
import './App.css';

const App: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const divRef = React.useRef <HTMLDivElement>(null);

    useEffect(() => {
        if (divRef.current) {
            setIsLoaded(true);
        }
    }, [divRef]);

    return (
        <div className='App'>
            <div ref={divRef}>
                {isLoaded ? (
                    <div className={'nbody-sim-canvas'}>
                        <NbodySimulator
                            parentRef={divRef}
                        />
                    </div>
                ) : (
                    <p className={'wait-sim-canvas'}>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default App;
```

or you can change all the settings like this:

```tsx
import React, {useEffect, useState} from 'react';
import NbodySimulator from 'nbody-simulator-react-p5';
import './App.css';

const App: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const divRef = React.useRef <HTMLDivElement>(null);

    useEffect(() => {
        if (divRef.current) {
            setIsLoaded(true);
        }
    }, [divRef]);

    return (
        <div className='App'>
            <div ref={divRef}>
                {isLoaded ? (
                    <div className={'nbody-sim-canvas'}>
                        <NbodySimulator
                            parentRef={divRef}
                            nbodyCountMobile={100}
                            nbodyCountComputer={50}
                            frameRate={60}
                            fixedUpdate={60}
                            minSpawnRadius={3}
                            maxSpawnRadius={4}
                            minSpawnVelocity={5}
                            maxSpawnVelocity={10}
                            gravitationalConstant={1}
                            particlesMass={400}
                            softening={4}
                            friction={0.99}
                            centerAttractorMass={1000}
                            pixelsPerMeter={100}
                            initColor={[0, 255, 255, 200]}
                            finalColor={[255, 0, 255, 200]}
                            maxForceMagColor={30}
                            backColor={[0, 0, 0, 255]}
                        />
                    </div>
                ) : (
                    <p className={'wait-sim-canvas'}>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default App;
```

The component takes 1 to 16 props:

- `parentRef` - a reference to the parent div of the canvas. It is used to get the size of the canvas.
- `particleCountMobile` - the number of particles on mobile devices.
- `particleCountComputer` - the number of particles on desktop devices.
- `fixedUpdate` - the number of fixed updates per second.
- `frameRate` - the number of frames per second.
- `minSpawnRadius` - the minimum radius of the particles when they are spawned.
- `maxSpawnRadius` - the maximum radius of the particles when they are spawned.
- `minSpawnVelocity` - the minimum velocity of the particles when they are spawned.
- `maxSpawnVelocity` - the maximum velocity of the particles when they are spawned.
- `gravitationalConstant` - the gravitational constant of the simulation.
- `particlesMass` - the mass of the particles.
- `attractorMass` - the mass of the attractor.
- `friction` - the friction of the particles.
- `softening` - the softening parameter of the gravitational force calculation.
- `pixelsPerMeter` - the number of pixels to represent 1 meter.
- `initColor` - the initial color of the particles (in RGB).
- `finalColor` - the final color of the particles (in RGB).
- `maxVelocityMagColor` - the maximum velocity of the particles at which the color will be the final color.
- `backColor` - the background color of the canvas (in RGB).

This will create a canvas with 3000 particles on desktop and 1000 on mobile in fullscreen which will be resized
when the window is resized.

> **Note**
> The default values of the props are the same as the ones in the example above.

You can find the complete example of the project in the GitHub
repository [here](https://im-rises.github.io/nbody-simulator-react-p5-website).

> **Note**  
> Be sure to do like in the example, the parent div of the canvas must be set before the p5 canvas is created.

## Calculations

The calculations are made with the [Newtonian mechanics](https://en.wikipedia.org/wiki/Newtonian_mechanics) equations.

$$ F = G \frac{m_1 m_2}{r^2} $$

To prevent to have a division by zero when the particles are too close to each other, we add a softening parameter
$\epsilon$.

One of the real force calculation with softening could be like this:

$$ F = G \frac{m_1 m_2}{(r^2 + \epsilon^2)^\frac{3}{2}} $$

Where G is the gravitational constant, m1 and m2 are the masses of the particles, r is the distance between the
particles and d is the softening parameter.

## Known issues

> **Warning**  
> The React-p5 dependency may have issues with the index.js file.

```js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

```

Please delete the React.StrictMode tag in the index.js file and replace it with the code below.

```js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <App/>
    </>
);
```

## GitHub Actions

[//]: # ([![pages-build-deployment]&#40;https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/pages/pages-build-deployment/badge.svg&#41;]&#40;https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/pages/pages-build-deployment&#41;)
[![Node.js CI](https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/node.js.yml)
[![ESLint](https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/eslint.yml/badge.svg?branch=main)](https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/eslint.yml)
[![CodeQL](https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/codeql.yml)
[![Node.js Package](https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/Im-Rises/nbody-simulator-react-p5/actions/workflows/npm-publish.yml)

The project is set up to run the following actions:

[//]: # (- pages-build-deployment : Builds the website and deploys it to GitHub Pages.)

- node.js.yml : Runs the tests for the Node.js project.
- eslint.yml : Runs the ESLint linter on the project.
- codeql.yml : Runs the CodeQL linter on the project.
- npm-publish.yml : Publishes the package to npm.

## Libraries

React:  
<https://reactjs.org/docs/getting-started.html>

Xo:  
<https://github.com/xojs/xo>  
<https://github.com/xojs/eslint-config-xo-react>  
<https://github.com/xojs/eslint-config-xo-typescript>

ESLint:  
<https://eslint.org/docs/latest/user-guide/getting-started>

GitHub gh-pages:  
<https://github.com/gitname/react-gh-pages>

P5.js:  
<https://p5js.org/>  
<https://www.npmjs.com/package/react-p5>

react-device-detect:  
<https://www.npmjs.com/package/react-device-detect>

## Documentation

The Coding Challenge (math and physics):  
<https://www.youtube.com/watch?v=OAcXnzRNiCY>  
<https://www.youtube.com/watch?v=GjbKsOkN1Oc>

P5.js:  
<https://p5js.org/>

P5.js React:  
<https://www.npmjs.com/package/react-p5>

Wikipedia Barnes-Hut simulation:  
<https://en.wikipedia.org/wiki/Barnes–Hut_simulation>

## Links

Check the source code
on [![github](https://user-images.githubusercontent.com/59691442/223556058-6244e346-8117-43cd-97c6-bf68611bf286.svg)](https://github.com/im-rises/nbody-simulator-react-p5)

Check the demo
on [![github](https://user-images.githubusercontent.com/59691442/223556058-6244e346-8117-43cd-97c6-bf68611bf286.svg)](https://github.com/im-rises/nbody-simulator-react-p5-website)

Check the package
on [![npm](https://user-images.githubusercontent.com/59691442/223556055-4e9ef014-79d4-4136-ac07-b837b49066c8.svg)](https://www.npmjs.com/package/nbody-simulator-react-p5)

## Contributors

Quentin MOREL :

- @Im-Rises
- <https://github.com/Im-Rises>

[![GitHub contributors](https://contrib.rocks/image?repo=Im-Rises/nbody-simulator-react-p5)](https://github.com/Im-Rises/nbody-simulator-react-p5/graphs/contributors)
