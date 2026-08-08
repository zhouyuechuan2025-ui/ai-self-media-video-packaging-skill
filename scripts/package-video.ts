import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {basename, join, resolve} from 'node:path';
import {copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {assertDirectorPlan} from '../packages/core/src/director-validation';
import {planStoryboard} from '../packages/core/src/planner';
import {probeMedia} from '../packages/core/src/probe';
import {gateABrief, storyboardMarkdown} from '../packages/core/src/reports';
import {parseSrt} from '../packages/core/src/srt';
import {generateHyperFramesProject} from '../packages/hyperframes-adapter/src/generate';
import {buildContactSheet, decodeEntireFile, detectBlackFrames, extractRepresentativeFrames, frameEvidenceFromFile, selectRepresentativeBeats, writeRenderManifest} from './lib/artifact-qa';
import {approvedGate, requireCumulativeApprovals, requireRenderAuthorization, type Args} from './lib/gates';

const parseArgs = (values: string[]): Args => {
  const args: Args = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith('--')) throw new Error(`Unexpected argument: ${value}`);
    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith('--')) args[key] = true;
    else { args[key] = next; index += 1; }
  }
  return args;
};

const required = (args: Args, key: string): string => {
  const value = args[key];
  if (typeof value !== 'string' || !value) throw new Error(`Missing --${key}`);
  return value;
};

const sha256 = (path: string): string => createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase();

const run = (command: string, values: string[], cwd: string): void => {
  const result = spawnSync(command, values, {cwd, stdio: 'inherit', shell: false, windowsHide: true});
  if (result.status !== 0) throw new Error(`${command} failed with exit code ${result.status ?? 'unknown'}`);
};

