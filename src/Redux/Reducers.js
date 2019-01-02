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
    CurrentView: 'asdf'
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_LIBRARY:
            return Object.assign({}, state, {
                Library: action.payload
            });
        case ActionTypes.SET_NOW_PLAYING:{
            return Object.assign({}, state, {
                NowPlaying: action.payload
            });}
        case ActionTypes.SET_CURRENT_VIEW:
            return Object.assign({}, state, {
                CurrentView: action.payload
            });
        default:
            return state;
    }
}