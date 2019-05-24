import React from 'react';
import SimContext from './SimContext';
import MathUtil from './MathUtil';


class SimEngine extends React.Component {

    static contextType = SimContext;

    simVariables = {
        sun: Object.assign({}, MathUtil.SimObjectTemplate),
        mars: Object.assign({}, MathUtil.SimObjectTemplate),
        ship: Object.assign({}, MathUtil.SimObjectTemplate),

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
            maxDistance: 6 * Math.pow(10, 11),  // the furthest distance fron the sun of any object, for canvas scaling 
            speedTolerance: 1.0 * Math.pow(10, 3),    
            distanceTolerance: 1.0 * Math.pow(10, 10), 
            initialDeltaVReserve: 10000,
            deltaVReserve: 10000,
            timeLimit: 5,        
        }

        this.setSecondsPerMarsYear = this.setSecondsPerMarsYear.bind(this);
        this.addDeltaV = this.addDeltaV.bind(this);
        this.setSpeedTolerance = this.setSpeedTolerance.bind(this);
        this.setDistanceTolerance = this.setDistanceTolerance.bind(this);
        this.setInitialDeltaVReserve = this.setInitialDeltaVReserve.bind(this);
        this.setDeltaVReserve = this.setDeltaVReserve.bind(this);
        this.setTimeLimit = this.setTimeLimit.bind(this);
        
        this.playSim = this.playSim.bind(this);
        this.pauseSim = this.pauseSim.bind(this);
        this.resetSim = this.resetSim.bind(this);

