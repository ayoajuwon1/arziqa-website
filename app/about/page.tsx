import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="brand">Arziqa</Link>
        <div className="links">
          <Link href="/about">Platform</Link>
          <Link href="/hubs">Network</Link>
          <Link href="/investors">Investors</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
      <main className="inner-page">
        <Link href="/" className="back-link">&larr; Back to journey</Link>
        <h1>The <em>Platform</em></h1>
        <p className="lede">
          Arziqa is the operating layer for Nigerian commodity infrastructure &mdash; storage, processing, financing, and export in one integrated system. From a single farmer in Benue to a buyer in Osaka, we hold the grain in trust.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 1,
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.08)",
          marginTop: 64,
          maxWidth: 900,
        }}>
          {[
            { n: "6", l: "Hub zones", x: "Across Nigeria\u2019s grain belt." },
            { n: "80K", l: "Metric tonnes", x: "Total storage capacity at full build." },
            { n: "30", l: "Months", x: "To full platform deployment." },
            { n: "$173M", l: "Commodity flow", x: "Gross throughput target, 2025." },
          ].map((item) => (
            <div key={item.l} style={{
              background: "var(--bg)",
              padding: "36px 32px",
            }}>
              <div style={{
                fontFamily: "var(--serif)",
                fontWeight: 200,
                fontSize: 48,
                lineHeight: 1,
                letterSpacing: "-.03em",
                color: "var(--gold)",
              }}>{item.n}</div>
              <div style={{
                marginTop: 14,
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: ".22em",
                textTransform: "uppercase" as const,
                color: "var(--ink-dim)",
              }}>{item.l}</div>
              <div style={{
                marginTop: 8,
                fontFamily: "var(--serif)",
                fontSize: 14,
                lineHeight: 1.4,
                color: "rgba(247,239,225,.5)",
              }}>{item.x}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
