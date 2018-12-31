import ActionTypes from './ActionTypes';

export function SetLibrary(arg) {
    return {
        type: ActionTypes.SET_LIBRARY,
        payload: arg
    }
}