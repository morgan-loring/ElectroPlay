import React from 'react';
import ReactDOM from 'react-dom';
import BarsVisual from './Visualization';
import './style.css';




class ElectroPlay extends React.Component {

    render() {
        return (
            <div>
                <div id="upper">
                    <BarsVisual />
                </div>
                <div id="footer">
                    <button onClick={clickHandle()} type="button">Pause/Play</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <ElectroPlay />,
    document.getElementById('app')
);

function clickHandle() {
    let ele = document.getElementById("AudioEle");
    if(ele.paused) ele.play();
    else ele.pause();
}