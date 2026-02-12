import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserManagementService, SystemUser } from './user-management.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';

@Controller('users')
export class UserManagementController {
    constructor(private readonly userManagementService: UserManagementService) { }

    @Get()
    async getUsers(@Query() paginationDto: PaginationDto): Promise<PaginatedResponse<SystemUser> | SystemUser[]> {
        // For now, since we read from file, we get all users. 
        // We can implement in-memory pagination here or in service.
        // Let's implement simple in-memory pagination.
        const allUsers = await this.userManagementService.getUsers();

        if (!paginationDto.page || !paginationDto.limit) {
            return allUsers;
        }

        const page = Number(paginationDto.page) || 1;
        const limit = Number(paginationDto.limit) || 10;
        const search = paginationDto.search?.toLowerCase();

        let filteredUsers = allUsers;

        if (search) {
            filteredUsers = allUsers.filter(u =>
                u.username.toLowerCase().includes(search) ||
                u.shell.toLowerCase().includes(search)
            );
        }

        const total = filteredUsers.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, total);

        const data = filteredUsers.slice(startIndex, endIndex);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userManagementService.createUser(createUserDto.username, createUserDto.password);
    }

    @Delete(':username')
    deleteUser(@Param('username') username: string) {
        return this.userManagementService.deleteUser(username);
    }
}

