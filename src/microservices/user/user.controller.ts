import { Body, Controller, Delete, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthenticationDTO } from './dto/authentication.dto';
import { RegistrationDTO } from './dto/registration.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

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
    const user = await this.service.authorize(auth);
    if (user) return await this.service.findAll();
    else undefined
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Headers('authorization') auth: string, @Param('id') id: string) {
    const user = await this.service.authorize(auth);
    if (user) return await this.service.delete(id);
    else undefined
    
  }
}