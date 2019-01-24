import React from 'react';
import { connect } from 'react-redux';
import { SetNowPlaying } from '../../Redux/Actions';
import './FileView.css';

const { remote } = require('electron')
const { Menu } = remote;
const ipc = require('electron').ipcRenderer;

let contextMenuClickedElement = null;

function AddToPlaylist(e) {
    ipc.send('AddFileToPlaylist', {
        NameID: e.id,
        Order: e.order,
        SongID: contextMenuClickedElement.getAttribute('fileid')
    })
}

class FileView extends React.Component {
    constructor(props) {
        super(props);

        this.fileClick = this.fileClick.bind(this);

        this.FileContextMenuTemp = [
            {
                label: 'Add File to Playlist',
                submenu: [{ label: '' }]
            }
        ]

        this.ContextMenu = Menu.buildFromTemplate(this.FileContextMenuTemp);
    }

    fileClick(e) {
        let id = e.currentTarget.getAttribute('fileid');
        let newPlaying = this.props.Library.find((ob) => {
            return ob.ID == id;
        });
        this.props.SetNowPlaying(Object.assign({}, newPlaying));
    }



    render() {
        let playlistSubmenu = [];
        for (let ii = 0; ii < this.props.Playlists.length; ii++) {
            playlistSubmenu.push({
                label: this.props.Playlists[ii].Name,
                id: this.props.Playlists[ii].ID,
                order: this.props.Playlists[ii].Files.length + 1,
                click(e) { AddToPlaylist(e); }
            });
        }

        this.FileContextMenuTemp[0].submenu = playlistSubmenu;
        this.ContextMenu = Menu.buildFromTemplate(this.FileContextMenuTemp);

        var fileElements = [];
        if (this.props.Library.length != 0) {
            let tableHeader = (
                <thead>
                    <tr><th colSpan='4'>{'Library'}</th></tr>
                    <tr>
                        <th>File ID</th>
                        <th>Title</th>
                        <th>Album</th>
                        <th>Artist</th>
                    </tr>
                </thead>
            );

            let rows;

            if (this.props.RecentlyViewed.LastLookedAt == 'Library'
                || this.props.RecentlyViewed.LastLookedAt == null) {
                rows = <tbody>
                    {this.props.Library.map((file, ii) => {
                        return (
                            <tr id={'File' + ii}
                                class="File"
                                fileID={file.ID}
                                onClick={(e) => { this.fileClick(e); }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    contextMenuClickedElement = e.currentTarget
                                    this.ContextMenu.popup(remote.getCurrentWindow());
                                }}
                            >
                                <td>{file.ID}</td>
                                <td>{file.Title}</td>
                                <td>{file.Album}</td>
                                <td>{file.Artist}</td>
                            </tr>
                        );
                    })}
                </tbody>;
            }
            else {
                let ids = [];
                if (this.props.RecentlyViewed.LastLookedAt == 'Playlist') {
                    for (let ii = 0; ii < this.props.Playlists.length; ii++) {
                        if (this.props.RecentlyViewed.Playlist == this.props.Playlists[ii].Name) {
                            ids = this.props.Playlists[ii].Files;
                            break;
                        }
                    }
                }
                else {
                    //for folders
                }
                rows = <tbody>{ids.map((id, ii) => {
                    let file = this.props.Library.find(o => o.ID == id);
                    return (
                        <tr id={'File' + ii}
                            class="File"
                            fileID={file.ID}
                            onClick={(e) => { this.fileClick(e); }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                contextMenuClickedElement = e.currentTarget
                                this.ContextMenu.popup(remote.getCurrentWindow());
                            }}
                        >
                            <td>{file.ID}</td>
                            <td>{file.Title}</td>
                            <td>{file.Album}</td>
                            <td>{file.Artist}</td>
                        </tr>
                    );
                })}</tbody>
            }
            let table = <table id='FileList' cellspacing="0" cellpadding="0">
                {tableHeader}
                {rows}
            </table>

            fileElements.push(table);
            return (
                <div id='FileListBox'>
                    {fileElements}
                </div>
            );

        }
        else
            return <p>Looks like your library is empty</p>;
    }
}

const mapStateToProps = state => {
    return {
        Library: state.Library,
        Playlists: state.Playlists,
        RecentlyViewed: state.RecentlyViewed
    }
}

const mapDispatchToProps = dispatch => {
    return {
        SetNowPlaying: (arg) => dispatch(SetNowPlaying(arg))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileView);