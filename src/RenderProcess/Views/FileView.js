import React from 'react';
import { connect } from 'react-redux';
import { SetNowPlaying } from '../../Redux/Actions';

class FileView extends React.Component {
    constructor(props) {
        super(props);

        this.fileClick = this.fileClick.bind(this);
    }

    fileClick(e) {
        let id = e.currentTarget.getAttribute('fileid');
        let newPlaying = this.props.Library.find((ob) => {
            return ob.ID == id;
        });
        this.props.SetNowPlaying(Object.assign({}, newPlaying));
    }

    render() {
        var fileElements = [];
        if (this.props.Library.length != 0) {
            if (this.props.ActiveList == 'Library') {
                for (let ii = 0; ii < this.props.Library.length; ii++) {
                    let ele = (<div id={'file' + ii}
                        fileID={this.props.Library[ii].ID}
                        onClick={(e) => { this.fileClick(e); }}>
                        {this.props.Library[ii].Title}
                    </div>);
                    fileElements.push(ele);
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

const mapDispatchToProps = dispatch => {
    return {
        SetNowPlaying: (arg) => dispatch(SetNowPlaying(arg))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileView);