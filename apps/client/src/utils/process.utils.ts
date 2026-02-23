import { ProcessStatus } from '../components/status-badge/status-badge.component';

/**
 * Maps a raw Linux process status string (from `ps aux`) to a typed ProcessStatus.
 * The first character of the status field determines the state:
 *  R = running, S/D/I = sleeping, T = stopped, Z = zombie
 */
export function mapProcessStatus(status: string): ProcessStatus {
    switch (status.toUpperCase().charAt(0)) {
        case 'R': return 'running';
        case 'S':
        case 'D':
        case 'I': return 'sleeping';
        case 'T': return 'stopped';
        case 'Z': return 'zombie';
        default: return 'sleeping';
    }
}
