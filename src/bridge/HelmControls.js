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

    const propsFunctions = {

        setDeltaV: props.helmData.setDeltaV,
        setTheta: props.helmData.setTheta,

    }

    const handleChange = (evt) => {
        propsFunctions[evt.target.name](evt.target.value);
    }

    return (
        <Helm>
            <Input
                name='setDeltaV'
                value={props.helmData.deltaV}
                min={0} max={100000} type="number" step="1000"
                onChange={handleChange}
            />
            <Input
                name='setTheta'
                value={props.helmData.theta}
                min={0} max={6.2} type="number" step="0.1"
                onChange={handleChange}
            />
            <Button onClick={() => context.addDeltaV([props.helmData.deltaV, props.helmData.theta])}>Fire</Button>
        </Helm>
    );
}

export default HelmControls;