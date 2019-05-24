import React, { useState } from 'react';
import styled from 'styled-components';
import ViewScreen from './ViewScreen';
import Instruments from './Instruments';
import HelmControls from './HelmControls';


const BrLayout = styled.div`
    display: flex;
`

function Bridge() {

    // const bridgeData = {
    //     deltaV: deltaV,
    //     setDeltaV: setDeltaV,
    //     theta: theta,
    //     setTheta: setTheta,
    // }
    
    return (
        <BrLayout>
            <div className='left'>
                <div className='view'>
                    <ViewScreen />
                </div>
                <div className='helm'>
                    <HelmControls />
                </div>
            </div>
            <div className='inst'>
                <Instruments />
            </div>
        </BrLayout>
    );
}

export default Bridge;