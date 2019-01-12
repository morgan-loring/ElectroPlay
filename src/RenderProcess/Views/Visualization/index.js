

import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { makeBars } from './BarsVisual';

import './style.css';

class BarsVisual extends React.Component {
    constructor() {
        super();

        this.state = {
            shouldRebuild: false
        }

        this.CreateVisual = this.CreateVisual.bind(this);
    }

    componentDidMount() {
        this.CreateVisual();
    }

    componentWillUnmount() {
        d3.select(window).on('resize', null);
    }

    shouldComponentUpdate(newProps, newState) {
        if (this.props.NowPlaying.Format !== newProps.NowPlaying.Format) {
            d3.selectAll('svg').remove();
            this.setState({ shouldRebuild: true });
            return true;
        }
        else if (newState.shouldRebuild) {
            this.setState({ shouldRebuild: false });
            this.CreateVisual();
            return true;
        }

        return false;
    }

    CreateVisual() {
        if (this.props.NowPlaying.Format == 'audio') {
            makeBars('audio');
        }
        if (this.props.NowPlaying.Format == 'video') {
            makeBars('video');
        }
    }

    render() {
        return <div id="VisualBox"></div>
    }
}

const mapPropsToState = state => {
    return {
        NowPlaying: state.NowPlaying
    }
}

export default connect(mapPropsToState, null)(BarsVisual);