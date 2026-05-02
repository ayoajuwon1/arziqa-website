import Link from "next/link";

export default function HubsPage() {
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
        <h1>Hub <em>Network</em></h1>
        <p className="lede">
          Six hub zones across Nigeria&apos;s grain belt. Steel-frame warehousing calibrated to 11.5% moisture, optical sort, fumigation, and bag-level traceability.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 1,
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.08)",
          marginTop: 64,
          maxWidth: 900,
        }}>
          {[
            { zone: "Kano", region: "NW", coords: "09\u00B035\u2032N 008\u00B025\u2032E", status: "Operational" },
            { zone: "Benue", region: "NC", coords: "07\u00B043\u2032N 008\u00B031\u2032E", status: "Phase 2" },
            { zone: "Kaduna", region: "NW", coords: "10\u00B031\u2032N 007\u00B026\u2032E", status: "Phase 2" },
            { zone: "Gombe", region: "NE", coords: "10\u00B017\u2032N 011\u00B010\u2032E", status: "Phase 3" },
            { zone: "Kebbi", region: "NW", coords: "12\u00B027\u2032N 004\u00B012\u2032E", status: "Phase 3" },
            { zone: "Lagos", region: "SW", coords: "06\u00B027\u2032N 003\u00B024\u2032E", status: "Export terminal" },
          ].map((hub) => (
            <div key={hub.zone} style={{
              background: "var(--bg)",
              padding: "32px 28px",
            }}>
              <div style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: 28,
                letterSpacing: "-.01em",
                color: "var(--ink)",
                marginBottom: 8,
              }}>{hub.zone}</div>
              <div style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: ".22em",
                textTransform: "uppercase" as const,
                color: "var(--gold)",
                marginBottom: 4,
              }}>{hub.region} &middot; {hub.status}</div>
              <div style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: ".12em",
                color: "var(--ink-faint)",
              }}>{hub.coords}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
