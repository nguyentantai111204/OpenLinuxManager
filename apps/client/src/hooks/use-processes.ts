import { useState, useMemo } from 'react';
import axios from 'axios';
import { useSocketContext } from '../contexts/socket-context';
import { mapProcessStatus } from '../utils/process.utils';
import { useSnackbar } from './use-snackbar';
import { ProcessStatus } from '../components/status-badge/status-badge.component';

export interface Process {
    pid: number;
    name: string;
    user: string;
    status: ProcessStatus;
    cpu: number;
    mem: number;
}

export function useProcesses() {
    const { isConnected, processes } = useSocketContext();
    const { snackbarProps, showSnackbar } = useSnackbar();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPids, setSelectedPids] = useState<number[]>([]);

    const clientProcesses: Process[] = useMemo(() => {
        return processes.map((p) => ({
            pid: p.pid,
            name: p.name,
            user: p.user,
            status: mapProcessStatus(p.status),
            cpu: p.cpu,
            mem: parseFloat(p.memory.toFixed(1)),
        }));
    }, [processes]);

    const filteredProcesses = useMemo(() => {
        if (!searchQuery.trim()) return clientProcesses;
        const query = searchQuery.toLowerCase();
        return clientProcesses.filter(
            (p) =>
                p.pid.toString().includes(query) ||
                p.name.toLowerCase().includes(query) ||
                p.user.toLowerCase().includes(query),
        );
    }, [clientProcesses, searchQuery]);

    const selectedProcesses = useMemo(() => {
        return clientProcesses.filter(p => selectedPids.includes(p.pid));
    }, [clientProcesses, selectedPids]);

    const handleKill = async (pids: number[], isForce: boolean = false) => {
        if (pids.length === 0) return;
        const urlSuffix = isForce ? '/force' : '';
        const actionLabel = isForce ? 'Buộc dừng' : 'Kết thúc';

        try {
            await Promise.all(pids.map((p) => axios.delete(`/api/system/processes/${p}${urlSuffix}`)));
            showSnackbar(`Đã ${actionLabel.toLowerCase()} ${pids.length} tiến trình thành công`, 'success');
            setSelectedPids([]);
            return true;
        } catch {
            showSnackbar(`Không thể ${actionLabel.toLowerCase()} một hoặc nhiều tiến trình`, 'error');
            return false;
        }
    };

    const handleSuspend = async (pids: number[]) => {
        if (pids.length === 0) return;

        try {
            await Promise.all(
                pids.map((pid) => axios.patch(`/api/system/processes/${pid}/suspend`)),
            );
            showSnackbar(`Đã tạm dừng ${pids.length} tiến trình thành công`, 'success');
            setSelectedPids([]);
            return true;
        } catch {
            showSnackbar('Không thể tạm dừng một hoặc nhiều tiến trình', 'error');
            return false;
        }
    };

    const handleResume = async (pids: number[]) => {
        if (pids.length === 0) return;

        try {
            await Promise.all(
                pids.map((pid) => axios.patch(`/api/system/processes/${pid}/resume`)),
            );
            showSnackbar(`Đã tiếp tục ${pids.length} tiến trình thành công`, 'success');
            setSelectedPids([]);
            return true;
        } catch {
            showSnackbar('Không thể tiếp tục một hoặc nhiều tiến trình', 'error');
            return false;
        }
    };

    return {
        isConnected,
        processes,
        filteredProcesses,
        searchQuery,
        setSearchQuery,
        selectedPids,
        setSelectedPids,
        selectedProcesses,
        handleKill,
        handleSuspend,
        handleResume,
        snackbarProps
    };
}
