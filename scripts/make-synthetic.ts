import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';

const target = resolve('examples', 'synthetic-horizontal');
mkdirSync(target, {recursive: true});
const result = spawnSync(
  'ffmpeg',
  [
    '-y', '-v', 'error',
    '-f', 'lavfi', '-i', 'testsrc2=size=1920x1080:rate=30:duration=4',
    '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000:duration=4',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest',
    resolve(target, 'input.mp4'),
  ],
  {stdio: 'inherit', shell: false, windowsHide: true},
);
if (result.status !== 0) throw new Error('Failed to generate synthetic fixture');
