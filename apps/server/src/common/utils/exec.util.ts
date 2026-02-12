import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger, InternalServerErrorException } from '@nestjs/common';

const execAsync = promisify(exec);

export class ExecUtil {
    private static readonly logger = new Logger(ExecUtil.name);

    /**
     * Execute a shell command safely
     * @param command Command to execute
     * @param errorMessage Custom error message
     */
    static async run(command: string, errorMessage = 'Command execution failed'): Promise<string> {
        try {
            // Log command (ensure no sensitive data is in the command string before passing here)
            this.logger.log(`Executing: ${command}`);

            const { stdout, stderr } = await execAsync(command);

            if (stderr) {
                this.logger.warn(`Command stderr: ${stderr}`);
            }

            return stdout.trim();
        } catch (error) {
            this.logger.error(`Error executing command: ${command}`, error);
            throw new InternalServerErrorException(errorMessage);
        }
    }
}
