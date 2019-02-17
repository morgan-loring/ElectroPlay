import ActionTypes from './ActionTypes';

export function SetLibrary(arg) {
    return {
        type: ActionTypes.SET_LIBRARY,
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

export function SetQueue(arg) {
    return {
        type: ActionTypes.SET_QUEUE,
        payload: arg
    }
}

export function SetHistory(arg) {
    return {
        type: ActionTypes.SET_HISTORY,
        payload: arg
    }
}

export function SetDraggedFile(arg) {
    return {
        type: ActionTypes.SET_DRAGGED_FILE,
        payload: arg
    }
}

export function SetVolume(arg) {
    return {
        type: ActionTypes.SET_VOLUME,
        payload: arg
    }
}

export function ToggleMute() {
    return {
        type: ActionTypes.TOGGLE_MUTE,
        payload: null
    }
}