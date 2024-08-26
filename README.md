# 🗃️ docusaurus-obsidian-bridge

Tools for integrating a Obsidian Vault with a Docusaurus website

> [!NOTE]
> As of now, this is just a personal project meant for my [portfolio website](https://chanjunren.github.io)


| Obsidian                                                                                                                  | Docusaurus (Without plugin)                                                                                                                                 | Docusaurus (With plugin)                                                                                                                              |
|---------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![obsidian_demo](https://raw.githubusercontent.com/chanjunren/docusaurus-obsidian-bridge/master/assets/obsidian_demo.png) | ![docusaurus_without_plugin_demo](https://raw.githubusercontent.com/chanjunren/docusaurus-obsidian-bridge/master/assets/docusaurus_without_plugin_demo.png) | ![docusaurus_with_plugin_demo](https://raw.githubusercontent.com/chanjunren/docusaurus-obsidian-bridge/master/assets/docusaurus_with_plugin_demo.png) |

Handles
- Admonitions ([javalent/admonitions](https://github.com/javalent/admonitions))
- Internal links
- Tags

## 🌳 Usage

1. Install the necessary plugins 
```bash
npm i remark-docusaurus-obsidian-bridge docusaurus-plugin-obsidian-bridge
```

2. Add the following to your `docusaurus.config.js` or `docusaurus.config.ts`

```typescript
{
    ...
    presets: [
    [
      "classic",
      {
        docs: {
          ...
          beforeDefaultRemarkPlugins: [
            [convertToDocusaurusMdx, { customReplacers: [dateTagReplacer] }],
          ],
        },
        ...
      } satisfies Preset.Options,
    ],
  ],
  ...
}
```



## 🏗️ Components
| Component                                                                                                                                   | Description                                                                                      |
|---------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| [remark-docusaurus-obsidian-bridge](https://github.com/chanjunren/docusaurus-obsidian-bridge/tree/master/remark-docusaurus-obsidian-bridge) | A Remark plugin to transform Obsidian-specific Markdown syntax into Docusaurus-compatible syntax |
| [docusaurus-plugin-obsidian-bridge](https://github.com/chanjunren/docusaurus-obsidian-bridge/tree/master/packages/docusaurus-plugin-obsidian-bridge) | A Docusaurus plugin that preprocesses your docusaurus document files and outputs data that is used by `remark-docusaurus-obsidian-bridge` |
