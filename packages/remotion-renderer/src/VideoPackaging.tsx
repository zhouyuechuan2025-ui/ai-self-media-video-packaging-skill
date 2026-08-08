import type {ReactElement} from 'react';
import {Video} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Storyboard} from '../../core/src/schema';
import {PALETTES} from '../../core/src/palettes';
import type {SrtCue} from '../../core/src/types';
import {illustrationRegistry} from './illustrations';
import {structureRegistry} from './structures';

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

const BeatOverlay = ({beat}: {beat: Storyboard['beats'][number]}): ReactElement => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = Math.max(1, Math.round((beat.end - beat.start) * fps));
  const progress = Math.max(0, Math.min(1, frame / Math.max(1, duration - 1)));
  const definition = structureRegistry[beat.structure];
  const Structure = definition.Component;
  const palette = PALETTES[beat.palette];
  const Illustration = beat.illustration ? illustrationRegistry[beat.illustration.type] : undefined;
  const evidence = beat.evidence ? {...beat.evidence, src: staticFile(beat.evidence.src)} : undefined;

  return (
    <AbsoluteFill data-beat={beat.id} data-safe-zone={definition.safeZone}>
      <Structure
        content={beat.content}
        progress={progress}
        palette={palette}
        placement={beat.placement}
        evidence={evidence}
        Illustration={Illustration}
      />
    </AbsoluteFill>
  );
};

const GeneratedCaptions = ({cues}: {cues: SrtCue[]}): ReactElement => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const cue = cues.find((item) => item.start <= time && item.end > time);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 52}}>
      {cue ? <div style={{maxWidth: 1450, padding: '12px 22px', borderRadius: 12, color: '#fff', background: 'rgba(2,8,23,.78)', font: '800 38px/1.25 system-ui', textAlign: 'center'}}>{cue.text}</div> : null}
    </AbsoluteFill>
  );
};

export const VideoPackaging = (props: VideoPackagingProps): ReactElement => {
  const {storyboard, overlayOnly = false, cues = []} = props;
  const plan = buildCompositionPlan(props);
  return (
    <AbsoluteFill style={{backgroundColor: plan.background}}>
      {!overlayOnly ? <Video src={staticFile(storyboard.source.video)} style={{width: '100%', height: '100%'}} objectFit="cover" disallowFallbackToOffthreadVideo/> : null}
      {plan.overlays.map((beat) => <Sequence key={beat.id} from={beat.from} durationInFrames={beat.durationInFrames} premountFor={storyboard.fps}><BeatOverlay beat={beat}/></Sequence>)}
      {storyboard.captionsMode === 'generated' ? <GeneratedCaptions cues={cues}/> : null}
    </AbsoluteFill>
  );
};
