

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
        if (newProps.Queue.length > 0 &&
            this.props.Library.find(o => o.ID == this.props.Queue[0]).Format !== newProps.Library.find(o => o.ID == newProps.Queue[0]).Format) {
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
        if (this.props.Queue.length > 0) {
            if (this.props.Library.find(o => o.ID == this.props.Queue[0]).Format == 'audio') {
                makeBars('audio');
            }
            if (this.props.Library.find(o => o.ID == this.props.Queue[0]).Format == 'video') {
                makeBars('video');
            }
        }
    }

    render() {
        return <div id="VisualBox"></div>
    }
}

const mapPropsToState = state => {
    return {
        Queue: state.Queue,
        Library: state.Library
    }
}

export default connect(mapPropsToState, null)(BarsVisual);