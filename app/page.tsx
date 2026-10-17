import Link from "next/link"
import {
  ArrowRight, Search, FileText, ClipboardList, Scale,
  BookOpen, ShieldCheck, Landmark
} from "lucide-react"

const tools = [
  {
    href: "/search",
    icon: Search,
    title: "Legal Research",
    description: "Explore Zimbabwean case law and legislation through natural-language research.",
  },
  {
    href: "/draft",
    icon: FileText,
    title: "Contract Drafter",
    description: "Build a first draft of common agreements for careful review and refinement.",
  },
  {
    href: "/forms",
    icon: ClipboardList,
    title: "Court Forms",
    description: "Prepare supported court forms and legal documents in a more guided workflow.",
  },
  {
    href: "/sentencing",
    icon: Scale,
    title: "Sentencing Tool",
    description: "Explore indicative sentencing information with careful attention to precedent.",
  },
]

export default function Home() {
  return (
    <main className="lz-public">
      <header className="lz-public-header">
        <Link href="/" className="lz-brand" aria-label="LexiZW home">
          <span className="lz-brand-mark" aria-hidden="true">L<span>.</span></span>
          <span className="lz-brand-copy">
            <span className="lz-brand-name">LexiZW</span>
            <span className="lz-brand-subtitle">AI LEGAL SUITE</span>
          </span>
        </Link>
        <nav className="lz-public-nav" aria-label="Main navigation">
          <a href="#tools">Legal tools</a>
          <a href="#approach">Our approach</a>
          <Link className="lz-public-signin" href="/sign-in">Sign in</Link>
          <Link className="lz-public-cta" href="/sign-up">Get started <ArrowRight size={14} /></Link>
        </nav>
      </header>

      <section className="lz-public-hero">
        <div className="lz-public-hero-copy">
          <div className="lz-public-eyebrow">LEGAL TECHNOLOGY FOR ZIMBABWE</div>
          <h1>Clarity for your legal work. <em>Confidence in every step.</em></h1>
          <p>
            LexiZW brings legal research and document preparation tools into one
            considered workspace, designed around the needs of Zimbabwe&apos;s legal community.
          </p>
          <div className="lz-public-actions">
            <Link href="/sign-up" className="lz-button lz-button-primary">Explore LexiZW <ArrowRight size={16} /></Link>
            <Link href="/sign-in" className="lz-button lz-button-secondary">Sign in to your workspace</Link>
          </div>
          <div className="lz-public-proof">
            <span><i /> Built for Zimbabwe</span>
            <span><i /> Research and drafting tools</span>
            <span><i /> Human review remains essential</span>
          </div>
        </div>
        <div className="lz-public-hero-image" role="img" aria-label="Legal books and documents in a professional legal setting">
          <div className="lz-public-image-label"><span /> A MORE THOUGHTFUL LEGAL WORKSPACE</div>
        </div>
      </section>

      <section className="lz-public-band" id="approach">
        <div className="lz-public-band-inner">
          <div className="lz-public-band-item">
            <Landmark size={21} />
            <div><strong>Zimbabwe-focused</strong><span>Tools intended for Zimbabwean legal work and context.</span></div>
          </div>
          <div className="lz-public-band-item">
            <BookOpen size={21} />
            <div><strong>Built for practical work</strong><span>Research and document workflows brought into one place.</span></div>
          </div>
          <div className="lz-public-band-item">
            <ShieldCheck size={21} />
            <div><strong>Review matters</strong><span>AI assists the process; professional judgement stays central.</span></div>
          </div>
        </div>
      </section>

      <section className="lz-public-tools" id="tools">
        <div className="lz-public-tools-heading">
          <div>
            <p className="lz-kicker">THE LEXIZW WORKSPACE</p>
            <h2>Thoughtful tools for the work that matters.</h2>
          </div>
          <p>Start with the task in front of you. Move between tools in a consistent, focused experience.</p>
        </div>
        <div className="lz-public-tool-grid">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <article key={tool.href} className="lz-public-tool">
                <Icon size={22} strokeWidth={1.6} />
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <Link href="/sign-in">Open workspace <ArrowRight size={14} /></Link>
              </article>
            )
          })}
        </div>
      </section>

      <div className="lz-public-disclaimer">
        LexiZW provides AI-assisted tools, not legal advice. Always verify generated content and legal authorities with a qualified Zimbabwean legal practitioner.
      </div>
      <footer className="lz-public-footer">
        <span>© {new Date().getFullYear()} LexiZW · AI Legal Suite</span>
        <span>Designed to support, not replace, professional legal judgement.</span>
      </footer>
    </main>
  )
}

