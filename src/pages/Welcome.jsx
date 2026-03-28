import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, BarChart2, ArrowRight, Check, Wallet } from 'lucide-react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../theme/ThemeProvider';

/* ── Feature cards data ── */
const FEATURES = [
    {
        Icon: LayoutDashboard,
        title: 'Live Dashboard',
        desc: 'Net balance, daily spend, savings rate — your entire financial picture in one glance.',
        accent: '#6366f1',
        glow: 'rgba(99,102,241,0.18)',
    },
    {
        Icon: BookOpen,
        title: 'Smart Ledger',
        desc: 'Log transactions in seconds. Filter by category, date, or payment mode instantly.',
        accent: '#8b5cf6',
        glow: 'rgba(139,92,246,0.18)',
    },
    {
        Icon: BarChart2,
        title: 'Visual Reports',
        desc: 'Spending trends, pie charts & monthly comparisons rendered in stunning visuals.',
        accent: '#10b981',
        glow: 'rgba(16,185,129,0.18)',
    },
];

/* ── Stagger container & item variants ── */
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Welcome() {
    const navigate = useNavigate();
    const { mode, toggleTheme } = useThemeMode();
    const isDark = mode === 'dark';

    const theme = {
        bg: isDark ? '#0f172a' : '#f8fafc',
        textPrimary: isDark ? '#f1f5f9' : '#0f172a',
        textSecondary: isDark ? '#94a3b8' : '#334155',
        navBg: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.85)',
        mesh: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.08)',
        cardBg: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
        cardBorder: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.1)',
        cardShadow: isDark ? 'none' : '0 10px 40px rgba(99,102,241,0.06)',
        cardHoverShadow: isDark ? '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px var(--card-accent)' : '0 24px 60px rgba(99,102,241,0.12), 0 0 0 1px var(--card-accent)',
        navBorder: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.18)',
        blob1: isDark ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.12)',
        blob2: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(20,184,166,0.08)',
        blob3: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.07)',
        btnGhostBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        btnGhostBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        btnGhostText: isDark ? '#cbd5e1' : '#475569',
        footerBorder: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.1)'
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: theme.bg,
            fontFamily: "'Inter', 'Poppins', -apple-system, sans-serif",
            color: theme.textPrimary,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowX: 'hidden',
        }}>

            {/* ─── GLOBAL OVERRIDES ─── */}
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body { overflow-x: hidden !important; max-width: 100% !important; }

                /* ─── Grid mesh background ─── */
                .mesh-bg::before {
                    content: '';
                    position: absolute; inset: 0;
                    background-image:
                        linear-gradient(${theme.mesh} 1px, transparent 1px),
                        linear-gradient(90deg, ${theme.mesh} 1px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                    z-index: 0;
                }

                /* ─── Animated gradient blobs ─── */
                .blob {
                    position: absolute; border-radius: 50%;
                    filter: blur(100px); pointer-events: none; z-index: 0;
                }
                .blob-1 {
                    width: 560px; height: 560px;
                    background: radial-gradient(ellipse, ${theme.blob1}, transparent 70%);
                    top: -160px; left: 50%; transform: translateX(-50%);
                    animation: drift1 8s ease-in-out infinite alternate;
                }
                .blob-2 {
                    width: 300px; height: 300px;
                    background: radial-gradient(ellipse, ${theme.blob2}, transparent 70%);
                    bottom: -60px; right: 0;
                    animation: drift2 7s ease-in-out infinite alternate;
                }
                .blob-3 {
                    width: 220px; height: 220px;
                    background: radial-gradient(ellipse, ${theme.blob3}, transparent 70%);
                    bottom: 60px; left: 0;
                    animation: drift2 9s ease-in-out infinite alternate-reverse;
                }

                @keyframes drift1 {
                    from { transform: translateX(-50%) translateY(0) scale(1); }
                    to   { transform: translateX(-50%) translateY(30px) scale(1.08); }
                }
                @keyframes drift2 {
                    from { transform: translate(0, 0); }
                    to   { transform: translate(0px, -20px); }
                }

                /* ─── Navbar ─── */
                .sk-nav {
                    position: relative; z-index: 50;
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 16px 32px;
                    background: ${theme.navBg};
                    backdrop-filter: blur(22px);
                    border-bottom: 1px solid ${theme.navBorder};
                    flex-shrink: 0;
                }

                /* ─── Buttons ─── */
                .btn-primary {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #14b8a6 100%);
                    color: #fff; border: none; border-radius: 8px;
                    font-size: 14px; font-weight: 700; padding: 11px 24px;
                    cursor: pointer; font-family: inherit; letter-spacing: 0.01em;
                    box-shadow: 0 0 26px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.15);
                    transition: all 0.22s; position: relative; overflow: hidden;
                    white-space: nowrap;
                }
                .btn-primary::before {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
                    opacity: 0; transition: opacity 0.22s;
                }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
                .btn-primary:hover::before { opacity: 1; }
                .btn-primary:active { transform: translateY(0); }

                .btn-ghost {
                    background: ${isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)'};
                    color: ${theme.textPrimary}; 
                    border: 1px solid ${isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.4)'};
                    border-radius: 10px; font-size: 14px; font-weight: 600;
                    padding: 11px 22px; cursor: pointer; font-family: inherit;
                    transition: all 0.22s; white-space: nowrap;
                    backdrop-filter: blur(8px);
                }
                .btn-ghost:hover {
                    background: ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.12)'};
                    border-color: rgba(139,92,246,0.6);
                    box-shadow: 0 0 24px rgba(139,92,246,0.2);
                    color: ${theme.textPrimary};
                    transform: translateY(-2px);
                }

                /* ─── Logo badge ─── */
                .logo-badge {
                    width: 36px; height: 36px; border-radius: 11px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; font-size: 13px; color: #fff;
                    box-shadow: 0 0 18px rgba(99,102,241,0.55), inset 0 1px 0 rgba(255,255,255,0.2);
                    flex-shrink: 0;
                }

                /* ─── Hero tag ─── */
                .hero-tag {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(99,102,241,0.1);
                    border: 1px solid rgba(99,102,241,0.28);
                    border-radius: 100px; padding: 5px 14px;
                    font-size: 12px; font-weight: 600; color: #a78bfa;
                    letter-spacing: 0.04em;
                }
                .hero-tag .dot {
                    width: 7px; height: 7px; border-radius: 50%; background: #6366f1;
                    animation: glow-pulse 2s ease infinite;
                }
                @keyframes glow-pulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.6); }
                    50%     { box-shadow: 0 0 0 5px rgba(99,102,241,0); }
                }

                /* ─── Gradient headline ─── */
                .hero-headline {
                    font-size: clamp(2.1rem, 5vw, 3.4rem);
                    font-weight: 800;
                    line-height: 1.16;
                    letter-spacing: -0.03em;
                    font-family: 'Poppins', 'Inter', sans-serif;
                    color: ${theme.textPrimary};
                }
                .hero-headline .accent {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #14b8a6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* ─── Feature cards ─── */
                .feat-card {
                    flex: 1; min-width: 0;
                    background: ${theme.cardBg};
                    border: 1px solid ${theme.cardBorder};
                    border-radius: 18px;
                    padding: 22px 20px;
                    position: relative; overflow: hidden;
                    box-shadow: ${theme.cardShadow};
                    transition: all 0.32s cubic-bezier(0.22,1,0.36,1);
                    cursor: default;
                }
                .feat-card::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: var(--card-glow);
                    opacity: 0;
                    transition: opacity 0.32s;
                    border-radius: inherit;
                }
                .feat-card:hover {
                    transform: translateY(-6px);
                    border-color: var(--card-accent);
                    box-shadow: ${theme.cardHoverShadow};
                }
                .feat-card:hover::before { opacity: 1; }

                .feat-icon {
                    width: 44px; height: 44px; border-radius: 13px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px; margin-bottom: 14px;
                    background: var(--card-glow);
                    border: 1px solid var(--card-accent);
                }

                /* ─── Footer ─── */
                .sk-footer {
                    flex-shrink: 0; position: relative; z-index: 10;
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 13px 32px;
                    border-top: 1px solid ${theme.footerBorder};
                    font-size: 12px; color: ${theme.textSecondary};
                }

                /* ─── Responsive ─── */
                @media (max-width: 640px) {
                    /* Kill horizontal scroll */
                    html, body, #root { overflow-x: hidden !important; max-width: 100vw !important; }

                    /* Contain blobs so they don't bleed */
                    .blob-1 { width: 300px !important; height: 300px !important; }
                    .blob-2 { width: 160px !important; height: 160px !important; right: 0 !important; }
                    .blob-3 { width: 130px !important; height: 130px !important; left: 0 !important; }

                    /* Nav — compact */
                    .sk-nav { padding: 10px 14px; }
                    .nav-actions .btn-ghost { display: none !important; }
                    .sk-nav .btn-primary { padding: 8px 14px; font-size: 13px; margin-left: auto; }

                    /* Hero — compress vertical space */
                    .main-container { padding: 2vh 16px !important; gap: 20px !important; justify-content: flex-start !important; }
                    .hero-headline { font-size: 1.7rem !important; margin-bottom: 8px !important; }
                    .hero-subtext { font-size: 13.5px !important; line-height: 1.5 !important; }
                    .hero-tag { font-size: 11px !important; padding: 4px 10px !important; margin-bottom: 12px !important; }

                    /* Cards — compact stack to limit scrolling */
                    .feat-row { flex-direction: column !important; gap: 10px !important; }
                    .feat-card { padding: 14px 16px !important; }
                    .feat-icon { width: 36px !important; height: 36px !important; margin-bottom: 10px !important; font-size: 18px !important; }
                    .feat-card-title { font-size: 14px !important; margin-bottom: 4px !important; }
                    .feat-card-desc { font-size: 12.5px !important; line-height: 1.4 !important; }

                    /* CTAs — full width */
                    .cta-row { flex-direction: column; align-items: stretch; gap: 10px !important; }
                    .cta-row button { width: 100%; justify-content: center; }

                    /* Footer — mobile stacked */
                    .sk-footer { 
                        flex-direction: column; 
                        padding: 16px 16px; 
                        gap: 10px; 
                        text-align: center;
                    }
                    .sk-footer .footer-links { justify-content: center; width: 100%; }
                }
            `}</style>

            {/* ── BG LAYERS ── */}
            <div className="mesh-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />

            {/* ══ NAV ══ */}
            <motion.div
                className="sk-nav"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="logo-badge" style={{ background: 'linear-gradient(135deg, #6366f1, #14b8a6)', boxShadow: 'none' }}><Wallet size={16} strokeWidth={2.5} /></div>
                    <span className="brand-text" style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.4px', color: theme.textPrimary }}>
                        ShreeKhata
                    </span>
                </div>

                {/* Nav actions */}
                <div className="nav-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <IconButton onClick={toggleTheme} sx={{ color: theme.textPrimary, mr: { xs: 0, sm: 1 }, width: 34, height: 34 }}>
                        {isDark ? <Brightness7 sx={{ fontSize: 18 }} /> : <Brightness4 sx={{ fontSize: 18 }} />}
                    </IconButton>
                    <button className="btn-ghost" onClick={() => navigate('/login')}>Log in</button>
                    <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started →</button>
                </div>
            </motion.div>

            {/* ══ MAIN ══ */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="main-container"
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '6vh 28px',
                    position: 'relative',
                    zIndex: 10,
                    gap: 32,
                    maxWidth: 960,
                    margin: '0 auto',
                    width: '100%',
                }}
            >
                {/* ─── HERO COPY ─── */}
                <motion.div variants={item} style={{ textAlign: 'center' }}>
                    {/* Pill badge */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                        <div className="hero-tag">
                            <span className="dot" />
                            Free&nbsp;·&nbsp;No credit card&nbsp;·&nbsp;PWA
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="hero-headline" style={{ marginBottom: 14 }}>
                        Your Money,{' '}
                        <span className="accent">Under Control.</span>
                    </h1>

                    {/* Subtext */}
                    <p className="hero-subtext" style={{
                        color: theme.textSecondary, fontSize: 'clamp(14px, 2vw, 16px)',
                        lineHeight: 1.72, maxWidth: 420, margin: '0 auto',
                    }}>
                        Track every rupee, visualize your spending, and grow your savings — in one beautiful digital ledger.
                    </p>
                </motion.div>

                {/* ─── CTAs ─── */}
                <motion.div variants={item}>
                    <div className="cta-row" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            className="btn-primary"
                            style={{ fontSize: 15, padding: '14px 32px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                            onClick={() => navigate('/signup')}
                        >
                            Start Free — No Card Needed <ArrowRight size={16} strokeWidth={2.5} />
                        </button>
                        <button
                            className="btn-ghost"
                            style={{ fontSize: 15, padding: '14px 26px', borderRadius: 12 }}
                            onClick={() => navigate('/login')}
                        >
                            Log in
                        </button>
                    </div>

                    {/* Trust row */}
                    <div style={{
                        display: 'flex', gap: 20, justifyContent: 'center',
                        marginTop: 14, flexWrap: 'wrap',
                    }}>
                        {['Free forever', 'PDF & Excel Export', 'No credit card'].map(t => (
                            <span key={t} style={{ color: theme.textSecondary, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Check size={11} color="#10B981" strokeWidth={3} />{t}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* ─── FEATURE CARDS ─── */}
                <motion.div
                    variants={item}
                    className="feat-row"
                    style={{ display: 'flex', gap: 14, width: '100%' }}
                >
                    {FEATURES.map((f, i) => (
                        <div
                            key={i}
                            className="feat-card"
                            style={{
                                '--card-accent': `${f.accent}55`,
                                '--card-glow': `radial-gradient(ellipse at 0% 0%, ${f.glow}, transparent 70%)`,
                            }}
                        >
                            <div
                                className="feat-icon"
                                style={{
                                    '--card-glow': f.glow,
                                    '--card-accent': `${f.accent}44`,
                                }}
                            >
                                <f.Icon size={20} color={f.accent} strokeWidth={1.75} />
                            </div>
                            <div className="feat-card-title" style={{ fontWeight: 700, fontSize: 15, marginBottom: 7, color: theme.textPrimary }}>
                                {f.title}
                            </div>
                            <div className="feat-card-desc" style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 1.65 }}>
                                {f.desc}
                            </div>

                            {/* Corner accent line */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: 40, height: 2,
                                background: `linear-gradient(90deg, ${f.accent}, transparent)`,
                                borderRadius: '18px 0 0 0',
                            }} />
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* ══ FOOTER ══ */}
            <motion.div
                className="sk-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
            >
                <span style={{ color: theme.textSecondary }}>© {new Date().getFullYear()} ShreeKhata</span>
                <span style={{ color: theme.textSecondary, letterSpacing: '0.06em', fontSize: 11 }}>
                    TRACK &nbsp;·&nbsp; ANALYZE &nbsp;·&nbsp; GROW
                </span>
                <div className="footer-links" style={{ display: 'flex', gap: 18 }}>
                    {['Privacy', 'Terms'].map(l => (
                        <span key={l} style={{ color: theme.textSecondary, cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = '#14B8A6'}
                            onMouseLeave={e => e.target.style.color = theme.textSecondary}
                        >{l}</span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
