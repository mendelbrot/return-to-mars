import React, { useContext } from 'react';
import styled from 'styled-components';
import { PanelBox } from '../SharedStyles';
import RelativePlot from './RelativePlot';
import SimContext from '../sim-helpers/SimContext';


const Inst = styled(PanelBox)`

    .plot {
        margin-bottom: 10px;
        padding: 10px;
        background-color: white;
        border-radius: 10px;
    }

    .last {
        margin-bottom: 0px;
    }
`

function Instruments() {

    const context = useContext(SimContext);

    return (
        <Inst>
            <div className='plot'>
                <span>Distance</span>
                <RelativePlot 
                    x={context.marsShipDistance} 
                    y={context.timeMarsYears} 
                    tol={context.distanceTolerance}/>
            </div>
            <div className='plot last'>
                <span>Speed</span>
                <RelativePlot 
                    x={context.marsShipSpeed} 
                    y={context.timeMarsYears} 
                    tol={context.speedTolerance}/>
            </div>
        </Inst>
    );
}

export default Instruments;