import ActionTypes from './ActionTypes';

const initialState = {
    NowPlaying: {
        ID: -1,
        Path: null
    },
    Library: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_LIBRARY:
            return Object.assign({}, state, { 
                Library: action.payload 
            });
        default:
            return state;
    }
}