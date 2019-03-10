import React from 'react';
import { connect } from 'react-redux';
import { remote, ipcMain } from 'electron';
import store from '../../Redux/Store';
import {
    SetCurrentView, SetRecentlyViewedPlaylist,
    SetRecentlyViewedFolder, SetLastLookedAt, SetQueue,
    SetSearchString
} from '../../Redux/Actions';
import './ListView.css';

const ipc = require('electron').ipcRenderer;
const { Menu } = remote;

let contextMenuClickedElement = null;

function AddCollectionToQueue(e) {
    let collectionID = contextMenuClickedElement.getAttribute('PlaylistID');
    let collectionType = 'Playlists';
    if (collectionID == null) {
        collectionID = contextMenuClickedElement.getAttribute('FolderID');
        collectionType = 'Folders';
    }

    let state = store.getState();
    let newQueue = [];

    for (let ii = 0; ii < state[collectionType].length; ii++) {
        if (state[collectionType][ii].ID == collectionID) {
            for (let jj = 0; jj < state[collectionType][ii].Files.length; jj++) {
                for (let kk = 0; kk < state.Library.length; kk++) {
                    if (state[collectionType][ii].Files[jj].SongID == state.Library[kk].ID) {
                        // newQueue.push(state.Library.slice(kk, kk + 1)[0]);
                        newQueue.push(state.Library[kk].ID);
                    }
                }
            }
            break;
        }
    }

    store.dispatch(SetQueue(newQueue));
}

class ListView extends React.Component {
    constructor(props) {
        super(props);

        this.AddCollection = this.AddCollection.bind(this);

        this.PlayListItemClick = this.PlayListItemClick.bind(this);
        this.DeletePlaylist = this.DeletePlaylist.bind(this);

        this.FolderItemClick = this.FolderItemClick.bind(this);
        this.DeleteFolder = this.DeleteFolder.bind(this);

        this.SelectionMade = this.SelectionMade.bind(this);

        this.DragOver = this.DragOver.bind(this);
        this.Drop = this.Drop.bind(this);

        this.SearchUpdate = this.SearchUpdate.bind(this);

        this.menu = null;

        this.state = { Showing: 'Library' }
    }

    PlayListItemClick(e) {
        let id = e.currentTarget.getAttribute('PlaylistID');
        for (let ii = 0; ii < this.props.Playlists.length; ii++) {
            if (this.props.Playlists[ii].ID == id) this.props.SetRecentlyViewedPlaylist(this.props.Playlists[ii].Name);
        }
    }

    FolderItemClick(e) {
        let id = e.currentTarget.getAttribute('FolderID');
        for (let ii = 0; ii < this.props.Folders.length; ii++) {
            if (this.props.Folders[ii].ID == id) this.props.SetRecentlyViewedFolder(this.props.Folders[ii].Name);
        }
    }

    AddCollection(e) {
        ipc.send('ShowAddCollectionWin', this.state.Showing);
    }

