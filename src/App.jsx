import { useState, useEffect, useRef } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
// Cream: #F5F0E8  |  Dark: #1a1a1a  |  Mid: #E8E2D6  |  Red: #C0392B
// Muted: #8a8070  |  Border: #D8D2C6

// ─── DATA ────────────────────────────────────────────────────────────────────

const DAPPS = [
  { name: "KEA Wallet", category: "Wallet", description: "A passkey-powered wallet on Thru Chain. Sign in with Face ID, Touch ID, or a security key — no passwords, no seed phrases. Send and receive THRU tokens natively.", status: "Live", logo: null, url: "https://keawallet.com", highlights: ["Passkey Login", "Send & receive THRU", "Face ID / Touch ID"] },
  { name: "Thru Wallet", category: "Wallet", description: "The official wallet for the Thru blockchain. An early preview of the native wallet experience — unaudited and built for explorers.", status: "Pre-Alpha", logo: "⬡", url: "https://wallet.thru.org/", highlights: ["Official wallet", "Pre-alpha preview", "Native Thru experience"] },
  { name: "Thru Explorer", category: "Block Explorer", description: "The official Thru blockchain explorer. Track transactions, wallets, blocks and network activity on Thru in real time.", status: "Live", logo: "⬢", url: "https://scan.thru.org/", highlights: ["Live transactions", "Block data", "Wallet lookup"] },
  { name: "ThruScan", category: "Block Explorer", description: "Community-built blockchain explorer for the Thru network. Browse blocks, transactions and addresses with a clean, fast interface.", status: "Live", logo: "◈", url: "https://thruscan.net", highlights: ["Block explorer", "Transaction history", "Network stats"] },
  { name: "Thru Faucet", category: "Developer Tool", description: "Get free testnet THRU tokens to start building and testing on the Thru blockchain. No signup required.", status: "Live", logo: "◎", url: "https://faucet.thruscan.net", highlights: ["Free testnet tokens", "Instant delivery", "No signup"] },
];

const NEWS = [
  { id: 1, title: "Unto Labs Raises $14.4M to Build Thru", excerpt: "Electric Capital and Framework Ventures back Unto Labs in a combined round valuing the company at $140M.", source: "Thru Blog", date: "Apr 29, 2025", tag: "Funding", type: "blog" },
  { id: 2, title: "ThruVM: How RISC-V Redefines Smart Contract Execution", excerpt: "Thru's VM runs standard Rust and C++ compilers out of the box — no bespoke tooling required.", source: "Thru Blog", date: "Mar 15, 2025", tag: "Technology", type: "blog" },
  { id: 3, title: "Vitalik Proposes RISC-V for Ethereum — Thru Was Already There", excerpt: "Months before Buterin's proposal, Thru had already committed to RISC-V as its execution foundation.", source: "Thru Blog", date: "Apr 23, 2025", tag: "Ecosystem", type: "blog" },
  { id: 4, title: "Inside Thru's Consensus: Compete on Performance, Not Stake", excerpt: "Operators earn their spot with uptime and throughput — a fundamental rethink of validator economics.", source: "Thru Blog", date: "Feb 28, 2025", tag: "Research", type: "blog" },
  { id: 5, title: "Liam Heeger on Leaving Jump Crypto and Building Thru", excerpt: "The former Firedancer engineer on the legal battle, the vision, and why L1 scaling is far from over.", source: "Thru Blog", date: "May 10, 2025", tag: "Interview", type: "blog" },
  { id: 6, title: "Thru Testnet Is Live: What Builders Need to Know", excerpt: "Deploy RISC-V smart contracts using standard Rust toolchains. No custom compilers needed.", source: "Thru Blog", date: "Jun 3, 2025", tag: "Developer", type: "blog" },
];

const NEWS_TAGS = ["All", "Funding", "Technology", "Ecosystem", "Research", "Interview", "Developer"];

const TAG_COLORS = {
  Funding:    { bg: "#fef3c7", text: "#92400e" },
  Technology: { bg: "#dbeafe", text: "#1e40af" },
  Ecosystem:  { bg: "#d1fae5", text: "#065f46" },
  Research:   { bg: "#ede9fe", text: "#5b21b6" },
  Interview:  { bg: "#fce7f3", text: "#9d174d" },
  Developer:  { bg: "#f0fdf4", text: "#166534" },
};

const STATUS_COLORS = {
  "Live":        { bg: "#d1fae5", text: "#065f46" },
  "Dev Preview": { bg: "#dbeafe", text: "#1e40af" },
  "Pre-Alpha":   { bg: "#fef3c7", text: "#92400e" },
  "Coming Soon": { bg: "#f1f5f9", text: "#64748b" },
};

// ─── BLOG CONTENT ────────────────────────────────────────────────────────────

