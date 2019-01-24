import ActionTypes from './ActionTypes';

const initialState = {
    NowPlaying: {
        ID: -1,
        Path: null,
        Title: null,
        Artist: null,
        Album: null,
        Format: null
    },
    Library: [],
    Folders: [],
    Playlists: [],
    CurrentView: 'Library',
    RecentlyViewed: {
        LastLookedAt: 'Library',
        Folder: null,
        Playlist: null
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_LIBRARY:
            return Object.assign({}, state, {
                Library: action.payload
            });
        case ActionTypes.SET_FOLDERS:
            return Object.assign({}, state, {
                Folders: action.payload
            });
        case ActionTypes.SET_PLAYLISTS:
            return Object.assign({}, state, {
                Playlists: action.payload
            });
        case ActionTypes.SET_NOW_PLAYING: {
            return Object.assign({}, state, {
                NowPlaying: action.payload
            });
        }
        case ActionTypes.SET_CURRENT_VIEW:
            return Object.assign({}, state, {
                CurrentView: action.payload
            });
        case ActionTypes.SET_LAST_LOOKED_AT:
            return Object.assign({}, state, {
                RecentlyViewed: { LastLookedAt: action.payload }
            });
        case ActionTypes.SET_RECENTLY_VIEWED_PLAYLIST:
            return Object.assign({}, state, {
                RecentlyViewed: { Playlist: action.payload, LastLookedAt: 'Playlist' }
            });
        default:
            return state;
    }
}