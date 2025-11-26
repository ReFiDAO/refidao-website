import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version} <span class="external-arrow">↗</span></a> © {year}
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => {
            const isExternal = link.startsWith("http://") || link.startsWith("https://")
            return (
              <li>
                <a href={link}>
                  {text}
                  {isExternal && <span class="external-arrow">↗</span>}
                </a>
              </li>
            )
          })}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