const BLOG_CONTENT = {
  1: `On April 29, 2025, Unto Labs — the company building Thru — announced it had raised $14.4 million in a combined pre-seed and seed round. Framework Ventures led the pre-seed. Electric Capital led the seed. The round values the company at $140 million.

For a team of five people with no product in production, those are significant numbers. They reflect a specific bet: that the blockchain industry has not yet produced the infrastructure it actually needs, and that the window to build it is open right now.

## Who backed it and why

Electric Capital and Framework Ventures are not generalist investors placing broad crypto bets. Both funds have deep technical roots and a track record of backing infrastructure that outlasts hype cycles.

Electric Capital has been among the most rigorous analysts of developer activity in crypto — their annual developer reports are the closest thing the industry has to a census of who is actually building. Their bet on Unto Labs is a bet that Thru's approach to developer experience solves a real problem, not a theoretical one.

Framework Ventures backed Solana early, when high-performance L1s were still a minority view. Their thesis has consistently been that throughput and cost matter more than ideology. Thru fits that thesis directly.

## What the money is for

Liam Heeger, Thru's founder, has been direct about this: the capital goes toward people. The team is five right now. The goal is ten by end of year.

Every hire is someone who understands the scope of what Unto Labs is attempting. Thru is not a fork of an existing chain. ThruVM is new. The consensus model is new. The account architecture is new. Building all of that correctly requires a small number of exceptionally capable engineers, not a large number of average ones.

## The broader context

This raise is happening at a specific moment in the industry's history. The L2 narrative has dominated the last two years. Thru's raise is a direct rebuttal to that. Electric Capital and Framework are placing a large bet that base layer innovation still has significant room.

**Sources:** [Fortune](https://fortune.com/crypto/2025/04/29/unto-labs-fundraising-framework-ventures-electric-capital/) · [Crypto-Fundraising.info](https://crypto-fundraising.info/projects/unto-labs-thru/) · [X / Unto Labs](https://x.com/untolabs)`,

  2: `Every blockchain VM is a bet. Ethereum bet on the EVM — a custom stack-based machine optimised for smart contracts but alien to the rest of the software world. Solana bet on BPF, inheriting a Linux kernel tool and bending it toward on-chain execution. Both choices unlocked ecosystems, but they also locked developers into new mental models, new toolchains, and new failure modes.

Thru is making a different bet: **RISC-V**.

## What is RISC-V and why does it matter?

RISC-V is an open-source instruction set architecture originally developed at UC Berkeley. It's the hardware language spoken by a growing share of the world's chips. Unlike proprietary ISAs, it has no licensing fees, no single controlling vendor, and a vast existing ecosystem of compilers, debuggers, and tooling.

The key insight behind ThruVM is simple: if you build your smart contract runtime on RISC-V, you inherit all of that. Rust compiles to RISC-V. C compiles to RISC-V. C++ compiles to RISC-V. Any language with an LLVM backend compiles to RISC-V. **No custom compiler. No new SDK. No blockchain-specific language to learn.**

## The developer experience problem

The crypto industry has long underestimated how much developer friction costs. Solidity is powerful but niche. Move is elegant but exotic. The result: a pool of blockchain developers that is orders of magnitude smaller than the pool of general software engineers.

ThruVM closes that gap. A backend engineer who has never written a smart contract can deploy on Thru using the tools they already know.

## Performance without compromise

Beyond developer experience, RISC-V brings real performance benefits. The EVM's interpreter overhead is a known bottleneck. RISC-V maps directly to hardware. Execution is faster, proving is cheaper, and the runtime can take full advantage of underlying hardware improvements.

Thru's architecture is built around this: bigger accounts, bigger transactions, bigger blocks — none of which require exotic hardware or compromise on decentralisation.`,

  3: `On April 20, 2025, Vitalik Buterin posted a proposal to Ethereum's developer forum. The headline was striking: replace the EVM with RISC-V.

Buterin argued that RISC-V would "greatly improve the efficiency of the Ethereum execution layer, resolving one of the primary scaling bottlenecks." The proposal triggered immediate debate across crypto Twitter, developer forums, and research channels.

Thru had already made this exact bet. Months earlier.

## What Vitalik actually proposed

The proposal was not a roadmap item or a vague suggestion. It was a concrete technical argument: the EVM's interpreter overhead is a fundamental inefficiency that compounds at scale. Every ZK proof, every execution trace, every block replay carries that overhead.

RISC-V eliminates it. Because RISC-V is a standard instruction set that maps directly to modern hardware, execution becomes faster, proving becomes cheaper, and the runtime can take advantage of hardware improvements without changes to the spec.

## How Thru got there first

Thru's founder Liam Heeger spent two years building Firedancer — the high-performance Solana validator client — at Jump Crypto. That work gave him a precise understanding of where blockchain performance actually breaks down.

When Heeger left to build Thru, the choice of RISC-V was not a trend-follow. It was a conclusion from first principles: if you want a blockchain that competes with web2 infrastructure, you cannot afford a VM that speaks a language no hardware natively understands.

ThruVM was already in development when Buterin's proposal dropped. The timing was coincidental. The logic was identical.

## What this means for Thru

Buterin's proposal validated the thesis publicly. When the creator of Ethereum says RISC-V is the right direction, it becomes harder to dismiss RISC-V as an experiment.

Thru has no legacy contracts to preserve. RISC-V is the foundation, not a migration target. That is the advantage of building from scratch at the right moment.

**Sources:** [CoinDesk](https://www.coindesk.com/tech/2025/04/23/the-protocol-will-eth-developers-swap-out-the-evm-for-risc-v) · [Blockworks](https://blockworks.co/news/vitalik-ethereum-evm-scaling-l1-plan) · [CoinTelegraph](https://cointelegraph.com/explained/what-is-risc-v-and-why-does-vitalik-buterin-want-it-for-ethereum-smart-contracts)`,

  4: `Most blockchains treat consensus like a political election: whoever accumulates the most stake gets the most power. Validators compete to attract delegations, protocols optimise for economic weight, and the result is a system where capital — not performance — determines who secures the network.

Thru is built on a different premise. **Operators earn their place by doing the work, not by holding the most tokens.**

## The problem with stake-weighted consensus

When consensus power tracks capital, the interests of large validators and the interests of the network start to diverge. Large validators can afford to be mediocre — their stake protects their position. Small, high-performance validators lose delegation to bigger names regardless of their uptime.

The network's security budget ends up subsidising capital accumulation rather than operational excellence.

## How Thru's consensus works

Thru's consensus model flips this. Operators earn their position through **uptime and throughput** — measurable, verifiable indicators of actual contribution to network performance.

An operator who keeps their node running reliably and processes transactions quickly outcompetes one who simply holds more stake. Performance is the differentiator. Capital is not a shortcut.

This has a natural economic consequence: fees race toward zero. When operators compete on throughput rather than on their ability to attract delegations, the pressure is always downward on costs.

## Why this matters for builders

A performance-driven consensus model means the network actively selects for validators who keep latency low and availability high. The incentive structure is aligned with what builders actually need: fast, reliable, cheap transaction execution.

It also means the network is more resistant to centralisation over time. When performance is the barrier to entry rather than capital, a wider range of operators can compete effectively.`,

  5: `Liam Heeger spent two years at Jump Crypto helping build Firedancer — the high-performance Solana validator client. He left in January 2025. What followed was a lawsuit, a settlement, and the announcement of Thru.

## On leaving Jump Crypto

Leaving wasn't a sudden decision. I had been thinking about the fundamental constraints of existing chains for a long time — not just performance, but the whole developer experience, the way consensus is structured, the assumptions baked into every VM that exists today.

Jump alleged I was creating a competitive business. We settled. What I will say is that the work I'd done on Firedancer made it very clear to me that raw throughput is solvable. The hard problem isn't making a fast validator. It's building a chain that developers actually want to build on — and that users actually want to use.

## On why L1 is still an open problem

People declared L1 a solved problem. Layer 2 is the future, they said. I think that's wrong — or at least, incomplete. L2s are a patch on top of L1 limitations. They add latency, fragmentation, and complexity.

If your base layer is genuinely fast and cheap, you don't need most of that. The question is whether you can build a base layer that competes with web2 infrastructure on its own terms — not just within crypto, but against AWS, against Stripe, against the software that runs the world right now.

## On the decision to use RISC-V

Every existing chain VM is a liability for developer adoption. RISC-V is different because it's already everywhere. If you build your runtime on RISC-V, you inherit GCC, LLVM, every debugger, every profiler, decades of tooling. A developer who has never touched crypto can write a smart contract in the language they already know.

## On what success looks like

Success is a developer in Lagos or Berlin or Singapore deploying a contract on Thru using the same Rust codebase they use for everything else — and that contract running reliably, cheaply, at scale.

We built casinos. We chased attention. We argued about ideology. That era is over. The end of the beginning means we actually have to build things that work now. Thru is our attempt at that.`,

  6: `The Thru testnet is live. For the first time, developers can deploy smart contracts on a RISC-V blockchain, interact with the network, and start building against a production-grade execution environment.

## What the testnet gives you

The testnet is a fully functional preview of the Thru execution environment. ThruVM is running. You can deploy contracts, send transactions, and observe the network behaving as it will at mainnet.

This is not a toy environment. The testnet runs the same consensus logic, the same VM specification, and the same account model as mainnet will. What you build and test here will port directly.

## How to deploy your first contract

If you have written Rust before, you already have most of what you need. Thru's contract model compiles standard Rust to RISC-V. There is no new intermediate language, no custom macro system, and no blockchain-specific compiler to install.

**Step 1:** Install the standard Rust toolchain. Add the RISC-V target: \`rustup target add riscv64gc-unknown-none-elf\`

**Step 2:** Write your contract as a standard Rust library. Thru exposes a minimal SDK for reading and writing account state, emitting events, and calling other contracts.

**Step 3:** Compile and deploy using the Thru CLI. The deploy command handles packaging, submission, and address derivation.

## What comes next

The testnet is the first step toward mainnet. Unto Labs will be running structured developer programs, gathering feedback on the SDK and tooling, and iterating on the network based on what builders encounter in practice.

Get the CLI, deploy something, and tell the team what you find.`
};

