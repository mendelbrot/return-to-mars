import React from 'react';
import styled from 'styled-components';


function RelativePlot(props) {

    return (
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
    );
}

export default RelativePlot;