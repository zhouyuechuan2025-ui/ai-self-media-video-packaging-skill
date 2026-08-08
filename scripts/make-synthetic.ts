import {spawnSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = resolve('examples', 'synthetic-horizontal');
mkdirSync(target, {recursive: true});
writeFileSync(resolve(target, 'input.srt'), `1\n00:00:00,000 --> 00:00:01,800\nAI让信息更清楚\n\n2\n00:00:01,800 --> 00:00:04,000\n从结构到动效保持可复现\n`, 'utf8');
const result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=1920x1080:rate=30:duration=4', '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000:duration=4', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', resolve(target, 'input.mp4')], {stdio: 'inherit', shell: false, windowsHide: true});
if (result.status !== 0) throw new Error('Failed to generate synthetic fixture');
