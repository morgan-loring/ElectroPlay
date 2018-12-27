

import React from 'react';
import MakeBars from './BarsVisual';


export default class BarsVisual extends React.Component {
    constructor() {
        super();

    }

    componentDidMount() {
        MakeBars();
    }

    render() {
        return <div id="VisualBox"></div>
    }
}