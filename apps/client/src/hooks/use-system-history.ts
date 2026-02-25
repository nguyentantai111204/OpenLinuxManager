import { useState, useEffect } from 'react';
import { SystemStats } from '../types/socket.types';

export interface SystemHistoryPoint {
    time: string;
    cpu: number;
    ram: number;
}

export function useSystemHistory(systemStats: SystemStats | null, maxPoints: number = 30) {
    const [history, setHistory] = useState<SystemHistoryPoint[]>([]);

    useEffect(() => {
        if (systemStats) {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
                .getMinutes()
                .toString()
                .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            setHistory((prev) => {
                const newPoint = {
                    time: timeStr,
                    cpu: systemStats.cpu,
                    ram: systemStats.ram_total > 0
                        ? (systemStats.ram_used / systemStats.ram_total) * 100
                        : 0
                };
                const newHistory = [...prev, newPoint];
                return newHistory.slice(-maxPoints);
            });
        }
    }, [systemStats, maxPoints]);

    return { history, setHistory };
}
