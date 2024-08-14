# remark-obsidian-to-docusaurus

A Remark plugin to transform Obsidian-specific Markdown syntax into Docusaurus-compatible syntax

## ✨ Features

<details>
<summary>Internal links</summary>

Convert obsidian's internal link ( `[[link]]` ) to Docusaurus-friendly internal links

</details>

<details>
<summary>Admonitions</summary>

Converts obsidian `admonitions` ([javalent/admonitions](https://github.com/javalent/admonitions)) to Docusaurus-friendly admonotions

</details>

<details>
<summary>Tags</summary>

Convert obsidian's tags (`#tag`) to Docusaurus-friendly internal links

</details>

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
          beforeDefaultRemarkPlugins: [convertToDocusaurusMdx],
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
