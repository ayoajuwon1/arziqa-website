import Link from "next/link";

export default function ContactPage() {
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
        <h1><em>Contact</em></h1>
        <p className="lede">
          Reach out to discuss the platform, partnership opportunities, or investment. We operate from Lagos and Kano.
        </p>
        <div style={{
          marginTop: 64,
          maxWidth: 480,
          display: "flex",
          flexDirection: "column" as const,
          gap: 32,
        }}>
          <div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: ".22em",
              textTransform: "uppercase" as const,
              color: "var(--gold)",
              marginBottom: 12,
            }}>Email</div>
            <div style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 22,
              color: "var(--ink)",
            }}>hello@arziqa.com</div>
          </div>
          <div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: ".22em",
              textTransform: "uppercase" as const,
              color: "var(--gold)",
              marginBottom: 12,
            }}>Lagos office</div>
            <div style={{
              fontFamily: "var(--serif)",
              fontWeight: 300,
              fontSize: 16,
              lineHeight: 1.5,
              color: "var(--ink-dim)",
            }}>
              Victoria Island, Lagos<br />
              Nigeria
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: ".22em",
              textTransform: "uppercase" as const,
              color: "var(--gold)",
              marginBottom: 12,
            }}>Kano hub</div>
            <div style={{
              fontFamily: "var(--serif)",
              fontWeight: 300,
              fontSize: 16,
              lineHeight: 1.5,
              color: "var(--ink-dim)",
            }}>
              09&deg;35&prime;N 008&deg;25&prime;E<br />
              Kano, NW zone
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
