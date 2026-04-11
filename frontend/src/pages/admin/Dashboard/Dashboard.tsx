import React, { useState } from 'react';
import Header from '../../../components/admin/Header';
import {
    LayoutDashboard,
    List,
    CalendarCheck,
    Wallet,
    ClipboardList,
    TrendingUp,
    TrendingDown,
    Star,
    ChevronRight,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────── */
interface NavItem {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
}

/* ─── Sidebar nav items ──────────────────────────── */
const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true },
    { label: 'My Listings', icon: <List size={18} /> },
    { label: 'Requests', icon: <ClipboardList size={18} /> },
    { label: 'Reservations', icon: <CalendarCheck size={18} /> },
    { label: 'Earnings', icon: <Wallet size={18} /> },
];

/* ─── Stat cards data ────────────────────────────── */
const STATS = [
    { label: 'Total Bookings', value: '487', icon: <CalendarCheck size={20} />, color: '#007EFF' },
    { label: 'Total Revenue', value: '200k€', icon: <Wallet size={20} />, color: '#F6E304' },
    { label: 'Amount of Listings', value: '8', icon: <List size={20} />, color: '#007EFF' },
    { label: 'Min. Nightly Rate', value: '$ 25', icon: <Star size={20} />, color: '#F6E304' },
    { label: 'Max. Nightly Rate', value: '$ 500', icon: <Star size={20} />, color: '#007EFF' },
];

/* ─── Request rows ───────────────────────────────── */
const REQUESTS = [
    { period: 'This week', value: '487', prev: 5596, trend: 'up', pct: '32%' },
    { period: 'This month', value: '1,579', prev: 2596, trend: 'down', pct: '32%' },
    { period: 'This year', value: '2,012', prev: 2596, trend: 'up', pct: '32%' },
];

/* ─── Top listings ───────────────────────────────── */
const LISTINGS = [
    { title: 'Apartment not far from the center of main...', type: 'Apartments', location: 'New Delhi, Delhi, India', bookings: 25 },
    { title: 'A nice place for an unforgettable holiday', type: 'Building', location: '21000, Split, Croatia', bookings: 23 },
    { title: 'Fantastic Urban Condo Rental', type: 'Home', location: 'New York, NY, USA', bookings: 17 },
];

/* ─── Reviews ────────────────────────────────────── */
const REVIEWS = [
    { name: 'Kevin Simpson', date: '14 May 2022', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempor sed metus non consectetuer.' },
    { name: 'Leona Maxwell', date: '28 Jun 2022', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempor sed metus non consectetuer.' },
];

/* ─── Mini bar chart (SVG) ───────────────────────── */
const MiniBarChart: React.FC = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const vals = [6, 4, 5, 5, 4, 0, 0, 5, 5, 9, 6, 3];
    const maxV = 10;
    const W = 560; const H = 100; const barW = 32; const gap = (W - months.length * barW) / (months.length + 1);

    return (
        <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" style={{ display: 'block' }}>
            {vals.map((v, i) => {
                const x = gap + i * (barW + gap);
                const bh = (v / maxV) * H;
                const y = H - bh;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={bh} rx={6}
                            fill={i === 9 ? '#007EFF' : 'rgba(0,126,255,0.18)'} />
                        <text x={x + barW / 2} y={H + 16} textAnchor="middle"
                            fontSize="10" fill="rgba(243,243,243,0.3)" fontFamily="system-ui">{months[i]}</text>
                    </g>
                );
            })}
        </svg>
    );
};

/* ─── Mini line chart (SVG) ──────────────────────── */
const MiniLineChart: React.FC = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const vals = [3, 7, 4, 6, 4, 5, 8, 6, 9, 7, 10, 6];
    const W = 560; const H = 100; const maxV = 12;
    const pts = vals.map((v, i) => {
        const x = (i / (vals.length - 1)) * W;
        const y = H - (v / maxV) * H;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" style={{ display: 'block' }}>
            <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007EFF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#007EFF" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon
                points={`0,${H} ${pts} ${W},${H}`}
                fill="url(#lineGrad)"
            />
            {/* Line */}
            <polyline points={pts} fill="none" stroke="#007EFF" strokeWidth="2" strokeLinejoin="round" />
            {/* Dots */}
            {vals.map((v, i) => {
                const x = (i / (vals.length - 1)) * W;
                const y = H - (v / maxV) * H;
                return <circle key={i} cx={x} cy={y} r={3} fill="#007EFF" />;
            })}
            {/* Labels */}
            {months.map((m, i) => {
                const x = (i / (months.length - 1)) * W;
                return <text key={i} x={x} y={H + 16} textAnchor="middle" fontSize="10" fill="rgba(243,243,243,0.3)" fontFamily="system-ui">{m}</text>;
            })}
        </svg>
    );
};

