import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageTitle(),
    Component.Navigation(),
    Component.Search(),
    Component.Darkmode(),
    Component.Profile(),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "Twitter": "https://twitter.com/refidao",
      "Discord": "https://discord.gg/refidao",
      "GitHub": "https://github.com/ReFiDAO",
      "Newsletter": "/newsletter",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.TagList(),
  ],
  left: [],  // Empty - sidebars hidden by default via CSS
  right: [], // Empty - sidebars hidden by default via CSS
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [],  // Empty - sidebars hidden by default via CSS
  right: [], // Empty - sidebars hidden by default via CSS
}
