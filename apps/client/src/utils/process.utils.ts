import { ProcessStatus } from '../components/status-badge/status-badge.component';

/**
 * Maps a raw Linux process status string (from `ps aux`) to a typed ProcessStatus.
 * The first character of the status field determines the state:
 *  R = running, S/D/I = sleeping, T = stopped, Z = zombie
 */
export function mapProcessStatus(status: string): ProcessStatus {
    const s = status.toLowerCase();

    // If it's already a valid mapped status, return it
    if (['running', 'sleeping', 'stopped', 'zombie', 'disk-sleep', 'idle', 'unknown'].includes(s)) {
        return s as ProcessStatus;
    }

    const firstChar = status.toUpperCase().charAt(0);
    switch (firstChar) {
        case 'R': return 'running';
        case 'S': return 'sleeping';
        case 'D': return 'disk-sleep';
        case 'I': return 'idle';
        case 'T': return 'stopped';
        case 'Z': return 'zombie';
        default: return 'unknown';
    }
}
