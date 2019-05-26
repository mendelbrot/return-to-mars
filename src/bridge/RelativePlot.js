import React from 'react';
import styled from 'styled-components';
import { VictoryChart, VictoryGroup, VictoryArea, VictoryLine } from 'victory'


function RelativePlot(props) {

    //pushFunctionToStateChangeCallbackList

    var tolData = [
        { x: 2, y: null },
        { x: 5, y: 6 },
        { x: 4, y: 3 }
    ];

    return (
        <div>
            <VictoryChart width={400} height={400}>
                <VictoryGroup
                    style={{
                        data: { strokeWidth: 3, fillOpacity: 0.4 }
                    }}
                >
                    <VictoryLine
                        style={{
                            data: { stroke: "cyan" }
                        }}
                        data={[
                            { x: 1, y: 2 },
                            { x: 2, y: 3 },
                            { x: 3, y: 5 },
                            { x: 4, y: 4 },
                            { x: 5, y: 7 }
                        ]}
                    />
                    <VictoryArea
                        style={{
                            data: { fill: "magenta", stroke: "magenta" }
                        }}
                        data={tolData}
                    />
                </VictoryGroup>
            </VictoryChart>
            <div style={ props.x < props.tol ? { backgroundColor : 'green' } : { backgroundColor: 'red' } }>
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