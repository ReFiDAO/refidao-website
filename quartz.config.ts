import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration for ReFi DAO Documentation Site
 * 
 * This configuration is for the docs subdomain (docs.refidao.com).
 * The main site (refidao.com) is built separately using the site/ directory.
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "ReFi DAO Docs",
    pageTitleSuffix: " - Documentation",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "docs.refidao.com",
    ignorePatterns: ["private", "templates", ".obsidian", "node_modules", "public", "site"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#ffffff",
          lightgray: "#f5f5f5",
          gray: "#888888",
          darkgray: "#333333",
          dark: "#1a1a1a",
          secondary: "#4a9eff",
          tertiary: "#6bb3ff",
          highlight: "rgba(74, 158, 255, 0.15)",
          textHighlight: "rgba(74, 158, 255, 0.25)",
        },
        darkMode: {
          light: "#0d1117",
          lightgray: "#161b22",
          gray: "#8b949e",
          darkgray: "#c9d1d9",
          dark: "#f0f6fc",
          secondary: "#58a6ff",
          tertiary: "#79c0ff",
          highlight: "rgba(88, 166, 255, 0.15)",
          textHighlight: "rgba(88, 166, 255, 0.25)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
