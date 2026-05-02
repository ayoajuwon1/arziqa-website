import Link from "next/link";

export default function InvestorsPage() {
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
        <h1>For <em>Investors</em></h1>
        <p className="lede">
          Arziqa is raising catalytic equity to build commodity infrastructure across Nigeria &mdash; storage, processing, and export in one vertically integrated operating layer.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 1,
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.08)",
          marginTop: 64,
          maxWidth: 900,
        }}>
          {[
            { n: "$173.4M", l: "Gross commodity flow" },
            { n: "14%", l: "Return on equity" },
            { n: "$12M", l: "Farmer payouts" },
            { n: "30", l: "Vessels FOB" },
          ].map((stat) => (
            <div key={stat.l} style={{
              background: "var(--bg)",
              padding: "36px 28px",
            }}>
              <div style={{
                fontFamily: "var(--serif)",
                fontWeight: 200,
                fontSize: 48,
                lineHeight: 1,
                letterSpacing: "-.03em",
                color: "var(--gold)",
              }}>{stat.n}</div>
              <div style={{
                marginTop: 14,
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: ".22em",
                textTransform: "uppercase" as const,
                color: "var(--ink-dim)",
              }}>{stat.l}</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 80,
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 24,
          lineHeight: 1.4,
          color: "var(--ink-dim)",
          maxWidth: 560,
        }}>
          Contact us to request the full investment memorandum and financial model.
        </div>
        <Link
          href="/contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            marginTop: 40,
            padding: "22px 32px",
            fontFamily: "var(--mono)",
            fontSize: 11.5,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            borderRadius: 999,
            background: "var(--gold)",
            color: "#0A0907",
            transition: "all .3s",
          }}
        >
          Request memo
        </Link>
      </main>
    </>
  );
}
