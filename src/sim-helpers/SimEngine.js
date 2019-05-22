import React, { useContext } from 'react';
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
             simContext: {
                playing: false,
                _secondsPerMarsYear: 12,          // the number of seconds it takes mars to make a circle on the screen
                get secondsPerMarsYear() {
                    return this._secondsPerMarsYear;
                },
                set secondsPerMarsYear(secondsPerMarsYear) {
                    this._secondsPerMarsYear = secondsPerMarsYear;
                    let secondsPerCalculation = this._millisecondsPerFrame / (1000 * this._calculationsPerFrame);
                    let simSecondsPerMarsYear = 2 * Math.PI / this.constructor.marsAngularSpeed;
                    // updating deltaT changes the simulation speed to reflect secondsPerMarsYear
                    this.deltaT = Math.round(secondsPerCalculation * simSecondsPerMarsYear / secondsPerMarsYear)
                },
                _calculationsPerFrame: 10,       // calculations between view refresh
                _millisecondsPerFrame: 50,       // milliseconds between view refresh
                _deltaT: 600,                    // simulation seconds per calculation
                marsPosition: [null, null],
                shipPosition: [null, null],
                shipVelocity: [null, null],
                marsShipDistance: null,
                marsShipSpeed: null,
                timeMarsYears: 0,
            }
        }

        this.setState = this.setState.bind(this);
    }

    simContext = {
        playing: false,
        _secondsPerMarsYear: 12,          // the number of seconds it takes mars to make a circle on the screen
        get secondsPerMarsYear() {
            return this._secondsPerMarsYear;
        },
        set secondsPerMarsYear(secondsPerMarsYear) {
            this._secondsPerMarsYear = secondsPerMarsYear;
            let secondsPerCalculation = this._millisecondsPerFrame / (1000 * this._calculationsPerFrame);
            let simSecondsPerMarsYear = 2*Math.PI/this.constructor.marsAngularSpeed;
            // updating deltaT changes the simulation speed to reflect secondsPerMarsYear
            this.deltaT = Math.round(secondsPerCalculation * simSecondsPerMarsYear / secondsPerMarsYear)
        },
        _calculationsPerFrame: 10,       // calculations between view refresh
        _millisecondsPerFrame: 50,       // milliseconds between view refresh
        _deltaT: 600,                    // simulation seconds per calculation
        marsPosition: [null, null],
        shipPosition: [null, null],
        shipVelocity: [null, null],
        marsShipDistance: null,
        marsShipSpeed: null,
        timeMarsYears: 0,
    }

    render() {
        return (
            <SimContext.Provider
                value={this.state.simContext}
            >
                {this.props.children}
            </SimContext.Provider>
        );   
    }
}

export default SimEngine;