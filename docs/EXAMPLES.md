# Examples

## Real invocation: auto-editing-0

The repository includes a real-call record built from an authorized local talking-head video and its SRT. The original media is not distributed. Public evidence includes input hashes, generic media facts, the generated storyboard, output hash, QA report, and screenshots extracted from the actual rendered MP4.

See [examples/auto-editing-0/README.md](../examples/auto-editing-0/README.md).

## Synthetic fixture

The synthetic fixture can be generated locally with FFmpeg and then packaged without private media:

```bash
npm run make:synthetic
npm run example:synthetic
```

Both examples exercise the same public CLI and storyboard contract.
