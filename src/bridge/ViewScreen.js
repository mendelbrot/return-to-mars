import React from 'react';
import styled from 'styled-components';
import SimContext from '../sim-helpers/SimContext';
//import '../App.css';

class ViewScreen extends React.Component {

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
                <SimContext.Consumer>
                    {
                        context => (
                            <h1>
                                {context.hello}
                            </h1>
                        )
                    }
                </SimContext.Consumer>
            </div>
        );
    }
}

export default ViewScreen;