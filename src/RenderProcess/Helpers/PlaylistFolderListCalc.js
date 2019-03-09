import React from 'react';
import { remote } from 'electron';
import store from '../../Redux/Store';
import { SetDraggedFile } from '../../Redux/Actions';
const ipc = require('electron').ipcRenderer;

let contextMenuClickedElement;

exports.GetContextMenuElement = () => { return contextMenuClickedElement; }

function HandleRateChange(e) {
    ipc.send('UpdateRating', {
        Rating: e.currentTarget.value,
        ID: e.currentTarget.parentNode.parentNode.getAttribute('fileID')
    });
}

function makeRow(file, contextMenu) {
    return (<tr
        id={'File' + file.ID}
        index={file.index}
        class="File"
        fileID={file.ID}
        onContextMenu={(e) => {
            e.preventDefault();
            contextMenuClickedElement = e.currentTarget
            contextMenu.popup(remote.getCurrentWindow());
        }}
        onDragStart={(e) => {
            store.dispatch(SetDraggedFile(e.currentTarget))
            // this.props.SetDraggedFile(e.currentTarget);
        }}
        draggable
    >
        <td>{file.ID}</td>
        <td>{file.Title}</td>
        <td>{file.Album}</td>
        <td>{file.Artist}</td>
        <td>
            <select class='RatingSelect' onChange={(e) => { HandleRateChange(e); }}>
                <option disabled selected={file.Rating == 0 ? true : false}>0</option>
                <option selected={file.Rating == 1 ? true : false}>1</option>
                <option selected={file.Rating == 2 ? true : false}>2</option>
                <option selected={file.Rating == 3 ? true : false}>3</option>
                <option selected={file.Rating == 4 ? true : false}>4</option>
                <option selected={file.Rating == 5 ? true : false}>5</option>
            </select>
        </td>
    </tr>);
}

exports.CalcTable = function (library, files, type, searchString, contextMenu) {
    let rows = [];
    let toCompute = [];

    if (type == 'Library') {
        for (let jj = 0; jj < library.length; jj++) {
            if (library[jj].Title.toLowerCase().search(searchString) != -1) {
                let r = Object.assign({}, library[jj]);
                r.index = jj;
                toCompute.push(r);
            }
        }
    }
    else if (type == 'Queue') {
        for (let ii = 0; ii < files.length; ii++) {
            for (let jj = 0; jj < library.length; jj++) {
                if (library[jj].ID == files[ii]) {
                    let r = Object.assign({}, library[jj]);
                    r.index = ii;
                    toCompute.push(r);
                    break;
                }
            }
        }
    }
    else {
        for (let ii = 0; ii < files.length; ii++) {
            for (let jj = 0; jj < library.length; jj++) {
                if (library[jj].ID == files[ii].SongID &&
                    library[jj].Title.toLowerCase().search(searchString) != -1) {
                    let r = Object.assign({}, library[jj]);
                    r.index = ii;
                    toCompute.push(r);
                    break;
                }
            }
        }
    }


    for (let ii = 0; ii < toCompute.length; ii++) {
        rows.push(makeRow(toCompute[ii], contextMenu));
    }

    return rows;
}