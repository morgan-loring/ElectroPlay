import React from 'react';
import Electron from 'electron';
import { connect } from 'react-redux';
import Views from './Views';
import ReactPlayer from 'react-player';
import './style.css';

import store from '../Redux/Store';
import { SetLibrary, /*SetNowPlaying,*/ SetCurrentView, SetPlaylists, SetFolders, SetQueue, SetHistory } from '../Redux/Actions';
import { QueueDequeue } from './Helpers/Queue';

const ipc = Electron.ipcRenderer;

class ElectroPlay extends React.Component {
    constructor(props) {
        super(props);

        this.pauseHandle = this.pauseHandle.bind(this);
        this.prevHandle = this.prevHandle.bind(this);
        this.nextHandle = this.nextHandle.bind(this);
        this.visualHandle = this.visualHandle.bind(this);

        this.FileEnded = this.FileEnded.bind(this);

        this.state = {
            playing: false
        }
    }

    componentDidMount() {
        ipc.on('RecieveLibrary', function (evt, result) {
            store.dispatch(SetLibrary(result));
        });

        ipc.on('RecievePlaylists', function (e, res) {
            store.dispatch(SetPlaylists(res));
        });

        ipc.on('RecieveFolders', function(evt, res) {
            store.dispatch(SetFolders(res));
        })

        ipc.send('GetLibrary');
        ipc.send('GetPlaylists');
        ipc.send('GetFolders');
    }

    pauseHandle() {
        this.setState({
            playing: !this.state.playing
        })

        if (this.state.playing) {
            document.getElementById("PlayButton").innerText = 'Play';
        }
        else {
            document.getElementById("PlayButton").innerText = 'Pause';
        }
    }

    prevHandle() {
        // this.props.SetNowPlaying(this.props.Library[this.props.NowPlaying.ID])
        let newQueue = this.props.Queue.slice();
        newQueue.unshift(this.props.History[0]);
        this.props.SetQueue(newQueue);
        let newHist = this.props.History.splice(1);
        this.props.SetHistory(newHist);
    }

    nextHandle() {
        // this.props.SetNowPlaying(this.props.Library[this.props.NowPlaying.ID])
        let newHist = this.props.History.slice();
        newHist.unshift(this.props.Queue[0]);
        this.props.SetHistory(newHist);
        let newQueue = this.props.Queue.slice();
        this.props.SetQueue(QueueDequeue(newQueue));
    }

    visualHandle() {
        if (this.props.CurrentView == 'Bars')
            this.props.SetCurrentView('Library');
        else if (this.props.CurrentView == 'Library')
            this.props.SetCurrentView('Bars');
    }

    FileEnded() {
        this.props.SetQueue(QueueDequeue(this.props.Queue));
    }

    render() {
        console.log(this);
        return (
            <div id='Container'>
                <div id="Upper">
                    <Views />
                    <ReactPlayer
                        width='100%'
                        height={'100%'}
                        url={this.props.Queue.length > 0 ? this.props.Queue[0].Path : null}
                        controls={false}
                        playing={this.state.playing}
                        volume='0.5'
                        onEnded={this.FileEnded}
                    />
                </div>
                <div id="footer">
                    <div id='MediaControlBox'>
                        <button id='PrevButton' onClick={this.prevHandle} type="button">Prev</button>
                        <button id='PlayButton' onClick={this.pauseHandle} type="button">Play</button>
                        <button id='NextButton' onClick={this.nextHandle} type="button">Next</button>
                        <button id='VisualButton' onClick={this.visualHandle} type="button">vis</button>
                        <button id='ListButton' onClick={this.listHandle} type="button">vis</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        // NowPlaying: state.NowPlaying,
        Library: state.Library,
        CurrentView: state.CurrentView,
        Queue: state.Queue,
        History: state.History
    }
}

const mapDispatchToProps = dispatch => {
    return {
        SetLibrary: (arg) => dispatch(SetLibrary(arg)),
        SetCurrentView: (arg) => dispatch(SetCurrentView(arg)),
        // SetNowPlaying: (arg) => dispatch(SetNowPlaying(arg)),
        SetQueue: (arg) => dispatch(SetQueue(arg)),
        SetHistory: (arg) => dispatch(SetHistory(arg))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ElectroPlay);