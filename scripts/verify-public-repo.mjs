import {execFileSync} from 'node:child_process';
import {existsSync, lstatSync, readFileSync} from 'node:fs';
import {extname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const textExtensions = new Set(['', '.md', '.txt', '.json', '.yaml', '.yml', '.ts', '.tsx', '.js', '.mjs', '.css', '.html', '.gitignore', '.npmrc']);
const sourceMedia = new Set(['.mp4', '.mov', '.mkv', '.avi', '.webm', '.wav', '.mp3', '.m4a']);
const directDPath = new RegExp(`\\b${['D', ':', '\\\\'].join('')}`, 'i');
const userPath = new RegExp(`[A-Z]:${['\\\\', 'Users', '\\\\', '[^\\\\]+', '\\\\'].join('')}`, 'i');
const nonPublicTerms = [new RegExp(['motion', 'playground'].join('\\s*'), 'i'), new RegExp(['动效', '工作台'].join('\\s*'), 'i')];
const secretPatterns = [
  /(?:api[_-]?key|access[_-]?token|client[_-]?secret|private[_-]?key)\s*[:=]\s*["']?[a-z0-9_\-]{8,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /gh[pousr]_[A-Za-z0-9]{24,}/,
];

export const scanEntries = (entries) => {
  const findings = [];
  for (const entry of entries) {
    const normalized = entry.path.replaceAll('\\', '/');
    const extension = extname(normalized).toLowerCase();
    if (/(^|\/)\.env(?:\.|$)/i.test(normalized) || /\.(?:pem|key|p12|pfx)$/i.test(normalized)) findings.push(`${normalized}: forbidden-file`);
    if (sourceMedia.has(extension)) findings.push(`${normalized}: source-media`);
    if (entry.size > 20 * 1024 * 1024) findings.push(`${normalized}: file-over-20mb`);
    if (entry.text !== null) {
      if (directDPath.test(entry.text) || userPath.test(entry.text)) findings.push(`${normalized}: absolute-local-path`);
      if (nonPublicTerms.some((pattern) => pattern.test(entry.text))) findings.push(`${normalized}: non-public-term`);
      if (secretPatterns.some((pattern) => pattern.test(entry.text))) findings.push(`${normalized}: possible-secret`);
      const marker = new RegExp(`\\b(?:${['TO' + 'DO', 'T' + 'BD', 'FIX' + 'ME', 'PLACE' + 'HOLDER'].join('|')})\\b`, 'i');
      if (marker.test(entry.text)) findings.push(`${normalized}: ${'place' + 'holder'}`);
    }
  }
  return findings;
};

const collectCandidates = (root) => {
  const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {cwd: root, encoding: 'utf8', windowsHide: true});
  return output.split(/\r?\n/).filter(Boolean).map((path) => {
    const absolute = resolve(root, path);
    if (!existsSync(absolute)) return null;
    const stat = lstatSync(absolute);
    if (!stat.isFile() || stat.isSymbolicLink()) return null;
    const extension = extname(path).toLowerCase();
    return {path, size: stat.size, text: textExtensions.has(extension) ? readFileSync(absolute, 'utf8') : null};
  }).filter(Boolean);
};

export const verifyPublicRepo = (root) => {
  const findings = scanEntries(collectCandidates(root));
  if (findings.length) throw new Error(`Public repository verification failed:\n${findings.join('\n')}`);
  return {ok: true, files: collectCandidates(root).length};
};

const isDirect = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isDirect) {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const result = verifyPublicRepo(root);
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
