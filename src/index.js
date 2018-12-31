import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from './Redux/Store';
import ElectroPlay from './RenderProcess';


ReactDOM.render(
    <Provider store={Store}>
        <ElectroPlay />
    </Provider>,
    document.getElementById('app')
);