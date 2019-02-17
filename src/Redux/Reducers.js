import ActionTypes from './ActionTypes';

const initialState = {
    Library: [],
    Folders: [],
    Playlists: [],
    Queue: [],
    History: [],
    CurrentView: 'Library',
    RecentlyViewed: {
        LastLookedAt: 'Library',
        Folder: null,
        Playlist: null
    },
    Settings: {
        Volume: 50,
        Muted: false
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
        case ActionTypes.SET_RECENTLY_VIEWED_FOLDER:
            return Object.assign({}, state, {
                RecentlyViewed: { Folder: action.payload, LastLookedAt: 'Folder' }
            });
        case ActionTypes.SET_QUEUE:
            return Object.assign({}, state, { Queue: action.payload });
        case ActionTypes.SET_HISTORY:
            return Object.assign({}, state, { History: action.payload });
        case ActionTypes.SET_DRAGGED_FILE:
            return Object.assign({}, state, { DraggedFile: action.payload });
        case ActionTypes.SET_VOLUME:
            return Object.assign({}, state, { Settings: { Volume: action.payload } });
        case ActionTypes.TOGGLE_MUTE:
            let val = !state.Settings.Muted;
            return Object.assign({}, state, {
                Settings: Object.assign({}, state.Settings, { Muted: val })
            });
        default:
            return state;
    }
}