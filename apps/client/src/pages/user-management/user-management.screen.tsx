import React, { useState, useMemo } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import {
    ButtonComponent,
    TextFieldComponent,
    ConfirmationDialogComponent,
    PageLoading,
    AppSnackbar,
    DataTableComponent
} from '../../components';
import { Add as AddIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import { SPACING, TYPOGRAPHY, ICON_SIZES, BORDER_RADIUS } from '../../constants/design';
import { StackRowComponent, StackColComponent } from '../../components/stack';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { useUsers } from '../../hooks/use-users';
import { useSnackbar } from '../../hooks/use-snackbar';
import { SystemUser } from '../../apis/users/users.api';
import { ColumnConfig, ActionConfig } from '../../components/table/table.component';

export function UserManagement() {
    const { users, isLoading, createUser, deleteUser } = useUsers();
    const { snackbarProps, showSnackbar } = useSnackbar();

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [newUser, setNewUser] = useState({ username: '', password: '' });

    const handleCreateUser = async () => {
        try {
            await createUser(newUser.username, newUser.password);
            showSnackbar(`Người dùng ${newUser.username} đã được tạo`, 'success');
            setOpenAddDialog(false);
            setNewUser({ username: '', password: '' });
        } catch {
            showSnackbar('Không thể tạo người dùng', 'error');
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await deleteUser(selectedUser);
            showSnackbar(`Đã xóa người dùng ${selectedUser}`, 'success');
            setSelectedUser(null);
        } catch {
            showSnackbar('Không thể xóa người dùng', 'error');
        }
    };

    const columns = useMemo<ColumnConfig<SystemUser>[]>(() => [
        {
            id: 'username',
            label: 'Tên người dùng',
            sortable: true,
            render: (row) => (
                <StackRowComponent spacing={SPACING.sm / 8} alignItems="center">
                    <PersonIcon sx={{ color: 'primary.main', fontSize: ICON_SIZES.sm }} />
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                            fontSize: TYPOGRAPHY.fontSize.sm,
                        }}
                    >
                        {row.username}
                    </Typography>
                </StackRowComponent>
            )
        },
        { id: 'uid', label: 'UID', sortable: true },
        { id: 'gid', label: 'GID', sortable: true },
        {
            id: 'home',
            label: 'Thư mục Home',
            render: (row) => (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: TYPOGRAPHY.fontSize.xs }}>
                    {row.home}
                </Typography>
            )
        },
        {
            id: 'shell',
            label: 'Shell',
            render: (row) => (
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: TYPOGRAPHY.fontFamily.mono,
                        fontSize: TYPOGRAPHY.fontSize.xs,
                        opacity: 0.8
                    }}
                >
                    {row.shell}
                </Typography>
            )
        },
    ], []);

    const actions = useMemo<ActionConfig<SystemUser>[]>(() => [
        {
            id: 'delete',
            icon: <DeleteIcon fontSize="small" />,
            tooltip: 'Xóa người dùng',
            color: 'error',
            onClick: (row) => setSelectedUser(row.username),
        }
    ], []);

    if (isLoading && users.length === 0) {
        return (
            <Box sx={{ p: SPACING.lg / 8 }}>
                <PageLoading message="Đang tải danh sách người dùng..." />
            </Box>
        );
    }

    return (
        <Box sx={{ p: SPACING.lg / 8 }}>
            <PageHeaderComponent
                title="Quản lý người dùng"
                subtitle="Quản lý tài khoản và phân quyền hệ thống"
                actions={
                    <ButtonComponent
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                    >
                        Thêm người dùng
                    </ButtonComponent>
                }
            />

            <DataTableComponent
                idField="username"
                columns={columns}
                data={users}
                actions={actions}
                emptyMessage="Không tìm thấy người dùng nào"
                pagination={{
                    page: 0,
                    rowsPerPage: 10,
                    total: users.length,
                    onPageChange: () => { },
                    onRowsPerPageChange: () => { },
                    autoPagination: true
                }}
                maxHeight="calc(100vh - 200px)"
            />

            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                PaperProps={{
                    sx: { borderRadius: BORDER_RADIUS.lg, width: '100%', maxWidth: 400 }
                }}
            >
                <DialogTitle sx={{ fontWeight: TYPOGRAPHY.fontWeight.bold }}>Thêm người dùng mới</DialogTitle>
                <DialogContent>
                    <StackColComponent spacing={2} sx={{ mt: 1 }}>
                        <TextFieldComponent
                            autoFocus
                            label="Tên đăng nhập"
                            fullWidth
                            value={newUser.username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setNewUser({ ...newUser, username: e.target.value })
                            }
                        />
                        <TextFieldComponent
                            label="Mật khẩu"
                            type="password"
                            fullWidth
                            value={newUser.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setNewUser({ ...newUser, password: e.target.value })
                            }
                        />
                    </StackColComponent>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <ButtonComponent onClick={() => setOpenAddDialog(false)}>Hủy</ButtonComponent>
                    <ButtonComponent
                        variant="contained"
                        onClick={handleCreateUser}
                        disabled={!newUser.username || !newUser.password}
                    >
                        Tạo tài khoản
                    </ButtonComponent>
                </DialogActions>
            </Dialog>

            <ConfirmationDialogComponent
                open={!!selectedUser}
                title="Xóa người dùng"
                message={`Bạn có chắc chắn muốn xóa người dùng "${selectedUser}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa vĩnh viễn"
                cancelText="Hủy"
                severity="error"
                onConfirm={handleDeleteUser}
                onCancel={() => setSelectedUser(null)}
            />

            <AppSnackbar {...snackbarProps} />
        </Box>
    );
}

