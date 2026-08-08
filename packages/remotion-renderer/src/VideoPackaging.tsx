import type {CSSProperties, ReactElement} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Storyboard} from '../../core/src/schema';
import type {SrtCue} from '../../core/src/types';
import {illustrationRegistry} from './illustrations';
import {structureRegistry} from './structures';
import {placementStyle} from './theme';

export type VideoPackagingProps = {
  storyboard: Storyboard;
  overlayOnly?: boolean;
  cues?: SrtCue[];
};

export const buildCompositionPlan = ({storyboard, overlayOnly = false, cues = []}: VideoPackagingProps) => {
  const durationInFrames = Math.ceil(storyboard.duration * storyboard.fps);
  return {
    durationInFrames,
    background: overlayOnly ? 'transparent' : storyboard.theme.background,
    videoTracks: overlayOnly ? [] : [{src: storyboard.source.video, from: 0, durationInFrames, audio: true}],
    captionTracks: storyboard.captionsMode === 'generated' ? cues : [],
    overlays: storyboard.beats.map((beat) => ({
      ...beat,
      from: Math.round(beat.start * storyboard.fps),
      durationInFrames: Math.max(1, Math.round((beat.end - beat.start) * storyboard.fps)),
      safeZone: structureRegistry[beat.structure].safeZone,
    })),
  };
};

const BeatOverlay = ({storyboard, beat}: {storyboard: Storyboard; beat: Storyboard['beats'][number]}): ReactElement => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = Math.max(1, Math.round((beat.end - beat.start) * fps));
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, duration - 1)));
  const Structure = structureRegistry[beat.structure].Component;
  const Illustration = beat.illustration ? illustrationRegistry[beat.illustration.type] : null;
  const wrapper: CSSProperties = {display: 'flex', boxSizing: 'border-box', ...placementStyle(beat.placement)};

  return <AbsoluteFill data-beat={beat.id} data-safe-zone={structureRegistry[beat.structure].safeZone} style={wrapper}>
    <Structure text={beat.text} kicker={beat.kicker} progress={progress} accent={storyboard.theme.accent}/>
    {Illustration ? <div style={{position: 'absolute', [beat.placement === 'right' ? 'left' : 'right']: 96, bottom: 168, width: 500, padding: 18, borderRadius: 28, background: 'rgba(7,15,30,.72)', border: '1px solid rgba(148,163,184,.24)', boxShadow: '0 18px 48px rgba(2,8,23,.28)'}}><Illustration progress={progress} accent={storyboard.theme.accent}/></div> : null}
    {beat.evidence ? <div style={{position: 'absolute', right: 110, top: 112, width: 520, height: 292, overflow: 'hidden', borderRadius: 24, border: `3px solid ${storyboard.theme.accent}`, background: '#fff'}}><Img src={staticFile(beat.evidence.src)} style={{width: '100%', height: '100%', objectFit: 'contain'}}/><span style={{position: 'absolute', left: 18, bottom: 14, padding: '7px 12px', borderRadius: 10, background: 'rgba(2,8,23,.82)', color: '#fff', font: '700 18px/1.2 system-ui'}}>{beat.evidence.label}</span></div> : null}
  </AbsoluteFill>;
};

const GeneratedCaptions = ({cues}: {cues: SrtCue[]}): ReactElement => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const cue = cues.find((item) => item.start <= time && item.end > time);
  return <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 52}}>{cue ? <div style={{maxWidth: 1450, padding: '12px 22px', borderRadius: 12, color: '#fff', background: 'rgba(2,8,23,.78)', font: '800 38px/1.25 system-ui', textAlign: 'center'}}>{cue.text}</div> : null}</AbsoluteFill>;
};

export const VideoPackaging = (props: VideoPackagingProps): ReactElement => {
  const {storyboard, overlayOnly = false, cues = []} = props;
  const plan = buildCompositionPlan(props);
  return <AbsoluteFill style={{backgroundColor: plan.background}}>
    {!overlayOnly ? <OffthreadVideo src={staticFile(storyboard.source.video)} style={{width: '100%', height: '100%', objectFit: 'cover'}}/> : null}
    {plan.overlays.map((beat) => <Sequence key={beat.id} from={beat.from} durationInFrames={beat.durationInFrames} premountFor={storyboard.fps}><BeatOverlay storyboard={storyboard} beat={beat}/></Sequence>)}
    {storyboard.captionsMode === 'generated' ? <GeneratedCaptions cues={cues}/> : null}
  </AbsoluteFill>;
};
