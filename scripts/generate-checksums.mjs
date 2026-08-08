import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
  cwd: root,
  encoding: 'utf8',
  windowsHide: true,
});

const files = output
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((path) => path !== 'SHA256SUMS.txt')
  .filter((path) => existsSync(resolve(root, path)))
  .sort((a, b) => a.localeCompare(b, 'en'));

const lines = files.map((path) => {
  const hash = createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex').toUpperCase();
  return `${hash}  ${path.replaceAll('\\', '/')}`;
});

writeFileSync(resolve(root, 'SHA256SUMS.txt'), `${lines.join('\n')}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({files: files.length})}\n`);
