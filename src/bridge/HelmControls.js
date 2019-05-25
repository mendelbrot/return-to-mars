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

        deltaV: props.helmData.setDeltaV,
        theta: props.helmData.setTheta,

    }

    const handleChange = (evt) => {
        eventFunctions[evt.target.name](Number(evt.target.value));
    }

    return (
        <Helm>
            <Input
                name='deltaV'
                value={props.helmData.deltaV}
                min={0} max={100000} type="number" step="1000"
                onChange={handleChange}
            />
            <Input
                name='theta'
                value={props.helmData.theta}
                min={0} max={6.2} type="number" step="0.1"
                onChange={handleChange}
            />
            <Button onClick={() => context.addDeltaV([props.helmData.deltaV, props.helmData.theta])}>Fire</Button>
            <br/>
            <span>initial deltaV reserve: {context.initialDeltaVReserve} </span>
            <br/>
            <span>current deltaV reserve: {context.deltaVReserve} </span>
        </Helm>
    );
}

export default HelmControls;