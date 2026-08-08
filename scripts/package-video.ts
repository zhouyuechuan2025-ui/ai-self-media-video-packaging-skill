import {execFileSync, spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, join, resolve} from 'node:path';
import {assertDirectorPlan} from '../packages/core/src/director-validation';
import {planStoryboard} from '../packages/core/src/planner';
import {probeMedia} from '../packages/core/src/probe';
import {gateABrief, storyboardMarkdown} from '../packages/core/src/reports';
import {parseSrt} from '../packages/core/src/srt';
import {generateHyperFramesProject} from '../packages/hyperframes-adapter/src/generate';

type Args = Record<string, string | boolean>;

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

const main = (): void => {
  const args = parseArgs(process.argv.slice(2));
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
  if (args['approve-gate-a'] !== true) {
    process.stdout.write(`Gate A complete: ${out}\n`);
    return;
  }

  if (renderer === 'hyperframes') {
    const project = generateHyperFramesProject(storyboard);
    const target = join(out, 'hyperframes');
    mkdirSync(target, {recursive: true});
    writeFileSync(join(target, 'index.html'), project.html, 'utf8');
    writeFileSync(join(target, 'index.motion.json'), `${JSON.stringify(project.motion, null, 2)}\n`, 'utf8');
    copyFileSync(video, join(target, 'input.mp4'));
    process.stdout.write(`HyperFrames project generated: ${target}\n`);
    return;
  }

  if (args.render !== true) {
    process.stdout.write(`Gate B plan ready; add --render for local media generation: ${out}\n`);
    return;
  }

  const repo = resolve(import.meta.dirname, '..');
  const publicDir = join(out, 'public');
  const renders = join(out, 'renders');
  mkdirSync(publicDir, {recursive: true});
  mkdirSync(renders, {recursive: true});
  ensurePreviewMedia(video, join(publicDir, 'input.mp4'), probe.video.codec, repo);
  const propsPath = join(out, 'props.json');
  writeFileSync(propsPath, `${JSON.stringify({storyboard, cues, overlayOnly: false}, null, 2)}\n`, 'utf8');
  const entry = join(repo, 'packages', 'remotion-renderer', 'src', 'index.ts');
  const output = join(renders, 'packaged.mp4');
  run(process.execPath, [join(repo, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'), 'render', entry, 'VideoPackaging', output, '--props', propsPath, '--public-dir', publicDir, '--codec', 'h264', '--crf', '18', '--concurrency', renderConcurrency, '--overwrite'], repo);
  const screenshotTimes = storyboard.beats.slice(0, 5).map((beat) => Number(((beat.start + beat.end) / 2).toFixed(3)));
  screenshotTimes.forEach((time, index) => run('ffmpeg', ['-y', '-v', 'error', '-ss', String(time), '-i', output, '-frames:v', '1', join(renders, `preview-${String(index + 1).padStart(2, '0')}-${time.toFixed(3)}s.png`)], repo));
  const outputProbe = probeMedia(output);
  execFileSync('ffmpeg', ['-v', 'error', '-i', output, '-f', 'null', '-'], {stdio: 'ignore', windowsHide: true});
  writeFileSync(join(out, 'RENDER_MANIFEST.json'), `${JSON.stringify({renderer, output: {file: 'renders/packaged.mp4', sha256: sha256(output), ...outputProbe}, screenshots: screenshotTimes}, null, 2)}\n`, 'utf8');
  process.stdout.write(`Render complete: ${output}\n`);
};

main();
