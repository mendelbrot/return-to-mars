import React from 'react';
import SimContext from './SimContext';
//import '../App.css';

class SimEngine extends React.Component {

    static contextType = SimContext;

    static constants = {
        G: 6.67408 * Math.pow(10, -11),
        marsSunDistance: 2.279 * Math.pow(10, 11),      // meters
        marsAngularSpeed: 1.059 * Math.pow(10, -7),     // radians per second
        marsMass: 6.417 * Math.pow(10, 23),             // kg
        sunMass: 1.98855 * Math.pow(10, 30),            // kg
    };

    static convertPolarPositionToCartesian = (polarPosition) => {

        return [polarPosition[0] * Math.cos(polarPosition[1]), polarPosition[0] * Math.sin(polarPosition[1])];
    }

    static convertPolarVelocityToCartesian = (polarVelocity, polarPosition) => {

        return [
            polarVelocity[0] * Math.cos(polarPosition[1]) - polarPosition[0] * polarVelocity[1] * Math.sin(polarPosition[1]),
            polarVelocity[0] * Math.sin(polarPosition[1]) + polarPosition[0] * polarVelocity[1] * Math.cos(polarPosition[1])
        ]
    }

    static vectorSum = (A1, A2) => {
        return A1.map( (element, index) => {
            return element + A2[index];
        });
    }

    static multiplyNumberVector = (s, A) => {
        return A.map((element) => {
            return s * element;
        });
    }

    static magnitudeVectorDifference = (A1, A2) => {
        let normSquared = 0;
        A1.forEach((element, index) => {
            normSquared += (element - A2[index])**2;
        });
        return Math.sqrt(normSquared);
    }

    // calculates the accelleration of each object due to gravitational force from all the other objects
    // if indexList is specified then only update the accellerations at those indices
    static updateAccelleration = (simObjectsList, indexList) => {

        if (!indexList) {
            indexList = simObjectsList.map((element, index) => {
                return index;
            });
        }

        indexList.forEach((currentIndex) => {
            var currentObject = simObjectsList[currentIndex];
            simObjectsList.forEach( (element, index) => {
                if (index !== currentIndex) {
                    currentObject.accelleration[0] +=
                        this.constants.G
                        * element.mass
                        * (element.position[0] - currentObject.position[0])
                        * Math.pow(
                            Math.pow(element.position[0] - currentObject.position[0], 2)
                            + Math.pow(element.position[1] - currentObject.position[1], 2),
                            -3 / 2
                        );
                    currentObject.accelleration[1] +=
                        this.constants.G
                        * element.mass
                        * (element.position[1] - currentObject.position[1])
                        * Math.pow(
                            Math.pow(element.position[0] - currentObject.position[0], 2)
                            + Math.pow(element.position[1] - currentObject.position[1], 2),
                            -3 / 2
                        );
                };
            });
        });
    }

    static calculateMaxDistance = (simObjectsList) => {
        let maxDistance = 0;
        simObjectsList.forEach((object) => {
            let distance = this.magnitudeVectorDifference(object.position, [0, 0]);
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        });
        return maxDistance;
    }

    static SimObjectTemplate = {
        position: [0, 0],
        velocity: [0, 0],
        accelleration: [0, 0],
        mass: 0,
    }

    simVariables = {
        sun: Object.assign({}, this.constructor.SimObjectTemplate),
        mars: Object.assign({}, this.constructor.SimObjectTemplate),
        ship: Object.assign({}, this.constructor.SimObjectTemplate),

        calculationsPerFrame: 10,       // the number of calculations between view refresh
        millisecondsPerFrame: 50,       // the number of milliseconds between view refresh
        deltaT: 2000,                   // the number of simulation seconds per calculation
    }

