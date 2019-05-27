import React, { useContext } from 'react';
import styled from 'styled-components';
import { PanelBox } from '../SharedStyles';
import RelativePlot from './RelativePlot';
import SimContext from '../sim-helpers/SimContext';


const Inst = styled(PanelBox)`

    h2 {
            font-size: 1.5em;
            color: white;
        }

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
            <h2>Distance</h2>
            <div className='plot'>
                
                <RelativePlot 
                    reset={context.hasReset}
                    x={context.timeMarsYears} 
                    xLabel='Time (Martian Years)'
                    n={50}
                    y={context.marsShipDistance / 1000000000} 
                    yLabel='Distance (Million Km)'
                    tol={context.distanceTolerance / 1000000000}/>
            </div>
            <h2>Speed</h2>
            <div className='plot last'>
                <RelativePlot 
                    reset={context.hasReset}
                    x={context.timeMarsYears} 
                    xLabel='Time (Martian Years)'
                    n={50}
                    y={context.marsShipSpeed / 1000} 
                    yLabel='Speed (Km/s)'
                    tol={context.speedTolerance / 1000}/>
            </div>
        </Inst>
    );
}

export default Instruments;