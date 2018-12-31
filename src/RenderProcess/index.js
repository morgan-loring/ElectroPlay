import React from 'react';
import Electron from 'electron';
import { connect } from 'react-redux';
import BarsVisual from './Visualization';
import './style.css';

import store from '../Redux/Store';
import { SetLibrary } from '../Redux/Actions';

const ipc = Electron.ipcRenderer;


class ElectroPlay extends React.Component {
    constructor(props) {
        super(props);

        this.clickHandle = this.pauseHandle.bind(this);
        this.dbtest = this.dbtest.bind(this);
        this.nextHandle = this.nextHandle.bind(this);
        this.currentSongID = -1;
    }
    componentDidMount() {
        ipc.on('RecieveLibrary', function (evt, result) {
            store.dispatch(SetLibrary(result));
        });

        ipc.send('GetLibrary');
    }
    render() {console.log(this.props);
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
        ipc.send('test');
    }
    nextHandle() {
        ipc.send('getNextSong');
    }
}

const mapStateToProps = state => {
    return {
        NowPlaying: state.NowPlaying,
        Library: state.Library
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
//         SetLibrary: (arg) => dispatch(SetLibrary(arg))
//     }
// }

export default connect(mapStateToProps)(ElectroPlay); 
// export default connect(mapStateToProps, mapDispatchToProps)(ElectroPlay); 