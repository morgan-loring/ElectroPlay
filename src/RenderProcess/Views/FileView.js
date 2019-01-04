import React from 'react';
import { connect } from 'react-redux';

class FileView extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        var fileElements = [];
        if (this.props.Library.length != 0) {
            if (this.props.ActiveList == 'Library') {
                for (let ii = 0; ii < this.props.Library.length; ii++) {
                    fileElements.push(<div id={'file' + ii}>{this.props.Library[ii].Title}</div>);
                }
            }
            else {
                //write code for listing playlist and folder files
            }
            return (
                <div id='FileListBox'>
                    {fileElements}
                </div>
            );
        }
        else
            return <div>Looks like your library is empty</div>;
    }
}

const mapStateToProps = state => {
    return {
        Library: state.Library,
        ActiveList: state.ActiveList
    }
}

export default connect(mapStateToProps, null)(FileView);