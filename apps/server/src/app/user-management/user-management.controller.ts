import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserManagementService } from './user-management.service';

@Controller('users')
export class UserManagementController {
    constructor(private readonly userManagementService: UserManagementService) { }

    @Get()
    getUsers() {
        return this.userManagementService.getUsers();
    }

    @Post()
    createUser(@Body() body: { username: string; password?: string }) {
        return this.userManagementService.createUser(body.username, body.password);
    }

    @Delete(':username')
    deleteUser(@Param('username') username: string) {
        return this.userManagementService.deleteUser(username);
    }
}
