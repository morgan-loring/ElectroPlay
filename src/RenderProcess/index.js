import React from 'react';
import Electron from 'electron';
import { connect } from 'react-redux';
import Views from './Views';
import ReactPlayer from 'react-player';
import './style.css';

import store from '../Redux/Store';
import {
    SetLibrary, SetCurrentView, SetPlaylists,
    SetFolders, SetQueue, SetHistory, SetVolume,
    ToggleMute, ToggleRepeat, ToggleShuffle
} from '../Redux/Actions';
import { QueueDequeue } from './Helpers/Queue';

const ipc = Electron.ipcRenderer;

class ElectroPlay extends React.Component {
    constructor(props) {
        super(props);

        this.PauseHandle = this.PauseHandle.bind(this);
        this.PrevHandle = this.PrevHandle.bind(this);
        this.NextHandle = this.NextHandle.bind(this);
        this.VisualHandle = this.VisualHandle.bind(this);
        this.ClearQueueHandle = this.ClearQueueHandle.bind(this);
        this.VolumeChange = this.VolumeChange.bind(this);
        this.MuteHandle = this.MuteHandle.bind(this);
        this.RepeatHandle = this.RepeatHandle.bind(this);
        this.ShuffleHandle = this.ShuffleHandle.bind(this);

        this.state = {
            playing: false
        }

        this.ref = React.createRef();
    }

    componentDidMount() {
        ipc.on('RecieveLibrary', function (evt, result) {
            store.dispatch(SetLibrary(result));
        });

        ipc.on('RecievePlaylists', function (e, res) {
            store.dispatch(SetPlaylists(res));
        });

        ipc.on('RecieveFolders', function (evt, res) {
            store.dispatch(SetFolders(res));
        })

        ipc.send('GetLibrary');
        ipc.send('GetPlaylists');
        ipc.send('GetFolders');
    }

    PauseHandle() {
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

    PrevHandle() {
        if (this.props.History.length > 0) {
            let newQueue = this.props.Queue.slice();
            newQueue.unshift(this.props.History[0]);
            this.props.SetQueue(newQueue);
            let newHist = this.props.History.splice(1);
            this.props.SetHistory(newHist);
        }
    }

    NextHandle() {
        if (this.props.Repeat) {
            this.ref.current.seekTo(0);
        }
        else {
            let newHist = this.props.History.slice();
            if (this.props.Queue.length > 0) {
                newHist.unshift(this.props.Queue[0]);
                this.props.SetHistory(newHist);
            }
            let newQueue = this.props.Queue.slice();
            QueueDequeue(newQueue)
            if (this.props.Shuffle && newQueue.length > 0) {
                let nextSong = Math.floor(Math.random() * newQueue.length);
                console.log(nextSong, newQueue);
                newQueue.unshift(newQueue.splice(nextSong, nextSong + 1)[0]);
                console.log(newQueue);
            }
            this.props.SetQueue(newQueue);
        }
    }

    VisualHandle() {
        if (this.props.CurrentView == 'Bars')
            this.props.SetCurrentView('Library');
        else if (this.props.CurrentView == 'Library')
            this.props.SetCurrentView('Bars');
    }

    ClearQueueHandle() {
        this.props.SetQueue([]);
    }

    VolumeChange(e) {
        this.props.SetVolume(e.currentTarget.value);
    }

    MuteHandle() {
        this.props.ToggleMute();
    }

    RepeatHandle() {
        this.props.ToggleRepeat();
    }

    ShuffleHandle() {
        this.props.ToggleShuffle();
    }

    render() {
        console.log(this.props);
        return (
            <div id='Container'>
                <div id="Upper">
                    <Views />
                    <ReactPlayer
                        ref={this.ref}
                        width='100%'
                        height='100%'
                        url={this.props.Queue.length > 0 ? this.props.Queue[0].Path : null}
                        controls={false}
                        playing={this.state.playing}
                        volume={this.props.Volume / 100}
                        muted={this.props.Muted}
                        onEnded={this.NextHandle}
                    />
                </div>
                <div id="footer">
                    <div id='MediaControlBox'>
                        <button id='PrevButton' onClick={this.PrevHandle} type="button">Prev</button>
                        <button id='PlayButton' onClick={this.PauseHandle} type="button">Play</button>
                        <button id='NextButton' onClick={this.NextHandle} type="button">Next</button>
                        <button id='VisualButton' onClick={this.VisualHandle} type="button">Visual</button>
                        <button id='ClearQueueButton' onClick={this.ClearQueueHandle} type="button">Clear Queue</button>
                        <button id='RepeatButton' onClick={this.RepeatHandle} type="button">Repeat</button>
                        <button id='ShuffleButton' onClick={this.ShuffleHandle} type="button">Shuffle</button>
                        <input type="range" min="0" max="100" defaultValue="50" onChange={this.VolumeChange}></input>
                        <button id='MuteButton' onClick={this.MuteHandle} type="button">Mute</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        Library: state.Library,
        CurrentView: state.CurrentView,
        Queue: state.Queue,
        History: state.History,
        Volume: state.Settings.Volume,
        Muted: state.Settings.Muted,
        Repeat: state.Settings.Repeat,
        Shuffle: state.Settings.Shuffle
    }
}

const mapDispatchToProps = dispatch => {
    return {
        SetLibrary: (arg) => dispatch(SetLibrary(arg)),
        SetCurrentView: (arg) => dispatch(SetCurrentView(arg)),
        SetQueue: (arg) => dispatch(SetQueue(arg)),
        SetHistory: (arg) => dispatch(SetHistory(arg)),
        SetVolume: (arg) => dispatch(SetVolume(arg)),
        ToggleMute: () => dispatch(ToggleMute()),
        ToggleRepeat: () => dispatch(ToggleRepeat()),
        ToggleShuffle: () => dispatch(ToggleShuffle())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ElectroPlay);