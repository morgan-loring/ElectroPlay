import React from 'react';
import Electron from 'electron';
import { connect } from 'react-redux';
import Views from './Views';
import ReactPlayer from 'react-player';
import './style.css';

import store from '../Redux/Store';
import { SetLibrary, SetNowPlaying, SetCurrentView } from '../Redux/Actions';

const ipc = Electron.ipcRenderer;


class ElectroPlay extends React.Component {
    constructor(props) {
        super(props);

        this.clickHandle = this.pauseHandle.bind(this);
        this.pauseHandle = this.pauseHandle.bind(this);
        this.nextHandle = this.nextHandle.bind(this);
        this.visualHandle = this.visualHandle.bind(this);
        this.state = {
            playing: false
        }
    }
    componentDidMount() {
        ipc.on('RecieveLibrary', function (evt, result) {
            store.dispatch(SetLibrary(result));
        });

        ipc.send('GetLibrary');
    }
    render() {
        return (
            <div>
                <div id="upper">
                    <Views />
                    <ReactPlayer
                        width='100%'
                        height={'100%'}
                        url={this.props.NowPlaying.Path}
                        controls={false}
                        playing={this.state.playing}
                        volume='0.5'
                    />

                </div>
                <div id="footer">
                    <div id='MediaControlBox'>
                        <button id='PrevButton' type="button">Prev</button>
                        <button id='PlayButton' onClick={this.pauseHandle} type="button">Play</button>
                        <button id='NextButton' onClick={this.nextHandle} type="button">Next</button>
                        <button id='VisualButton' onClick={this.visualHandle} type="button">vis</button>
                        <button id='VisualButton' onClick={() => {this.props.SetLibrary(this.props.Library)}} type="button">test</button>
                    </div>
                </div>
            </div>
        );
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

    nextHandle() {
        this.props.SetNowPlaying(this.props.Library[this.props.NowPlaying.ID])
    }

    visualHandle() {
        if (this.props.CurrentView == 'Bars')
            this.props.SetCurrentView('Library');
        else if (this.props.CurrentView == 'Library')
            this.props.SetCurrentView('Bars');
    }
}

const mapStateToProps = state => {
    return {
        NowPlaying: state.NowPlaying,
        Library: state.Library,
        CurrentView: state.CurrentView
    }
}

const mapDispatchToProps = dispatch => {
    return {
        SetLibrary: (arg) => dispatch(SetLibrary(arg)),
        SetCurrentView: (arg) => dispatch(SetCurrentView(arg)),
        SetNowPlaying: (arg) => dispatch(SetNowPlaying(arg))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ElectroPlay);