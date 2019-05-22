import React, {useContext} from 'react';
import styled from 'styled-components';
import { Input } from 'reactstrap'
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
        </div>
    );
    
}

export default SimControls;