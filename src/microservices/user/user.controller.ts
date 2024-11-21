import { Body, Controller, Delete, Get, Headers, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthenticationDTO } from './dto/authentication.dto';
import { RegistrationDTO } from './dto/registration.dto';
import { User } from '../../shared/schemas/user.schema';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/authorize')
  @ApiOperation({ summary: 'Authorize a token and retrieve the user object' })
  @ApiResponse({ status: 200, description: 'Successfully authorized and retrieved user.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing authorization token.' })
  async authorize(@Headers('authorization') auth: string): Promise<User | undefined> {
    const user = await this.service.authorize(auth);
    if (!user) {
      throw new UnauthorizedException('Invalid or missing authorization token.');
    }
    return user;
  }

  @Post('/authenticate')
  @ApiOperation({ summary: 'Authenticate user.' })
  @ApiResponse({ status: 200, description: 'Authenticated' })
  @ApiResponse({ status: 404, description: 'Error on auth.' })
  async login(@Body() dto: AuthenticationDTO) {
    return this.service.authenticate(dto);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user.' })
  @ApiResponse({ status: 201, description: 'User registrated.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() dto: RegistrationDTO) {
    return this.service.register(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findAll(@Headers('authorization') auth: string) {
    return await this.service.findAll(auth);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Headers('authorization') auth: string, @Param('id') id: string) {
    return await this.service.delete(id, auth);
  }
}