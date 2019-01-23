import React from 'react';
import { connect } from 'react-redux';
import BarsVisual from './Visualization';
import FileView from './FileView';
import ListView from './ListView';

class Views extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let elements = [];
        if (this.props.CurrentView == 'Bars')
            elements.push(<BarsVisual />);
        else if (this.props.CurrentView == 'Library') {
            elements.push(<ListView />);
            elements.push(<FileView />);
        }

        return elements;
    }
}

const mapPropsToState = state => {
    return {
        CurrentView: state.CurrentView
    }
}

export default connect(mapPropsToState, null)(Views);