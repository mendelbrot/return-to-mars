import React from 'react';
import styled from 'styled-components';


function RelativePlot(props) {

    return (
        <div>
            <div>
                {props.x}
            </div>
            <div>
                {props.y}
            </div>
        </div>
    );
}

export default RelativePlot;