import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { playAudio, pauseAudio, nextTrack, prevTrack, clearPlayer } from '../../../actions/ui_actions';
import { requestTrack } from '../../../actions/track_actions';
import { createLike, deleteLike } from '../../../actions/like_actions';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: null,
      duration: 0,
      currentTime: 0,
      muted: false,
    };
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.setSeek = this.setSeek.bind(this);
    this.setVolume = this.setVolume.bind(this);
  }

  componentDidMount() {
    this.updateInterval = setInterval(this.handleUpdate, 333);
  }

  componentWillReceiveProps(nextProps) {
    const audio = document.getElementById('audio');
    if ( nextProps.currentTrack && ((!audio.src) || !audio.src.includes(nextProps.currentTrack.src))) {
      audio.src = nextProps.currentTrack.src;
      this.setState({ currentTrack: nextProps.currentTrack });
      if(nextProps.isPlaying) audio.play();
    }
    if (nextProps.isPlaying && !this.props.isPlaying) audio.play();
    if (!nextProps.isPlaying && this.props.isPlaying) audio.pause();
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  setSeek(e) {
    if (this.props.currentTrack) {
      const audio = document.getElementById('audio');
      const bounds = e.target.getBoundingClientRect();
      audio.currentTime = (e.clientX - bounds.x)/bounds.width * audio.duration;
    }
  }

  setVolume(e) {
    const audio = document.getElementById('audio');
    const bounds = e.target.getBoundingClientRect();
    audio.volume = (e.clientX - bounds.x)/bounds.width;
  }

  handleUpdate() {
    const audio = document.getElementById('audio');
    this.setState({
      duration: audio.duration || 0,
      currentTime: audio.currentTime || 0,
    });
  }

  handleMute(e) {
    const audio = document.getElementById('audio');
    this.setState({ muted: !this.state.muted});
    audio.muted = !audio.muted;
  }

  handleNext(e) {
    if (this.props.nextTrackId) {
      this.props.next(this.props.nextTrackId);
    } else {
      this.props.clearPlayer();
      this.setState({ currentTrack: null });
    }
  }
  handlePrev(e) {
    const audio = document.getElementById('audio');
    if (this.state.currentTime > 3) {
      audio.currentTime = 0;
    } else if (this.props.prevTrackId) {
      this.props.prev(this.props.prevTrackId);
    } else {
      this.setState({ currentTrack: null });
      this.props.clearPlayer();
    }
  }

  render () {
    const audio = document.getElementById('audio');

    const tm = Math.floor(this.state.currentTime/60);
    const ts = Math.floor(this.state.currentTime%60);
    const time = String( tm+":"+ ((ts > 9) ? ts : "0"+ts) );

    const dm = Math.floor(this.state.duration/60);
    const ds = Math.floor(this.state.duration%60);
    const duration = String( dm+":"+ ((ds > 9) ? ds : "0"+ds) );

    let info = { imgSrc: '', title: '', albumId: '', artist: '', artistId: '' };
    if (this.state.currentTrack) {
      info = {
        imgSrc: this.state.currentTrack.artwork,
        title: this.state.currentTrack.title,
        albumId: this.state.currentTrack.album.id,
        artist: this.state.currentTrack.artist.name,
        artistId: this.state.currentTrack.artist.id,
      };
    }

    let svg;
    if (this.props.isPlaying) {
      svg = (
        <svg viewBox="0 0 300 300" className="rela-block svg play-pause" onClick={this.props.pause}>
          <circle cx="150" cy="150" r="100"/>
          <rect x="107" y="105" width="25" height="90" rx="8" ry="8" />
          <rect x="168" y="105" width="25" height="90" rx="8" ry="8" />
        </svg>
      );
    } else {
      svg = (
        <svg viewBox="0 0 300 300" className="rela-block svg play-pause" onClick={this.props.play}>
          <circle cx="150" cy="150" r="100"/>
          <path d="M 115 105 L 115 195 Q 115 200 121 199 L 203 153
                   Q 205 150 203 147 L 121 102 Q 115 100 115 105 Z"/>
        </svg>
      );
    }

    let volumeSvg;
    if (this.state.muted) {
      volumeSvg = (
        <svg viewBox="0 0 400 400" className="rela-block svg">
          <path d="M 60 135 L 60 245 L 140 245 L 210 295 L 210 85 L 140 135 Z" strokeWidth="20" fill="none" />
          <path d="M 260 160 L 340 240" strokeWidth="20" />
          <path d="M 260 240 L 340 160" strokeWidth="20" />
        </svg>
      );
    } else if (!audio || audio.volume > 0.67) {
      volumeSvg = (
        <svg viewBox="0 0 400 400" className="rela-block svg">
          <path d="M 60 135 L 60 245 L 140 245 L 210 295 L 210 85 L 140 135 Z" strokeWidth="20" fill="none" />
          <path d="M 250 260 Q 310 195 250 130 " strokeWidth="20" fill="none" />
          <path d="M 270 320 Q 420 195 270 70 " strokeWidth="20" fill="none" />
       </svg>
      );
    } else if (audio.volume > 0.33) {
      volumeSvg = (
        <svg viewBox="0 0 400 400" className="rela-block svg">
          <path d="M 60 135 L 60 245 L 140 245 L 210 295 L 210 85 L 140 135 Z" strokeWidth="20" fill="none" />
          <path d="M 260 290 Q 350 195 260 100 " strokeWidth="20" fill="none" />
          <path d="M 260 290 Q 350 195 260 100 " strokeWidth="20" fill="none" />
        </svg>
      );
    } else {
      volumeSvg = (
        <svg viewBox="0 0 400 400" className="rela-block svg">
          <path d="M 60 135 L 60 245 L 140 245 L 210 295 L 210 85 L 140 135 Z" strokeWidth="20" fill="none" />
          <path d="M 250 260 Q 310 195 250 130 " strokeWidth="20" fill="none" />
          <path d="M 250 260 Q 310 195 250 130 " strokeWidth="20" fill="none" />
        </svg>
      );
    }


    let addSvg;
    if(!this.state.currentTrack) {
      addSvg = '';
    } else if (this.props.currentUser.liked_track_ids.includes(this.state.currentTrack.id)) {
      addSvg = (
        <svg viewBox="0 0 200 200" className="rela-block svg"
          onClick={() => {
            this.props.deleteLike({
              user_id: this.props.currentUser.id,
              likeable_id: this.state.currentTrack.id,
              likeable_type: 'Track',
            })
          }}>
          <path d="M 35 90 L 75 130 L 150 55" strokeWidth="15" fill="none" />
        </svg>
      );
    } else {
      addSvg = (
        <svg viewBox="0 0 200 200" className="rela-block svg"
          onClick={() => {
            this.props.createLike({
              user_id: this.props.currentUser.id,
              likeable_id: this.state.currentTrack.id,
              likeable_type: 'Track',
            })
          }}>
          <path d="M 100 50 L 100 150" strokeWidth="15" fill="none" />
          <path d="M 50 100 L 150 100" strokeWidth="15" fill="none" />
        </svg>
      );
    }

    return (
      <div className="audio-player">
        <div className="flex-parent player-controls-container">

          <div className="player-info">
            <div className="rela-inline player-artwork">
              <Link to={`/albums/${info.albumId}`}>
                <img src={info.imgSrc}/>
              </Link>
            </div>
            <div className="rela-inline player-info-text">
              <p>
                <Link className="border" to={`/albums/${info.albumId}`}>
                  {info.title}
                </Link>
              </p>
              <p className="small-text">
                <Link className="border" to={`/artists/${info.artistId}`}>
                  {info.artist}
                </Link>
              </p>
            </div>
            <div className="rela-inline svg-container">
              <div className="rela-inline alt-svg">
                {addSvg}
              </div>
            </div>
          </div>

          <div className="flex player-controls">
            <div className="rela-block control-svg-container">
              <div className="rela-inline svg-container">
                <svg viewBox="0 0 500 500" className="rela-block svg player" onClick={this.handlePrev}>
                  <path d="M 290 205 L 290 295 Q 290 300 284 299 L 197 253
                           Q 195 250 197 247 L 284 202 Q 290 200 290 205 Z" strokeWidth="0"/>
                  <rect x="165" y="205" width="25" height="90" rx="8" ry="8" strokeWidth="0"/>
                </svg>
              </div>
              <div className="rela-inline svg-container play-pause">{svg}</div>
              <div className="rela-inline svg-container">
                <svg viewBox="0 0 500 500" className="rela-block svg player" onClick={this.handleNext}>
                  <path d="M 215 205 L 215 295 Q 215 300 221 299 L 303 253
                           Q 305 250 303 247 L 221 202 Q 215 200 215 205 Z" strokeWidth="0"/>
                  <rect x="310" y="205" width="25" height="90" rx="8" ry="8" strokeWidth="0"/>
                </svg>
              </div>
            </div>
            <div className="flex-parent seek-bar-outer-container">
              <p>{time}</p>
              <div className="flex progress-bar seek-bar-container" onClick={this.setSeek}>
                <div className="outer-bar">
                  <div className="inner-bar" style={{width: `${(this.state.currentTime*100/(this.state.duration || 1))}%`}}></div>
                </div>
              </div>
              <p>{duration}</p>
            </div>
          </div>

          <div className="player-alt-controls">
            <div className="rela-inline svg-container">
              <Link to="/queue" className="rela-inline app-link alt-svg">
                <svg viewBox="0 0 400 400" className="rela-block svg">
                  <path d="M 60 65 L 60 175 Q 60 180 66 179 L 158 123
                           Q 160 120 158 117 L 66 62 Q 60 60 60 65" strokeWidth="0"/>
                  <path d="M 180 120 L 340 120" strokeWidth="20" />
                  <path d="M 60 200 L 340 200" strokeWidth="20" />
                  <path d="M 60 280 L 340 280" strokeWidth="20" />
                </svg>
              </Link>
            </div>
            <div className="rela-inline svg-container">
              <div className="rela-inline alt-svg" onClick={this.handleMute}>
                {volumeSvg}
              </div>
            </div>
            <div className="rela-inline progress-bar volume-bar-container" onClick={this.setVolume}>
              <div className="outer-bar">
                <div className={"inner-bar" + (this.state.muted ? ' disabled' : '')} style={{width: `${audio ? audio.volume*100 : 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        <audio id="audio" onEnded={this.handleNext}></audio>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.entities.users[state.session.currentUserId],
  currentTrack: state.entities.tracks[state.ui.audioPlayer.currentTrackId],
  nextTrackId: state.ui.audioPlayer.queue[state.ui.audioPlayer.queuePos + 1],
  prevTrackId: state.ui.audioPlayer.queue[state.ui.audioPlayer.queuePos - 1],
  isPlaying: state.ui.audioPlayer.isPlaying,
});

const mapDispatchToProps = dispatch => ({
  play: () => dispatch(playAudio()),
  pause: () => dispatch(pauseAudio()),
  clearPlayer: () => dispatch(clearPlayer()),
  createLike: like => dispatch(createLike(like)),
  deleteLike: like => dispatch(deleteLike(like)),
  next: id => {
    dispatch(nextTrack());
    if (id) dispatch(requestTrack(id));
  },
  prev: id => {
    dispatch(prevTrack());
    if (id) dispatch(requestTrack(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
