import React, { useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@mui/material';
import { ButtonComponent, TextFieldComponent, TableContainerComponent, TableComponent, TableHeadComponent, TableRowComponent, TableCellComponent, TableBodyComponent, ConfirmationDialogComponent, PageLoading, TableEmptyRow, AppSnackbar } from '../../components';
import { Add as AddIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import { SPACING, TYPOGRAPHY, ICON_SIZES, BORDER_RADIUS } from '../../constants/design';
import { StackRowComponent, StackColComponent } from '../../components/stack';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { useUsers } from '../../hooks/use-users';
import { useSnackbar } from '../../hooks/use-snackbar';

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

            <TableContainerComponent sx={{ mt: SPACING.md / 8 }}>
                <TableComponent>
                    <TableHeadComponent>
                        <TableRowComponent>
                            <TableCellComponent>TÊN NGƯỜI DÙNG</TableCellComponent>
                            <TableCellComponent>UID</TableCellComponent>
                            <TableCellComponent>GID</TableCellComponent>
                            <TableCellComponent>THƯ MỤC HOME</TableCellComponent>
                            <TableCellComponent>SHELL</TableCellComponent>
                            <TableCellComponent align="right">HÀNH ĐỘNG</TableCellComponent>
                        </TableRowComponent>
                    </TableHeadComponent>
                    <TableBodyComponent>
                        {users.map((user) => (
                            <TableRowComponent key={user.username}>
                                <TableCellComponent>
                                    <StackRowComponent spacing={SPACING.sm / 8} alignItems="center">
                                        <PersonIcon sx={{ color: 'primary.main', fontSize: ICON_SIZES.sm }} />
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
                                <TableCellComponent sx={{ color: 'text.secondary', fontSize: TYPOGRAPHY.fontSize.xs }}>
                                    {user.home}
                                </TableCellComponent>
                                <TableCellComponent sx={{ fontFamily: TYPOGRAPHY.fontFamily.mono, fontSize: TYPOGRAPHY.fontSize.xs }}>
                                    {user.shell}
                                </TableCellComponent>
                                <TableCellComponent align="right">
                                    <IconButton
                                        onClick={() => setSelectedUser(user.username)}
                                        color="error"
                                        size="small"
                                        sx={{
                                            '&:hover': { backgroundColor: 'error.lighter' }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCellComponent>
                            </TableRowComponent>
                        ))}
                        {users.length === 0 && (
                            <TableEmptyRow colSpan={6} message="Không tìm thấy người dùng nào" />
                        )}
                    </TableBodyComponent>
                </TableComponent>
            </TableContainerComponent>

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
