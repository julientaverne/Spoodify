import React from 'react';
import { connect } from 'react-redux';
import { requestTracks } from '../../../actions/track_actions';
import { openModal, setModalComponent, setModalProps } from '../../../actions/ui_actions';
import TrackIndexItem from './track_index_item';

const arrayEq = (a1, a2) => {
  return ( a1.length === a2.length && a1.every((val, idx) => val === a2[idx]) );
};

class TrackIndex extends React.Component {
  componentDidMount() {
    this.props.requestTracks(this.props.trackIds);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.trackIds && !arrayEq(this.props.trackIds,nextProps.trackIds)) {
      this.props.requestTracks(nextProps.trackIds);
    }
  }

  render () {
    const tracks = this.props.tracks.map(track => (
      <TrackIndexItem
        key={track.id} track={track}
        openModal={this.props.openModal}
        setModalComponent={this.props.setModalComponent}
        setModalProps={this.props.setModalProps} />
    ));
    return (
      <div className="track-index">
        <ul>
          {tracks}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tracks: Object.values(state.entities.tracks),
});

const mapDispatchToProps = dispatch => ({
  requestTracks: (ids) => dispatch(requestTracks(ids)),
  openModal: () => dispatch(openModal()),
  setModalComponent: comp => dispatch(setModalComponent(comp)),
  setModalProps: props => dispatch(setModalProps(props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackIndex);
