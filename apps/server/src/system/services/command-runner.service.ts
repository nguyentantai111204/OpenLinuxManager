import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class CommandRunnerService {
    private readonly logger = new Logger(CommandRunnerService.name);

    async run(command: string, args: string[] = [], timeoutMs = 10000): Promise<string> {
        return this.execute(command, args, null, timeoutMs);
    }

    async runWithInput(command: string, args: string[], input: string, timeoutMs = 10000): Promise<string> {
        return this.execute(command, args, input, timeoutMs);
    }

    private execute(command: string, args: string[], input: string | null, timeoutMs: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const logArgs = args.map(arg => arg.includes('password') ? '******' : arg); // Simple heuristic, but arguments shouldn't contain passwords anyway with this design
            this.logger.log(`Executing: ${command} ${logArgs.join(' ')}`);

            const child = spawn(command, args, {
                timeout: timeoutMs,
                stdio: ['pipe', 'pipe', 'pipe'] // stdin, stdout, stderr
            });

            let stdout = '';
            let stderr = '';

            if (input) {
                child.stdin.write(input);
                child.stdin.end();
            }

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('error', (error) => {
                this.logger.error(`Command failed to start: ${command}`, error);
                reject(new InternalServerErrorException(`Failed to execute command: ${command}`));
            });

            child.on('close', (code) => {
                if (code !== 0) {
                    this.logger.error(`Command failed with exit code ${code}: ${stderr}`);
                    reject(new Error(stderr.trim() || `Command failed with exit code ${code}`));
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    }
}
