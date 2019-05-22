import React, {useContext} from 'react';
import styled from 'styled-components';
import SimEngine from '../sim-helpers/SimEngine'
import { Input } from 'reactstrap'
import SimContext from '../sim-helpers/SimContext';
//import '../App.css';

//class SimControls extends React.Component {

const SimControls = (props) => {

    //static contextType = SimContext;

    // constructor(props) {
    //     super(props) 
        
    //     this.handleChange = this.handleChange.bind(this);
    // }

    const context = useContext(SimContext);

    const handleChange = (evt) => {
        //this.context.setState({ [evt.target.name]: evt.target.value });
        context.setSecondsPerMarsYear(evt.target.value);
        console.log(evt.target.value);
    }
    //render() {
        return (
            <div>
                <Input 
                    name='secondsPerMarsYear' 
                    value={context.secondsPerMarsYear} 
                    min={1} max={60} type="number" step="1" 
                    onChange={handleChange}
                />
            </div>
        );
    //}
    
}

export default SimControls;