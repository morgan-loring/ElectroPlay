import React from 'react';
import Electron from 'electron';
import { connect } from 'react-redux';
import Views from './Views';
import ReactPlayer from 'react-player';
import ScreenFull from 'screenfull';
import './style.css';

import store from '../Redux/Store';
import {
    SetLibrary, SetCurrentView, SetPlaylists,
    SetFolders, SetQueue, SetHistory, SetVolume,
    ToggleMute, ToggleRepeat, ToggleShuffle,
    SetPlaybackSpeed, LoadSettings
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
        this.FullscreenHandle = this.FullscreenHandle.bind(this);

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
        });

        ipc.on('SetPlaybackSpeed', function (evt, res) {
            store.dispatch(SetPlaybackSpeed(res));
        });

        ipc.on('FileRemovedFromLibrary', function (evt) {
            ipc.send('GetLibrary');
            ipc.send('GetPlaylists');
            ipc.send('GetFolders');
        });

        ipc.on('GetSettings', function (evt) {
            let state = store.getState();
            let settings = {
                Queue: JSON.stringify(state.Queue.slice()),
                Volume: state.Settings.Volume,
                Muted: state.Settings.Muted ? 1 : 0,
                Repeat: state.Settings.Repeat ? 1 : 0,
                Shuffle: state.Settings.Shuffle ? 1 : 0,
                PlaybackSpeed: state.Settings.PlaybackSpeed
            }
            ipc.send('RecieveSettings', settings);
        });

        ipc.on('LoadSettings', function(evt, settings) {
            store.dispatch(LoadSettings(settings[0]));
        });

        ipc.send('GetLibrary');
        ipc.send('GetPlaylists');
        ipc.send('GetFolders');
        ipc.send('GetSettingsToLoad');
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
            let newHist = this.props.History.splice(1, 1);
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
                newQueue.unshift(newQueue.splice(nextSong, nextSong + 1)[0]);
            }
            this.props.SetQueue(newQueue);
            let song = this.props.Library.find(o => o.ID == newQueue[0]);
            if (newQueue.length > 0) {
                if (song.Format == 'audio' && this.props.CurrentView == 'Video')
                    this.props.SetCurrentView('Bars');
                else if (song.Format != 'audio' && this.props.CurrentView == 'Bars')
                    this.props.SetCurrentView('Video');
            }
            else {
                this.props.SetCurrentView('Library');
            }
        }
    }

    VisualHandle() {
        if (this.props.Queue.length > 0) {
            if (this.props.Library.find(o => o.ID == this.props.Queue[0]).Format == 'audio') {
                if (this.props.CurrentView == 'Bars')
                    this.props.SetCurrentView('Library');
                else if (this.props.CurrentView == 'Library')
                    this.props.SetCurrentView('Bars');
            }
            else {
                if (this.props.CurrentView == 'Video')
                    this.props.SetCurrentView('Library');
                else if (this.props.CurrentView == 'Library')
                    this.props.SetCurrentView('Video');
            }
        }
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

    FullscreenHandle() {
        if (ScreenFull.enabled) {
            ScreenFull.toggle();
        }
    }

    render() {
        return (
            <div id='Container'>
                <div id="Upper">
                    <Views />
                    <div id='wrapper'
                        class={this.props.CurrentView != 'Video' ? 'invisible' : ''}
                    >
                        <ReactPlayer
                            ref={this.ref}
                            width='100%'
                            height='100%'
                            url={this.props.Queue.length > 0 ?
                                this.props.Library.find(o => o.ID == this.props.Queue[0]).Path : null}
                            controls={false}
                            playing={this.state.playing}
                            playbackRate={this.props.PlaybackSpeed}
                            volume={this.props.Volume / 100}
                            muted={this.props.Muted}
                            onEnded={this.NextHandle}
                            onError={console.log('error')}
                        />
                    </div>
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
                        <button id='FullScreenButton' onClick={this.FullscreenHandle} type="button">Full Screen</button>
                        <input id='VolumeSlider' type="range" min="0" max="100" value={this.props.Volume} onChange={this.VolumeChange}></input>
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
        Shuffle: state.Settings.Shuffle,
        PlaybackSpeed: state.Settings.PlaybackSpeed
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