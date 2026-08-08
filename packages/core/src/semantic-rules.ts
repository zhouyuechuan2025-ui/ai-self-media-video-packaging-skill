import type {DirectorRole, IllustrationScenario, MotionPrimitive, VisualStructure} from './schema';

const contains = (text: string, expression: RegExp) => expression.test(text);

export const chooseStructure = (text: string, index: number): VisualStructure => {
  if (index === 0 && contains(text, /为什么|怎么|如何|到底|[?？]/)) return 'impact-question';
  if (contains(text, /官方|证据|截图|来源|文档/)) return index % 2 ? 'evidence-takeover' : 'evidence-pip';
  if (contains(text, /以前.*现在|优化前|优化后|不是.*而是|但是|却/)) return 'before-after';
  if (contains(text, /\d|一倍|两倍|三倍|百分之|%|万|千/)) return 'metric-counter';
  if (contains(text, /步骤|第一|第二|第三|首先|然后|接着/)) return 'adaptive-steps';
  if (contains(text, /路径|流程|流转|闭环|连接|串联/)) return 'signal-route';
  if (contains(text, /完成|最后|总结|评论区|下一步/)) return 'completion-rail';
  if (contains(text, /不等于|反而|真相|关键不是/)) return 'contrarian-stamp';
  if (contains(text, /两个|一边|另一边|对比|区别/)) return 'dual-concept';
  if (contains(text, /能力|功能|包括|包含/)) return 'capability-matrix';
  return index % 3 === 0 ? 'gradient-keyword' : index % 3 === 1 ? 'side-insight-card' : 'keyword-relay';
};

export const fallbackStructure = (index: number): VisualStructure => {
  const values: VisualStructure[] = [
    'gradient-keyword', 'side-insight-card', 'keyword-relay', 'state-switch',
    'chapter-timeline', 'three-beat-hook', 'split-conflict',
  ];
  return values[index % values.length];
};

export const motionsForStructure = (structure: VisualStructure): MotionPrimitive[] => {
  if (structure === 'impact-question') return ['hit', 'focus'];
  if (structure === 'contrarian-stamp') return ['stamp', 'reveal'];
  if (structure === 'metric-counter') return ['count', 'focus'];
  if (structure === 'signal-route') return ['route', 'trace'];
  if (structure.startsWith('evidence-')) return ['reveal', 'focus'];
  if (structure === 'completion-rail') return ['relay', 'stamp'];
  if (structure === 'adaptive-steps' || structure === 'chapter-timeline') return ['relay', 'slide'];
  return ['lift', 'reveal'];
};

export const chooseIllustration = (text: string): IllustrationScenario | undefined => {
  if (contains(text, /官方|证据|截图|来源|文档/)) return undefined;
  if (contains(text, /路径|流程|流转|闭环|连接|串联/)) return 'route-activation';
  if (contains(text, /推|爬|攀|困难|难点|坑/)) return 'climb-boulder';
  if (contains(text, /平衡|权衡|成本|取舍/)) return 'workstation-balance';
  if (contains(text, /更快|速度|飞速|提速/)) return 'paper-plane-route';
  if (contains(text, /以前|现在|优化前|优化后/)) return 'before-after-illustration';
  if (contains(text, /任务|窗口|信息过载|忙不过来/)) return 'information-overload';
  return undefined;
};

export const chooseDirectorRole = (text: string, index: number): DirectorRole => {
  if (index === 0) return 'hook';
  if (contains(text, /官方|证据|截图|来源|文档/)) return 'evidence';
  if (contains(text, /评论区|关注|咨询|下一期|下一步/)) return 'cta';
  if (contains(text, /最后|总结|完成|交付|结果/)) return 'payoff';
  if (contains(text, /以前.*现在|优化前|优化后|不是.*而是|但是|却|不等于|反而/)) return 'contrast';
  if (contains(text, /问题|难点|卡点|没人看|不清楚/)) return 'problem';
  if (contains(text, /步骤|第一|第二|第三|首先|然后|接着/)) return 'steps';
  if (contains(text, /路径|流程|流转|闭环|连接|串联/)) return 'mechanism';
  if (contains(text, /\d|一倍|两倍|三倍|百分之|%|万|千|分钟/)) return 'data';
  return 'definition';
};
