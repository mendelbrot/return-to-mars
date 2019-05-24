import React from 'react';
import styled from 'styled-components';
import ViewScreen from './ViewScreen';
import Instruments from './Instruments';
import HelmControls from './HelmControls';
//import '../App.css';

const BrLayout = styled.div`
    display: flex;
`

function Bridge() {
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