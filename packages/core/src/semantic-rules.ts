import type {DirectorRole, IllustrationScenario, MotionPrimitive} from './schema';
import type {SemanticStructure} from './template-contracts';

const contains = (text: string, expression: RegExp) => expression.test(text);

export const classifySemanticStructure = (text: string, index: number): SemanticStructure => {
  if (contains(text, /官方|证据|截图|来源|文档/)) return 'evidence-panel';
  if (contains(text, /以前|现在|优化前|优化后|从.+(?:变成|转为)|不是.+而是/)) return 'before-after-scrub';
  if (contains(text, /丢进去.+(?:剪完|生成|完成)/)) return 'signal-route';
  if (contains(text, /首先|然后|接着|随后|最后|第一|第二|第三|第四|步骤|字幕.+(?:卡点|特效)|卡点.+特效/)) return 'four-stage-pipeline';
  if (contains(text, /运行|点击|打开|检查|审核|确认|输入命令|评论区打|点个关注|直接拿去用|继续分享|分享给大家/)) return 'command-palette';
  if (contains(text, /反馈|来回|双向|输入.+输出|人.+AI|AI.+人/)) return 'bidirectional-flow';
  if (contains(text, /路径|节点|流向|串联|闭环|连接/)) return 'signal-route';
  if (contains(text, /\d|百分之|%|几万|几十|几个月|万|千|分钟|小时|倍/)) return 'metric-odometer';
  if (contains(text, /困难|难点|卡住|踩坑|坑|推着|攀爬|越过|起飞|平衡|转化/)) return 'semantic-doodle';
  if (contains(text, /因为|原因|关键|证明|意味着|为什么|如何|怎么|概率|只靠.+不够|[?？]/)) return 'thesis-and-proof';
  if (contains(text, /一边|另一边|左边|右边|两类|两个方面|包括.+和|还有.+和|选题和文案/)) return 'editorial-dual-rail';
  return index === 0 ? 'thesis-and-proof' : 'editorial-dual-rail';
};

export const motionsForStructure = (structure: SemanticStructure): MotionPrimitive[] => {
  if (structure === 'thesis-and-proof') return ['hit', 'focus'];
  if (structure === 'editorial-dual-rail') return ['slide', 'reveal'];
  if (structure === 'bidirectional-flow') return ['route', 'relay'];
  if (structure === 'command-palette') return ['focus', 'stamp'];
  if (structure === 'four-stage-pipeline') return ['route', 'relay'];
  if (structure === 'before-after-scrub') return ['slide', 'reveal'];
  if (structure === 'evidence-panel') return ['reveal', 'focus'];
  if (structure === 'metric-odometer') return ['count', 'hit'];
  if (structure === 'signal-route') return ['route', 'trace'];
  return ['trace', 'lift'];
};

export const chooseIllustration = (text: string): IllustrationScenario | undefined => {
  if (contains(text, /官方|证据|截图|来源|文档/)) return undefined;
  if (contains(text, /路径|流程|流转|闭环|连接|串联|节点/)) return 'route-activation';
  if (contains(text, /推|爬|攀|困难|难点|坑|越过/)) return 'climb-boulder';
  if (contains(text, /平衡|权衡|成本|取舍/)) return 'workstation-balance';
  if (contains(text, /更快|速度|飞速|提速|起飞/)) return 'paper-plane-route';
  if (contains(text, /以前|现在|优化前|优化后/)) return 'before-after-illustration';
  if (contains(text, /任务|窗口|信息过载|忙不过来/)) return 'information-overload';
  return undefined;
};

export const chooseDirectorRole = (text: string, index: number): DirectorRole => {
  if (index === 0) return 'hook';
  if (contains(text, /官方|证据|截图|来源|文档/)) return 'evidence';
  if (contains(text, /评论区|关注|咨询|下一期|下一步/)) return 'cta';
  if (contains(text, /最后|总结|完成|交付|结果/)) return 'payoff';
  if (contains(text, /以前|现在|优化前|优化后|不是.+而是|反而/)) return 'contrast';
  if (contains(text, /问题|难点|卡点|没人看|不清楚/)) return 'problem';
  if (contains(text, /步骤|第一|第二|第三|第四|首先|然后|接着/)) return 'steps';
  if (contains(text, /路径|流程|流转|闭环|连接|串联|反馈/)) return 'mechanism';
  if (contains(text, /\d|百分之|%|万|千|分钟|小时|倍/)) return 'data';
  return 'definition';
};
