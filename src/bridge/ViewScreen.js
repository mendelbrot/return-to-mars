import React from 'react';
import styled from 'styled-components';
import SimContext from '../sim-helpers/SimContext';
//import '../App.css';

class ViewScreen extends React.Component {

    static contextType = SimContext;

    componentDidMount() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    render() {
        return (
            <div>
                <canvas ref='canvas' width={600} height={600} />
                <div>
                    <h1>
                        {this.context.secondsPerMarsYear}
                    </h1>
                    <h2>
                        {this.context.marsPosition[0]}
                    </h2>
                </div>
            </div>
        );
    }
}

export default ViewScreen;