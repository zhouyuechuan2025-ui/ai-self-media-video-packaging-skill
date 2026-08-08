import type {Storyboard} from './schema';
import {TemplateContentSchema, type SemanticStructure} from './template-contracts';
import {PRESENTATION_MODE_BY_STRUCTURE} from './presentation-contracts';

export type DirectorIssueCode =
  | 'structure-diversity'
  | 'structure-run-too-long'
  | 'side-repeat'
  | 'invalid-full-screen-role'
  | 'evidence-missing'
  | 'content-contract'
  | 'copy-too-long'
  | 'semantic-mismatch'
  | 'presentation-mode-mismatch';

export type DirectorIssue = {code: DirectorIssueCode; message: string; beatId?: string};

const roleAllowsFullScreen = new Set(['hook', 'bridge', 'payoff', 'cta', 'evidence']);
const structureAllowsFullScreen = new Set<SemanticStructure>([
  'four-stage-pipeline',
  'before-after-scrub',
  'evidence-panel',
  'metric-odometer',
  'signal-route',
  'semantic-doodle',
  'bidirectional-flow',
]);

export const validateDirectorPlan = (storyboard: Storyboard): DirectorIssue[] => {
  const issues: DirectorIssue[] = [];
  const uniqueStructures = new Set(storyboard.beats.map((beat) => beat.structure)).size;
  if (storyboard.duration > 30 && uniqueStructures < 8) {
    issues.push({
      code: 'structure-diversity',
      message: `Videos over 30 seconds require eight semantically valid structures; received ${uniqueStructures}`,
    });
  }

  let runLength = 0;
  let previousStructure: SemanticStructure | undefined;
  storyboard.beats.forEach((beat, index) => {
    runLength = beat.structure === previousStructure ? runLength + 1 : 1;
    previousStructure = beat.structure;
    if (runLength === 3) {
      issues.push({
        code: 'structure-run-too-long',
        beatId: beat.id,
        message: `${beat.structure} appears more than twice consecutively`,
      });
    }

    const parsedContent = TemplateContentSchema.safeParse(beat.content);
    if (!parsedContent.success || beat.content.structure !== beat.structure) {
      issues.push({
        code: 'content-contract',
        beatId: beat.id,
        message: `Content does not satisfy ${beat.structure}`,
      });
    }
    if (beat.structure === 'evidence-panel' && !beat.evidence) {
      issues.push({
        code: 'evidence-missing',
        beatId: beat.id,
        message: 'Evidence panels require a real source asset',
      });
    }
    if (
      beat.placement === 'full'
      && !roleAllowsFullScreen.has(beat.directorRole)
      && !structureAllowsFullScreen.has(beat.structure)
    ) {
      issues.push({
        code: 'invalid-full-screen-role',
        beatId: beat.id,
        message: `${beat.structure}/${beat.directorRole} cannot use a full-screen treatment`,
      });
    }
    if (PRESENTATION_MODE_BY_STRUCTURE[beat.structure] === 'opaque-full-screen' && beat.placement !== 'full') {
      issues.push({
        code: 'presentation-mode-mismatch',
        beatId: beat.id,
        message: `${beat.structure} crosses the presenter center and must use an opaque full-screen treatment`,
      });
    }

    const previous = storyboard.beats[index - 1];
    if (
      previous
      && beat.placement !== 'full'
      && previous.placement !== 'full'
      && beat.placement === previous.placement
    ) {
      issues.push({
        code: 'side-repeat',
        beatId: beat.id,
        message: 'Consecutive ordinary overlays use the same presenter-safe lane',
      });
    }
  });
  return issues;
};

export const assertDirectorPlan = (storyboard: Storyboard): void => {
  const issues = validateDirectorPlan(storyboard);
  if (issues.length === 0) return;
  const details = issues
    .map((issue) => `${issue.code}${issue.beatId ? `(${issue.beatId})` : ''}: ${issue.message}`)
    .join('; ');
  throw new Error(`Director plan rejected: ${details}`);
};
