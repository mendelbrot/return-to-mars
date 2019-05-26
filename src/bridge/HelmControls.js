import React, { useContext } from 'react';
import styled from 'styled-components';
import { PanelBox } from '../SharedStyles';
import { Input, Button } from 'reactstrap'
import SimContext from '../sim-helpers/SimContext';


const Helm = styled(PanelBox)`

    .control-label {
        color: white;
        font-size: 0.7em
    }

    .controls {
        display: flex;
    }

    .delta-v{
        width: 80px;
        margin-right: 10px;
    }

    .theta {
        width: 70px;
        margin-right: 10px;
    }

    .fire {
        margin-right: 10px;
    }

    .guage {
        flex: 1;
    }
`

const Guage = styled.div`

    display: flex;   
    height: 38px;

    .reserve {
        background-color: blue;
        flex: ${props => props.reserve || 1};
    }

    .setting {
        background-color: red;
        flex: ${props => props.setting || 1};
    }

    .depleted {
        background-color: orange;
        flex: ${props => props.depleted || 1};
    }

`

function HelmControls(props) {

    const context = useContext(SimContext);


    const eventFunctions = {

        getDeltaV: () => Math.round(props.helmData.deltaV / 100) /10,
        setDeltaV: (deltaV) => { props.helmData.setDeltaV(deltaV * 1000)},
        getTheta: () => Math.round(180 / Math.PI * props.helmData.theta),
        setTheta: (theta) => props.helmData.setTheta(Math.PI / 180 * theta),
        getInitialDeltaVReserve: () => Math.round(context.initialDeltaVReserve / 100) / 10,
        getDeltaVReserve: () => Math.round(context.deltaVReserve / 100) / 10
    }

    const handleChange = (evt) => {
        eventFunctions[evt.target.name](Number(evt.target.value));

        console.log(reserve);
        console.log(setting);
        console.log(depleted);
    }

    var reserve = eventFunctions.getDeltaVReserve() - eventFunctions.getDeltaV();
    if (reserve < 0) {
        reserve = 0;
    }
    var setting = eventFunctions.getDeltaV();
    if (setting > eventFunctions.getDeltaVReserve()) {
        setting = eventFunctions.getDeltaVReserve();
    }
    var depleted = eventFunctions.getInitialDeltaVReserve() - eventFunctions.getDeltaVReserve();

    return (
        <Helm>
            <div className='controls'>
                <div className='delta-v'>
                    <span className='control-label'>Delta V (Km/s)</span>
                    <Input
                        name='setDeltaV'
                        value={eventFunctions.getDeltaV()}
                        min={0} type="number" step="0.1"
                        onChange={handleChange}
                    />
                </div>
                <div className='theta'>
                    <span className='control-label'>Angle</span>
                    <Input
                        name='setTheta'
                        value={eventFunctions.getTheta()}
                        type="number" step="1"
                        onChange={handleChange}
                    />
                </div>
                <div className='fire'>
                    <span className='control-label'> </span><br/>
                    <Button 
                        color='danger' 
                        onClick={() => context.addDeltaV([props.helmData.deltaV, props.helmData.theta])}>
                            Fire
                    </Button>
                </div>
                <div className='guage'>
                    <span className='control-label'>Propellant Guage</span><br />
                    <Guage
                        reserve={reserve}
                        setting={setting}
                        depleted={depleted}>

                        <div className='reserve'></div>
                        <div className='setting'></div>
                        <div className='depleted'></div>
                    </Guage>
                </div>
            </div>
        </Helm>
    );
}

export default HelmControls;