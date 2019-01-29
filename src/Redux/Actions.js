import ActionTypes from './ActionTypes';

export function SetLibrary(arg) {
    return {
        type: ActionTypes.SET_LIBRARY,
        payload: arg
    }
}

export function SetNowPlaying(arg) {
    return {
        type: ActionTypes.SET_NOW_PLAYING,
        payload: arg
    }
}

export function SetCurrentView(arg) {
    return {
        type: ActionTypes.SET_CURRENT_VIEW,
        payload: arg
    }
}

export function SetFolders(arg) {
    return {
        type: ActionTypes.SET_FOLDERS,
        payload: arg
    }
}

export function SetPlaylists(arg) {
    return {
        type: ActionTypes.SET_PLAYLISTS,
        payload: arg
    }
}

export function SetLastLookedAt(arg) {
    return {
        type: ActionTypes.SET_LAST_LOOKED_AT,
        payload: arg
    }
}

export function SetRecentlyViewedPlaylist(arg) {
    return {
        type: ActionTypes.SET_RECENTLY_VIEWED_PLAYLIST,
        payload: arg
    }
}

export function SetRecentlyViewedFolder(arg) {
    return {
        type: ActionTypes.SET_RECENTLY_VIEWED_FOLDER,
        payload: arg
    }
}