import React from 'react';
import ReactDOM from 'react-dom';
import BarsVisual from './Visualization';
import electron from 'electron';
import { Provider } from 'react-redux';
import './style.css';

const ipc = electron.ipcRenderer;


class ElectroPlay extends React.Component {
    constructor() {
        super();

        this.clickHandle = this.pauseHandle.bind(this);
        this.dbtest = this.dbtest.bind(this);
        this.nextHandle = this.nextHandle.bind(this);
        this.currentSongID = -1;
    }
    componentDidMount() {
        ipc.on('RecieveSong', function (evt, result) {
            this.currentSongID = result[0].currentSongID;
            document.getElementById('AudioEle').src = result[0].Path;
        });

        ipc.send('GetSong', this.currentSongID);
    }
    render() {
        return (
            <div>
                <div id="upper">
                    <BarsVisual />
                </div>
                <div id="footer">
                    <div id='MediaControlBox'>
                        <button id='PrevButton' onClick={this.dbtest} type="button">Prev</button>
                        <button id='PlayButton' onClick={this.pauseHandle} type="button">Play</button>
                        <button id='NextButton' onClick={this.nextHandle} type="button">Next</button>
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

    dbtest() {
        ipc.send('test', [2, 4]);
    }
    nextHandle() {
        ipc.send('getNextSong', [2, 4]);
    }
}

ReactDOM.render(
    
    <ElectroPlay />,
    document.getElementById('app')
);