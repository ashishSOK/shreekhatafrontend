import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Grid, Card, CardContent, Typography, Button, Collapse,
    useTheme, useMediaQuery,
} from '@mui/material';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    TrendingUp, TrendingDown, Wallet, Home,
    IndianRupee, QrCode, LineChart,
    PieChart as PieChartIcon, BarChart3, CreditCard,
    PiggyBank, CalendarRange, ArrowRightLeft,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { dashboardAPI, transactionAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { motion } from 'framer-motion';
import PageLoader from '../components/common/PageLoader';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = memo(({ title, value, icon, color, delay, isDark }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, type: 'spring', stiffness: 130 }}
        style={{ height: '100%' }}
    >
        <Card sx={{
            height: '100%',
            background: isDark
                ? `linear-gradient(145deg, ${color}1a 0%, ${color}08 100%)`
                : `linear-gradient(145deg, ${color}22 0%, ${color}12 100%)`,
            border: `1px solid ${isDark ? `${color}28` : `${color}30`}`,
            borderRadius: 3,
            boxShadow: isDark
                ? `0 4px 20px ${color}14`
                : `0 4px 20px ${color}18`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: isDark
                    ? `0 10px 32px ${color}28`
                    : `0 10px 32px ${color}30`,
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${color}, ${color}88)`,
                borderRadius: '3px 3px 0 0',
            },
        }}>
            <CardContent sx={{
                p: { xs: '10px 4px !important', sm: '18px !important', md: '22px !important' },
                pb: { xs: '12px !important', sm: '18px !important', md: '22px !important' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', sm: 'flex-start' },
                textAlign: { xs: 'center', sm: 'left' }
            }}>
                <Box sx={{
                    width: { xs: 22, sm: 42, md: 48 },
                    height: { xs: 22, sm: 42, md: 48 },
                    bgcolor: `${color}${isDark ? '18' : '28'}`,
                    borderRadius: { xs: 1.5, sm: 2, md: 2.5 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: { xs: 0.8, sm: 1.25, md: 1.5 },
                    boxShadow: `0 2px 10px ${color}20`,
                }}>
                    {icon}
                </Box>
                <Typography sx={{
                    fontWeight: 800,
                    fontSize: { xs: '0.8rem', sm: '1.45rem', md: '1.95rem', lg: '2.1rem' },
                    lineHeight: 1.1,
                    color: color,
                    letterSpacing: '-0.02em',
                    mb: { xs: 0.2, sm: 0.4 },
                    wordBreak: 'break-word',
                    width: '100%',
                }}>
                    {value}
                </Typography>
                <Typography sx={{
                    fontSize: { xs: '0.58rem', sm: '0.78rem', md: '0.85rem' },
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    width: '100%',
                }}>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    </motion.div>
));

// ─── Chart Card wrapper ───────────────────────────────────────────────────────
const ChartCard = memo(({ title, icon, accent, delay, isDark, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        style={{ height: '100%' }}
    >
        <Card sx={{
            background: isDark
                ? 'rgba(255,255,255,0.025)'
                : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            border: isDark
                ? '1px solid rgba(255,255,255,0.07)'
                : '1px solid rgba(0,0,0,0.08)',
            borderRadius: 3,
            boxShadow: isDark
                ? '0 6px 28px rgba(0,0,0,0.22)'
                : '0 4px 20px rgba(0,0,0,0.08)',
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${accent[0]}, ${accent[1]})`,
            },
        }}>
            <CardContent sx={{ p: { xs: '16px !important', sm: '24px !important' } }}>
                <Typography sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.82rem', sm: '1rem' },
                    mb: { xs: 1.5, sm: 2 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    background: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    <span style={{ WebkitTextFillColor: 'initial', display: 'flex', alignItems: 'center' }}>
                        {icon}
                    </span>
                    {title}
                </Typography>
                {children}
            </CardContent>
        </Card>
    </motion.div>
));

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, showExtra }) => {
    if (!active || !payload?.length) return null;

    // Sometimes we want to show fields from the raw data that aren't plotted
    const rawData = payload[0]?.payload || {};

    return (
        <Box sx={{
            background: 'rgba(10,10,20,0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2.5,
            p: '10px 14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', mb: 0.5, fontWeight: 600 }}>
                {label}
            </Typography>
            {payload.map((entry, i) => (
                <Typography key={i} sx={{ fontSize: '0.72rem', color: entry.color || '#fff', fontWeight: 700 }}>
                    {entry.name}: {formatCurrency(entry.value)}
                </Typography>
            ))}
            {/* Render extra unplotted fields if requested */}
            {showExtra && showExtra.map((extra, i) => {
                const val = rawData[extra.key];
                if (val === undefined) return null;
                return (
                    <Typography key={`extra-${i}`} sx={{ fontSize: '0.72rem', color: extra.color || '#fff', fontWeight: 700 }}>
                        {extra.name}: {formatCurrency(val)}
                    </Typography>
                );
            })}
        </Box>
    );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDark = theme.palette.mode === 'dark';
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [trend, setTrend] = useState([]);
    const [categoryDist, setCategoryDist] = useState([]);
    const [monthlyComp, setMonthlyComp] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [showAllStats, setShowAllStats] = useState(false);

    useEffect(() => { loadDashboardData(); }, []);

    const loadDashboardData = async () => {
        try {
            const localDate = new Date().toLocaleDateString('en-CA');
            const [sRes, tRes, cRes, mRes, txRes] = await Promise.all([
                dashboardAPI.getSummary(localDate),
                dashboardAPI.getTrend(localDate),
                dashboardAPI.getCategoryDistribution(localDate),
                dashboardAPI.getMonthlyComparison(localDate),
                transactionAPI.getAll({ limit: 5 })
            ]);
            setSummary(sRes.data);
            setTrend(tRes.data);
            setCategoryDist(cRes.data);
            setMonthlyComp(mRes.data);
            setRecentTransactions(txRes.data.transactions || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

    if (loading) return <PageLoader message="Loading Dashboard..." />;

    const todayExp = Number(summary?.today?.expense || 0);
    const monthIncome = Number(summary?.month?.income || 0);
    const monthExpense = Number(summary?.month?.expense || 0);
    const dailyAvg = monthExpense / (new Date().getDate() || 1);
    const savingsRate = monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome) * 100 : 0;

    const iconSz = isMobile ? 12 : 28;

    const statCards = [
        { title: "Today's Expense", value: formatCurrency(todayExp), color: todayExp > 0 ? '#ef4444' : '#10b981', icon: todayExp > 0 ? <TrendingDown size={iconSz} color="#ef4444" /> : <TrendingUp size={iconSz} color="#10b981" /> },
        { title: 'Net Balance', value: formatCurrency(summary?.netBalance || 0), color: '#3b82f6', icon: <Wallet size={iconSz} color="#3b82f6" /> },
        { title: 'Monthly Expense', value: formatCurrency(monthExpense), color: '#ec4899', icon: <TrendingDown size={iconSz} color="#ec4899" /> },
        { title: 'Monthly Income', value: formatCurrency(monthIncome), color: '#10b981', icon: <TrendingUp size={iconSz} color="#10b981" /> },
        { title: 'Monthly Rent Exp.', value: formatCurrency(summary?.month?.rent || 0), color: '#f59e0b', icon: <Home size={iconSz} color="#f59e0b" /> },
        { title: 'Monthly Rent Inc.', value: formatCurrency(summary?.month?.rentIncome || 0), color: '#8b5cf6', icon: <Home size={iconSz} color="#8b5cf6" /> },
        { title: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, color: savingsRate >= 20 ? '#10b981' : (savingsRate > 0 ? '#f59e0b' : '#ef4444'), icon: <PiggyBank size={iconSz} color={savingsRate >= 20 ? '#10b981' : (savingsRate > 0 ? '#f59e0b' : '#ef4444')} /> },
        { title: 'Daily Average', value: formatCurrency(dailyAvg), color: '#6366f1', icon: <CalendarRange size={iconSz} color="#6366f1" /> },
    ];

    const fmtTrend = trend.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }));

    const fmtMonthly = monthlyComp.map(d => ({
        ...d,
        month: new Date(d.month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
    }));

    // Theme-aware chart styles
    const gridStroke = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
    const axisStyle = { fontSize: isMobile ? 9 : 11, fill: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)' };
    const legendStyle = { fontSize: isMobile ? 10 : 12, paddingTop: 6, color: isDark ? '#cbd5e1' : '#64748b' };

    return (
        <Box sx={{ pb: { xs: 3, md: 4 } }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
                    <Typography sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.5rem', sm: '1.8rem' },
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6 50%, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.025em',
                    }}>
                        Dashboard
                    </Typography>

                    <Button
                        onClick={() => setShowAllStats(!showAllStats)}
                        endIcon={showAllStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                            borderRadius: 2,
                            px: 2, py: 0.5,
                            '&:hover': { background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }
                        }}
                    >
                        {showAllStats ? 'Show Less' : 'Show All Data'}
                    </Button>
                </Box>
            </motion.div>

            {/* ── Stat Cards ── */}
            <Collapse in={true}>
                <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ mb: { xs: 2.5, md: 3.5 } }}>
                    {(showAllStats ? statCards : statCards.slice(0, isMobile ? 4 : 6)).map((card, i) => (
                        <Grid item xs={3} sm={3} md={2} lg={2} key={card.title}>
                            <StatCard {...card} isDark={isDark} delay={i * 0.05} />
                        </Grid>
                    ))}
                </Grid>
            </Collapse>

            {/* ── Charts ── */}
            <Grid container spacing={{ xs: 1.5, md: 2.5 }}>

                {/* Spending Trend */}
                <Grid item xs={12} md={8}>
                    <ChartCard title="Spending Trend (30 Days)" icon={<LineChart size={20} color="#6366f1" />} accent={['#6366f1', '#8b5cf6']} delay={0.32} isDark={isDark}>
                        <ResponsiveContainer width="100%" height={isMobile ? 170 : 220}>
                            <AreaChart data={fmtTrend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.7} />
                                        <stop offset="35%" stopColor="#ef4444" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                                <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} interval={isMobile ? 5 : 2} />
                                <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                                <Tooltip content={<CustomTooltip showExtra={[{ key: 'income', name: 'income', color: '#10b981' }]} />} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={legendStyle} />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#ef4444"
                                    strokeWidth={3.5}
                                    fill="url(#gExp)"
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#ef4444', stroke: isDark ? '#0f172a' : '#ffffff', strokeWidth: 3 }}
                                    style={{ filter: isDark ? 'drop-shadow(0px 6px 10px rgba(239, 68, 68, 0.45))' : 'drop-shadow(0px 8px 14px rgba(239, 68, 68, 0.35))' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Category Distribution */}
                <Grid item xs={12} md={4}>
                    <ChartCard title="Category Split" icon={<PieChartIcon size={20} color="#ec4899" />} accent={['#ec4899', '#8b5cf6']} delay={0.4} isDark={isDark}>
                        <Box sx={{ position: 'relative', width: '100%', height: isMobile ? 190 : 220 }}>
                            <Box sx={{
                                position: 'absolute',
                                top: '40%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                pointerEvents: 'none',
                                zIndex: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <Typography sx={{
                                    fontSize: { xs: '0.85rem', sm: '1.05rem' },
                                    fontWeight: 800,
                                    color: isDark ? '#f8fafc' : '#0f172a',
                                    lineHeight: 1
                                }}>
                                    {formatCurrency(monthExpense)}
                                </Typography>
                                <Typography sx={{
                                    fontSize: { xs: '0.6rem', sm: '0.65rem' },
                                    fontWeight: 700,
                                    color: isDark ? '#94a3b8' : '#64748b',
                                    letterSpacing: '0.05em',
                                    mt: 0.4
                                }}>
                                    TOTAL
                                </Typography>
                            </Box>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryDist}
                                        cx="50%" cy={isMobile ? "50%" : "45%"}
                                        outerRadius={isMobile ? 65 : 80}
                                        innerRadius={isMobile ? 45 : 56}
                                        dataKey="value"
                                        paddingAngle={3}
                                        stroke="none"
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                            if (percent < 0.05) return null;
                                            const R = Math.PI / 180;
                                            const r = innerRadius + (outerRadius - innerRadius) * 0.55;
                                            return (
                                                <text
                                                    x={cx + r * Math.cos(-midAngle * R)}
                                                    y={cy + r * Math.sin(-midAngle * R)}
                                                    fill="white" textAnchor="middle" dominantBaseline="central"
                                                    fontSize={isMobile ? 10 : 12} fontWeight="bold"
                                                >
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                        labelLine={false}
                                    >
                                        {categoryDist.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ ...legendStyle, paddingTop: 4 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </ChartCard>
                </Grid>

                {/* Monthly Comparison */}
                <Grid item xs={12} md={7}>
                    <ChartCard title="Monthly Comparison" icon={<BarChart3 size={20} color="#3b82f6" />} accent={['#3b82f6', '#6366f1']} delay={0.48} isDark={isDark}>
                        <ResponsiveContainer width="100%" height={isMobile ? 190 : 260}>
                            <BarChart data={fmtMonthly} barGap={3} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                                <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                                <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ ...legendStyle, paddingTop: 8 }} />
                                <Bar dataKey="expense" fill="#ef4444" radius={[5, 5, 0, 0]} maxBarSize={36} />
                                <Bar dataKey="income" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                {/* Payment Mode */}
                <Grid item xs={12} md={5}>
                    <ChartCard title="Payment Mode" icon={<CreditCard size={20} color="#10b981" />} accent={['#10b981', '#3b82f6']} delay={0.56} isDark={isDark}>
                        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                            {[
                                {
                                    label: 'Cash',
                                    value: summary?.month?.cash || 0,
                                    color: '#6366f1',
                                    icon: <IndianRupee size={isMobile ? 36 : 48} color="#6366f1" strokeWidth={1.5} style={{ marginBottom: 8, filter: 'drop-shadow(0 4px 6px rgba(99, 102, 241, 0.2))' }} />
                                },
                                {
                                    label: 'Online',
                                    value: summary?.month?.online || 0,
                                    color: '#8b5cf6',
                                    icon: <QrCode size={isMobile ? 36 : 48} color="#8b5cf6" strokeWidth={1.5} style={{ marginBottom: 8, filter: 'drop-shadow(0 4px 6px rgba(139, 92, 246, 0.2))' }} />
                                },
                            ].map(({ label, value, color, icon }) => (
                                <Grid item xs={6} key={label}>
                                    <motion.div whileHover={{ scale: 1.03, y: -3 }} transition={{ type: 'spring', stiffness: 280 }}>
                                        <Box sx={{
                                            textAlign: 'center',
                                            py: { xs: 2, sm: 3 },
                                            px: { xs: 1, sm: 2 },
                                            background: isDark
                                                ? `linear-gradient(145deg, ${color}16 0%, ${color}06 100%)`
                                                : `linear-gradient(145deg, ${color}22 0%, ${color}12 100%)`,
                                            border: `1px solid ${isDark ? `${color}22` : `${color}28`}`,
                                            borderRadius: 3,
                                            boxShadow: isDark
                                                ? `0 4px 16px ${color}10`
                                                : `0 4px 16px ${color}15`,
                                            '&::after': {
                                                content: '""',
                                                display: 'block',
                                                width: '40%',
                                                height: 2,
                                                background: `${color}60`,
                                                margin: '8px auto 0',
                                                borderRadius: 1,
                                            },
                                        }}>
                                            {icon}
                                            <Typography sx={{ fontWeight: 800, color, fontSize: { xs: '1rem', sm: '1.5rem' }, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                                {formatCurrency(value)}
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.8rem' }, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.4 }}>
                                                {label}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </ChartCard>
                </Grid>

                {/* Recent Transactions */}
                <Grid item xs={12}>
                    <ChartCard title="Recent Transactions" icon={<ArrowRightLeft size={20} color="#f43f5e" />} accent={['#f43f5e', '#fb923c']} delay={0.64} isDark={isDark}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {recentTransactions.map((t) => (
                                <Box key={t._id} sx={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    p: { xs: 1.25, sm: 1.5 },
                                    borderRadius: 2.5,
                                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    transition: 'transform 0.2s',
                                    '&:hover': { background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', transform: 'translateX(4px)' }
                                }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.85rem', sm: '0.95rem' }, color: isDark ? '#fff' : '#111827', mb: 0.2 }}>{t.category}</Typography>
                                        <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                                            {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {t.paymentMode} {t.vendor || t.notes ? `• ${t.vendor || t.notes}` : ''}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '0.95rem', sm: '1.05rem' }, color: ['expense', 'purchase'].includes(t.type) ? '#ef4444' : '#10b981' }}>
                                        {['expense', 'purchase'].includes(t.type) ? '-' : '+'}{formatCurrency(t.amount)}
                                    </Typography>
                                </Box>
                            ))}
                            {recentTransactions.length === 0 ? (
                                <Typography sx={{ textAlign: 'center', py: 3, color: 'text.secondary', fontSize: '0.85rem' }}>No recent transactions found.</Typography>
                            ) : (
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/ledger')}
                                    sx={{
                                        mt: 1,
                                        width: '100%',
                                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                        color: 'text.primary',
                                        '&:hover': {
                                            borderColor: '#f43f5e',
                                            background: 'rgba(244, 63, 94, 0.05)'
                                        }
                                    }}
                                >
                                    View All Transactions
                                </Button>
                            )}
                        </Box>
                    </ChartCard>
                </Grid>

            </Grid>
        </Box>
    );
};

export default Dashboard;
