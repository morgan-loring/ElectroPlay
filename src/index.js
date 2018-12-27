import React from 'react';
import ReactDOM from 'react-dom';
import BarsVisual from './Visualization';
import './style.css';




class ElectroPlay extends React.Component {
    constructor() {
        super();

        this.clickHandle = this.pauseHandle.bind(this);
        this.seek = this.seek.bind(this);
    }
    render() {
        return (
            <div>
                <div id="upper">
                    <BarsVisual />
                </div>
                <div id="footer">
                <progress id='seekBar' value='30' min='0' max='100' onClick={this.seek}></progress>
                    <div id='MediaControlBox'>
                        <button id='PrevButton' onClick={this.pauseHandle} type="button">Prev</button>
                        <button id='PlayButton' onClick={this.pauseHandle} type="button">Play</button>
                        <button id='NextButton' onClick={this.pauseHandle} type="button">Next</button>
                    </div>
                </div>
            </div>
        );
    }

    pauseHandle() {
        let ele = document.getElementById("AudioEle");
        if (ele.paused) {
            ele.play();
            document.getElementById("PlayButton").innerText = 'Pause';
        }
        else {
            ele.pause();
            document.getElementById("PlayButton").innerText = 'Play';
        }
    }

    seek(e) {
        console.log(this);
        let per = e.nativeEvent.offsetX / this.offsetX;
        let audioEle = document.getElementById('AudioEle')
        console.log(audioEle);
        audioEle.currentTime = per * audioEle.durration
        document.getElementById('seekBar').value = per / 100;
    }
}

ReactDOM.render(
    <ElectroPlay />,
    document.getElementById('app')
);