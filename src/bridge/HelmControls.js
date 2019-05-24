import React, { useContext } from 'react';
import styled from 'styled-components';
import { PanelBox } from '../SharedStyles';
import { Input, Button } from 'reactstrap'
import SimContext from '../sim-helpers/SimContext';


const Helm = styled(PanelBox)`
    min-width: 100px;
`

function HelmControls() {

    const context = useContext(SimContext);

    return (
        <Helm>
            <Button onClick={() => context.addDeltaV([100000, Math.PI])}>Fire</Button>
        </Helm>
    );
}

export default HelmControls;