import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Audit } from '@open-linux-manager/api';
import { UserManagementService, SystemUser } from './user-management.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';

@Controller('users')
export class UserManagementController {
    constructor(private readonly userManagementService: UserManagementService) { }

    @Get()
    async getUsers(@Query() paginationDto: PaginationDto) {
        return this.userManagementService.getUsers(paginationDto);
    }

    @Post()
    @Audit('CREATE_USER', 'User Management')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userManagementService.createUser(createUserDto.username, createUserDto.password);
    }

    @Delete(':username')
    @Audit('DELETE_USER', 'User Management')
    deleteUser(@Param('username') username: string) {
        return this.userManagementService.deleteUser(username);
    }
}