    DeletePlaylist(id, e) {
        let callback = (choice) => {
            if (choice == 0) {
                this.props.SetRecentlyViewedPlaylist(null);
                this.props.SetLastLookedAt('Library');
                ipc.send('DeletePlaylist', id);
            }
        };

        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            title: 'Delete a Playlist...?',
            buttons: ['Yes', 'No'],
            message: 'Are you sure you want to delete the this playlist?'
        }, callback);
    }

    DeleteFolder(id, e) {
        let callback = (choice) => {
            if (choice == 0) {
                this.props.SetRecentlyViewedFolder(null);
                this.props.SetLastLookedAt('Library');
                ipc.send('DeleteFolder', id);
            }
        };

        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            title: 'Delete a Folder...?',
            buttons: ['Yes', 'No'],
            message: 'Are you sure you want to delete the this folder?'
        }, callback);
    }

    SelectionMade(e) {
        switch (e.target.value) {
            case 'Library':
                this.setState({ Showing: 'Library' });
                this.props.SetLastLookedAt('Library');
                break;
            case 'Playlists':
                this.setState({ Showing: 'Playlist' });
                break;
            case 'Folders':
                this.setState({ Showing: 'Folder' });
                break;
            case 'Queue':
                this.setState({ Showing: 'Queue' });
                this.props.SetLastLookedAt('Queue');
                break;
        }
    }

    DragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    Drop(e) {
        e.preventDefault();
        e.stopPropagation();

        let command = 'AddFileToPlaylist';

        let id = e.currentTarget.getAttribute("playlistid");
        if (id == null) {
            id = e.currentTarget.getAttribute("folderid");
            command = 'AddFileToFolder';
        }
        let order = e.currentTarget.getAttribute("Order");
        let songId = this.props.DraggedFile.getAttribute("fileid");


        ipc.send(command, {
            NameID: id,
            Order: order,
            SongID: songId
        });
    }

    SearchUpdate(e) {
        this.props.SetSearchString(e.currentTarget.value);
    }

    render() {
        let list = [];

        let menuTemp = [];

        menuTemp.push({
            label: 'Add to Queue',
            click(e) { AddCollectionToQueue(e) }
        });

        this.menu = Menu.buildFromTemplate(menuTemp);

        if (this.state.Showing == 'Playlist') {
            list.push(this.props.Playlists.map((ele, index) => {
                return (
                    <div PlaylistID={ele.ID}
                        Order={Math.max.apply(Math, this.props.Playlists[index].Files.map((o) => { return o.Order })) + 1}
                        class='ListItem'
                        onContextMenu={(e) => {
                            e.preventDefault();
                            contextMenuClickedElement = e.currentTarget
                            this.menu.popup(remote.getCurrentWindow());
                        }}
                        onClick={(e) => { this.PlayListItemClick(e); }}
                        onDragOver={(e) => { this.DragOver(e); }}
                        onDrop={(e) => { this.Drop(e); }}
                    >
                        {ele.Name}
                        <button class='DeleteButton' onClick={(e) => { this.DeletePlaylist(ele.ID, e); }}>X</button >
                    </div >
                )
            }));
        }
        else if (this.state.Showing == 'Folder') {
            list.push(this.props.Folders.map((ele, index) => {
                return (
                    <div FolderID={ele.ID}
                        Order={Math.max.apply(Math, this.props.Folders[index].Files.map((o) => { return o.Order })) + 1}
                        class='ListItem'
                        onContextMenu={(e) => {
                            e.preventDefault();
                            contextMenuClickedElement = e.currentTarget
                            this.menu.popup(remote.getCurrentWindow());
                        }}
                        onClick={(e) => { this.FolderItemClick(e); }}
                        onDragOver={(e) => { this.DragOver(e); }}
                        onDrop={(e) => { this.Drop(e); }}
                    >
                        {ele.Name}
                        <button class='DeleteButton' onClick={(e) => { this.DeleteFolder(ele.ID, e); }}>X</button>
                    </div>
                )
            }));
        }

        if (this.state.Showing == 'Folder' || this.state.Showing == 'Playlist')
            list.push(<div id="AddButton"><button onClick={(e) => { this.AddCollection(e) }}>New</button></div>);
        return (<div id="ListViewBox">
            <input id='SearchBox' placeholder='Search...' type='text' onChange={(e) => { this.SearchUpdate(e) }}></input>
            <select id='ListSelect' onChange={(e) => { this.SelectionMade(e) }}>
                <option value='Library'>Library</option>
                <option value='Playlists'>Playlists</option>
                <option value='Folders'>Folders</option>
                <option value='Queue'>Queue</option>
            </select>
            <div id="ListCollectionBox">
                {list}
            </div>
        </div>);
    }
}

const MapPropsToState = (state) => {
    return {
        Playlists: state.Playlists,
        Folders: state.Folders,
        RecentlyViewed: state.RecentlyViewed,
        DraggedFile: state.DraggedFile
    };
}

const MapPropsToDispatch = (dispatch) => {
    return {
        SetCurrentView: (arg) => dispatch(SetCurrentView(arg)),
        SetRecentlyViewedPlaylist: (arg) => dispatch(SetRecentlyViewedPlaylist(arg)),
        SetRecentlyViewedFolder: (arg) => dispatch(SetRecentlyViewedFolder(arg)),
        SetLastLookedAt: (arg) => dispatch(SetLastLookedAt(arg)),
        SetSearchString: (arg) => dispatch(SetSearchString(arg))
    }
}

export default connect(MapPropsToState, MapPropsToDispatch)(ListView);