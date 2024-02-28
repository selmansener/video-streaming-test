import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
} from 'media-chrome/dist/react';

import Hls from 'hls.js';

import { useEffect, useRef } from 'react';

function App() {
  const videoElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {

    if (videoElement) {
      const videoSrc = "videos/output.m3u8";
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoElement.current as any);
      }
    }

  }, []);

  return (
    <div style={{ width: '100%' }}>
      <MediaController style={{ width: '100%' }}>
        <video
          width='100%'
          slot="media"
          //src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
          preload="auto"
          muted
          crossOrigin=""
          ref={videoElement}
        />
        <MediaControlBar>
          <MediaPlayButton></MediaPlayButton>
          <MediaSeekBackwardButton></MediaSeekBackwardButton>
          <MediaSeekForwardButton></MediaSeekForwardButton>
          <MediaTimeRange></MediaTimeRange>
          <MediaTimeDisplay showDuration></MediaTimeDisplay>
          <MediaMuteButton></MediaMuteButton>
          <MediaVolumeRange></MediaVolumeRange>
        </MediaControlBar>
      </MediaController>
    </div>
  );
}

export default App;