// ─── REVEAL ──────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── COUNTER ─────────────────────────────────────────────────────────────────

function Counter({ end, prefix = "", suffix = "", decimals = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = (ts) => {
          if (!start) start = ts;
          const prog = Math.min((ts - start) / 1400, 1);
          const ease = 1 - Math.pow(1 - prog, 3);
          setVal(parseFloat((ease * end).toFixed(decimals)));
          if (prog < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step); obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, decimals]);
  return <span ref={ref}>{prefix}{decimals ? val.toFixed(decimals) : Math.round(val)}{suffix}</span>;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ section, setSection, onBack, showBack }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const handleNav = (s) => { setSection(s); setMenuOpen(false); };

  return (
    <>
      {/* Overlay */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(26,26,26,0.4)", backdropFilter: "blur(4px)" }} />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 400,
        width: "280px", background: "#1a1a1a", borderTopLeftRadius: "24px", borderBottomLeftRadius: "24px",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column", padding: "28px",
      }}>
        <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", alignSelf: "flex-end", padding: "4px", marginBottom: "40px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div style={{ fontFamily: "Josefin Sans", fontSize: "11px", letterSpacing: "0.15em", color: "#8a8070", textTransform: "uppercase", marginBottom: "24px" }}>Navigation</div>
        {["home", "protocols", "news"].map(s => (
          <button key={s} onClick={() => handleNav(s)} style={{
            background: "none", border: "none", borderBottom: "1px solid #2a2a2a",
            color: section === s ? "#C0392B" : "#F5F0E8",
            fontFamily: "Josefin Sans", fontSize: "22px", fontWeight: "normal",
            padding: "16px 0", cursor: "pointer", textAlign: "left",
            textTransform: "capitalize", transition: "color 0.2s",
          }}>{s}</button>
        ))}
        <a href="https://x.com/Thru_pulse" target="_blank" rel="noreferrer" style={{
          marginTop: "auto", display: "flex", alignItems: "center", gap: "10px",
          textDecoration: "none", padding: "14px 0", borderTop: "1px solid #2a2a2a",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#8a8070">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span style={{ fontFamily: "Josefin Sans", fontSize: "13px", color: "#8a8070" }}>@Thru_pulse</span>
        </a>
      </div>

      {/* Nav bar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? "rgba(245,240,232,0.96)" : "rgba(245,240,232,0)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #D8D2C6" : "1px solid transparent",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: "64px", transition: "all 0.3s ease",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => showBack ? onBack() : setSection("home")}>
          <div style={{ width: "30px", height: "30px", borderRadius: "12px", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#F5F0E8", fontSize: "14px", fontWeight: "900", fontFamily: "Josefin Sans" }}>T</span>
          </div>
          <span style={{ fontFamily: "Josefin Sans", fontSize: "16px", color: "#1a1a1a", letterSpacing: "-0.01em" }}>
            thru<span style={{ color: "#C0392B" }}>Pulse</span>
          </span>
        </div>

        {/* Desktop nav tabs */}
        {!showBack && (
          <div className="desktop-nav" style={{ display: "flex", gap: "2px", background: "#E8E2D6", padding: "3px", borderRadius: "12px" }}>
            {["home", "protocols", "news"].map(s => (
              <button key={s} onClick={() => setSection(s)} style={{
                background: section === s ? "#F5F0E8" : "transparent",
                color: section === s ? "#1a1a1a" : "#8a8070",
                border: "none", fontFamily: "Josefin Sans", fontSize: "12px", fontWeight: "600",
                padding: "7px 18px", borderRadius: "12px", cursor: "pointer", textTransform: "capitalize",
                boxShadow: section === s ? "0 1px 4px rgba(26,26,26,0.08)" : "none", transition: "all 0.2s",
              }}>{s}</button>
            ))}
          </div>
        )}

        {showBack && (
          <button onClick={onBack} style={{ background: "none", border: "1px solid #D8D2C6", color: "#1a1a1a", fontFamily: "Josefin Sans", fontSize: "13px", padding: "7px 16px", borderRadius: "12px", cursor: "pointer" }}>← Back</button>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <a href="https://x.com/Thru_pulse" target="_blank" rel="noreferrer" style={{
            width: "36px", height: "36px", borderRadius: "12px", border: "1px solid #D8D2C6",
            background: "transparent", display: "inline-flex", alignItems: "center",
            justifyContent: "center", textDecoration: "none", transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.borderColor = "#1a1a1a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#D8D2C6"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#1a1a1a">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* Hamburger — mobile only */}
          {!showBack && (
            <button onClick={() => setMenuOpen(true)} className="mobile-nav" style={{
              width: "36px", height: "36px", borderRadius: "12px", border: "1px solid #D8D2C6",
              background: "transparent", display: "none", alignItems: "center",
              justifyContent: "center", cursor: "pointer", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.borderColor = "#1a1a1a"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#D8D2C6"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}

// ─── ROTATING WORD ───────────────────────────────────────────────────────────

const WORDS = ["Performance.", "Scale.", "Trust.", "Utility.", "Speed."];
function RotatingWord() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % WORDS.length); setFade(true); }, 300);
    }, 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ color: "#C0392B", opacity: fade ? 1 : 0, transition: "opacity 0.3s", display: "inline-block" }}>
      {WORDS[idx]}
    </span>
  );
}

// ─── NEWS CAROUSEL ───────────────────────────────────────────────────────────

function NewsCarousel({ openPost, setSection }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const start = () => { timerRef.current = setInterval(() => setActive(i => (i + 1) % NEWS.length), 3500); };
  useEffect(() => { start(); return () => clearInterval(timerRef.current); }, []);
  const goTo = (i) => { clearInterval(timerRef.current); setActive(i); start(); };
  const item = NEWS[active];
  const tc = TAG_COLORS[item.tag] || {};

  return (
    <div style={{ padding: "80px 48px", background: "#F5F0E8" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px" }}>
          <div>
            <div style={{ fontFamily: "Josefin Sans", fontSize: "11px", letterSpacing: "0.15em", color: "#8a8070", textTransform: "uppercase", marginBottom: "8px" }}>Latest coverage</div>
            <h2 style={{ fontFamily: "Josefin Sans", fontSize: "32px", fontWeight: "normal", color: "#1a1a1a", margin: 0, letterSpacing: "-0.02em" }}>In the news</h2>
          </div>
          <button onClick={() => setSection("news")} style={{ background: "none", border: "1px solid #D8D2C6", color: "#1a1a1a", fontFamily: "Josefin Sans", fontSize: "13px", padding: "8px 20px", borderRadius: "12px", cursor: "pointer" }}>All news →</button>
        </div>

        {/* Big carousel card */}
        <div onClick={() => item.type === "blog" ? openPost(item) : window.open(item.url, "_blank")}
          style={{ background: "#1a1a1a", borderRadius: "24px", padding: "52px 56px", cursor: "pointer", position: "relative", overflow: "hidden", minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "flex-end", transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.92"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {/* Big number watermark */}
          <div style={{ position: "absolute", top: "-20px", right: "40px", fontFamily: "Josefin Sans", fontSize: "180px", fontWeight: "900", color: "rgba(245,240,232,0.04)", lineHeight: 1, userSelect: "none" }}>
            {String(active + 1).padStart(2, "0")}
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Josefin Sans", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", background: tc.bg, color: tc.text, padding: "3px 10px", borderRadius: "12px" }}>{item.tag}</span>
              <span style={{ fontFamily: "Josefin Sans", fontSize: "12px", color: "#8a8070" }}>{item.source} · {item.date}</span>
            </div>
            <h3 style={{ fontFamily: "Josefin Sans", fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: "normal", color: "#F5F0E8", margin: "0 0 16px", lineHeight: "1.25", letterSpacing: "-0.02em", maxWidth: "700px" }}>{item.title}</h3>
            <p style={{ fontFamily: "Josefin Sans", fontSize: "15px", color: "#8a8070", lineHeight: "1.7", margin: "0 0 28px", maxWidth: "580px" }}>{item.excerpt}</p>
            <span style={{ fontFamily: "Josefin Sans", fontSize: "13px", color: "#C0392B", letterSpacing: "0.05em" }}>
              {item.type === "blog" ? "Read article →" : "Read more →"}
            </span>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
          {NEWS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === active ? "28px" : "8px", height: "3px", border: "none", cursor: "pointer", padding: 0,
              background: i === active ? "#1a1a1a" : "#D8D2C6", borderRadius: "12px", transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BLOG POST ────────────────────────────────────────────────────────────────

function BlogPost({ item, onBack }) {
  const [displayed, setDisplayed] = useState("");
  const [loading, setLoading] = useState(true);
  const fullContent = BLOG_CONTENT[item.id] || "";
  const tc = TAG_COLORS[item.tag] || {};

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayed(""); setLoading(true);
    const t = setTimeout(() => {
      setLoading(false);
      let i = 0;
      const words = fullContent.split(" ");
      const iv = setInterval(() => {
        i += 6;
        setDisplayed(words.slice(0, i).join(" "));
        if (i >= words.length) { setDisplayed(fullContent); clearInterval(iv); }
      }, 30);
    }, 600);
    return () => clearTimeout(t);
  }, [item.id]);

  function parseLine(text) {
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} style={{ fontWeight: "bold", color: "#1a1a1a" }}>{p.slice(2, -2)}</strong>;
      const lm = p.match(/^\[(.*?)\]\((.*?)\)$/);
      if (lm) return <a key={i} href={lm[2]} target="_blank" rel="noreferrer" style={{ color: "#C0392B", textDecoration: "underline", textUnderlineOffset: "3px" }}>{lm[1]}</a>;
      return p;
    });
  }

  function renderMarkdown(md) {
    return md.split("\n").map((line, i) => {
      const l = line.trim();
      if (!l) return null;
      if (l.startsWith("## ")) return <h2 key={i} style={{ fontFamily: "Josefin Sans", fontSize: "22px", fontWeight: "normal", color: "#1a1a1a", margin: "40px 0 16px", letterSpacing: "-0.02em", borderBottom: "1px solid #D8D2C6", paddingBottom: "12px" }}>{l.replace("## ", "")}</h2>;
      if (l.startsWith("### ")) return <h3 key={i} style={{ fontFamily: "Josefin Sans", fontSize: "17px", fontWeight: "normal", color: "#1a1a1a", margin: "28px 0 10px" }}>{l.replace("### ", "")}</h3>;
      if (l.startsWith("- ") || l.startsWith("* ")) return <li key={i} style={{ fontFamily: "Josefin Sans", fontSize: "17px", color: "#3a3028", lineHeight: "1.8", marginBottom: "8px", marginLeft: "20px" }}>{parseLine(l.replace(/^[-*] /, ""))}</li>;
      return <p key={i} style={{ fontFamily: "Josefin Sans", fontSize: "18px", color: "#3a3028", lineHeight: "1.85", margin: "0 0 22px" }}>{parseLine(l)}</p>;
    });
  }

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "#F5F0E8" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 40px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "28px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Josefin Sans", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", background: tc.bg, color: tc.text, padding: "3px 10px", borderRadius: "12px" }}>{item.tag}</span>
          <span style={{ fontFamily: "Josefin Sans", fontSize: "13px", color: "#8a8070" }}>{item.source} · {item.date}</span>
        </div>
        <h1 style={{ fontFamily: "Josefin Sans", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "normal", color: "#1a1a1a", letterSpacing: "-0.03em", lineHeight: "1.2", margin: "0 0 20px" }}>{item.title}</h1>
        <p style={{ fontFamily: "Josefin Sans", fontSize: "19px", color: "#8a8070", lineHeight: "1.7", margin: "0 0 40px", borderBottom: "1px solid #D8D2C6", paddingBottom: "40px" }}>{item.excerpt}</p>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[100, 88, 95, 72, 80, 60].map((w, i) => (
              <div key={i} style={{ height: "14px", background: "#E8E2D6", borderRadius: "12px", width: `${w}%`, animation: "shimmer 1.4s ease infinite", animationDelay: `${i * 0.1}s` }} />
            ))}
            <p style={{ fontFamily: "Josefin Sans", fontSize: "12px", color: "#8a8070", marginTop: "8px", textAlign: "center", letterSpacing: "0.05em" }}>Loading article...</p>
          </div>
        ) : (
          <div>{renderMarkdown(displayed)}</div>
        )}

        {!loading && (
          <div style={{ marginTop: "56px", paddingTop: "32px", borderTop: "1px solid #D8D2C6" }}>
            <button onClick={onBack} style={{ background: "#1a1a1a", color: "#F5F0E8", fontFamily: "Josefin Sans", fontSize: "14px", padding: "12px 28px", border: "none", cursor: "pointer", borderRadius: "12px" }}>← Back to News</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────

function Home({ setSection, openPost }) {
  return (
    <div style={{ background: "#F5F0E8" }}>

      {/* HERO */}
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 48px 0", position: "relative", overflow: "hidden" }}>
        {/* Big background circles */}
        <div style={{ position: "absolute", top: "-120px", left: "-120px", width: "500px", height: "500px", borderRadius: "50%", background: "#E8E2D6", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "#E8E2D6", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "15%", width: "160px", height: "160px", borderRadius: "50%", background: "#E0D9CE", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid #D8D2C6", borderRadius: "12px", padding: "6px 14px", marginBottom: "40px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C0392B" }} />
            <span style={{ fontFamily: "Josefin Sans", fontSize: "11px", color: "#8a8070", letterSpacing: "0.1em" }}>Testnet Live · Unto Labs · $14.4M Raised</span>
          </div>

          {/* Big headline */}
          <h1 style={{ fontFamily: "Josefin Sans", fontWeight: "normal", fontSize: "clamp(56px, 9vw, 120px)", lineHeight: "0.95", color: "#1a1a1a", letterSpacing: "-0.04em", margin: "0 0 32px" }}>
            Built for<br /><RotatingWord />
          </h1>

          <p style={{ fontFamily: "Josefin Sans", fontSize: "18px", color: "#8a8070", lineHeight: "1.7", maxWidth: "480px", margin: "0 0 48px" }}>
            Thru is a next-generation L1 blockchain. Powered by ThruVM and RISC-V. Bigger accounts, bigger blocks, zero compromises.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => setSection("protocols")} style={{ background: "#1a1a1a", color: "#F5F0E8", fontFamily: "Josefin Sans", fontSize: "14px", padding: "14px 32px", border: "none", cursor: "pointer", borderRadius: "12px", transition: "opacity 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Explore Ecosystem →</button>
            <button onClick={() => setSection("news")} style={{ background: "transparent", color: "#1a1a1a", fontFamily: "Josefin Sans", fontSize: "14px", padding: "14px 32px", border: "1px solid #D8D2C6", cursor: "pointer", borderRadius: "12px", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#D8D2C6"}
            >Latest News</button>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div style={{ borderTop: "1px solid #D8D2C6", borderBottom: "1px solid #D8D2C6", background: "#E8E2D6", borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {[
            { value: 14.4, prefix: "$", suffix: "M", dec: 1, label: "Total Raised", sub: "Electric Capital + Framework" },
            { value: 140, prefix: "$", suffix: "M", dec: 0, label: "Valuation", sub: "Combined round" },
            { value: 5, prefix: "", suffix: "", dec: 0, label: "Live Protocols", sub: "Growing ecosystem" },
            { value: 0, prefix: "~$", suffix: "", dec: 0, label: "Target TX Fee", sub: "Racing toward zero" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div style={{ padding: "32px 40px", borderRight: i < 3 ? "1px solid #D8D2C6" : "none" }}>
                <div style={{ fontFamily: "Josefin Sans", fontSize: "44px", fontWeight: "normal", color: "#1a1a1a", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  <Counter end={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.dec} />
                </div>
                <div style={{ fontFamily: "Josefin Sans", fontSize: "13px", color: "#1a1a1a", marginTop: "8px", letterSpacing: "0.02em" }}>{s.label}</div>
                <div style={{ fontFamily: "Josefin Sans", fontSize: "11px", color: "#8a8070", marginTop: "3px" }}>{s.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* PILLARS */}
      <div style={{ padding: "100px 48px", background: "#F5F0E8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: "60px", textAlign: "center" }}>
              <div style={{ fontFamily: "Josefin Sans", fontSize: "11px", letterSpacing: "0.15em", color: "#8a8070", textTransform: "uppercase", marginBottom: "16px" }}>What makes Thru different</div>
              <h2 style={{ fontFamily: "Josefin Sans", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: "normal", color: "#1a1a1a", letterSpacing: "-0.03em", margin: "0 auto" }}>The end of the beginning for blockchain.</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1px", background: "#D8D2C6", border: "1px solid #D8D2C6", borderRadius: "20px", overflow: "hidden" }}>
            {[
              { n: "01", title: "ThruVM", body: "A RISC-V virtual machine. Works with Rust, C, C++ — no custom compilers, no domain-specific languages." },
              { n: "02", title: "Performance Consensus", body: "Operators earn their spot with uptime and throughput, not stake. Fees race toward zero." },
              { n: "03", title: "Web2-Grade Scale", body: "Bigger accounts, bigger transactions, bigger blocks. Compete with global applications." },
              { n: "04", title: "Open Dev Experience", body: "Any language targeting RISC-V works out of the box. Mainstream adoption starts here." },
            ].map((f, i) => (
              <Reveal key={f.n} delay={i * 60}>
                <div style={{ background: "#F5F0E8", padding: "36px 32px", position: "relative", transition: "background 0.2s", height: "100%" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#EDE8DF"}
                  onMouseLeave={e => e.currentTarget.style.background = "#F5F0E8"}
                >
                  <span style={{ position: "absolute", top: "20px", right: "24px", fontFamily: "Josefin Sans", fontSize: "11px", color: "#D8D2C6", letterSpacing: "0.05em" }}>{f.n}</span>
                  <h3 style={{ fontFamily: "Josefin Sans", fontSize: "18px", fontWeight: "normal", color: "#1a1a1a", margin: "0 0 12px", letterSpacing: "-0.01em" }}>{f.title}</h3>
                  <p style={{ fontFamily: "Josefin Sans", fontSize: "14px", color: "#8a8070", lineHeight: "1.7", margin: 0 }}>{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* MANIFESTO */}
      <div style={{ background: "#F5F0E8", padding: "0 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 0 60px" }}>
          <div style={{ background: "#1a1a1a", borderRadius: "24px", padding: "80px 64px", textAlign: "center" }}>
            <Reveal>
              <p style={{ fontFamily: "Josefin Sans", fontSize: "clamp(20px, 3.5vw, 32px)", fontWeight: "normal", color: "#F5F0E8", lineHeight: "1.6", maxWidth: "760px", margin: "0 auto 24px", letterSpacing: "-0.02em" }}>
                "The crypto dark ages were built on isolation, distrust, and speculation. We're building for{" "}
                <span style={{ color: "#C0392B" }}>trust, utility, and scale.</span>"
              </p>
              <p style={{ fontFamily: "Josefin Sans", fontSize: "12px", color: "#8a8070", letterSpacing: "0.12em", textTransform: "uppercase" }}>— Unto Labs, Introducing Thru</p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* LIVE PROTOCOLS */}
      <div style={{ padding: "100px 48px 0", background: "#F5F0E8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ fontFamily: "Josefin Sans", fontSize: "11px", letterSpacing: "0.15em", color: "#8a8070", textTransform: "uppercase", marginBottom: "8px" }}>Ecosystem</div>
                <h2 style={{ fontFamily: "Josefin Sans", fontSize: "32px", fontWeight: "normal", color: "#1a1a1a", margin: 0, letterSpacing: "-0.02em" }}>Live protocols</h2>
              </div>
              <button onClick={() => setSection("protocols")} style={{ background: "none", border: "1px solid #D8D2C6", color: "#1a1a1a", fontFamily: "Josefin Sans", fontSize: "13px", padding: "8px 20px", borderRadius: "12px", cursor: "pointer" }}>View all →</button>
            </div>
          </Reveal>

          {/* Logo grid */}
          <Reveal>
            <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid #E8E2D6", padding: "48px 40px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0px" }}>
                {DAPPS.map((dapp, i) => (
                  <a key={dapp.name} href={dapp.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", padding: "36px 24px", borderRight: i % 2 === 0 ? "1px solid #F0EBE3" : "none", borderBottom: i < DAPPS.length - 2 ? "1px solid #F0EBE3" : "none", transition: "background 0.15s", borderRadius: i === 0 ? "16px 0 0 0" : i === 1 ? "0 16px 0 0" : i === DAPPS.length - 2 ? "0 0 0 16px" : i === DAPPS.length - 1 ? "0 0 16px 0" : "0" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F5F0E8"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "Josefin Sans", fontSize: "16px", fontWeight: "700", color: "#1a1a1a", letterSpacing: "0.02em", marginBottom: "4px" }}>{dapp.name}</div>
                      <div style={{ fontFamily: "Josefin Sans", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C0392B" }}>{dapp.category}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* NEWS CAROUSEL */}
      <NewsCarousel openPost={openPost} setSection={setSection} />

      {/* CTA */}
      <div style={{ padding: "0 48px 100px", background: "#F5F0E8" }}>
        <Reveal>
          <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center", border: "1px solid #D8D2C6", borderRadius: "24px", padding: "60px 40px" }}>
            <h2 style={{ fontFamily: "Josefin Sans", fontSize: "30px", fontWeight: "normal", color: "#1a1a1a", letterSpacing: "-0.02em", margin: "0 0 14px" }}>Ready to build on Thru?</h2>
            <p style={{ fontFamily: "Josefin Sans", fontSize: "15px", color: "#8a8070", lineHeight: "1.7", margin: "0 0 32px" }}>Deploy smart contracts with your existing Rust or C++ toolchain. No custom compilers. No domain-specific languages. Just ship.</p>
            <a href="https://docs.thru.org/" target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", background: "#1a1a1a", borderRadius: "100px", padding: "6px 6px 6px 24px", textDecoration: "none", gap: "12px", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2a2a2a"; e.currentTarget.querySelector(".arrow-box").style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.querySelector(".arrow-box").style.transform = "translateX(0)"; }}
            >
              <span style={{ fontFamily: "Josefin Sans", fontSize: "14px", fontWeight: "600", color: "#F5F0E8", letterSpacing: "0.02em" }}>Read the Docs</span>
              <div className="arrow-box" style={{ width: "36px", height: "36px", borderRadius: "100px", background: "#3a3a3a", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s ease" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─── PROTOCOLS ───────────────────────────────────────────────────────────────

function Protocols() {
  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "#F5F0E8" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 48px" }}>
        <Reveal>
          <div style={{ marginBottom: "56px" }}>
            <div style={{ fontFamily: "Josefin Sans", fontSize: "11px", letterSpacing: "0.15em", color: "#8a8070", textTransform: "uppercase", marginBottom: "12px" }}>Ecosystem</div>
            <h2 style={{ fontFamily: "Josefin Sans", fontSize: "40px", fontWeight: "normal", color: "#1a1a1a", letterSpacing: "-0.03em", margin: "0 0 12px" }}>Protocol Explorer</h2>
            <p style={{ fontFamily: "Josefin Sans", fontSize: "15px", color: "#8a8070", margin: 0 }}>Native apps and protocols live on Thru right now.</p>
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#D8D2C6", borderRadius: "20px", overflow: "hidden" }}>
          {DAPPS.map((dapp, i) => {
            const sc = STATUS_COLORS[dapp.status] || {};
            return (
              <Reveal key={dapp.name} delay={i * 60}>
                <a href={dapp.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ background: "#F5F0E8", padding: "32px 36px", display: "flex", gap: "24px", alignItems: "flex-start", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#EDE8DF"}
                    onMouseLeave={e => e.currentTarget.style.background = "#F5F0E8"}
                  >
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                      {dapp.logo ? <span style={{ color: "#F5F0E8" }}>{dapp.logo}</span> : <span style={{ fontFamily: "Josefin Sans", fontWeight: "bold", fontSize: "12px", color: "#F5F0E8" }}>KEA</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <h3 style={{ fontFamily: "Josefin Sans", fontSize: "20px", fontWeight: "normal", color: "#1a1a1a", margin: 0 }}>{dapp.name}</h3>
                        <span style={{ fontFamily: "Josefin Sans", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: "12px" }}>{dapp.status}</span>
                        <span style={{ fontFamily: "Josefin Sans", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#C0392B" }}>{dapp.category}</span>
                      </div>
                      <p style={{ fontFamily: "Josefin Sans", fontSize: "14px", color: "#8a8070", lineHeight: "1.7", margin: "0 0 14px" }}>{dapp.description}</p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {dapp.highlights.map(h => (
                          <span key={h} style={{ fontFamily: "Josefin Sans", fontSize: "10px", color: "#8a8070", border: "1px solid #D8D2C6", padding: "3px 8px", borderRadius: "12px" }}>{h}</span>
                        ))}
                      </div>
                    </div>
                    <span style={{ color: "#D8D2C6", fontSize: "18px", flexShrink: 0 }}>→</span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <div style={{ marginTop: "12px", background: "#E8E2D6", border: "1px solid #D8D2C6", borderRadius: "20px", padding: "36px", textAlign: "center" }}>
            <h3 style={{ fontFamily: "Josefin Sans", fontSize: "17px", fontWeight: "normal", color: "#1a1a1a", margin: "0 0 8px" }}>More protocols coming</h3>
            <p style={{ fontFamily: "Josefin Sans", fontSize: "13px", color: "#8a8070", margin: "0 0 12px" }}>The Thru ecosystem is early. As new protocols launch we'll add them here.</p>
            <a href="https://x.com/Thru_pulse" target="_blank" rel="noreferrer" style={{ fontFamily: "Josefin Sans", fontSize: "12px", color: "#C0392B", textDecoration: "none" }}>Follow @thruPulse for updates →</a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─── NEWS ────────────────────────────────────────────────────────────────────

function News({ openPost }) {
  const [tag, setTag] = useState("All");
  const filtered = tag === "All" ? NEWS : NEWS.filter(n => n.tag === tag);

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "#F5F0E8" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 48px" }}>
        <Reveal>
          <div style={{ marginBottom: "48px" }}>
            <div style={{ fontFamily: "Josefin Sans", fontSize: "11px", letterSpacing: "0.15em", color: "#8a8070", textTransform: "uppercase", marginBottom: "12px" }}>Coverage</div>
            <h2 style={{ fontFamily: "Josefin Sans", fontSize: "40px", fontWeight: "normal", color: "#1a1a1a", letterSpacing: "-0.03em", margin: "0 0 10px" }}>News & Updates</h2>
            <p style={{ fontFamily: "Josefin Sans", fontSize: "14px", color: "#8a8070", margin: 0 }}>Everything happening in the Thru ecosystem.</p>
          </div>
        </Reveal>

        {/* Tag filters */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "36px", flexWrap: "wrap" }}>
          {NEWS_TAGS.map(t => (
            <button key={t} onClick={() => setTag(t)} style={{
              background: tag === t ? "#1a1a1a" : "transparent",
              color: tag === t ? "#F5F0E8" : "#8a8070",
              border: "1px solid", borderColor: tag === t ? "#1a1a1a" : "#D8D2C6",
              fontFamily: "Josefin Sans", fontSize: "11px", letterSpacing: "0.05em",
              padding: "6px 14px", borderRadius: "12px", cursor: "pointer", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>

        {/* News list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#D8D2C6", borderRadius: "20px", overflow: "hidden" }}>
          {filtered.map((item, i) => {
            const tc = TAG_COLORS[item.tag] || {};
            return (
              <Reveal key={item.id} delay={i * 50}>
                <div style={{ background: "#F5F0E8", padding: "28px 32px", display: "flex", gap: "20px", alignItems: "flex-start", cursor: "pointer", transition: "background 0.2s" }}
                  onClick={() => item.type === "blog" ? openPost(item) : window.open(item.url, "_blank")}
                  onMouseEnter={e => e.currentTarget.style.background = "#EDE8DF"}
                  onMouseLeave={e => e.currentTarget.style.background = "#F5F0E8"}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "Josefin Sans", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", background: tc.bg, color: tc.text, padding: "2px 8px", borderRadius: "12px" }}>{item.tag}</span>
                      {item.type === "blog" && <span style={{ fontFamily: "Josefin Sans", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", background: "#ede9fe", color: "#5b21b6", padding: "2px 8px", borderRadius: "12px" }}>Blog</span>}
                      <span style={{ fontFamily: "Josefin Sans", fontSize: "12px", color: "#8a8070" }}>{item.source} · {item.date}</span>
                    </div>
                    <h3 style={{ fontFamily: "Josefin Sans", fontSize: "18px", fontWeight: "normal", color: "#1a1a1a", margin: "0 0 6px", lineHeight: "1.35" }}>{item.title}</h3>
                    <p style={{ fontFamily: "Josefin Sans", fontSize: "13px", color: "#8a8070", lineHeight: "1.65", margin: 0 }}>{item.excerpt}</p>
                  </div>
                  <span style={{ color: "#D8D2C6", fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>→</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [section, setSection] = useState("home");
  const [activePost, setActivePost] = useState(null);

  const openPost = (item) => { setActivePost(item); window.scrollTo(0, 0); };
  const closePost = () => { setActivePost(null); window.scrollTo(0, 0); };

  useEffect(() => { if (!activePost) window.scrollTo(0, 0); }, [section]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body, #root { background: #F5F0E8; min-height: 100vh; color: #1a1a1a; }
        @keyframes shimmer { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #F5F0E8; }
        ::-webkit-scrollbar-thumb { background: #D8D2C6; border-radius: 2px; }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-nav { display: inline-flex !important; } }
      `}</style>

      <Nav
        section={section}
        setSection={(s) => { setActivePost(null); setSection(s); }}
        showBack={!!activePost}
        onBack={closePost}
      />

      {activePost ? (
        <BlogPost item={activePost} onBack={closePost} />
      ) : (
        <>
          {section === "home"      && <Home setSection={setSection} openPost={openPost} />}
          {section === "protocols" && <Protocols />}
          {section === "news"      && <News openPost={openPost} />}
        </>
      )}

      <footer style={{ borderTop: "1px solid #D8D2C6", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: "#E8E2D6" }}>
        <span style={{ fontFamily: "Josefin Sans", fontSize: "12px", color: "#8a8070" }}>© 2026 thruPulse</span>
        <div style={{ display: "flex", gap: "24px" }}>
          {[{ l: "thru.xyz", u: "https://thru.xyz" }, { l: "thruPulse", u: "https://x.com/Thru_pulse" }, { l: "Unto Labs", u: "https://untolabs.com" }].map(x => (
            <a key={x.l} href={x.u} target="_blank" rel="noreferrer" style={{ fontFamily: "Josefin Sans", fontSize: "12px", color: "#8a8070", textDecoration: "none" }}>{x.l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
