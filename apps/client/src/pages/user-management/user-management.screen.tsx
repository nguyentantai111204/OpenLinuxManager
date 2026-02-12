import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Snackbar,
    Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import { axiosClient as axios } from '../../utils/axios-client';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, COLORS, ICON_SIZES } from '../../constants/design';
import { StackRow, StackCol } from '../../components/stack';

interface User {
    username: string;
    uid: number;
    gid: number;
    home: string;
    shell: string;
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            const userData = response.data?.data || response.data;

            if (Array.isArray(userData)) {
                setUsers(userData);
            } else {
                console.error('API response is not an array:', response.data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
            showSnackbar('Failed to load users', 'error');
            setUsers([]);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async () => {
        try {
            await axios.post('/api/users', newUser);
            showSnackbar('User created successfully', 'success');
            setOpenAddDialog(false);
            setNewUser({ username: '', password: '' });
            fetchUsers();
        } catch (error) {
            console.error('Failed to create user', error);
            showSnackbar('Failed to create user', 'error');
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await axios.delete(`/api/users/${selectedUser}`);
            showSnackbar(`User ${selectedUser} deleted`, 'success');
            setOpenDeleteDialog(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user', error);
            showSnackbar('Failed to delete user', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <StackRow sx={{ mb: SPACING.lg / 8, justifyContent: 'space-between' }}>
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.bold,
                            fontSize: TYPOGRAPHY.fontSize['3xl'],
                            mb: SPACING.xs / 8
                        }}
                    >
                        User Management
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            fontSize: TYPOGRAPHY.fontSize.base,
                        }}
                    >
                        Manage system users and permissions
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddDialog(true)}
                    sx={{
                        borderRadius: BORDER_RADIUS.md / 8,
                        textTransform: 'none',
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                    }}
                >
                    Add User
                </Button>
            </StackRow>

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: BORDER_RADIUS.lg / 8,
                    boxShadow: SHADOWS.md,
                    overflow: 'hidden',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'background.default' }}>
                            <TableCell sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, fontSize: TYPOGRAPHY.fontSize.xs, color: 'text.secondary', textTransform: 'uppercase' }}>USERNAME</TableCell>
                            <TableCell sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, fontSize: TYPOGRAPHY.fontSize.xs, color: 'text.secondary', textTransform: 'uppercase' }}>UID</TableCell>
                            <TableCell sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, fontSize: TYPOGRAPHY.fontSize.xs, color: 'text.secondary', textTransform: 'uppercase' }}>GID</TableCell>
                            <TableCell sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, fontSize: TYPOGRAPHY.fontSize.xs, color: 'text.secondary', textTransform: 'uppercase' }}>HOME DIRECTORY</TableCell>
                            <TableCell sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, fontSize: TYPOGRAPHY.fontSize.xs, color: 'text.secondary', textTransform: 'uppercase' }}>SHELL</TableCell>
                            <TableCell align="right" sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold, fontSize: TYPOGRAPHY.fontSize.xs, color: 'text.secondary', textTransform: 'uppercase' }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.username} hover>
                                <TableCell>
                                    <StackRow spacing={SPACING.sm / 8} alignItems="center">
                                        <PersonIcon sx={{ color: 'text.secondary', fontSize: ICON_SIZES.sm }} />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                                                fontSize: TYPOGRAPHY.fontSize.sm,
                                            }}
                                        >
                                            {user.username}
                                        </Typography>
                                    </StackRow>
                                </TableCell>
                                <TableCell>{user.uid}</TableCell>
                                <TableCell>{user.gid}</TableCell>
                                <TableCell>{user.home}</TableCell>
                                <TableCell>{user.shell}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => {
                                            setSelectedUser(user.username);
                                            setOpenDeleteDialog(true);
                                        }}
                                        color="error"
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">No users found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add User Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Add New System User</DialogTitle>
                <DialogContent>
                    <StackCol spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField
                            autoFocus
                            label="Username"
                            fullWidth
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                    </StackCol>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateUser} disabled={!newUser.username}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user <strong>{selectedUser}</strong>? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
