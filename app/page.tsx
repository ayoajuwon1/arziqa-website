"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const STAGES = [
  "The Harvest",
  "The Crisis",
  "The Hub",
  "The Receipt",
  "The Transformation",
  "The Voyage",
  "The Value",
  "The Beginning",
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [chNum, setChNum] = useState("01");
  const [chName, setChName] = useState("The Harvest");
  const [arcOffset, setArcOffset] = useState(119.4);
  const [seedTop, setSeedTop] = useState(80);
  const [activeStops, setActiveStops] = useState<boolean[]>(
    new Array(8).fill(false)
  );

  const stagesRef = useRef<(HTMLElement | null)[]>([]);
  const railSeedRef = useRef<HTMLDivElement>(null);
  const countedRef = useRef<Set<string>>(new Set());
  const priceNewRef = useRef<HTMLDivElement>(null);
  const vNumRef = useRef<HTMLSpanElement>(null);

  // Loader
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setLoaded(true);
      document.body.style.overflow = "auto";
      // Reveal harvest elements
      document.querySelectorAll(".s-harvest .rv").forEach((el, i) => {
        setTimeout(() => el.classList.add("in"), 100 + i * 150);
      });
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  // Counter animation
  const animateCounter = useCallback(
    (id: string, el: HTMLElement | null, from: number, to: number, prefix: string, suffix: string) => {
      if (countedRef.current.has(id) || !el) return;
      countedRef.current.add(id);
      const start = performance.now();
      const dur = 1600;
      function tick(t: number) {
        const k = Math.min((t - start) / dur, 1);
        const e = 1 - Math.pow(1 - k, 3);
        const v = Math.round(from + (to - from) * e);
        el!.textContent = prefix + v.toLocaleString() + suffix;
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },
    []
  );

  // Scroll handler
  useEffect(() => {
    function update() {
      const sH = window.innerHeight;
      const docH = document.documentElement.scrollHeight - sH;
      const sc = window.scrollY;
      const p = Math.min(Math.max(sc / docH, 0), 1);

      // Progress arc
      const circ = 119.4;
      setArcOffset(circ - circ * p);

      // Rail seed position
      const railTop = 80;
      const railBottom = sH - 80;
      setSeedTop(railTop + (railBottom - railTop) * p);

      // Active stage
      let active = 0;
      stagesRef.current.forEach((s, i) => {
        if (!s) return;
        const r = s.getBoundingClientRect();
        if (r.top <= sH * 0.4 && r.bottom > sH * 0.4) active = i;
      });

      const newStops = new Array(8).fill(false);
      for (let i = 0; i <= active; i++) newStops[i] = true;
      setActiveStops(newStops);
      setChNum(String(active + 1).padStart(2, "0"));
      setChName(STAGES[active]);

      // Reveals
      document.querySelectorAll(".rv").forEach((el) => {
        if (el.classList.contains("in")) return;
        const r = el.getBoundingClientRect();
        if (r.top < sH * 0.85) el.classList.add("in");
      });

      // Receipt section in
      const rec = document.querySelector(".s-receipt");
      if (rec && rec.getBoundingClientRect().top < sH * 0.5) {
        rec.classList.add("in");
      }

      // Counter on price + value
      const trans = document.querySelector(".s-trans");
      if (trans && trans.getBoundingClientRect().top < sH * 0.6) {
        animateCounter("priceNew", priceNewRef.current, 1200, 1850, "$", "");
      }
      const val = document.querySelector(".s-value");
      if (val && val.getBoundingClientRect().top < sH * 0.6) {
        animateCounter("vNum", vNumRef.current, 0, 1850, "", "");
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [animateCounter]);

  return (
    <>
      {/* LOADER */}
      <div className={`loader${loaded ? " gone" : ""}`} id="loader">
        <div className="seed" />
        <div className="seed-text">Follow the seed.</div>
        <div className="seed-mark">
          Arziqa &nbsp;&middot;&nbsp; <span>Journey of a Grain</span>
        </div>
      </div>

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="brand">Arziqa</Link>
        <div className="links">
          <Link href="/about">Platform</Link>
          <Link href="/hubs">Network</Link>
          <Link href="/investors">Investors</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/command" style={{ color: '#00D4FF' }}>Command</Link>
        </div>
      </nav>

      {/* CHAPTER READOUT */}
      <div className="chapter">
        <span className="num">{chNum}</span>
        <span className="of">/</span>
        <span>08</span>
        <em>&mdash;</em>
        <span className="nm">{chName}</span>
      </div>

      {/* SCROLL PROGRESS ARC */}
      <div className="progress-arc" aria-hidden="true">
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle className="track" cx="22" cy="22" r="19" />
          <circle
            className="fill"
            cx="22"
            cy="22"
            r="19"
            strokeDasharray="119.4"
            strokeDashoffset={arcOffset}
          />
        </svg>
      </div>

      {/* LEFT GOLD RAIL */}
      <div className="rail">
        <div className="rail-stops">
          {STAGES.map((name, i) => (
            <div
              key={i}
              className={`rail-stop${activeStops[i] ? " active" : ""}`}
              style={{ top: `${(i / (STAGES.length - 1)) * 100}%` }}
            >
              <i>{String(i + 1).padStart(2, "0")}</i>
              <b />
              <span>{name}</span>
            </div>
          ))}
        </div>
        <div
          className="rail-seed"
          ref={railSeedRef}
          style={{ top: `${seedTop}px` }}
        />
      </div>

      {/* ============ STAGE 01 -- THE HARVEST ============ */}
      <section
        className="stage s-harvest"
        data-stage="0"
        data-name="The Harvest"
        ref={(el) => { stagesRef.current[0] = el; }}
      >
        <div className="bg" />
        <div className="body">
          <div className="eyebrow rv">Chapter I &nbsp;&middot;&nbsp; The Harvest</div>
          <h1 className="rv" data-d="1">
            A farmer in Benue<br />
            harvests her <em>sesame.</em>
          </h1>
          <div className="stat-line rv" data-d="2">
            <div><b>14 mt</b>October yield</div>
            <div><b>$1,200</b>Gate price &middot; per mt</div>
            <div><b>72 hr</b>Until the rain comes</div>
          </div>
          <div
            className="micro rv"
            data-d="3"
            style={{
              marginTop: 48,
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: ".22em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,.45)",
              display: "flex",
              gap: 32,
              flexWrap: "wrap" as const,
            }}
          >
            <span>07&deg;43&prime;N &middot; 008&deg;31&prime;E</span>
            <span>Lat. Benue, NG</span>
            <span>Sesame &middot; Sesamum indicum</span>
            <span>Hand-cut &middot; pre-dawn</span>
          </div>
        </div>
      </section>

      {/* ============ STAGE 02 -- THE CRISIS ============ */}
      <section
        className="stage s-crisis"
        data-stage="1"
        data-name="The Crisis"
        ref={(el) => { stagesRef.current[1] = el; }}
      >
        <div className="stage-tag">Chapter II &nbsp;&middot;&nbsp; The Crisis</div>
        <div className="pre rv">Post-harvest loss &middot; Sub-Saharan grain</div>
        <div className="big rv" data-d="1">
          6<sup>%</sup>
        </div>
        <div className="pull rv" data-d="2">
          Six in every hundred tonnes <b>never reach a buyer.</b> Spoiled in transit, lost to rain, sold below break-even &mdash; because there is no place to <em>hold</em>.
        </div>
        <div className="data rv" data-d="3">
          <div className="d">
            <div className="n"><em>$4.5B</em></div>
            <div className="l">Annual loss &middot; NG alone</div>
            <div className="x">Unstored grain &amp; oilseed, 2024 ledger.</div>
          </div>
          <div className="d">
            <div className="n">42%</div>
            <div className="l">Smallholder share</div>
            <div className="x">Sell within 14 days of harvest at gate price.</div>
          </div>
          <div className="d">
            <div className="n">0.6%</div>
            <div className="l">Modern storage</div>
            <div className="x">Of national grain throughput. Tier-1 lender accepted.</div>
          </div>
        </div>
        <div className="stage-foot">
          <span>Source &middot; NCMB ledger 2024</span>
          <span>02 / 08</span>
        </div>
      </section>

      {/* ============ STAGE 03 -- THE HUB ============ */}
      <section
        className="stage s-hub"
        data-stage="2"
        data-name="The Hub"
        ref={(el) => { stagesRef.current[2] = el; }}
      >
        <div className="bg" />
        <div className="body">
          <div
            className="eyebrow rv"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: ".28em",
              textTransform: "uppercase" as const,
              color: "var(--gold)",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ width: 48, height: 1, background: "var(--gold)" }} />
            Chapter III &nbsp;&middot;&nbsp; The Hub
          </div>
          <h2 className="rv" data-d="1">
            Her sesame<br />
            arrives at <em>Kano.</em>
          </h2>
          <p className="lede rv" data-d="2">
            Steel-frame warehousing, calibrated to 11.5% moisture. Optical sort, fumigation, bag-level traceability. Twelve hours from intake to negotiable receipt.
          </p>
          <div className="pills rv" data-d="3">
            <div className="pill">Storage</div>
            <div className="pill">Cleaning</div>
            <div className="pill">Optical sort</div>
            <div className="pill">Fumigation</div>
            <div className="pill">Bagging</div>
            <div className="pill">Negotiable receipts</div>
            <div className="pill">Insurance</div>
          </div>
        </div>
        <div className="specs rv" data-d="2">
          <div className="row"><span>Capacity</span><b>80,000 mt</b></div>
          <div className="row"><span>Throughput</span><b>240 mt/d</b></div>
          <div className="row"><span>Hold</span><b>18 mo</b></div>
          <div className="row"><span>Moisture</span><b>11.5%</b></div>
        </div>
        <div className="stage-foot">
          <span>Kano hub &middot; NW zone &middot; 09&deg;35&prime;N 008&deg;25&prime;E</span>
          <span>03 / 08</span>
        </div>
      </section>

      {/* ============ STAGE 04 -- THE RECEIPT ============ */}
      <section
        className="stage s-receipt"
        data-stage="3"
        data-name="The Receipt"
        ref={(el) => { stagesRef.current[3] = el; }}
      >
        <div className="left">
          <div className="pre rv">Chapter IV &nbsp;&middot;&nbsp; The Receipt</div>
          <h2 className="rv" data-d="1">
            Now her grain<br />
            is a <em>negotiable instrument.</em>
          </h2>
          <p className="lede rv" data-d="2">
            A warehouse receipt &mdash; accepted by Tier-1 Nigerian lenders. She walks in with bagged sesame; she walks out with a credit line against it. The harvest stops being a deadline.
          </p>
        </div>
        <div className="right">
          <div className="receipt rv" data-d="2">
            <div className="watermark">Registered</div>
            <div className="stamp">Verified &middot; NCMB</div>
            <div className="top">
              <div className="l">
                Arziqa <em>NG</em>
                <span>Negotiable warehouse receipt</span>
              </div>
              <div className="r">
                No. 0 7 4 2 9 1<br />
                MMXXVI &middot; X &middot; 14<br />
                Kano hub
              </div>
            </div>
            <div className="row"><span>Holder</span><b>A. Iorshe (Benue)</b></div>
            <div className="row"><span>Commodity</span><b>Sesame &middot; grade 1</b></div>
            <div className="row"><span>Tonnage</span><b>14.00 mt</b></div>
            <div className="row"><span>Moisture</span><b>11.4%</b></div>
            <div className="row"><span>Bag count</span><b>280 &middot; jute</b></div>
            <div className="row"><span>Hold period</span><b>12 mo &middot; auto-renew</b></div>
            <div className="total">
              <span>Collateral value</span>
              <b>&#8358;24.8M</b>
            </div>
            <div className="barcode" />
            <div className="barcode-num">
              0 7 4 2 9 1 &nbsp; &middot; &nbsp; A R Z Q &middot; K A N &middot; 2 6
            </div>
            <div className="sig">
              <div className="s"><b>A. Iorshe</b><span>Holder</span></div>
              <div className="s"><b>O. Adebayo</b><span>Hub master &middot; Kano</span></div>
            </div>
            <div className="seal">
              <b>Arziqa</b>
              <span>Vault &nbsp;&middot;&nbsp; Sealed</span>
            </div>
            <div className="perf" />
          </div>
        </div>
      </section>

      {/* ============ STAGE 05 -- THE TRANSFORMATION ============ */}
      <section
        className="stage s-trans"
        data-stage="4"
        data-name="The Transformation"
        ref={(el) => { stagesRef.current[4] = el; }}
      >
        <div className="stage-tag">Chapter V &nbsp;&middot;&nbsp; The Transformation</div>
        <div className="pre rv">Hold &middot; process &middot; time the market</div>
        <h2 className="rv" data-d="1">
          She holds for six months.<br />
          The market <em>turns.</em>
        </h2>
        <div className="arrow-row rv" data-d="2">
          <div className="price old">$1,200</div>
          <div className="arrow">&rarr;</div>
          <div className="price new" ref={priceNewRef}>$1,850</div>
        </div>
        <div className="badge rv" data-d="3">54% premium &middot; per tonne</div>
        <div className="footnote rv" data-d="4">
          Average uplift across Arziqa-held sesame in the 2025 cycle. The grain didn&apos;t change. The patience did.
        </div>
        <div className="stage-foot">
          <span>Sesame &middot; 2025 hold cycle &middot; Lagos FOB index</span>
          <span>05 / 08</span>
        </div>
      </section>

      {/* ============ STAGE 06 -- THE VOYAGE ============ */}
      <section
        className="stage s-voyage"
        data-stage="5"
        data-name="The Voyage"
        ref={(el) => { stagesRef.current[5] = el; }}
      >
        <div className="bg" />
        <div className="body">
          <div className="eyebrow rv">Chapter VI &nbsp;&middot;&nbsp; The Voyage</div>
          <h2 className="rv" data-d="1">
            Loaded FOB Lagos.<br />
            Destination: <em>Osaka.</em>
          </h2>
          <div className="route rv" data-d="2">
            <div className="city"><b>Origin</b>Apapa</div>
            <div className="dash" />
            <div className="city"><b>Transit</b>Suez &middot; 28d</div>
            <div className="dash" />
            <div className="city"><b>Discharge</b>Osaka</div>
          </div>
          <div className="ledger rv" data-d="3">
            <div className="e">
              <div className="d">14 OCT &middot; MMXXVI</div>
              <div className="t">Loaded FOB</div>
              <div className="x">Apapa terminal &middot; container 4 sealed</div>
            </div>
            <div className="e">
              <div className="d">06 NOV</div>
              <div className="t">Suez transit</div>
              <div className="x">SCFI lane 7 &middot; clear</div>
            </div>
            <div className="e">
              <div className="d">28 NOV</div>
              <div className="t">Discharged</div>
              <div className="x">Osaka south &middot; bonded</div>
            </div>
            <div className="e">
              <div className="d">04 DEC</div>
              <div className="t">Buyer paid</div>
              <div className="x">Letter of credit settled</div>
            </div>
          </div>
        </div>
        <div className="stage-foot" style={{ color: "rgba(255,255,255,.6)" }}>
          <span>Bill of lading &middot; 14 mt &middot; sealed container</span>
          <span>06 / 08</span>
        </div>
      </section>

      {/* ============ STAGE 07 -- THE VALUE ============ */}
      <section
        className="stage s-value"
        data-stage="6"
        data-name="The Value"
        ref={(el) => { stagesRef.current[6] = el; }}
      >
        <div className="pre">Chapter VII &nbsp;&middot;&nbsp; The Value</div>
        <div className="big rv">
          <span>
            $<span ref={vNumRef}>1,850</span>
          </span>
          <span className="unit">per&nbsp;mt</span>
        </div>
        <h2 className="rv" data-d="1">
          From a single farmer to a global buyer &mdash; held, processed, financed, exported. <em>One operating layer.</em>
        </h2>
        <div className="grid rv" data-d="2">
          <div className="cell">
            <div className="n"><em>$12M</em></div>
            <div>
              <div className="l">Farmer payouts &middot; 2025</div>
              <div className="x">Issued at intake against negotiable receipt.</div>
            </div>
          </div>
          <div className="cell">
            <div className="n">14<em>%</em></div>
            <div>
              <div className="l">Default rate avoided</div>
              <div className="x">Vs. unsecured smallholder credit.</div>
            </div>
          </div>
          <div className="cell">
            <div className="n">30</div>
            <div>
              <div className="l">Vessels FOB &middot; 2025</div>
              <div className="x">EU &middot; GCC &middot; ECOWAS &middot; Asia.</div>
            </div>
          </div>
          <div className="cell">
            <div className="n">$<em>173.4M</em></div>
            <div>
              <div className="l">Gross commodity flow</div>
              <div className="x">Across the operating layer &middot; 2025.</div>
            </div>
          </div>
        </div>
        <div className="stage-foot" style={{ color: "rgba(247,239,225,.4)" }}>
          <span>Audited ledger &middot; KPMG NG &middot; Q4 2025</span>
          <span>07 / 08</span>
        </div>
      </section>

      {/* ============ STAGE 08 -- THE BEGINNING ============ */}
      <section
        className="stage s-begin"
        data-stage="7"
        data-name="The Beginning"
        ref={(el) => { stagesRef.current[7] = el; }}
      >
        <div className="logo">
          Arz<span className="i-dot">i</span>qa
        </div>
        <div className="tagline">Preserving prosperity.</div>
        <div className="arabic">&mdash; ar &middot; zi &middot; qa &nbsp;&middot;&nbsp; the harvest, in trust &mdash;</div>
        <div className="ctas">
          <Link className="primary" href="#">
            Browse the platform{" "}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9h12m0 0l-5-5m5 5l-5 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
