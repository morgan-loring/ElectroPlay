import React from 'react';
import { connect } from 'react-redux';
import { SetCurrentView, SetRecentlyViewedPlaylist } from '../../Redux/Actions';

class ListView extends React.Component {
    constructor(props) {
        super(props);

        this.LibraryClick = this.LibraryClick.bind(this);
        this.PlaylistsClick = this.PlaylistsClick.bind(this);
        this.FoldersClick = this.FoldersClick.bind(this);
        this.PlayListItemClick = this.PlayListItemClick.bind(this);
        this.state = {
            Showing: 'Library'
        }
    }

    LibraryClick() {
        this.props.SetCurrentView('Library');
    }

    PlaylistsClick() {
        this.setState({ Showing: 'Playlist' });
    }

    FoldersClick() {
    }

    PlayListItemClick(e) {
        let id = e.currentTarget.getAttribute('PlaylistID');
        for (let ii = 0; ii < this.props.Playlists.length; ii++) {
            if(this.props.Playlists[ii].ID == id) this.props.SetRecentlyViewedPlaylist(this.props.Playlists[ii].Name);
        }
    }

    render() {
        let list = null;
        if (this.state.Showing == 'Playlist') {
            list = this.props.Playlists.map((ele, index) => {
                return (
                    <div PlayListID={ele.ID} onClick={(e) => { this.PlayListItemClick(e); }}>{ele.Name}</div>
                )
            });
        }
        else if (this.state.Showing == 'Folder') {

        }
        
        return (<div id="ListViewBox">
            <div id="ListButtonBox">
                <button id="LibraryButton" onClick={this.LibraryClick}>Library</button>
                <button id="PlaylistsButton" onClick={this.PlaylistsClick}>Playlists</button>
                <button id="FoldersButton" onClick={this.FoldersClick}>Folders</button>
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
        SetRecentlyViewedPlaylist: (arg) => dispatch(SetRecentlyViewedPlaylist(arg))
    }
}

export default connect(MapPropsToState, MapPropsToDispatch)(ListView);