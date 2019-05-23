import React, {useContext} from 'react';
import styled from 'styled-components';
import { Input, Button } from 'reactstrap'
import SimContext from '../sim-helpers/SimContext';
//import '../App.css';

const SimControls = (props) => {

    const context = useContext(SimContext);

    const handleSecondsPerMarsYearChange = (evt) => {
        context.setSecondsPerMarsYear(evt.target.value);
        console.log(evt.target.value);
    }

    return (
        <div>
            <Input 
                name='secondsPerMarsYear' 
                value={context.secondsPerMarsYear} 
                min={1} max={60} type="number" step="1" 
                onChange={handleSecondsPerMarsYearChange}
            />
            <Button onClick={playSimulation}>Play</Button>
            <Button onClick={pauseSimulation}>Pause</Button>
            <Button onClick={resetSimulation}>Reset</Button>
        </div>
    );
    
}

export default SimControls;