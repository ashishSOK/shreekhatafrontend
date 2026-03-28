import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Grid,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Stack,
    Skeleton,
    useTheme,
    Paper,
    Divider,
} from '@mui/material';
import { Add, Edit, Delete, Circle } from '@mui/icons-material';
import { categoryAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '../components/common/PageLoader';

const CategoryCard = ({ category, index, onEdit, onDelete, isDefault, isDark }) => (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
        <Box sx={{
            p: { xs: 1.5, sm: 2 },
            display: 'flex', alignItems: 'center', gap: 2,
            transition: 'background 0.2s ease',
            '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }
        }}>
            <Box sx={{
                width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, borderRadius: 2,
                background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}05 100%)`,
                border: `1px solid ${category.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <Circle sx={{ color: category.color, fontSize: { xs: 16, sm: 20 } }} />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Typography variant="body1" fontWeight={600} noWrap sx={{ color: isDark ? 'white' : '#0f172a', fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                    {category.name}
                </Typography>
                {isDefault ? (
                    <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)', fontSize: '0.7rem', fontWeight: 600 }}>SYSTEM</Typography>
                ) : (
                    <Typography variant="caption" sx={{ color: category.color, fontSize: '0.7rem', fontWeight: 600 }}>CUSTOM</Typography>
                )}
            </Box>

            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {!isDefault && (
                    <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => onEdit(category)} sx={{ width: 32, height: 32, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? 'white' : '#0f172a', borderRadius: 2, '&:hover': { background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }}>
                            <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDelete(category._id)} sx={{ width: 32, height: 32, background: 'rgba(244, 63, 94, 0.1)', color: '#F43F5E', borderRadius: 2, '&:hover': { background: 'rgba(244, 63, 94, 0.2)' } }}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </Stack>
                )}
            </Box>
        </Box>
    </motion.div>
);

const CategorySkeleton = ({ isDark }) => (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="rectangular" sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
            <Skeleton variant="text" width="30%" height={14} sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
        </Box>
    </Box>
);

const Categories = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', color: '#6366f1' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const colors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
        '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#8b5cf6',
    ];

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            // Promise.all ensures we wait for API but also respect min loading time
            const [response] = await Promise.all([
                categoryAPI.getAll()
            ]);
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (category = null) => {
        if (category) {
            setEditMode(true);
            setCurrentCategory(category);
            setFormData({ name: category.name, color: category.color });
        } else {
            setEditMode(false);
            setCurrentCategory(null);
            setFormData({ name: '', color: colors[0] });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setError('');
    };

    const handleSubmit = async () => {
        try {
            setError('');
            if (editMode) {
                await categoryAPI.update(currentCategory._id, formData);
                setSuccess('Category updated successfully!');
            } else {
                await categoryAPI.create(formData);
                setSuccess('Category created successfully!');
            }
            loadCategories();
            handleCloseDialog();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error saving category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoryAPI.delete(id);
            setSuccess('Category deleted successfully!');
            loadCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error deleting category');
        }
    };

    const defaultCategories = useMemo(() => categories.filter((c) => c.isDefault), [categories]);
    const customCategories = useMemo(() => categories.filter((c) => !c.isDefault), [categories]);

    return (
        <Box>
            {loading && <PageLoader message="Loading Categories..." />}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Categories
                </Typography>
                <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                >
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(139, 92, 246, 0.3)',
                            borderRadius: 2,
                            px: 3,
                            py: 1.2,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                boxShadow: '0 12px 32px rgba(99, 102, 241, 0.5), 0 6px 16px rgba(139, 92, 246, 0.4)',
                            },
                        }}
                    >
                        Add Category
                    </Button>
                </motion.div>
            </Box>

            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Default Categories */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: isDark ? 'white' : '#0f172a', letterSpacing: 0.5 }}>
                    Default Categories
                </Typography>
                <Paper elevation={0} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)', backdropFilter: 'blur(20px)', border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)' }}>
                    <Stack divider={<Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />}>
                        {loading ? (
                            Array.from(new Array(3)).map((_, index) => <CategorySkeleton key={index} isDark={isDark} />)
                        ) : (
                            defaultCategories.map((category, index) => (
                                <CategoryCard category={category} index={index} isDefault={true} key={category._id} isDark={isDark} />
                            ))
                        )}
                    </Stack>
                </Paper>
            </motion.div>

            {/* Custom Categories */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: isDark ? 'white' : '#0f172a', letterSpacing: 0.5 }}>
                    Custom Categories
                </Typography>

                <Paper elevation={0} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)', backdropFilter: 'blur(20px)', border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)' }}>
                    {loading ? (
                        <Stack divider={<Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />}>
                            {Array.from(new Array(2)).map((_, index) => <CategorySkeleton key={index} isDark={isDark} />)}
                        </Stack>
                    ) : customCategories.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                                <Add sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                            </motion.div>
                            <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>
                                No custom categories yet. Create your first category!
                            </Typography>
                        </Box>
                    ) : (
                        <Stack divider={<Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />}>
                            {customCategories.map((category, index) => (
                                <CategoryCard category={category} index={index} isDefault={false} onEdit={handleOpenDialog} onDelete={handleDelete} key={category._id} isDark={isDark} />
                            ))}
                        </Stack>
                    )}
                </Paper>
            </motion.div>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
                            : 'white'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    {editMode ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Category Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                Select Color
                            </Typography>
                            <Grid container spacing={1.5}>
                                {colors.map((color) => (
                                    <Grid item key={color}>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Box
                                                onClick={() => setFormData({ ...formData, color })}
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    bgcolor: color,
                                                    cursor: 'pointer',
                                                    border: formData.color === color ? '3px solid white' : '2px solid transparent',
                                                    boxShadow: formData.color === color ? `0 0 0 2px ${color}` : 'none',
                                                    transition: 'all 0.2s',
                                                }}
                                            />
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            px: 3
                        }}
                    >
                        {editMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Categories;
