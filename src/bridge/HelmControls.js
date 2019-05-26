import React, { useContext } from 'react';
import styled from 'styled-components';
import { PanelBox } from '../SharedStyles';
import { Input, Button } from 'reactstrap'
import SimContext from '../sim-helpers/SimContext';


const Helm = styled(PanelBox)`

    .control-label {
        color: white;
        font-size: 0.7em
    }

    .guage {
        color: darkblue;
        background-color: orange;
        font-size: 0.9em;
        font-weight: bold;
        margin: 10px 0px 10px 0px;
        padding: 5px 10px 5px 10px;
    }

    .controls {
        display: flex;
    }

    .delta-v, .theta {
        width: 100px;
        margin-right: 10px;
    }
`

function HelmControls(props) {

    const context = useContext(SimContext);

    const eventFunctions = {

        getDeltaV: () => Math.round(props.helmData.deltaV / 100) /10,
        setDeltaV: (deltaV) => props.helmData.setDeltaV(deltaV * 1000),
        getTheta: () => Math.round(180 / Math.PI * props.helmData.theta),
        setTheta: (theta) => props.helmData.setTheta(Math.PI / 180 * theta),

    }

    const handleChange = (evt) => {
        eventFunctions[evt.target.name](Number(evt.target.value));
        console.log(eventFunctions.getTheta())
        console.log(props.helmData.theta)
    }

    return (
        <Helm>
            <div className='controls'>
                <div className='delta-v'>
                    <span className='control-label'>Delta V (Km/s)</span>
                    <Input
                        name='setDeltaV'
                        value={eventFunctions.getDeltaV()}
                        min={0} max={100} type="number" step="0.1"
                        onChange={handleChange}
                    />
                </div>
                <div className='theta'>
                    <span className='control-label'>Angle (Degrees)</span>
                    <Input
                        name='setTheta'
                        value={eventFunctions.getTheta()}
                        min={0} max={360} type="number" step="1"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <span className='control-label'> </span><br/>
                    <Button 
                        color='danger' 
                        onClick={() => context.addDeltaV([props.helmData.deltaV, props.helmData.theta])}>
                            Fire
                    </Button>
                </div>
            </div>
            <div className='guage'>
                <span>Initial Reserve: {Math.round(context.initialDeltaVReserve / 100) / 10} </span>
                <br />
                <span>Current Reserve: {Math.round(context.deltaVReserve / 100) / 10} </span>
            </div>
        </Helm>
    );
}

export default HelmControls;