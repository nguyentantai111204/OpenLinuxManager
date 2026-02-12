import { Module } from '@nestjs/common';
import { CommandRunnerService } from './services/command-runner.service';
import { PythonRunnerService } from './services/python-runner.service';

@Module({
    providers: [CommandRunnerService, PythonRunnerService],
    exports: [CommandRunnerService, PythonRunnerService],
})
export class SystemModule { }

