import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Grid,
    Avatar,
    Divider,
    Alert,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { PersonOutlined, PhoneOutlined, EmailOutlined, StoreOutlined, ReceiptOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/common/PageLoader';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        shopName: user?.shopName || '',
        gstNumber: user?.gstNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const payload = { ...formData };
        if (payload.newPassword) {
            if (!payload.currentPassword) {
                setError('Current password is required to set a new password');
                setLoading(false);
                return;
            }
            if (payload.newPassword !== payload.confirmPassword) {
                setError('New password and confirm password do not match');
                setLoading(false);
                return;
            }
            payload.password = payload.newPassword;
        }
        delete payload.newPassword;
        delete payload.confirmPassword;

        // Artificial delay for smoother UX
        const result = await updateUserProfile(payload);

        if (result.success) {
            setSuccess('Profile updated successfully!');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <Box>
            {loading && <PageLoader message="Updating Profile..." />}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                Profile
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mx: 'auto',
                                    mb: 2,
                                    fontSize: '3rem',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                }}
                            >
                                {user?.name?.[0]?.toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Update Profile
                            </Typography>

                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {success}
                                </Alert>
                            )}

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={user?.email}
                                            disabled
                                            helperText="Email cannot be changed"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Shop/Business Name"
                                            name="shopName"
                                            value={formData.shopName}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="GST Number"
                                            name="gstNumber"
                                            value={formData.gstNumber}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.05)' }} />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                            Change Password
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            type={showCurrentPassword ? "text" : "password"}
                                            label="Current Password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            helperText="Required to change password"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowCurrentPassword((prev) => !prev)}>
                                                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type={showNewPassword ? "text" : "password"}
                                            label="New Password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            helperText="Leave blank to keep your current password"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowNewPassword((prev) => !prev)}>
                                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type={showConfirmPassword ? "text" : "password"}
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            helperText="Must match new password"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sx={{ mt: 1 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            disabled={loading}
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                                },
                                            }}
                                        >
                                            {loading ? 'Updating...' : 'Update Profile'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
