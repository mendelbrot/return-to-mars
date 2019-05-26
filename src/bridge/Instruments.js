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
                    reset={context.hasReset}
                    x={context.timeMarsYears} 
                    dx={context.marsYearsPerFrame()}
                    n={50}
                    y={context.marsShipDistance / 1000000000} 
                    tol={context.distanceTolerance / 1000000000}/>
            </div>
            <div className='plot last'>
                <span>Speed</span>
                <RelativePlot 
                    reset={context.hasReset}
                    x={context.timeMarsYears} 
                    dx={context.marsYearsPerFrame()}
                    n={50}
                    y={context.marsShipSpeed / 1000} 
                    tol={context.speedTolerance / 1000}/>
            </div>
        </Inst>
    );
}

export default Instruments;