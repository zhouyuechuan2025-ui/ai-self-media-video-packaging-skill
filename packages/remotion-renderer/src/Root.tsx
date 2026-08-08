import type {ReactElement} from 'react';
import {Composition} from 'remotion';
import type {Storyboard} from '../../core/src/schema';
import {VideoPackaging, type VideoPackagingProps} from './VideoPackaging';

const defaultStoryboard: Storyboard = {
  version: '2.0',
  id: 'video-packaging',
  title: 'AI video packaging',
  duration: 2,
  fps: 30,
  width: 1920,
  height: 1080,
  captionsMode: 'burned-in',
  source: {video: 'input.mp4'},
  theme: {background: '#07101f', foreground: '#f8fafc', accent: '#5eead4'},
  beats: [{
    id: 'hook',
    start: 0,
    end: 2,
    text: 'AI VIDEO PACKAGING',
    structure: 'thesis-and-proof',
    content: {structure: 'thesis-and-proof', thesis: 'AI VIDEO PACKAGING', reason: 'Structure follows spoken meaning.'},
    motions: ['hit'],
    placement: 'full',
    palette: 'deep-ocean',
    directorRole: 'hook',
  }],
};

const defaultProps: VideoPackagingProps = {storyboard: defaultStoryboard, overlayOnly: false, cues: []};

export const RemotionRoot = (): ReactElement => (
  <Composition
    id="VideoPackaging"
    component={VideoPackaging}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => ({
      durationInFrames: Math.ceil(props.storyboard.duration * props.storyboard.fps),
      fps: props.storyboard.fps,
      width: props.storyboard.width,
      height: props.storyboard.height,
      props,
    })}
  />
);
