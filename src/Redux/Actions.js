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