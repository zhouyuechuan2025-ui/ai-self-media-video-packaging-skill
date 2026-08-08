import type {TemplateContent, SemanticStructure} from './template-contracts';

type EvidenceInput = {
  src: string;
  label: string;
  sourceUrl?: string;
};

const clip = (value: string, max: number): string => {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, Math.max(1, max - 1))}…`;
};

const clauses = (text: string): string[] => text
  .split(/[，。；：、,.!?！？]/)
  .map((part) => part.trim())
  .filter(Boolean);

const unique = (values: string[]): string[] => [...new Set(values.map((value) => value.trim()).filter(Boolean))];

const stepsFromText = (text: string): string[] => {
  const normalized = text
    .replace(/(?:首先|第一步|第一)[，：:]?/g, '|')
    .replace(/(?:然后|接着|随后|再|第二步|第二)[，：:]?/g, '|')
    .replace(/(?:最后|最终|第三步|第三|第四步|第四)[，：:]?/g, '|');
  return unique(normalized.split(/[|，。；：、,.!?！？]/).map((part) => clip(part, 16)));
};

const beforeAfter = (text: string): {before: string; after: string} => {
  const fromTo = text.match(/从(.+?)(?:变成|到|转为)(.+)/);
  if (fromTo) return {before: clip(fromTo[1], 24), after: clip(fromTo[2], 24)};
  const oldNew = text.match(/(?:以前|优化前)(.+?)(?:现在|优化后)(.+)/);
  if (oldNew) return {before: clip(oldNew[1], 24), after: clip(oldNew[2], 24)};
  const contrast = text.match(/不是(.+?)[，,]?而是(.+)/);
  if (contrast) return {before: clip(contrast[1], 24), after: clip(contrast[2], 24)};
  const parts = clauses(text);
  return {before: clip(parts[0] ?? '原有方式', 24), after: clip(parts[1] ?? '新的方式', 24)};
};

const routeNodes = (text: string): string[] => {
  const normalized = text
    .replace(/从/g, '|')
    .replace(/(?:流向|再到|连接到|串联到|到)/g, '|');
  return unique(normalized.split(/[|，。；：、,.!?！？]/).map((part) => clip(part, 14)));
};

const metricFromText = (text: string) => {
  const match = text.match(/(-?\d+(?:\.\d+)?)(%|万|千|分钟|小时|倍)?/);
  const evidenceStatus = /估算|预计|大约|约/.test(text)
    ? 'estimate' as const
    : /本次|我的|实测|个人/.test(text)
      ? 'owner-confirmed' as const
      : /官方|文档|来源/.test(text)
        ? 'sourced' as const
        : 'estimate' as const;
  return {
    value: match?.[1] ?? '1',
    unit: match?.[2] ?? '',
    label: clip(text, 18),
    evidenceStatus,
    ...(evidenceStatus === 'sourced' ? {sourceLabel: '已标注来源'} : {}),
  };
};

export const buildTemplateContent = (
  structure: SemanticStructure,
  text: string,
  options: {evidence?: EvidenceInput} = {},
): TemplateContent => {
  const parts = clauses(text);

  if (structure === 'before-after-scrub') {
    const states = beforeAfter(text);
    return {structure, ...states, criterion: '工作方式'};
  }
  if (structure === 'four-stage-pipeline') {
    const stages = unique([...stepsFromText(text), '确认结果', '完成交付']).slice(0, 4);
    return {structure, title: '执行流程', stages: stages.slice(0, Math.max(3, stages.length)) as [string, string, string, ...string[]]};
  }
  if (structure === 'command-palette') {
    const actions = unique([...parts, ...stepsFromText(text), '检查结果']).slice(0, 5);
    return {structure, commandTitle: '执行清单', actions: actions.slice(0, Math.max(2, actions.length)) as [string, string, ...string[]], resultState: '等待确认'};
  }
  if (structure === 'metric-odometer') {
    return {structure, metrics: [metricFromText(text)]};
  }
  if (structure === 'signal-route') {
    const nodes = unique([...routeNodes(text), '处理', '结果']).slice(0, 5);
    return {structure, nodes: nodes.slice(0, Math.max(3, nodes.length)) as [string, string, string, ...string[]], routeLabel: '信息路径', result: '形成闭环'};
  }
  if (structure === 'bidirectional-flow') {
    return {
      structure,
      leftLabel: clip(parts[0] ?? '输入', 14),
      rightLabel: clip(parts[1] ?? '输出', 14),
      forwardAction: '生成',
      returnAction: '反馈修正',
      result: clip(parts.at(-1) ?? '持续优化', 24),
    };
  }
  if (structure === 'semantic-doodle') {
    return {
      structure,
      subject: /创作者|人物|员工|团队/.exec(text)?.[0] ?? '创作者',
      action: /推|爬|攀|平衡|飞|越过/.exec(text)?.[0] ?? '推进任务',
      outcome: clip(parts.at(-1) ?? '得到结果', 20),
      accent: '#e97a5f',
    };
  }
  if (structure === 'evidence-panel') {
    if (!options.evidence) throw new Error('Evidence panel requires a real evidence asset');
    return {
      structure,
      evidenceAsset: clip(options.evidence.src, 120),
      caption: clip(options.evidence.label, 28),
      sourceLabel: clip(options.evidence.sourceUrl ?? options.evidence.label, 28),
      interpretation: clip(parts.at(-1) ?? text, 36),
    };
  }
  if (structure === 'thesis-and-proof') {
    return {
      structure,
      thesis: clip(parts[0] ?? text, 24),
      reason: clip(parts.slice(1).join('，') || '用清晰证据支撑观点', 36),
    };
  }

  return {
    structure: 'editorial-dual-rail',
    kicker: '核心信息',
    headline: clip(parts[0] ?? text, 24),
    leftItems: [{label: '现状', detail: clip(parts[1] ?? '信息需要被整理', 22)}],
    rightItems: [{label: '行动', detail: clip(parts[2] ?? '给出清晰下一步', 22)}],
    takeaway: clip(parts.at(-1) ?? text, 24),
  };
};

