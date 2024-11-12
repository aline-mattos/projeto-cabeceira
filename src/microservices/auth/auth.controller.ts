import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegistrationDTO } from './dto/registration.dto'; 
import { AuthenticationDTO } from './dto/authentication.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

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
}