        this.pushFunctionToStateChangeCallbackList = this.pushFunctionToStateChangeCallbackList.bind(this);
    }

    componentDidMount() {
        this.resetSim();
    }

    playSim = () => {

        // do not proceed if the sim is already playing
        if (this.state.playing) {
            return;
        };

        this.setState({ playing: true }, () => {
            var interval = setInterval(() => {

                // pause if state.playing has been set to false
                if (!this.state.playing) {
                    clearInterval(interval);
                    return;
                };

                for (let i = 0; i < this.simVariables.calculationsPerFrame; i++) {
                    this.calcNextState();
                };

                this.setStateFromSimVariables(true);

            }, this.simVariables.millisecondsPerFrame);
        });


    };

    pauseSim = () => {

        if (!this.state.playing) {
            return
        };

        this.setState({ playing: false });
    };

    resetSim = () => {
        this.pauseSim();
        this.setSecondsPerMarsYear(this.state.secondsPerMarsYear);
        this.setState({ timeMarsYears: 0});

        let s = this.simVariables;
        let c = MathUtil.constants;

        s.sun.mass = c.sunMass;
        s.mars.mass = c.marsMass;
        s.mars.position = 
            MathUtil.convertPolarToCartesian([c.marsSunDistance, 0]);
        s.mars.velocity =
            MathUtil.convertPolarVelocityToCartesian([0, c.marsAngularSpeed], [c.marsSunDistance, 0]);
        s.mars.r = c.marsSunDistance; //adding r, theta to mars to facilitate calculationg circular motion
        s.mars.theta = 0;
        s.ship.position = MathUtil.multiplyNumberVector(2, s.mars.position);
        s.ship.velocity = MathUtil.multiplyNumberVector(0.5, s.mars.velocity);

        this.setStateFromSimVariables();
    };

    calcNextState = () => {

        let s = this.simVariables;
        let c = MathUtil.constants;

        // move mars in a circle
        s.mars.theta += c.marsAngularSpeed * s.deltaT;
        s.mars.position = MathUtil.convertPolarToCartesian([s.mars.r, s.mars.theta]);

        //move spaceship
        s.ship.position = MathUtil.vectorSum(
            s.ship.position,
            MathUtil.multiplyNumberVector(s.deltaT / 2, s.ship.velocity)
        );
        MathUtil.updateAccelleration([s.ship, s.sun, s.mars], [0]);
        s.ship.velocity = MathUtil.vectorSum(
            s.ship.velocity,
            MathUtil.multiplyNumberVector(s.deltaT, s.ship.accelleration)
        );
        s.ship.position = MathUtil.vectorSum(
            s.ship.position,
            MathUtil.multiplyNumberVector(s.deltaT / 2, s.ship.velocity)
        );
    };

    setStateFromSimVariables = (addToTime) => {
        this.setState( (state) => { 
            let newT = addToTime ?  // update the time, in mars years
                state.timeMarsYears 
                    + MathUtil.constants.marsAngularSpeed * this.simVariables.deltaT * this.simVariables.calculationsPerFrame / 2 /Math.PI :
                state.timeMarsYears;
            return {
                marsPosition: this.simVariables.mars.position,
                shipPosition: this.simVariables.ship.position,
                shipVelocity: this.simVariables.ship.velocity,
                marsShipDistance:
                    MathUtil.magnitudeVectorDifference(this.simVariables.mars.position, this.simVariables.ship.position),
                marsShipSpeed:
                    MathUtil.magnitudeVectorDifference(this.simVariables.mars.velocity, this.simVariables.ship.velocity),
                timeMarsYears: newT,
                maxDistance: 
                    MathUtil.calculateMaxDistance([this.simVariables.ship, this.simVariables.mars], 3 * MathUtil.constants.marsSunDistance),
            };      
        }, () => this.stateChangeCallbackList.forEach((f) => f.call() )
        );
    };

    setSecondsPerMarsYear = (val) => {
        this.setState({ secondsPerMarsYear: val });
        let secondsPerCalculation = this.simVariables.millisecondsPerFrame / 1000 / this.simVariables.calculationsPerFrame;
        let simSecondsPerMarsYear = 2 * Math.PI / MathUtil.constants.marsAngularSpeed;
        // updating deltaT changes the simulation speed to reflect secondsPerMarsYear
        this.simVariables.deltaT = secondsPerCalculation * simSecondsPerMarsYear / val;
    };

    // recieves deltaV in polar coordinates
    addDeltaV = (deltaV) => {

        // don't do anything if there's no propellent left
        if (this.state.deltaVReserve == 0) {
            return
        }

        // if there isn't enough propellant, then just give what you can
        if (deltaV[0] > this.state.deltaVReserve) {
            deltaV[0] = this.state.deltaVReserve;
            this.setState({deltaVReserve: 0});
        } else {
            this.setState((state) => { return { deltaVReserve: state.deltaVReserve - deltaV[0] }});
        }

        // add the deltaV to the ship's velocity
        this.simVariables.ship.velocity = 
            MathUtil.vectorSum(
                this.simVariables.ship.velocity,
                MathUtil.convertPolarToCartesian(deltaV));
    };

    setSpeedTolerance = (val) => {
        this.setState({ speedTolerance: val });
    };

    setDistanceTolerance = (val) => {
        this.setState({ distanceTolerance: val });
    };

    setInitialDeltaVReserve = (val) => {
        this.setState({ initialDeltaVReserve: val });
    };

    setDeltaVReserve = (val) => {
        this.setState({ deltaVReserve: val });
    };

    setTimeLimit = (val) => {
        this.setState({ timeLimit: val });
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
                    speedTolerance: this.state.speedTolerance,
                    distanceTolerance: this.state.distanceTolerance,
                    initialDeltaVReserve: this.state.initialDeltaVReserve,
                    deltaVReserve: this.state.deltaVReserve,
                    timeLimit: this.state.timeLimit,      

                    // setters
                    playSim: this.playSim,
                    pauseSim: this.pauseSim,
                    resetSim: this.resetSim,
                    setSecondsPerMarsYear: this.setSecondsPerMarsYear,
                    setSpeedTolerance: this.setSpeedTolerance,
                    setDistanceTolerance: this.setDistanceTolerance,
                    setInitialDeltaVReserve: this.setInitialDeltaVReserve,
                    setDeltaVReserve: this.setDeltaVReserve,
                    setTimeLimit: this.setTimeLimit,
                    addDeltaV: this.addDeltaV,
                    pushFunctionToStateChangeCallbackList: this.pushFunctionToStateChangeCallbackList,
                }}
            >
                {this.props.children}
            </SimContext.Provider>
        );   
    }
}

export default SimEngine;