import React from 'react';
import { connect } from 'react-redux';
import BarsVisual from '../Visualization';

class Views extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        if (this.props.CurrentView == 'Bars')
            return <BarsVisual />;
        else
            return null;
    }
}

const mapPropsToState = state => {
    return {
        CurrentView: state.CurrentView
    }
}

export default connect(mapPropsToState, null)(Views);