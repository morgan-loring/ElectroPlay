import React from 'react';
import { connect } from 'react-redux';
import { SetQueue } from '../../Redux/Actions';
import { QueueEnqueue } from '../Helpers/Queue';
import store from '../../Redux/Store';
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
    });
}

function RemoveFileFromPlaylist(e) {
    ipc.send('RemoveFileFromPlaylist', {
        NameID: e.id,
        SongID: contextMenuClickedElement.getAttribute('fileid')
    });
}

function AddToFolder(e) {
    ipc.send('AddFileToFolder', {
        NameID: e.id,
        Order: e.order,
        SongID: contextMenuClickedElement.getAttribute('fileid')
    });
}

function RemoveFileFromFolder(e) {
    ipc.send('RemoveFileFromFolder', {
        NameID: e.id,
        SongID: contextMenuClickedElement.getAttribute('fileid')
    });
}

function AddToQueue(e) {
    let state = store.getState();
    let ob, id = contextMenuClickedElement.getAttribute('fileid'),
        library = state.Library.slice(),
        queue = state.Queue.slice();
    for (let ii = 0; ii < library.length; ii++) {
        if (id == library[ii].ID) {
            ob = library.slice(ii, ii + 1);
            break;
        }
    }
    if (ob != undefined) {
        store.dispatch(SetQueue(QueueEnqueue(queue, ob[0])));
    }
}

function RemoveFromQueue(e) {
    let state = store.getState();
    let index = contextMenuClickedElement.getAttribute('index');
    let newQueue = state.Queue.slice();

    newQueue.splice(index, index + 1);

    store.dispatch(SetQueue(newQueue));
}

class FileView extends React.Component {
    constructor(props) {
        super(props);

        // this.fileClick = this.fileClick.bind(this);
        this.ContextMenu = Menu.buildFromTemplate([]);
    }

    render() {
        let fileContextMenuTemp = [];

        let playlistSubmenu = [];
        for (let ii = 0; ii < this.props.Playlists.length; ii++) {
            playlistSubmenu.push({
                label: this.props.Playlists[ii].Name,
                id: this.props.Playlists[ii].ID,
                order: this.props.Playlists[ii].Files.length + 1,
                click(e) { AddToPlaylist(e); }
            });
        }

        let folderSubmenu = [];
        for (let ii = 0; ii < this.props.Folders.length; ii++) {
            folderSubmenu.push({
                label: this.props.Folders[ii].Name,
                id: this.props.Folders[ii].ID,
                order: this.props.Folders[ii].Files.length + 1,
                click(e) { AddToFolder(e); }
            });
        }

        let addFileToQueue = {
            label: 'Add to Queue',
            click(e) { AddToQueue(e); }
        }

        let removeFileFromQueue = {
            label: 'Remove from Queue',
            click(e) { RemoveFromQueue(e); }
        }

        let addFilePlaylistItem = {
            label: 'Add File to Playlist',
            submenu: playlistSubmenu
        };

        let addFileFolderItem = {
            label: 'Add File to Folder',
            submenu: folderSubmenu
        };

        if (this.props.RecentlyViewed.LastLookedAt == 'Queue')
            fileContextMenuTemp.push(removeFileFromQueue);
        else
            fileContextMenuTemp.push(addFileToQueue);
        fileContextMenuTemp.push(addFilePlaylistItem);
        fileContextMenuTemp.push(addFileFolderItem);

        var fileElements = [];
        if (this.props.Library.length != 0) {
            let topRow;
            if (this.props.RecentlyViewed.LastLookedAt == 'Playlist')
                topRow = this.props.RecentlyViewed.Playlist;
            else if (this.props.RecentlyViewed.LastLookedAt == 'Folder')
                topRow = this.props.RecentlyViewed.Folder;
            else
                topRow = 'Library';

            let tableHeader = (
                <thead>
                    <tr><th colSpan='4'>{topRow}</th></tr>
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
                || this.props.RecentlyViewed.LastLookedAt == 'Queue'
                || this.props.RecentlyViewed.LastLookedAt == null) {
                let mapFunc = (file, ii) => {
                    return (
                        <tr id={'File' + ii}
                            index={ii}
                            class="File"
                            fileID={file.ID}
                            // onClick={(e) => { this.fileClick(e); }}
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
                };
                let data;
                if (this.props.RecentlyViewed.LastLookedAt == 'Library')
                    data = this.props.Library.map(mapFunc);
                else
                    data = this.props.Queue.map(mapFunc);
                rows = <tbody>
                    {data}
                </tbody>;
            }
            else {
                let collection = [];
                if (this.props.RecentlyViewed.LastLookedAt == 'Playlist' &&
                    this.props.RecentlyViewed.Playlist != null) {
                    let removeFilePlaylistItem = {
                        label: 'Remove File from Playlist',
                        id: this.props.Playlists.find(o => { if (o.Name == this.props.RecentlyViewed.Playlist) return o; }).ID,
                        click(e) { RemoveFileFromPlaylist(e); }
                    };
                    fileContextMenuTemp.push(removeFilePlaylistItem);

                    for (let ii = 0; ii < this.props.Playlists.length; ii++) {
                        if (this.props.RecentlyViewed.Playlist == this.props.Playlists[ii].Name) {
                            collection = this.props.Playlists[ii].Files;
                            break;
                        }
                    }
                }
                else if (this.props.RecentlyViewed.LastLookedAt == 'Folder' &&
                    this.props.RecentlyViewed.Folder != null) {
                    let removeFileFolderItem = {
                        label: 'Remove File from Folder',
                        id: this.props.Folders.find(o => { if (o.Name == this.props.RecentlyViewed.Folder) return o; }).ID,
                        click(e) { RemoveFileFromFolder(e); }
                    };
                    fileContextMenuTemp.push(removeFileFolderItem);

                    for (let ii = 0; ii < this.props.Folders.length; ii++) {
                        if (this.props.RecentlyViewed.Folder == this.props.Folders[ii].Name) {
                            collection = this.props.Folders[ii].Files;
                            break;
                        }
                    }
                }
                else if (this.props.RecentlyViewed.LastLookedAt == 'Queue') {
                    // let removeFileFolderItem = {
                    //     label: 'Remove File from Folder',
                    //     id: this.props.Folders.find(o => { if (o.Name == this.props.RecentlyViewed.Folder) return o; }).ID,
                    //     click(e) { RemoveFileFromFolder(e); }
                    // };
                    // fileContextMenuTemp.push(removeFileFolderItem);

                    collection = this.props.Queue;
                }
                else {
                    <div>An error occurred...</div>
                }
                rows = <tbody>{collection.map((song, ii) => {
                    let file = this.props.Library.find(o => o.ID == song.SongID);
                    return (
                        <tr id={'File' + ii}
                            class="File"
                            fileID={file.ID}
                            // onClick={(e) => { this.fileClick(e); }}
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

            this.ContextMenu = Menu.buildFromTemplate(fileContextMenuTemp);

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
        Folders: state.Folders,
        Queue: state.Queue,
        RecentlyViewed: state.RecentlyViewed
    }
}

const mapDispatchToProps = dispatch => {
    return {
        SetQueue: (arg) => dispatch(SetQueue(arg))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileView);