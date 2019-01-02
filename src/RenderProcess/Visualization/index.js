

import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import MakeBars from './BarsVisual';


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
            MakeBars('audio');
        }
        if (this.props.NowPlaying.Format == 'video') {
            MakeBars('video');
        }
    }

    componentWillUnmount() {
        // d3.selectAll('svg').remove();
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