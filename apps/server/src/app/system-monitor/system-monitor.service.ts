import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';
import { SystemStats } from './system-stats.interface';

@Injectable()
export class SystemMonitorService {
    private readonly logger = new Logger(SystemMonitorService.name);
    private readonly pythonScriptPath: string;

    constructor() {
        // Path to the Python script
        this.pythonScriptPath = join(
            process.cwd(),
            'apps',
            'server',
            'src',
            'scripts',
            'monitor_system.py'
        );
    }

    /**
     * Execute Python script to get system statistics
     */
    async getSystemStats(): Promise<SystemStats> {
        return new Promise((resolve, reject) => {
            try {
                // Spawn Python process
                const python = spawn('python3', [this.pythonScriptPath]);

                let dataString = '';
                let errorString = '';

                // Collect stdout data
                python.stdout.on('data', (data) => {
                    dataString += data.toString();
                });

                // Collect stderr data
                python.stderr.on('data', (data) => {
                    errorString += data.toString();
                });

                // Handle process completion
                python.on('close', (code) => {
                    if (code !== 0) {
                        this.logger.error(`Python script exited with code ${code}`);
                        this.logger.error(`Error: ${errorString}`);

                        // Return default values on error
                        resolve(this.getDefaultStats());
                        return;
                    }

                    try {
                        // Parse JSON output
                        const stats: SystemStats = JSON.parse(dataString);
                        resolve(stats);
                    } catch (parseError) {
                        this.logger.error('Failed to parse Python script output', parseError);
                        this.logger.error(`Output was: ${dataString}`);
                        resolve(this.getDefaultStats());
                    }
                });

                // Handle process errors
                python.on('error', (error) => {
                    this.logger.error('Failed to start Python script', error);
                    resolve(this.getDefaultStats());
                });

                // Set timeout to prevent hanging
                setTimeout(() => {
                    python.kill();
                    this.logger.warn('Python script execution timeout');
                    resolve(this.getDefaultStats());
                }, 5000);

            } catch (error) {
                this.logger.error('Error executing Python script', error);
                resolve(this.getDefaultStats());
            }
        });
    }

    /**
     * Return default stats when script fails
     */
    private getDefaultStats(): SystemStats {
        return {
            cpu: 0,
            ram_total: 0,
            ram_used: 0,
            ram_free: 0,
            uptime: 0,
            os_name: 'Error',
            os_version: 'N/A',
            os_pretty_name: 'System monitoring unavailable',
            timestamp: Date.now(),
            error: 'Failed to retrieve system stats'
        };
    }
}
