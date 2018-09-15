import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { openModal } from '../../actions/ui_actions';

const BrowseNav = (props) => {
  return (
    <div className="rela-block content-nav">
      <ul className="content-nav-list">
        <li className="rela-inline">
          <Link to="/browse/artists"
            className={"rela-block app-link" + ((props.match.params.section === 'artists') ? ' active' : '')}>
            Artists
          </Link>
        </li>
        <li className="rela-inline">
          <Link to="/browse/albums"
            className={"rela-block app-link" + ((props.match.params.section === 'albums') ? ' active' : '')}>
            Albums
          </Link>
        </li>
        <li className="rela-inline">
          <Link to="/browse/tracks"
            className={"rela-block app-link" + ((props.match.params.section === 'tracks') ? ' active' : '')}>
            Tracks
          </Link>
        </li>
        <li className="rela-inline">
          <Link to="/browse/playlists"
            className={"rela-block app-link" + ((props.match.params.section === 'playlists') ? ' active' : '')}>
            Playlists
          </Link>
        </li>
      </ul>
      <div className="rela-block open-modal-button">
        <button className="button slim resizing" onClick={props.openModal}>New Playlist</button>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  openModal: () => dispatch(openModal()),
})

export default connect(null,mapDispatchToProps)(BrowseNav);
