import type {Storyboard} from './schema';

export type DirectorIssueCode =
  | 'palette-diversity'
  | 'structure-diversity'
  | 'adjacent-pair-repeat'
  | 'template-overuse'
  | 'side-repeat'
  | 'invalid-full-screen-role';

export type DirectorIssue = {code: DirectorIssueCode; message: string; beatId?: string};

const fullScreenRoles = new Set(['hook', 'bridge', 'payoff', 'cta', 'evidence']);

export const validateDirectorPlan = (storyboard: Storyboard): DirectorIssue[] => {
  const issues: DirectorIssue[] = [];
  if (storyboard.duration > 30 && new Set(storyboard.beats.map((beat) => beat.palette)).size < 4) {
    issues.push({code: 'palette-diversity', message: 'Videos over 30 seconds require at least four semantic palettes'});
  }
  if (storyboard.duration > 30 && new Set(storyboard.beats.map((beat) => beat.structure)).size < 5) {
    issues.push({code: 'structure-diversity', message: 'Videos over 30 seconds require at least five visual structures'});
  }

  const counts = new Map<string, number>();
  storyboard.beats.forEach((beat, index) => {
    counts.set(beat.structure, (counts.get(beat.structure) ?? 0) + 1);
    if (beat.placement === 'full' && !fullScreenRoles.has(beat.directorRole)) {
      issues.push({code: 'invalid-full-screen-role', beatId: beat.id, message: `${beat.directorRole} cannot cover the presenter`});
    }
    const previous = storyboard.beats[index - 1];
    if (!previous) return;
    if (beat.structure === previous.structure && beat.palette === previous.palette) {
      issues.push({code: 'adjacent-pair-repeat', beatId: beat.id, message: 'Adjacent beats repeat the same structure and palette'});
    }
    if (beat.placement !== 'full' && previous.placement !== 'full' && beat.placement === previous.placement) {
      issues.push({code: 'side-repeat', beatId: beat.id, message: 'Consecutive ordinary overlays use the same presenter-safe lane'});
    }
  });
  counts.forEach((count, structure) => {
    if (count > 3) issues.push({code: 'template-overuse', message: `${structure} appears ${count} times`});
  });
  return issues;
};
