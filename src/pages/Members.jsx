import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
    Chip,
    Divider,
    Stack,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Grid,
    TextField,
    useTheme,
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Group,
    HourglassEmpty,
    PersonOff,
    Close,
    TrendingUp,
    Receipt,
    Circle,
    Payments,
    DeleteOutline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { membersAPI, reportAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
    pending: { label: 'Pending', color: 'warning', icon: <HourglassEmpty fontSize="small" /> },
    approved: { label: 'Active', color: 'success', icon: <CheckCircle fontSize="small" /> },
    rejected: { label: 'Rejected', color: 'error', icon: <PersonOff fontSize="small" /> },
};

const Members = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { isOwner } = useAuth();
    const navigate = useNavigate();

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState('');
    const [error, setError] = useState('');
    const [tab, setTab] = useState(0); // 0=active, 1=all, 2=pending

    // Stats dialog
    const [statsOpen, setStatsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);

    // Payment state
    const [payAmount, setPayAmount] = useState('');
    const [payNote, setPayNote] = useState('');
    const [payLoading, setPayLoading] = useState(false);

    useEffect(() => {
        if (!isOwner) { navigate('/dashboard'); return; }
        fetchMembers();
    }, [isOwner]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const res = await membersAPI.getAll();
            setMembers(res.data || []);
        } catch {
            setError('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (memberId) => {
        setActionLoading(memberId);
        try {
            await membersAPI.approve(memberId);
            setMembers(prev => prev.map(m => m._id === memberId ? { ...m, membershipStatus: 'approved' } : m));
        } catch {
            setError('Failed to approve member');
        } finally {
            setActionLoading('');
        }
    };

    const handleReject = async (memberId) => {
        setActionLoading(memberId + '_reject');
        try {
            await membersAPI.reject(memberId);
            setMembers(prev => prev.map(m => m._id === memberId ? { ...m, membershipStatus: 'rejected' } : m));
        } catch {
            setError('Failed to reject member');
        } finally {
            setActionLoading('');
        }
    };

    const handleViewStats = async (member) => {
        setSelectedMember(member);
        setStatsOpen(true);
        setStatsLoading(true);
        try {
            const res = await membersAPI.getStats(member._id);
            setStats(res.data.stats);
            setSelectedMember(res.data.member);
            setPayAmount('');
            setPayNote('');
        } catch {
            setStats(null);
        } finally {
            setStatsLoading(false);
        }
    };

    const handlePaySubmit = async () => {
        if (!payAmount || isNaN(payAmount) || Number(payAmount) <= 0) return;
        setPayLoading(true);
        try {
            const res = await membersAPI.pay(selectedMember._id, payAmount, payNote);
            setSelectedMember(prev => ({
                ...prev,
                amountPaidByOwner: res.data.amountPaidByOwner,
                reimbursements: res.data.reimbursements
            }));
            setPayAmount('');
            setPayNote('');
        } catch {
            setError('Failed to process payment');
        } finally {
            setPayLoading(false);
        }
    };

    const handleDeleteReimbursement = async (reimbursementId) => {
        if (!window.confirm('Are you sure you want to delete this reimbursement?')) return;
        try {
            const res = await membersAPI.deleteReimbursement(selectedMember._id, reimbursementId);
            setSelectedMember(prev => ({
                ...prev,
                amountPaidByOwner: res.data.amountPaidByOwner,
                reimbursements: res.data.reimbursements
            }));
        } catch {
            setError('Failed to delete reimbursement');
        }
    };

    const pending = members.filter(m => m.membershipStatus === 'pending');
    const active = members.filter(m => m.membershipStatus === 'approved');
    const all = members;

    const displayed = tab === 0 ? active : tab === 1 ? all : pending;

    const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

    return (
        <Box>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }, letterSpacing: '-0.02em' }} gutterBottom>
                            Team Members
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage who has access to your ShreeKhata account
                        </Typography>
                    </Box>
                </Box>

                {/* Mobile Premium Summary Widgets */}
                <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 4 }}>
                    {/* Total Members (Full Width Prominent Block) */}
                    <Grid item xs={12} sm={4}>
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                            <Paper elevation={0} sx={{
                                p: { xs: 2.5, sm: 3 },
                                borderRadius: { xs: 3, sm: 4 },
                                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                                overflow: 'hidden', position: 'relative'
                            }}>
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1 }}>{all.length}</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.9 }}>Total Members</Typography>
                                </Box>
                                <Group sx={{ fontSize: 64, opacity: 0.15, position: 'absolute', right: -10, bottom: -10 }} />
                            </Paper>
                        </motion.div>
                    </Grid>

                    {/* Pending & Active (Half-Width Sub Blocks) */}
                    <Grid item xs={6} sm={4}>
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Circle sx={{ fontSize: 10, color: '#10B981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
                                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Active</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={800} sx={{ color: isDark ? 'white' : '#0f172a' }}>{active.length}</Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Circle sx={{ fontSize: 10, color: '#F59E0B', boxShadow: '0 0 8px rgba(245, 158, 11, 0.5)' }} />
                                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pending</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={800} sx={{ color: isDark ? 'white' : '#0f172a' }}>{pending.length}</Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

                {/* Modern Pill Tabs */}
                <Box sx={{ display: 'flex', gap: 1.5, mb: 4, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                    {[{ label: 'Active', count: active.length }, { label: 'All', count: all.length }, { label: 'Pending', count: pending.length }].map((tabInfo, idx) => {
                        const isActive = tab === idx;
                        return (
                            <Button
                                key={tabInfo.label}
                                onClick={() => setTab(idx)}
                                sx={{
                                    borderRadius: 8,
                                    px: { xs: 2.5, sm: 3 }, py: 1,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap',
                                    background: isActive ? (isDark ? 'white' : '#0f172a') : 'transparent',
                                    color: isActive ? (isDark ? 'black' : 'white') : '#9ca3af',
                                    border: '1px solid',
                                    borderColor: isActive ? 'transparent' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                                    boxShadow: isActive ? (isDark ? '0 4px 12px rgba(255,255,255,0.2)' : '0 4px 12px rgba(0,0,0,0.1)') : 'none',
                                    '&:hover': { background: isActive ? (isDark ? 'white' : '#0f172a') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') }
                                }}
                            >
                                {tabInfo.label}
                                <Chip label={tabInfo.count} size="small" sx={{
                                    ml: 1.5,
                                    background: isActive ? (isDark ? 'black' : 'white') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                                    color: isActive ? (isDark ? 'white' : 'black') : '#9ca3af',
                                    fontWeight: 800, height: 22, fontSize: '0.75rem'
                                }} />
                            </Button>
                        )
                    })}
                </Box>

                {/* Premium List Layout */}
                <Paper elevation={0} sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    backdropFilter: 'blur(20px)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                }}>
                    {loading ? (
                        <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress sx={{ color: '#6366F1' }} /></Box>
                    ) : displayed.length === 0 ? (
                        <Box sx={{ py: 10, textAlign: 'center' }}>
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                                <Group sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.3 }} />
                                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                                    {tab === 0 ? 'No active members yet' : tab === 1 ? 'No members found' : 'No pending requests'}
                                </Typography>
                            </motion.div>
                        </Box>
                    ) : (
                        <Stack divider={<Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />}>
                            {displayed.map((member, i) => {
                                const status = statusConfig[member.membershipStatus];
                                return (
                                    <motion.div key={member._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                        <Box sx={{
                                            p: { xs: 2.25, sm: 3 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            transition: 'background 0.2s ease',
                                            '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }
                                        }}>
                                            {/* Avatar Left */}
                                            <Avatar sx={{
                                                bgcolor: member.membershipStatus === 'pending' ? 'rgba(245, 158, 11, 0.15)' : member.membershipStatus === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                                color: member.membershipStatus === 'pending' ? '#F59E0B' : member.membershipStatus === 'approved' ? '#10B981' : '#6366F1',
                                                border: `1px solid ${member.membershipStatus === 'pending' ? 'rgba(245, 158, 11, 0.3)' : member.membershipStatus === 'approved' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                                                width: { xs: 46, sm: 54 },
                                                height: { xs: 46, sm: 54 },
                                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                                fontWeight: 800
                                            }}>
                                                {member.name?.[0]?.toUpperCase()}
                                            </Avatar>

                                            {/* Center Content Group */}
                                            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                                <Typography variant="body1" fontWeight={700} noWrap sx={{ color: isDark ? 'white' : '#0f172a', fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>{member.name}</Typography>
                                                <Typography variant="caption" color="#9ca3af" noWrap sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: status.color === 'success' ? '#10B981' : status.color === 'warning' ? '#F59E0B' : '#6366F1' }}>
                                                        <Circle sx={{ fontSize: 6 }} /> {status.label}
                                                    </Box>
                                                    <Box component="span" sx={{ opacity: 0.5 }}>•</Box>
                                                    {new Date(member.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                                </Typography>
                                            </Box>

                                            {/* Right Fixed Action Area */}
                                            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                                                {member.membershipStatus === 'approved' && (
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleViewStats(member)}
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: { xs: 1.5, sm: 2.5 },
                                                            py: { xs: 0.75, sm: 1 },
                                                            borderRadius: 6,
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)',
                                                            color: isDark ? 'white' : 'black',
                                                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                            '&:hover': { background: isDark ? 'white' : 'black', color: isDark ? 'black' : 'white' }
                                                        }}
                                                    >
                                                        Stats
                                                    </Button>
                                                )}

                                                {member.membershipStatus === 'pending' && (
                                                    <Stack direction="row" spacing={0.5}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleApprove(member._id)}
                                                            sx={{
                                                                width: { xs: 34, sm: 40 }, height: { xs: 34, sm: 40 },
                                                                background: 'rgba(16, 185, 129, 0.1)', color: '#10B981',
                                                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                                                borderRadius: 3,
                                                                '&:hover': { background: 'rgba(16, 185, 129, 0.2)' }
                                                            }}
                                                        >
                                                            {actionLoading === member._id ? <CircularProgress size={16} color="inherit" /> : <CheckCircle fontSize="small" />}
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleReject(member._id)}
                                                            sx={{
                                                                width: { xs: 34, sm: 40 }, height: { xs: 34, sm: 40 },
                                                                background: 'rgba(244, 63, 94, 0.1)', color: '#F43F5E',
                                                                border: '1px solid rgba(244, 63, 94, 0.2)',
                                                                borderRadius: 3,
                                                                '&:hover': { background: 'rgba(244, 63, 94, 0.2)' }
                                                            }}
                                                        >
                                                            {actionLoading === member._id + '_reject' ? <CircularProgress size={16} color="inherit" /> : <Cancel fontSize="small" />}
                                                        </IconButton>
                                                    </Stack>
                                                )}
                                            </Box>
                                        </Box>
                                    </motion.div>
                                );
                            })}
                        </Stack>
                    )}
                </Paper>
            </motion.div>

            {/* Stats Dialog */}
            <Dialog
                open={statsOpen}
                onClose={() => setStatsOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        backgroundImage: 'none',
                        boxShadow: isDark ? '0 24px 48px rgba(0, 0, 0, 0.4)' : '0 12px 32px rgba(0, 0, 0, 0.1)',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                    pb: 2, pt: 2.5,
                    position: 'relative',
                    zIndex: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            width: 48,
                            height: 48,
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                        }}>
                            {selectedMember?.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ color: isDark ? 'white' : '#0f172a', lineHeight: 1.2 }}>{selectedMember?.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>{selectedMember?.email}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={() => setStatsOpen(false)} sx={{ color: '#6b7280', '&:hover': { color: isDark ? 'white' : 'black', bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' } }}><Close /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: { xs: 2, sm: 4 }, pt: { xs: 2.5, sm: 5 }, bgcolor: 'background.default', overflowX: 'hidden' }}>
                    {statsLoading ? (
                        <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress size={32} /></Box>
                    ) : stats ? (
                        <Grid container spacing={2} sx={{ mt: { xs: 0.5, sm: 0 } }}>
                            {/* Compact Stats Row */}
                            {[
                                { label: 'Transactions', value: stats.totalTransactions, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
                                { label: 'Total Income', value: fmt(stats.totalIncome), color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
                            ].map((s, i) => (
                                <Grid item xs={6} key={i}>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.05 }}>
                                        <Paper elevation={0} sx={{
                                            p: 2,
                                            borderRadius: 4,
                                            background: s.bg,
                                            border: isDark ? `1px solid rgba(255,255,255,0.03)` : `1px solid rgba(0,0,0,0.03)`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>{s.label}</Typography>
                                            <Typography variant="h6" fontWeight={800} sx={{ color: s.color, mt: 0.5, lineHeight: 1 }}>{s.value}</Typography>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}

                            {/* Consolidated Ledger Receipt */}
                            <Grid item xs={12}>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.02)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}>
                                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 1.5, display: 'block' }}>Expense Ledger</Typography>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>Total Logged Expense</Typography>
                                            <Typography variant="body2" fontWeight={700} sx={{ color: '#f43f5e' }}>{fmt(stats.totalExpense)}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>Reimbursed by Owner</Typography>
                                            <Typography variant="body2" fontWeight={700} sx={{ color: '#10b981' }}>{fmt(selectedMember?.amountPaidByOwner || 0)}</Typography>
                                        </Box>

                                        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', mb: 2, borderStyle: 'dashed' }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ color: isDark ? 'white' : '#0f172a', fontWeight: 600 }}>Unsettled Balance</Typography>
                                            <Typography variant="h5" fontWeight={800} sx={{ color: '#38bdf8' }}>
                                                {fmt(Math.max(0, (stats?.totalExpense || 0) - (selectedMember?.amountPaidByOwner || 0)))}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>

                            {/* Minimalist Payment Action */}
                            <Grid item xs={12}>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                placeholder="Settle Amount (₹)"
                                                type="number"
                                                value={payAmount}
                                                onChange={(e) => setPayAmount(e.target.value)}
                                                sx={{
                                                    input: { color: isDark ? 'white' : '#0f172a', fontWeight: 600, px: 2, py: 1.25 },
                                                    '& .MuiOutlinedInput-root': {
                                                        bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
                                                        borderRadius: 8,
                                                        '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                                                        '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
                                                        '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                disabled={payLoading || !payAmount}
                                                onClick={handlePaySubmit}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                                                    color: 'white',
                                                    minWidth: 'auto',
                                                    px: 3,
                                                    borderRadius: 8,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
                                                    },
                                                    '&.Mui-disabled': {
                                                        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                                        color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                                                    }
                                                }}
                                            >
                                                {payLoading ? <CircularProgress size={20} color="inherit" /> : 'Pay'}
                                            </Button>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            placeholder="Small Note (optional)"
                                            value={payNote}
                                            onChange={(e) => setPayNote(e.target.value)}
                                            sx={{
                                                input: { color: isDark ? 'white' : '#0f172a', fontWeight: 500, px: 2, py: 1.25, fontSize: '0.875rem' },
                                                '& .MuiOutlinedInput-root': {
                                                    bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                                                    borderRadius: 8,
                                                    '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
                                                    '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' },
                                                    '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                                                }
                                            }}
                                        />
                                    </Box>
                                </motion.div>
                            </Grid>

                            {/* Reimbursement History List */}
                            <Grid item xs={12}>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 4, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 1.5, display: 'block' }}>Reimbursement History</Typography>

                                        {!selectedMember?.reimbursements || selectedMember.reimbursements.length === 0 ? (
                                            <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
                                                No reimbursement history yet
                                            </Typography>
                                        ) : (
                                            <Box sx={{ maxHeight: '180px', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '4px' } }}>
                                                <Stack spacing={1.5}>
                                                    {[...selectedMember.reimbursements].reverse().map((r, i) => (
                                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 1.5, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderRadius: 2, border: isDark ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.03)' }}>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={700} sx={{ color: '#38bdf8' }}>+{fmt(r.amount)}</Typography>
                                                                {r.note && <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', display: 'block', mt: 0.5 }}>{r.note}</Typography>}
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                                                                <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', whiteSpace: 'nowrap' }}>
                                                                    {new Date(r.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                                                                </Typography>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteReimbursement(r._id)}
                                                                    sx={{
                                                                        color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                                                                        p: 0.25,
                                                                        marginLeft: 0.5,
                                                                        '&:hover': { color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)' }
                                                                    }}
                                                                >
                                                                    <DeleteOutline sx={{ fontSize: '1rem' }} />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        )}
                                    </Paper>
                                </motion.div>
                            </Grid>

                            {stats.lastActivity && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                                        <Circle sx={{ fontSize: 8, color: '#10b981', mr: 0.75 }} />
                                        Last active {new Date(stats.lastActivity).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>No data found.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: 'background.paper', borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <Button
                        onClick={() => setStatsOpen(false)}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                            px: 3,
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                            }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Members;
