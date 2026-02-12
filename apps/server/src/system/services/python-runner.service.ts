import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { CommandRunnerService } from './command-runner.service';

@Injectable()
export class PythonRunnerService {
    private readonly logger = new Logger(PythonRunnerService.name);
    private readonly pythonExecutable = 'python3'; // or from config

    constructor(private readonly commandRunner: CommandRunnerService) { }

    async runScript<T>(scriptPath: string, args: string[] = []): Promise<T> {
        try {

            const fullArgs = [scriptPath, ...args];
            const output = await this.commandRunner.run(this.pythonExecutable, fullArgs);

            try {
                return JSON.parse(output) as T;
            } catch (jsonError) {
                this.logger.error(`Failed to parse Python script output: ${output}`, jsonError);
                throw new InternalServerErrorException('Invalid output from Python script');
            }
        } catch (error) {
            this.logger.error(`Python script execution failed: ${scriptPath}`, error);
            throw error;
        }
    }
}
