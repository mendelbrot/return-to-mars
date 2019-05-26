import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryGroup, VictoryArea, VictoryLine, VictoryAxis } from 'victory'
import SimContext from '../sim-helpers/SimContext';


function RelativePlot(props) {

    const context = useContext(SimContext);

    const initialData = () => {
        var dat = [];
        for (var i = 0; i < props.n; i++) {
            dat.push({ x: null, y: null });
        };
        return dat;
    }

    const [hasPushedReset, setHasPushedReset] = useState(false);

    var reset = () => {
        setTolData(initialData());
        setValData(initialData());
    }

    if (!hasPushedReset) {
        context.pushFunctionToResetCallbackList(reset);
        setHasPushedReset(true);
    }

    const [tolData, setTolData] = useState(initialData());
    const [valData, setValData] = useState(initialData());
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

    var tolColor = props.y > props.tol ? "magenta": "lime";

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
                            data: { stroke: "blue" }
                        }}
                        data={valData}
                    />
                    <VictoryArea
                        style={{
                            data: { fill: tolColor, stroke: tolColor }
                        }}
                        data={tolData}
                    />
                </VictoryGroup>
            </VictoryChart>
        </div>

    );
}

export default RelativePlot;