/* ─── Dashboard ──────────────────────────────────── */
const Dashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeNav, setActiveNav] = useState(0);

    const user = { name: 'Zakaria Akrabou', email: 'zakaria.ak@example.com' };

    const sidebarW = sidebarOpen ? 220 : 72;

    /* styles */
    const card = (extra?: React.CSSProperties): React.CSSProperties => ({
        background: '#17171A',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '20px',
        ...extra,
    });

    return (
        <div style={{ minHeight: '100vh', background: '#000000', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#F3F3F3' }}>
            {/* Header */}
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} />

            {/* Body */}
            <div style={{ display: 'flex', paddingTop: '64px' }}>

                {/* Sidebar */}
                <aside style={{
                    width: `${sidebarW}px`,
                    minHeight: 'calc(100vh - 64px)',
                    background: '#081D3A',
                    borderRight: '1px solid rgba(0,126,255,0.12)',
                    position: 'fixed',
                    top: '64px',
                    left: 0,
                    bottom: 0,
                    transition: 'width 0.25s ease',
                    overflow: 'hidden',
                    zIndex: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 10px',
                    gap: '4px',
                }}>
                    {NAV_ITEMS.map((item, idx) => {
                        const isActive = activeNav === idx;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveNav(idx)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: sidebarOpen ? '11px 14px' : '11px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: isActive ? 'rgba(0,126,255,0.15)' : 'transparent',
                                    color: isActive ? '#007EFF' : 'rgba(243,243,243,0.5)',
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: '13px',
                                    width: '100%',
                                    textAlign: 'left',
                                    transition: 'all 0.15s',
                                    whiteSpace: 'nowrap',
                                    borderLeft: isActive ? '3px solid #007EFF' : '3px solid transparent',
                                }}
                            >
                                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        );
                    })}

                    {/* Bottom yellow accent */}
                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(246,227,4,0.1), rgba(246,227,4,0.04))',
                            border: '1px solid rgba(246,227,4,0.15)',
                            borderRadius: '12px',
                            padding: '12px',
                            display: sidebarOpen ? 'block' : 'none',
                        }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#F6E304', margin: '0 0 4px' }}>PRO PLAN</p>
                            <p style={{ fontSize: '11px', color: 'rgba(243,243,243,0.4)', margin: 0, lineHeight: 1.4 }}>Upgrade to unlock all features</p>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <main style={{
                    marginLeft: `${sidebarW}px`,
                    flex: 1,
                    padding: '28px 28px',
                    transition: 'margin-left 0.25s ease',
                    minHeight: 'calc(100vh - 64px)',
                }}>
                    {/* Page title */}
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#F3F3F3', margin: 0, letterSpacing: '-0.5px' }}>
                                Tableau de bord
                            </h1>
                            <p style={{ fontSize: '13px', color: 'rgba(243,243,243,0.4)', margin: '4px 0 0' }}>
                                Bienvenue dans votre espace d'administration ServiceHub.
                            </p>
                        </div>
                        <div style={{
                            background: '#F6E304',
                            color: '#000',
                            borderRadius: '10px',
                            padding: '9px 18px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}>
                            + Nouvelle annonce
                        </div>
                    </div>

                    {/* ── Stat cards ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '20px' }}>
                        {STATS.map((s, i) => (
                            <div key={i} style={card({ padding: '16px 18px' })}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '11px', color: 'rgba(243,243,243,0.45)', fontWeight: 500 }}>{s.label}</span>
                                    <div style={{
                                        background: `${s.color}15`,
                                        color: s.color,
                                        borderRadius: '8px',
                                        padding: '5px',
                                        display: 'flex',
                                    }}>{s.icon}</div>
                                </div>
                                <p style={{ fontSize: '22px', fontWeight: 800, color: '#F3F3F3', margin: 0 }}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Middle row ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '18px', marginBottom: '18px' }}>

                        {/* Total requests */}
                        <div style={card()}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                                <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Total Requests</h2>
                                <span style={{ fontSize: '12px', color: 'rgba(243,243,243,0.3)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>Week · Month · Year</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                                {REQUESTS.map((r, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px' }}>
                                        <p style={{ fontSize: '11px', color: 'rgba(243,243,243,0.4)', margin: '0 0 6px' }}>{r.period}</p>
                                        <p style={{ fontSize: '22px', fontWeight: 800, color: '#F3F3F3', margin: '0 0 6px' }}>{r.value}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {r.trend === 'up'
                                                ? <TrendingUp size={12} color="#22c55e" />
                                                : <TrendingDown size={12} color="#ef4444" />}
                                            <span style={{ fontSize: '11px', color: r.trend === 'up' ? '#22c55e' : '#ef4444' }}>
                                                {r.pct}
                                            </span>
                                            <span style={{ fontSize: '11px', color: 'rgba(243,243,243,0.3)' }}>vs prev.</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Listings */}
                        <div style={card()}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Top Listings</h2>
                                <span style={{ fontSize: '11px', color: 'rgba(243,243,243,0.35)' }}># of bookings</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {LISTINGS.map((l, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        gap: '10px',
                                    }}>
                                        {/* Thumbnail placeholder */}
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '8px',
                                            background: 'linear-gradient(135deg, rgba(0,126,255,0.3), rgba(8,29,58,0.8))',
                                            flexShrink: 0,
                                        }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#F3F3F3', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {l.title}
                                            </p>
                                            <p style={{ fontSize: '11px', color: 'rgba(243,243,243,0.35)', margin: 0 }}>{l.location}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                                                {[...Array(5)].map((_, si) => <Star key={si} size={9} color="#F6E304" fill="#F6E304" />)}
                                                <span style={{ fontSize: '10px', color: 'rgba(243,243,243,0.3)', marginLeft: '2px' }}>5.0</span>
                                            </div>
                                        </div>
                                        {/* Booking count badge */}
                                        <div style={{
                                            background: 'rgba(0,126,255,0.12)',
                                            border: '1px solid rgba(0,126,255,0.25)',
                                            borderRadius: '10px',
                                            padding: '6px 10px',
                                            textAlign: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <p style={{ fontSize: '16px', fontWeight: 800, color: '#007EFF', margin: 0 }}>{l.bookings}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom row: charts + reviews ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '18px' }}>

                        {/* Views chart */}
                        <div style={card()}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Amount of Views</h2>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {['Week', 'Month', 'Year'].map((t, i) => (
                                        <button key={i} style={{
                                            background: i === 0 ? 'rgba(0,126,255,0.15)' : 'transparent',
                                            border: 'none',
                                            color: i === 0 ? '#007EFF' : 'rgba(243,243,243,0.35)',
                                            fontSize: '12px',
                                            fontWeight: i === 0 ? 600 : 400,
                                            cursor: 'pointer',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                        }}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <MiniLineChart />
                        </div>

                        {/* Reviews */}
                        <div style={card()}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Reviews</h2>
                                <button style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#007EFF',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    Voir tout <ChevronRight size={13} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {REVIEWS.map((r, i) => (
                                    <div key={i} style={{
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        borderLeft: '3px solid #007EFF',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <div style={{
                                                width: '34px',
                                                height: '34px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #007EFF, #0050CC)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                color: '#fff',
                                                flexShrink: 0,
                                            }}>
                                                {r.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#F3F3F3', margin: 0 }}>{r.name}</p>
                                                <p style={{ fontSize: '11px', color: 'rgba(243,243,243,0.35)', margin: 0 }}>{r.date}</p>
                                            </div>
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                                                {[...Array(5)].map((_, si) => <Star key={si} size={10} color="#F6E304" fill="#F6E304" />)}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '12px', color: 'rgba(243,243,243,0.5)', margin: 0, lineHeight: 1.6 }}>
                                            {r.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Earnings chart */}
                    <div style={{ ...card({ marginTop: '18px' }) }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Earnings</h2>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {['Week', 'Month', 'Year'].map((t, i) => (
                                    <button key={i} style={{
                                        background: i === 0 ? 'rgba(246,227,4,0.12)' : 'transparent',
                                        border: 'none',
                                        color: i === 0 ? '#F6E304' : 'rgba(243,243,243,0.35)',
                                        fontSize: '12px',
                                        fontWeight: i === 0 ? 600 : 400,
                                        cursor: 'pointer',
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                    }}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <MiniBarChart />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;