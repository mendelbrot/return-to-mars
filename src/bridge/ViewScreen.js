import React from 'react';
import styled from 'styled-components';
import SimContext from '../sim-helpers/SimContext';
import ship1 from '../rocket.png'
import ship2 from '../space-ship.svg'
//import '../App.css';

class ViewScreen extends React.Component {

    static contextType = SimContext;

    // screen width
    width = 500;  

    //canvas objects
    canvas = null;
    ctx = null;
    ship = null;

    constructor(props) {
        super(props);

        this.simEngineStateChangeCallback = this.simEngineStateChangeCallback.bind(this);
    }

    componentDidMount = () => {

        this.context.pushFunctionToStateChangeCallbackList(this.simEngineStateChangeCallback)

        this.initializeCanvas();

    }

    simEngineStateChangeCallback = () => {
        this.drawMars();
        this.drawShip();
    }

    initializeCanvas = () => {
        this.canvas = this.refs.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.ship = this.refs.ship
        let shw = 0.5 * this.width;
        this.ctx.translate(shw, shw);     //origin at the center
        this.ctx.scale(1, -1);            //flip the y axis to correspond to math convention

        // draw ViewScreen
        let d = 0.5*shw;
        this.ctx.beginPath();
        this.ctx.moveTo(-shw, d);
        this.ctx.quadraticCurveTo(-shw, shw, -d, shw );
        this.ctx.lineTo(d, shw);
        this.ctx.quadraticCurveTo(shw, shw, shw, d);
        this.ctx.lineTo(shw, -d);
        this.ctx.quadraticCurveTo(shw, -shw, d, -shw);
        this.ctx.lineTo(-d, -shw);
        this.ctx.quadraticCurveTo(-shw, -shw, -shw, -d);   
        this.ctx.closePath();
        this.ctx.fillStyle = 'black';
        this.ctx.fill();

        // draw sun
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'yellow';
        this.ctx.fill();
        this.ctx.strokeStyle = 'orange';
        this.ctx.stroke();

        // save the context so it can be restored before drawing the next frame
        this.ctx.save();
    }

    drawMars = () => {
        let marsX = this.rescale(this.context.marsPosition[0]);
        let marsY = this.rescale(this.context.marsPosition[1]);
        this.ctx.beginPath();
        this.ctx.arc(marsX, marsY, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'firebrick';
        this.ctx.fill();
        this.ctx.strokeStyle = 'lightseagreen';
        this.ctx.stroke();
    }

    drawShip = () => {
        let shipX = this.rescale(this.context.shipPosition[0]);
        let shipY = this.rescale(this.context.shipPosition[1]);
        let shipWidth = 40;
        this.ship.onload = () => {
            this.ctx.drawImage(this.ship, shipX - shipWidth / 2, shipY - shipWidth / 2, shipWidth, shipWidth)
        };
    }

    // rescale distances in km to distances in px that fit in the viewscreen
    rescale = (valueKm) => {
        let maxDistFromCanvasCenter = this.width/2 - 20;
        let scaleFactor = maxDistFromCanvasCenter / this.context.maxDistance;
        return scaleFactor * valueKm;
    }

    render() {
        return (
            <div>
                <canvas ref='canvas' width={this.width} height={this.width} />
                <div>
                    <img ref='ship' src={ship1} style={{display:'none'}} />
                    {/* <img ref='ship' src={ship2} /> */}
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