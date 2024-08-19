# remark-obsidian-to-docusaurus

A Remark plugin to transform Obsidian-specific Markdown syntax into Docusaurus-compatible syntax

| Obsidian                                    | Docusaurus (Without plugin)                                                   | Docusaurus (With plugin)                                                |
|---------------------------------------------|-------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| ![obsidian_demo](./assets/obsidian_demo.png) | ![docusaurus_without_plugin_demo](./assets/docusaurus_without_plugin_demo.png) | ![docusaurus_with_plugin_demo](./assets/docusaurus_with_plugin_demo.png) |

Handles
- Admonitions ([javalent/admonitions](https://github.com/javalent/admonitions))
- Internal links
- Tags

## 🌳 Usage

1. Run `npm install remark-docusaurus-obsidian-bridge`

2. Add the following to your `docusaurus.config.js` or `docusaurus.config.ts`

```typescript
{
    ...
    presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          exclude: ["**/templates/*"],
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

## 📚 Resources

- [Docusaurus's official documentation](https://docusaurus.io/docs/markdown-features/plugins)
- [mdast](https://github.com/syntax-tree/mdast)
- [mdast-util-find-and-replace](https://github.com/syntax-tree/mdast-util-find-and-replace)
- [unist-util-map](https://github.com/syntax-tree/unist-util-map)
- [unist-builder](https://github.com/syntax-tree/mdast-util-from-markdown)

## 📄 License

[MIT][license] © [Chan Jun Ren][author]

[license]: license
[author]: https://chanjunren.github.io
