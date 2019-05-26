import React, { useContext } from 'react';
import styled from 'styled-components';
import { PanelBox } from '../SharedStyles';
import { Input, Button } from 'reactstrap'
import SimContext from '../sim-helpers/SimContext';


const Helm = styled(PanelBox)`
    min-width: 100px;
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
            <Input
                name='setDeltaV'
                value={eventFunctions.getDeltaV()}
                min={0} max={100} type="number" step="0.1"
                onChange={handleChange}
            />
            <Input
                name='setTheta'
                value={eventFunctions.getTheta()}
                min={0} max={360} type="number" step="1"
                onChange={handleChange}
            />
            <Button onClick={() => context.addDeltaV([props.helmData.deltaV, props.helmData.theta])}>Fire</Button>
            <br/>
            <span>initial deltaV reserve: {Math.round(context.initialDeltaVReserve / 100) / 10} </span>
            <br/>
            <span>current deltaV reserve: {Math.round(context.deltaVReserve / 100) / 10} </span>
        </Helm>
    );
}

export default HelmControls;