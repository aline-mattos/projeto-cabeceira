import { Injectable } from '@nestjs/common';
import { RegistrationDTO } from './dto/registration.dto';
import { User } from '../../shared/schemas/user.schema';
import { EventService } from '../../shared/services/event.service';
import { AuthenticationDTO } from './dto/authentication.dto';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly eventService: EventService,
  ) {}

  async authenticate(dto: AuthenticationDTO): Promise<User | undefined> {
    const user = await this.userService.find({ email: dto.email });

    if (user && (this.createHash(dto.password) === user.password)) {
      console.log(`[I] UserService.authenticate(${JSON.stringify(dto)}): Authentication successful!`);

      user.access_token = this.jwtService.sign(user)
      await this.userService.upsert(user);

      return user;
    }

    console.log(`[E] AuthService.authenticate(${JSON.stringify(dto)}): Error on authenticating!`);
    return undefined
  }

  async register(dto: RegistrationDTO): Promise<User | undefined> {
    const exists = await this.userService.find({ email: dto.email });

    if (!exists) {
      const user = await this.userService.upsert({
        name: dto.name,
        email: dto.email,
        password: this.createHash(dto.password)
      } as User)
      
      if (user) {
        user.access_token = this.jwtService.sign(user)
        await this.userService.upsert(user);
  
        console.log(`[I] UserService.register(${JSON.stringify(dto)}): Registration successful!`);
  
        return user;
      }
    }

    console.log(`[E] AuthService.register(${JSON.stringify(dto)}): Error on registering!`);
    return undefined
  }

  createHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
