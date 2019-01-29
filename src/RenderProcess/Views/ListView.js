import React from 'react';
import { connect } from 'react-redux';
import { remote, ipcMain } from 'electron';
import { SetCurrentView, SetRecentlyViewedPlaylist, SetLastLookedAt } from '../../Redux/Actions';
import './ListView.css';

const ipc = require('electron').ipcRenderer;

class ListView extends React.Component {
    constructor(props) {
        super(props);

        this.LibraryClick = this.LibraryClick.bind(this);
        this.PlaylistsClick = this.PlaylistsClick.bind(this);
        this.FoldersClick = this.FoldersClick.bind(this);
        this.PlayListItemClick = this.PlayListItemClick.bind(this);
        this.DeletePlaylist = this.DeletePlaylist.bind(this);
        this.AddCollection = this.AddCollection.bind(this);
        this.state = { Showing: 'Library' }
    }

    LibraryClick() {
        this.setState({ Showing: 'Library' });
        this.props.SetLastLookedAt('Library');
        // this.props.SetCurrentView('Library');
    }

    PlaylistsClick() {
        this.setState({ Showing: 'Playlist' });
    }

    FoldersClick() {
    }

    PlayListItemClick(e) {
        let id = e.currentTarget.getAttribute('PlaylistID');
        for (let ii = 0; ii < this.props.Playlists.length; ii++) {
            if (this.props.Playlists[ii].ID == id) this.props.SetRecentlyViewedPlaylist(this.props.Playlists[ii].Name);
        }
    }

    AddCollection(e) {
        ipc.send('ShowAddCollectionWin', this.state.Showing);
    }

    DeletePlaylist(id, e) {
        let callback = (choice) => {
            this.props.SetRecentlyViewedPlaylist(null);
            this.props.SetLastLookedAt('Library');
            if (choice == 0) {
                ipc.send('DeletePlaylist', id);
            }
        };

        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            title: 'Delete a Playlist...?',
            buttons: ['Yes', 'No'],
            message: 'Are you sure you want to delete the this playlist?'
        }, callback);
    }

    render() {
        let list = [];

        if (this.state.Showing == 'Playlist') {
            list.push(this.props.Playlists.map((ele, index) => {
                return (
                    <div PlayListID={ele.ID} class='ListItem' onClick={(e) => { this.PlayListItemClick(e); }}>
                        {ele.Name}
                        <button class='DeleteButton' onClick={(e) => { this.DeletePlaylist(ele.ID, e); }}>X</button>
                    </div>
                )
            }));
        }
        else if (this.state.Showing == 'Folder') {

        }

        if (this.state.Showing != 'Library')
            list.push(<div id="AddButton"><button onClick={(e) => { this.AddCollection(e) }}>New</button></div>);

        return (<div id="ListViewBox">
            <div id="ListButtonBox">
                <button id="LibraryButton" class="ListButton" onClick={this.LibraryClick}>Library</button>
                <button id="PlaylistsButton" class="ListButton" onClick={this.PlaylistsClick}>Playlists</button>
                <button id="FoldersButton" class="ListButton" onClick={this.FoldersClick}>Folders</button>
            </div>
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
        RecentlyViewed: state.RecentlyViewed
    };
}

const MapPropsToDispatch = (dispatch) => {
    return {
        SetCurrentView: (arg) => dispatch(SetCurrentView(arg)),
        SetRecentlyViewedPlaylist: (arg) => dispatch(SetRecentlyViewedPlaylist(arg)),
        SetLastLookedAt: (arg) => dispatch(SetLastLookedAt(arg)),
    }
}

export default connect(MapPropsToState, MapPropsToDispatch)(ListView);