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
  const verbal = text.match(/(几万|几十|几个月|两三个)(流量|条|小时|月|个)?/);
  const evidenceStatus = /估算|预计|大约|约/.test(text)
    ? 'estimate' as const
    : /本次|我的|我只|我(?:的)?Plus|实测|个人|新账号|迭代/.test(text)
      ? 'owner-confirmed' as const
      : /官方|文档|来源/.test(text)
        ? 'sourced' as const
        : 'estimate' as const;
  return {
    value: match?.[1] ?? verbal?.[1] ?? '1',
    unit: match?.[2] ?? verbal?.[2] ?? '',
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
    if (/以前剪一条视频.*找素材/.test(text)) {
      return {structure, before: '人工逐项找素材', after: '原视频进入工作流', criterion: '剪辑入口'};
    }
    if (/两三个小时.*现在/.test(text)) {
      return {structure, before: '2–3小时仍难完成', after: '交给工作流处理', criterion: '单条剪辑时间'};
    }
    const states = beforeAfter(text);
    return {structure, ...states, criterion: '工作方式'};
  }
  if (structure === 'four-stage-pipeline') {
    if (/字幕.*卡点.*特效/.test(text)) {
      return {structure, title: '传统手工剪辑流程', stages: ['找素材', '上字幕', '卡点', '加特效'], output: '逐项手工完成'};
    }
    const stages = unique([...stepsFromText(text), '确认结果', '完成交付']).slice(0, 4);
    return {structure, title: '执行流程', stages: stages.slice(0, Math.max(3, stages.length)) as [string, string, string, ...string[]]};
  }
  if (structure === 'command-palette') {
    if (/评论区打资料包/.test(text)) {
      return {structure, commandTitle: '领取资料', actions: ['评论区输入：资料包', '按需领取并使用'], resultState: '资料已准备'};
    }
    if (/点个关注/.test(text)) {
      return {structure, commandTitle: '继续获取方法', actions: ['关注账号', '等待下一期'], resultState: '下期继续'};
    }
    if (/核心Skill分享给大家/.test(text)) {
      return {structure, commandTitle: '下一期继续分享', actions: ['爆款选题方法', '核心Skill实操'], resultState: '关注后续内容'};
    }
    const actions = unique([...parts, ...stepsFromText(text), '检查结果']).slice(0, 5);
    return {structure, commandTitle: '执行清单', actions: actions.slice(0, Math.max(2, actions.length)) as [string, string, ...string[]], resultState: '等待确认'};
  }
  if (structure === 'metric-odometer') {
    return {structure, metrics: [metricFromText(text)]};
  }
  if (structure === 'signal-route') {
    if (/丢进去5分钟.*剪完/.test(text)) {
      return {structure, nodes: ['放入原视频', '工作流处理', '约5分钟完成'], routeLabel: '本次个人工作流', result: '个人实测：约5分钟'};
    }
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
    if (/踩.*坑/.test(text)) {
      return {structure, subject: '创作者', action: '跨过反复踩坑', outcome: '沉淀可复用Skill', accent: '#e97a5f', annotation: '持续迭代'};
    }
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
    if (/爆款.*概率.*拉满/.test(text)) {
      return {structure, thesis: '剪辑提升内容完成度', reason: '爆款仍取决于选题、文案与平台反馈'};
    }
    if (/只靠剪辑.*不够/.test(text)) {
      return {structure, thesis: '好视频不只靠剪辑', reason: '选题与文案同样决定最终反馈'};
    }
    if (/一键智能剪辑/.test(text)) {
      return {structure, thesis: '用Codex完成智能剪辑', reason: '从素材输入到成片由工作流串联'};
    }
    if (/特别便宜/.test(text)) {
      return {structure, thesis: '本次工具链成本更低', reason: '成本数据按个人实际用量说明'};
    }
    return {
      structure,
      thesis: clip(parts[0] ?? text, 24),
      reason: clip(parts.slice(1).join('，') || '用清晰证据支撑观点', 36),
    };
  }

  if (/Skill包括了视频剪辑和封面制作/.test(text)) {
    return {
      structure: 'editorial-dual-rail',
      kicker: '双项能力',
      headline: '一套Skill覆盖两类制作',
      leftItems: [{label: '视频剪辑', detail: '完成口播内容包装'}],
      rightItems: [{label: '封面制作', detail: '补齐发布视觉入口'}],
      takeaway: '剪辑与封面统一处理',
    };
  }
  if (/新账号用它剪的视频/.test(text)) {
    return {
      structure: 'editorial-dual-rail',
      kicker: 'PERSONAL CASE',
      headline: '新账号实测背景',
      leftItems: [{label: '账号状态', detail: '新账号起步阶段'}],
      rightItems: [{label: '剪辑方式', detail: '使用本套工作流'}],
      takeaway: '下一屏呈现本人口径数据',
    };
  }
  if (/资料我已经准备好了/.test(text)) {
    return {
      structure: 'editorial-dual-rail',
      kicker: 'RESOURCE READY',
      headline: '配套资料已准备',
      leftItems: [{label: '当前状态', detail: '资料已经整理完成'}],
      rightItems: [{label: '领取方式', detail: '按下一屏指引获取'}],
      takeaway: '继续查看领取指令',
    };
  }
  if (/爆款选题方法/.test(text)) {
    return {
      structure: 'editorial-dual-rail',
      kicker: 'NEXT EPISODE',
      headline: '下一期拆解选题方法',
      leftItems: [{label: '方法', detail: '本人实际使用的选题逻辑'}],
      rightItems: [{label: '实操', detail: '结合真实内容继续拆解'}],
      takeaway: '下一屏补充核心Skill',
    };
  }
  if (/选题和文案/.test(text)) {
    return {
      structure: 'editorial-dual-rail',
      kicker: '爆款变量',
      headline: '剪辑之外还有两件事',
      leftItems: [{label: '选题', detail: '决定用户是否停留'}],
      rightItems: [{label: '文案', detail: '决定内容是否成立'}],
      takeaway: '剪辑只是完整链路的一环',
    };
  }
  if (/爆款选题方法还有核心Skill/.test(text)) {
    return {
      structure: 'editorial-dual-rail',
      kicker: 'NEXT EPISODE',
      headline: '下一期分享两项内容',
      leftItems: [{label: '爆款选题方法', detail: '公开实际选题逻辑'}],
      rightItems: [{label: '核心Skill', detail: '展示完整使用方法'}],
      takeaway: '关注后续实操拆解',
    };
  }
  if (/下期再见/.test(text)) {
    return {
      structure: 'editorial-dual-rail',
      kicker: 'SEE YOU NEXT',
      headline: '下期继续拆解',
      leftItems: [{label: '本期', detail: '智能剪辑工作流'}],
      rightItems: [{label: '下期', detail: '选题方法与Skill'}],
      takeaway: '继续关注下一期',
    };
  }
  const dualMatch = text.match(/(.+?)(?:包括了?|还有|以及|和)(.+)/);
  if (dualMatch) {
    const left = clip(dualMatch[1], 14);
    const right = clip(dualMatch[2], 14);
    return {
      structure: 'editorial-dual-rail',
      kicker: '双项重点',
      headline: '两项关键内容',
      leftItems: [{label: left, detail: '第一项核心内容'}],
      rightItems: [{label: right, detail: '第二项核心内容'}],
      takeaway: clip(text, 24),
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
