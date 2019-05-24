import React, { useContext } from 'react';
import styled from 'styled-components';
import { PanelBox } from '../SharedStyles';
import RelativePlot from './RelativePlot';
import SimContext from '../sim-helpers/SimContext';


const Inst = styled(PanelBox)`
    min-width: 100px;
    border: solid 1px black;

    .plot {
        margin: 10px;
        padding: 10px;
        background-color: white;
        border-radius: 10px;
    }
`

        // border: solid 1px black;
        // margin: 10px;
        // padding: 10px;

function Instruments() {

    const context = useContext(SimContext);

    return (
        <Inst>
            <div className='plot'>
                <span>Distance</span>
                <RelativePlot x={context.marsShipDistance} y={context.timeMarsYears}/>
            </div>
            <div className='plot'>
                <span>Speed</span>
                <RelativePlot x={context.marsShipSpeed} y={context.timeMarsYears}/>
            </div>
        </Inst>
    );
}

export default Instruments;