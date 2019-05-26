import React, {useContext} from 'react';
import styled from 'styled-components';
import { Input, Button, Form, FormGroup, Label } from 'reactstrap'
import SimContext from '../sim-helpers/SimContext';


const SinCon = styled.div`

    height: 100vh;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .top {

        .title {

            padding: 10px 10px 0px 10px;
            h1 {
                font-family: 'marvin-visions';
            }
        }

        .play-controls {
            display: flex;

            > * {
                margin: 10px 10px 10px 0px;
            }

            .speed {
                margin-left: 10px;
            }

            .speed {
                width: 70px;
            }
        }
    }

    .bottom {

        .settings-header {
            border: 1px solid black;
            border-left: none;
            border-right: none;
            padding: 0px 10px 0px 10px;

            h2 {
                font-size: 1.5em
            }
        }

        .settings-form {
            padding: 10px 10px 10px 10px;
        }
    }

    
`

const SimControls = (props) => {

    const context = useContext(SimContext);

    const contextFunctions = {

        speed: (val) => {
            context.setSecondsPerMarsYear(val);
        },
        distanceTolerance: (val) => {
            context.setDistanceTolerance(val);
        },
        speedTolerance: (val) => {
            context.setSpeedTolerance(val);
        },
        initialDeltaVReserve: (val) => {
            context.setInitialDeltaVReserve(val);
        },
        timeLimit: (val) => {
            context.setTimeLimit(val);
        },


    }

    const handleChange = (evt) => {
        contextFunctions[evt.target.name](Number(evt.target.value));
    }

    return (
        <SinCon>
            <div className='top'>
                <div className='title'>
                    <h1>Return to Mars</h1>
                </div>
                <div className='play-controls'>
                    <div className='speed'>
                        <Input
                            name='speed'
                            value={context.secondsPerMarsYear}
                            min={1} max={60} type="number" step="1"
                            onChange={handleChange}
                        />
                    </div>
                    <Button color='success' onClick={context.playSim}>Play</Button>
                    <Button color='success' onClick={context.pauseSim}>Pause</Button>
                    <Button color='info' onClick={context.resetSim}>Reset</Button>
                </div>
            </div>

            <div className='bottom'>
                <div className='settings-header'>
                    <h2>Settings</h2>
                </div>
                <div className='settings-form'>
                    <Form>
                        <FormGroup>
                            <Label>Distance Tolerance</Label>
                            <Input
                                name='distanceTolerance'
                                value={context.distanceTolerance}
                                min={0} type="number" step="1000000000"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Speed Tolerance</Label>
                            <Input
                                name='speedTolerance'
                                value={context.speedTolerance}
                                min={0} type="number" step="100"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Initial Reserve</Label>
                            <Input
                                name='initialDeltaVReserve'
                                value={context.initialDeltaVReserve}
                                min={0} type="number" step="1000000"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Time Limit</Label>
                            <Input
                                name='timeLimit'
                                value={context.timeLimit}
                                min={0} type="number" step="1"
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <Button color='info' onClick={context.restoreDefaultValues}>Restore Default</Button>
                    </Form>
                </div>
            </div>

        </SinCon>

    );
    
}

export default SimControls;