import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { joinSegments } from "../util/path"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  // Use static folder (more reliable than assets) - logos copied to quartz/static/
  const logoPathBlack = joinSegments(baseDir, "static/refi-dao-logo-black.png")
  const logoPathWhite = joinSegments(baseDir, "static/refi-dao-logo-white.png")
  
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <img src={logoPathBlack} alt={title} class="logo-light" />
        <img src={logoPathWhite} alt={title} class="logo-dark" />
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}

.page-title a {
  display: inline-block;
  position: relative;
}

.page-title img.logo-light,
.page-title img.logo-dark {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}

.page-title img.logo-light {
  position: relative;
}

.page-title img.logo-dark {
  display: none;
}

[saved-theme="dark"] .page-title img.logo-light {
  display: none;
}

[saved-theme="dark"] .page-title img.logo-dark {
  display: block;
  position: relative;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