    stateChangeCallbackList = [];

    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            secondsPerMarsYear: 12,         // the number of seconds it takes mars to circle the sun on the screen
            marsPosition: [null, null],
            shipPosition: [null, null],
            shipVelocity: [null, null],
            marsShipDistance: null,
            marsShipSpeed: null,
            timeMarsYears: 0,               // the number of times mars has circled the sun on the screen
            maxDistance: 6 * Math.pow(10, 11)  // the furthest distance fron the sun of any object, for canvas scaling             
        }

        this.setPlaying = this.setPlaying.bind(this);
        this.setSecondsPerMarsYear = this.setSecondsPerMarsYear.bind(this);
        this.addToShipVelocity = this.addToShipVelocity.bind(this);
        this.pushFunctionToStateChangeCallbackList = this.pushFunctionToStateChangeCallbackList.bind(this);
    }

    componentDidMount() {
        this.resetSimulation();
    }

    resetSimulation = () => {
        this.setSecondsPerMarsYear(this.state.secondsPerMarsYear);
        this.setState({ timeMarsYears: 0});

        let s = this.simVariables;
        let c = this.constructor.constants;

        s.sun.mass = c.sunMass;
        s.mars.mass = c.marsMass;
        s.mars.position = 
            this.constructor.convertPolarPositionToCartesian([c.marsSunDistance, 0]);
        s.mars.velocity =
            this.constructor.convertPolarVelocityToCartesian([0, c.marsAngularSpeed], [c.marsSunDistance, 0]);
        s.ship.position = this.constructor.multiplyNumberVector(2, s.mars.position);
        s.ship.velocity = this.constructor.multiplyNumberVector(0.5, s.mars.velocity);

        this.setStateFromSimVariables();
    };

    setStateFromSimVariables = (addToTime) => {
        this.setState( (state) => { 
            let newT = addToTime ?
                state.timeMarsYears + state.deltaT * state.calculationsPerFrame :
                state.timeMarsYears;
            return {
                marsPosition: this.simVariables.mars.position,
                shipPosition: this.simVariables.ship.position,
                shipVelocity: this.simVariables.ship.velocity,
                marsShipDistance:
                    this.constructor.magnitudeVectorDifference(this.simVariables.mars.position, this.simVariables.ship.position),
                marsShipSpeed:
                    this.constructor.magnitudeVectorDifference(this.simVariables.mars.velocity, this.simVariables.ship.velocity),
                timeMarsYears: newT,
                maxDistance: 
                    this.constructor.calculateMaxDistance([this.simVariables.ship, this.simVariables.mars]),
            }      
        }, () => this.stateChangeCallbackList.forEach((f) => f.call() )
        );
    }

    playSimulation = () => {
        this.setState({ playing: true });
    };

    pauseSimulation = () => {
        this.setState({ playing: false });
    };

    setPlaying = (val) => {
        if (val) { 
            this.playSimulation();
        } else {     
            this.pauseSimulation();
        }
    };

    setSecondsPerMarsYear = (val) => {
        this.setState({ secondsPerMarsYear: val });
        let secondsPerCalculation = this.simVariables.millisecondsPerFrame / (1000 * this.simVariables.calculationsPerFrame);
        let simSecondsPerMarsYear = 2 * Math.PI / this.constructor.constants.marsAngularSpeed;
        // updating deltaT changes the simulation speed to reflect secondsPerMarsYear
        this.simVariables.deltaT = secondsPerCalculation * simSecondsPerMarsYear / val;
    };

    addToShipVelocity = (val) => {
        let newV = this.constructor.vectorSum(val, this.state.shipVelocity);
        this.setState({ shipVelocity: newV });
    };

    pushFunctionToStateChangeCallbackList = (f) => {
        this.stateChangeCallbackList.push(f);
    };

    render() {
        return (
            <SimContext.Provider
                value={{
                    playing: this.state.playing,
                    secondsPerMarsYear: this.state.secondsPerMarsYear,
                    calculationsPerFrame: this.state.calculationsPerFrame,
                    millisecondsPerFrame: this.state.millisecondsPerFrame,
                    deltaT: this.state.deltaT,
                    marsPosition: this.state.marsPosition,
                    shipPosition: this.state.shipPosition,
                    shipVelocity: this.state.shipVelocity,
                    marsShipDistance: this.state.marsShipDistance,
                    marsShipSpeed: this.state.marsShipSpeed,
                    timeMarsYears: this.state.timeMarsYears,
                    maxDistance: this.state.maxDistance,

                    // setters
                    setPlaying: this.setPlaying,
                    setSecondsPerMarsYear: this.setSecondsPerMarsYear,
                    addToShipVelocity: this.addToShipVelocity,
                    pushFunctionToStateChangeCallbackList: this.pushFunctionToStateChangeCallbackList,
                }}
            >
                {this.props.children}
            </SimContext.Provider>
        );   
    }
}

export default SimEngine;