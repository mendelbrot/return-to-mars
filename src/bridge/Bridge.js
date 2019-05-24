import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import ViewScreen from './ViewScreen';
import Instruments from './Instruments';
import HelmControls from './HelmControls';
import SimContext from '../sim-helpers/SimContext';


const BrLayout = styled.div`
    display: flex;
`

function Bridge(props) {

    const context  = useContext(SimContext);

    const [deltaV, setDeltaV] = useState(0);
    const [theta, setTheta] = useState(0);
    const [deltaVReserve, setDeltaVReserve] = useState(context.initialDeltaVReserve);

    const helmData = {
        deltaV: deltaV,
        setDeltaV: setDeltaV,
        theta: theta,
        setTheta: setTheta,
        deltaVReserve: deltaVReserve,
        setDeltaVReserve: setDeltaVReserve,
        initialDeltaVReserve: context.initialDeltaVReserve
    }
    
    return (
        <BrLayout>
            <div className='left'>
                <div className='view'>
                    <ViewScreen />
                </div>
                <div className='helm'>
                    <HelmControls helmData={helmData} />
                </div>
            </div>
            <div className='inst'>
                <Instruments />
            </div>
        </BrLayout>
    );
}

export default Bridge;