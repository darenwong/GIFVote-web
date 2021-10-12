import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import "./GIFComponent.css";
import { makeStyles } from "@material-ui/core/styles";
import {
  CardMedia,
} from "@material-ui/core";
import { useWindowSize } from "@react-hook/window-size/throttled";
import { Waypoint } from "react-waypoint";



const useStyles = makeStyles((theme) => ({
  root: {
  },
}));


export default function GIFComponent ({
  gifURL,
  gifimage,
  gifHeight,
  gifWidth,
}) {
  const classes = useStyles();
  const [width, height] = useWindowSize();
  let videoContainerWidth = Math.min(600, Math.max(300, width * 0.5));
  let renderedVideoHeight = (gifHeight * videoContainerWidth) / gifWidth;
  let [shouldPlay, updatePlayState] = useState(false);
  const videoRef = useRef();

  let handleEnterViewport = function () {
    updatePlayState(true);
    setTimeout(() => {
      if (videoRef && videoRef.current) {
        videoRef.current.handleClickPreview();
      }
    }, 1000);
  };
  let handleExitViewport = function () {
    updatePlayState(false);
    videoRef.current.showPreview();
  };

  return (
    <>
      <Waypoint
        onEnter={handleEnterViewport}
        onLeave={handleExitViewport}
        fireOnRapidScroll={false}
      >
        <div>
          <ReactPlayer
            ref={videoRef}
            width={videoContainerWidth}
            height={renderedVideoHeight}
            style={{ marginLeft: "auto", marginRight: "auto" }}
            url={gifURL}
            playing={shouldPlay}
            loop={true}
            muted={true}
            playsinline={true}
            light={gifimage}
            className={classes.reactPlayer}
            playIcon={<div />}
            fallback={
              <CardMedia
                component="img"
                alt="fallback"
                width={videoContainerWidth}
                height={renderedVideoHeight}
                image={gifimage}
              />
            }
            config={{
              file: {
                attributes: {
                  poster: gifimage,
                },
              },
            }}
          />
        </div>
      </Waypoint>
    </>
  );
};