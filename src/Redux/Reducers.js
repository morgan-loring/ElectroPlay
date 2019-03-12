import ActionTypes from './ActionTypes';

const initialState = {
    Library: [],
    Folders: [],
    Playlists: [],
    Queue: [],
    History: [],
    CurrentView: 'Library',
    SearchString: '',
    RecentlyViewed: {
        LastLookedAt: 'Library',
        Folder: null,
        Playlist: null
    },
    Settings: {
        Volume: 50,
        Muted: false,
        Repeat: false,
        Shuffle: false,
        PlaybackSpeed: 1
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
            return Object.assign({}, state, {
                Settings: Object.assign({}, state.Settings, { Volume: action.payload })
            });
        case ActionTypes.TOGGLE_MUTE:
            return Object.assign({}, state, {
                Settings: Object.assign({}, state.Settings, { Muted: !state.Settings.Muted })
            });
        case ActionTypes.TOGGLE_REPEAT:
            return Object.assign({}, state, {
                Settings: Object.assign({}, state.Settings, { Repeat: !state.Settings.Repeat })
            });
        case ActionTypes.TOGGLE_SHUFFLE:
            return Object.assign({}, state, {
                Settings: Object.assign({}, state.Settings, { Shuffle: !state.Settings.Shuffle })
            });
        case ActionTypes.SET_PLAYBACK_SPEED:
            return Object.assign({}, state, {
                Settings: Object.assign({}, state.Settings, { PlaybackSpeed: action.payload })
            });
        case ActionTypes.SET_SEARCH_STRING:
            return Object.assign({}, state, { SearchString: action.payload });
        case ActionTypes.SET_THEME:
            return Object.assign({}, state, {
                Settings: Object.assign({}, state.Settings, { Theme: action.payload })
            });
        case ActionTypes.LOAD_SETTINGS:
            let queue = {};
            if (action.payload.Queue != null)
                queue = { Queue: JSON.parse(action.payload.Queue.slice()) };
            return Object.assign({}, state, queue, {
                Settings:
                    Object.assign({}, state.Settings, {
                        Volume: action.payload.Volume,
                        Muted: action.payload.Muted == 1 ? true : false,
                        Repeat: action.payload.Repeat == 1 ? true : false,
                        Shuffle: action.payload.Shuffle == 1 ? true : false,
                        PlaybackSpeed: action.payload.PlaybackSpeed
                    })
            });
        default:
            return state;
    }
}