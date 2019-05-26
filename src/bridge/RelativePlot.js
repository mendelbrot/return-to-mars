import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryGroup, VictoryArea, VictoryLine, VictoryAxis } from 'victory'
import SimContext from '../sim-helpers/SimContext';


function RelativePlot(props) {

    const context = useContext(SimContext);

    const initData = () => {
        var dat = [];
        for (var i = 0; i <= props.n-1; i++) {
            dat.push({ x: null, y: null });
        };
        return dat;
    };

    const [hasPushedReset, setHasPushedReset] = useState(false);

    var reset = () => {
        setTolData(initData());
        setValData(initData());
    }

    if (!hasPushedReset) {
        context.pushFunctionToResetCallbackList(reset);
        setHasPushedReset(true);
    }

    const [tolData, setTolData] = useState(initData());
    const [valData, setValData] = useState(initData());
    useEffect(() => {
        for (var i = props.n - 1; i > 0; i--) {
            valData[i].x = valData[i - 1].x;
            valData[i].y = valData[i - 1].y;
            tolData[i].x = tolData[i - 1].x;
            tolData[i].y = props.tol;
        };
        valData[0].x = props.x;
        valData[0].y = props.y;
        tolData[0].x = props.x;
        tolData[0].y = props.tol;
        setValData(valData);
        setTolData(tolData);
    });

    return (
        <div>
            <VictoryChart width={400} height={250}>
                <VictoryAxis
                    orientation="right"
                />
                <VictoryAxis
                    orientation="bottom"
                />
                <VictoryGroup
                    style={{
                        data: { strokeWidth: 3, fillOpacity: 0.4 }
                    }}
                >
                    <VictoryLine
                        style={{
                            data: { stroke: "black" }
                        }}
                        data={valData}
                    />
                    <VictoryArea
                        style={{
                            data: { fill: "magenta", stroke: "magenta" }
                        }}
                        data={tolData}
                    />
                </VictoryGroup>
            </VictoryChart>
            <div style={props.y < props.tol ? { backgroundColor: 'green', display: 'none' } : { backgroundColor: 'red', display: 'none'} }>
                <div>
                    {props.x}
                </div>
                <div>
                    {props.tol}
                </div>
                <div>
                    {props.y}
                </div>
            </div>
        </div>

    );
}

export default RelativePlot;