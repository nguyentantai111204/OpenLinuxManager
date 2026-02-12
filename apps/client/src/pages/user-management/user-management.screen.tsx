import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TableBodyComponent,
    IconButton,
    Snackbar,
    Alert,
} from '@mui/material';
import { ButtonComponent, TextFieldComponent, TableContainerComponent, TableComponent, TableHeadComponent, TableRowComponent, TableCellComponent } from '../../components';
import { Add as AddIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import { axiosClient as axios } from '../../utils/axios-client';
import { SPACING, TYPOGRAPHY, COLORS, ICON_SIZES } from '../../constants/design';
import { StackRowComponent, StackColComponent } from '../../components/stack';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

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
            <StackColComponent spacing={SPACING.lg / 8}>
                <StackRowComponent sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <PageHeaderComponent
                        title="User Management"
                        subtitle="Manage system users and permissions"
                    />
                    <ButtonComponent
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                    >
                        Add User
                    </ButtonComponent>
                </StackRowComponent>

                <TableContainerComponent>
                    <TableComponent>
                        <TableHeadComponent>
                            <TableRowComponent>
                                <TableCellComponent>USERNAME</TableCellComponent>
                                <TableCellComponent>UID</TableCellComponent>
                                <TableCellComponent>GID</TableCellComponent>
                                <TableCellComponent>HOME DIRECTORY</TableCellComponent>
                                <TableCellComponent>SHELL</TableCellComponent>
                                <TableCellComponent align="right">ACTIONS</TableCellComponent>
                            </TableRowComponent>
                        </TableHeadComponent>
                        <TableBodyComponent>
                            {users.map((user) => (
                                <TableRowComponent key={user.username}>
                                    <TableCellComponent>
                                        <StackRowComponent spacing={SPACING.sm / 8} alignItems="center">
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
                                        </StackRowComponent>
                                    </TableCellComponent>
                                    <TableCellComponent>{user.uid}</TableCellComponent>
                                    <TableCellComponent>{user.gid}</TableCellComponent>
                                    <TableCellComponent>{user.home}</TableCellComponent>
                                    <TableCellComponent>{user.shell}</TableCellComponent>
                                    <TableCellComponent align="right">
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
                                    </TableCellComponent>
                                </TableRowComponent>
                            ))}
                            {users.length === 0 && (
                                <TableRowComponent>
                                    <TableCellComponent colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography color="text.secondary">No users found</Typography>
                                    </TableCellComponent>
                                </TableRowComponent>
                            )}
                        </TableBodyComponent>
                    </TableComponent>
                </TableContainerComponent>
            </StackColComponent>

            {/* Add User Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Add New System User</DialogTitle>
                <DialogContent>
                    <StackColComponent spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextFieldComponent
                            autoFocus
                            label="Username"
                            fullWidth
                            value={newUser.username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        <TextFieldComponent
                            label="Password"
                            type="password"
                            fullWidth
                            value={newUser.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                    </StackColComponent>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <ButtonComponent onClick={() => setOpenAddDialog(false)}>Cancel</ButtonComponent>
                    <ButtonComponent variant="contained" onClick={handleCreateUser} disabled={!newUser.username}>
                        Create
                    </ButtonComponent>
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
                    <ButtonComponent onClick={() => setOpenDeleteDialog(false)}>Cancel</ButtonComponent>
                    <ButtonComponent variant="contained" color="error" onClick={handleDeleteUser}>
                        Delete
                    </ButtonComponent>
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
