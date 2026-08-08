# 自动剪辑 0：真实调用案例

这是一次真实的 Skill 调用记录，不是组件画廊或人工拼接效果图。输入是一段 49.273 秒的横版口播视频与 21 条 SRT；源片已经烧录字幕，因此调用使用 `burned-in` 模式，没有叠加第二层字幕。

公开仓库不分发原始视频、原始 SRT 或完整渲染成片，只保留可复核的派生产物：输入哈希与媒体参数、实际调用命令、完整 storyboard、输出哈希、QA 记录，以及从最终成片直接抽取的预览帧。

## 实际调用

见 [invocation.txt](invocation.txt)。这次调用依次通过 Gate A、Gate B、Gate C 和 Gate D，最后才执行成片渲染与成片级 QA。

## 输入与输出

- 输入：1920×1080、30fps、HEVC/AAC、49.273 秒。
- 字幕：21 条；源片已烧录字幕。
- 规划：22 个视觉节拍、6 套配色、8 种实际使用结构，最长 3.2 秒；10 个短全屏解释态、6 个左侧态、6 个右侧态，左右连续重复为 0。
- 输出：1920×1080、30fps、H.264/AAC、49.323 秒，35,100,883 bytes。
- 输出 SHA-256：`026C197E05B3D3C14323DF04A81F27C6F252E467D8BADC7CA963D02121278C37`。

完整参数见 [input-manifest.json](input-manifest.json)，分镜见 [storyboard.json](storyboard.json)，逐帧证据见 [preview-manifest.json](preview-manifest.json)，最终验收见 [QA_REPORT.md](QA_REPORT.md)。

## 事实边界

视频口播中的“几万流量池”“5 分钟”“Plus 周额度 3%”“一周几十条”和“爆款概率”等表述属于讲述者对个人案例、当次消耗或经验判断的陈述。本案例只验证 Skill 的包装流程与成片，不把这些口播内容升级为独立验证的普遍结论。
