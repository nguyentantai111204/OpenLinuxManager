import { IsString, IsNotEmpty, Matches, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z_][a-z0-9_-]*$/, {
        message: 'Username must start with a lowercase letter or underscore, and contain only lowercase letters, numbers, underscores, and hyphens.',
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsOptional() // Password might be optional if we generate one or set it later? But typically required for creation.
    password?: string;
}
