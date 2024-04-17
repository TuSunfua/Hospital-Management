import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { UserRoles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { User } from './entities/user.entity';
import { Public } from 'src/common/decorators/auth.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UserRoles(Role.Admin)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UserRoles(Role.Admin)
    @HttpCode(HttpStatus.OK)
    @Get()
    @ApiOkResponse({ description: 'List all user' })
    findAll() {
        return this.usersService.findAll();
    }

    @Public()
    @Get('profile')
    @HttpCode(HttpStatus.FOUND)
    getProfile(@GetCurrentUserId() id: string) {
        try {
            this.usersService.findOneById(id);
        } catch (err: unknown) {
            throw err;
        }
    }

    @Post('search')
    @HttpCode(HttpStatus.FOUND)
    search(@Query('query') query: string) {
        var search = this.usersService.queryUser(query);
        return search;
    }
}