const ensurePreviewMedia = (source: string, destination: string, codec: string, cwd: string): void => {
  if (codec === 'h264') {
    copyFileSync(source, destination);
    return;
  }
  run('ffmpeg', ['-y', '-v', 'warning', '-i', source, '-map', '0:v:0', '-map', '0:a?', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', destination], cwd);
};

export const main = (argv = process.argv.slice(2)): void => {
  const args = parseArgs(argv);
  const video = resolve(required(args, 'video'));
  const srt = resolve(required(args, 'srt'));
  const out = resolve(required(args, 'out'));
  if (!existsSync(video) || !existsSync(srt)) throw new Error('Input video or SRT does not exist');
  const renderer = typeof args.renderer === 'string' ? args.renderer : 'remotion';
  const captionsMode = typeof args.captions === 'string' ? args.captions : 'burned-in';
  const renderConcurrency = typeof args.concurrency === 'string' ? args.concurrency : '2';
  if (!['burned-in', 'none', 'generated'].includes(captionsMode)) throw new Error('Invalid --captions mode');
  if (!['remotion', 'hyperframes'].includes(renderer)) throw new Error('Invalid --renderer');
  if (!/^[1-9]\d*$/.test(renderConcurrency) || Number(renderConcurrency) > 16) throw new Error('Invalid --concurrency; expected an integer from 1 to 16');

  mkdirSync(out, {recursive: true});
  const probe = probeMedia(video);
  const cues = parseSrt(readFileSync(srt, 'utf8'));
  const id = typeof args.id === 'string' ? args.id : basename(out).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'video-package';
  const storyboard = planStoryboard({id, title: typeof args.title === 'string' ? args.title : id, cues, probe, captionsMode: captionsMode as 'burned-in' | 'none' | 'generated', sourceVideo: 'input.mp4', sourceSrt: 'input.srt'});
  assertDirectorPlan(storyboard);
  writeFileSync(join(out, 'BRIEF.md'), gateABrief({storyboard, probe, cues}), 'utf8');
  writeFileSync(join(out, 'SOURCE_PROBE.json'), `${JSON.stringify(probe, null, 2)}\n`, 'utf8');
  writeFileSync(join(out, 'STORYBOARD.md'), storyboardMarkdown(storyboard), 'utf8');
  writeFileSync(join(out, 'storyboard.json'), `${JSON.stringify(storyboard, null, 2)}\n`, 'utf8');
  writeFileSync(join(out, 'input-manifest.json'), `${JSON.stringify({video: {sha256: sha256(video), size: probe.size, duration: probe.duration, codec: probe.video.codec}, srt: {sha256: sha256(srt), cues: cues.length}}, null, 2)}\n`, 'utf8');

  const gate = approvedGate(args);
  if (args.render === true && gate !== 'D') requireRenderAuthorization(args);
  if (gate === 'A') {
    process.stdout.write(`Gate A complete: ${out}\n`);
    return;
  }
  requireCumulativeApprovals(args, gate);

  const repo = resolve(import.meta.dirname, '..');
  const publicDir = join(out, 'public');
  mkdirSync(publicDir, {recursive: true});
  ensurePreviewMedia(video, join(publicDir, 'input.mp4'), probe.video.codec, repo);
  copyFileSync(srt, join(publicDir, 'input.srt'));
  const propsPath = join(out, 'props.json');
  writeFileSync(propsPath, `${JSON.stringify({storyboard, cues, overlayOnly: false}, null, 2)}\n`, 'utf8');

  if (renderer === 'hyperframes') {
    const project = generateHyperFramesProject(storyboard);
    const target = join(out, 'hyperframes');
    mkdirSync(target, {recursive: true});
    writeFileSync(join(target, 'index.html'), project.html, 'utf8');
    writeFileSync(join(target, 'index.motion.json'), `${JSON.stringify(project.motion, null, 2)}\n`, 'utf8');
    copyFileSync(join(publicDir, 'input.mp4'), join(target, 'input.mp4'));
  }

  if (gate === 'B') {
    process.stdout.write(`Gate B composition inputs ready: ${out}\n`);
    return;
  }
  if (renderer !== 'remotion') throw new Error('Gate C review stills and Gate D final rendering currently require --renderer remotion');

  const entry = join(repo, 'packages', 'remotion-renderer', 'src', 'index.ts');
  const reviewDir = join(out, 'gate-c-review');
  mkdirSync(reviewDir, {recursive: true});
  const reviewFrames = selectRepresentativeBeats(storyboard).map((beat, index) => {
    const file = join(reviewDir, `${String(index + 1).padStart(2, '0')}-${beat.structure}-${beat.timestamp.toFixed(3)}s.png`);
    run(process.execPath, [join(repo, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'), 'still', entry, 'VideoPackaging', file, '--frame', String(Math.round(beat.timestamp * storyboard.fps)), '--props', propsPath, '--public-dir', publicDir, '--overwrite'], repo);
    return frameEvidenceFromFile(beat, file);
  });
  const reviewContact = buildContactSheet(reviewFrames, join(reviewDir, 'contact-sheet.jpg'));
  writeFileSync(join(out, 'GATE_C_REPORT.json'), `${JSON.stringify({status: 'ready-for-review', contactSheet: reviewContact, frames: reviewFrames.map((frame) => ({...frame, file: basename(frame.file)}))}, null, 2)}\n`, 'utf8');

  if (gate === 'C') {
    process.stdout.write(`Gate C review ready; no final video rendered: ${reviewContact}\n`);
    return;
  }

  requireRenderAuthorization(args);
  const renders = join(out, 'renders');
  mkdirSync(renders, {recursive: true});
  const output = join(renders, 'packaged.mp4');
  run(process.execPath, [join(repo, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'), 'render', entry, 'VideoPackaging', output, '--props', propsPath, '--public-dir', publicDir, '--codec', 'h264', '--crf', '18', '--concurrency', renderConcurrency, '--overwrite'], repo);
  decodeEntireFile(output);
  const finalFrames = extractRepresentativeFrames(output, storyboard, join(renders, 'qa-frames'));
  buildContactSheet(finalFrames, join(renders, 'contact-sheet.jpg'));
  const manifest = writeRenderManifest({output, storyboard, frames: finalFrames, target: join(out, 'RENDER_MANIFEST.json')});
  const blackFrames = detectBlackFrames(output);
  if (blackFrames.length > 0) throw new Error(`Artifact QA failed: detected ${blackFrames.length} black segment(s)`);
  process.stdout.write(`Gate D render complete: ${output}\nSHA-256: ${manifest.output.sha256}\n`);
};

const isDirect = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isDirect) main();
