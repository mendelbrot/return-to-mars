import React from 'react';
import styled from 'styled-components';
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
                if (index != currentIndex) {
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

    static SimObjectTemplate = {
        position: [null, null],
        velocity: [null, null],
        accelleration: [null, null],
        mass: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            secondsPerMarsYear: 12,         // the number of seconds it takes mars to circle the sun on the screen
            calculationsPerFrame: 10,       // the number of calculations between view refresh
            millisecondsPerFrame: 50,       // the number of milliseconds between view refresh
            deltaT: 600,                    // the number of simulation seconds per calculation
            marsPosition: [null, null],
            shipPosition: [null, null],
            shipVelocity: [null, null],
            marsShipDistance: null,
            marsShipSpeed: null,
            timeMarsYears: 0,               // the number of times mars has circled the sun on the screen
        }
    }

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
                    setPlaying: (val) => { 
                        val ? this.setState({ playing: true }) : this.setState({ playing: false });
                    },
                    setSecondsPerMarsYear: (val) => {
                        this.setState({ secondsPerMarsYear: val });
                        let secondsPerCalculation = this._millisecondsPerFrame / (1000 * this._calculationsPerFrame);
                        let simSecondsPerMarsYear = 2 * Math.PI / this.constructor.marsAngularSpeed;
                        // updating deltaT changes the simulation speed to reflect secondsPerMarsYear
                        this.deltaT = Math.round(secondsPerCalculation * simSecondsPerMarsYear / val)
                    },
                    addToShipVelocity: (val) => {
                        let newV = this.constructor.vectorSum(val, this.state.shipVelocity);
                        this.setState({ shipVelocity: newV });
                    },
                }}
            >
                {this.props.children}
            </SimContext.Provider>
        );   
    }
}

export default SimEngine;