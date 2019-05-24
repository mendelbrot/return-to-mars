import React, {useContext} from 'react';
import styled from 'styled-components';
import { Input, Button } from 'reactstrap'
import SimContext from '../sim-helpers/SimContext';


const SimControls = (props) => {

    const context = useContext(SimContext);

    const contextFunctions = {

        speed: (val) => {
            context.setSecondsPerMarsYear(val);
        },
        distanceTolerance: (val) => {
            context.setDistanceTolerance(val);
        },
        speedTolerance: (val) => {
            context.setSpeedTolerance(val);
        },
        initialDeltaVReserve: (val) => {
            context.setInitialDeltaVReserve(val);
        },
        timeLimit: (val) => {
            context.setTimeLimit(val);
        },


    }

    const handleChange = (evt) => {
        contextFunctions[evt.target.name](evt.target.value);
    }

    return (
        <div>
            <div>
                <Input
                    name='speed'
                    value={context.secondsPerMarsYear}
                    min={1} max={60} type="number" step="1"
                    onChange={handleChange}
                />
                <Button onClick={context.playSim}>Play</Button>
                <Button onClick={context.pauseSim}>Pause</Button>
                <Button onClick={context.resetSim}>Reset</Button>
            </div>
            <div>
                <span>Distance Tolerance</span>
                <br/>
                <Input
                    name='distanceTolerance'
                    value={context.distanceTolerance}
                    min={0} type="number" step="1000000000"
                    onChange={handleChange}
                />
                <br/>
                <span>Speed Tolerance</span>
                <br />
                <Input
                    name='speedTolerance'
                    value={context.speedTolerance}
                    min={0} type="number" step="100"
                    onChange={handleChange}
                />
                <br />
                <span>Initial Reserve</span>
                <br />
                <Input
                    name='initialDeltaVReserve'
                    value={context.initialDeltaVReserve}
                    min={0} type="number" step="1000000"
                    onChange={handleChange}
                />
                <br />
                <span>Time Limit</span>
                <br />
                <Input
                    name='timeLimit'
                    value={context.timeLimit}
                    min={0} type="number" step="1"
                    onChange={handleChange}
                />
            </div>
        </div>

    );
    
}

export default SimControls;