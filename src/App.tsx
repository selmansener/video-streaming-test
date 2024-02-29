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
  MediaLoadingIndicator,
  MediaPlaybackRateButton,
  MediaFullscreenButton,
} from 'media-chrome/dist/react';

import Hls from 'hls.js';

import { SyntheticEvent, useEffect, useRef, useState } from 'react';

function App() {
  const videoElement = useRef<HTMLVideoElement>(null);
  const [isBusy, setIsBusy] = useState<Boolean>(false);

  useEffect(() => {

    fetch("https://localhost:7016/main/getlastsavepoint")
      .then((response) => {
        console.log("resp:",)

        response.json().then(lastSavePoint => {
          if (videoElement) {
            console.log("lastSavePoint.LastTimestamp", lastSavePoint.lastTimestamp);
            const videoSrc = "videos/output.m3u8";
            if (Hls.isSupported()) {
              var hls = new Hls({
                startPosition: lastSavePoint.lastTimestamp
              });
              hls.loadSource(videoSrc);
              hls.attachMedia(videoElement.current as any);
            }
          }
        })
      })
      .catch((e) => console.log(e));

  }, []);

  const onTimeUpdate = (e: SyntheticEvent) => {
    const eventTarget = e.target as HTMLVideoElement;
    if (Math.floor(eventTarget.currentTime) % 5 == 0) {
      if (!isBusy && eventTarget.currentTime > 5) {
        setIsBusy(true);

        fetch("https://localhost:7016/main/savepoint", {
          body: JSON.stringify({
            "LastTimestamp": eventTarget.currentTime
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
        }).then(() => {
          setIsBusy(false);
        }).catch((e) => {
          console.log(e);
          setIsBusy(false);
        })
      }

    }
  }

  return (
    <div style={{ width: '100%' }}>
      <MediaController style={{ width: '100%' }}>
        <video
          width='100%'
          slot="media"
          preload="auto"
          muted
          crossOrigin=""
          ref={videoElement}
          onTimeUpdate={onTimeUpdate}
        />
        <MediaLoadingIndicator  slot="centered-chrome" noautohide></MediaLoadingIndicator>
        <MediaControlBar>
          <MediaPlayButton></MediaPlayButton>
          <MediaSeekBackwardButton></MediaSeekBackwardButton>
          <MediaSeekForwardButton></MediaSeekForwardButton>
          <MediaTimeRange></MediaTimeRange>
          <MediaTimeDisplay showDuration></MediaTimeDisplay>
          <MediaMuteButton></MediaMuteButton>
          <MediaVolumeRange></MediaVolumeRange>
          <MediaPlaybackRateButton></MediaPlaybackRateButton>
          <MediaFullscreenButton></MediaFullscreenButton>
        </MediaControlBar>
      </MediaController>
    </div>
  );
}

export default App;
