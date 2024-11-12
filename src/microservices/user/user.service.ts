import { Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { User } from '../../shared/schemas/user.schema';
import { EventService } from '../../shared/services/event.service';
import * as crypto from 'crypto';
import { JwtPayload } from '../../shared/auth/jwt-payload';
import { AuthenticationDTO } from './dto/authentication.dto';
import { RegistrationDTO } from './dto/registration.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepo,
    private jwtService: JwtService,
    private readonly eventService: EventService,
  ) {}

  async authenticate(dto: AuthenticationDTO): Promise<User | undefined> {
    const user = await this.find({ email: dto.email });

    if (user && (this.createHash(dto.password) === user.password)) {
      user.access_token = this.jwtService.sign({
        _id: user._id.toString(),
        name: user.name,
        email: user.email
      } as JwtPayload)
      await this.upsert(user);

      console.log(`[I] UserService.authenticate(${JSON.stringify(dto)}): Authentication successful!`);

      return user;
    }

    console.log(`[E] UserService.authenticate(${JSON.stringify(dto)}): Error on authenticating!`);
    return undefined
  }

  async authorize(auth: string): Promise<User | undefined> {
    if (!auth) {
      console.log(`[E] UserService.authorize(${auth}): No auth token!`); 
      return undefined
    }

    try {
      const payload = this.jwtService.verify(auth, { secret: '01932033-4251-73cb-b46d-66541e1c40b8' });
      const result = await this.repo.findById(payload._id);
  
      if (result.error) console.log(`[E] UserService.authorize(${JSON.stringify(payload)}): ${result.error}`); 
      else console.log(`[I] UserService.authorize(${JSON.stringify(payload)}): ${JSON.stringify(result.data)}`);
    
      return result.data;
    } catch (error) {
      console.log(`[E] UserService.authorize(${auth}): ${error}`);
    }
  }

  async register(dto: RegistrationDTO): Promise<User | undefined> {
    const exists = await this.find({ email: dto.email });

    if (!exists) {
      const user = await this.upsert({
        name: dto.name,
        email: dto.email,
        password: this.createHash(dto.password)
      } as User)
      
      if (user) {
        user.access_token = this.jwtService.sign({
          _id: user._id,
          name: user.name,
          email: user.email
        })
        await this.upsert(user);
  
        console.log(`[I] UserService.register(${JSON.stringify(dto)}): Registration successful!`);
  
        return user;
      }
    }

    console.log(`[E] UserService.register(${JSON.stringify(dto)}): Error on registering!`);
    return undefined
  }

  createHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async upsert(user: User): Promise<User | undefined> {
    const result = await this.repo.upsert(user)

    if (result.error) console.log(`[E] UserService.upsert(${JSON.stringify(user)}): ${result.error}`);
    else console.log(`[I] UserService.upsert(${JSON.stringify(user)}): ${JSON.stringify(result.data)}`);

    return result.data;
  }

  async find(filter: Record<string, any>): Promise<User | undefined> {
    const result = await this.repo.find(filter);
  
    if (result.error) console.log(`[E] UserService.find(${JSON.stringify(filter)}): ${result.error}`); 
    else console.log(`[I] UserService.find(${JSON.stringify(filter)}): ${JSON.stringify(result.data)}`);
  
    return result.data;
  }

  async findAll(): Promise<User[] | undefined> {
    const result = await this.repo.findAll();

    if (result.error) console.log(`[E] UserService.findAll(): ${result.error}`); 
    else console.log(`[I] UserService.findAll(): ${JSON.stringify(result.data)}`);

    return result.data;
  }

  async delete(id: string): Promise<User | undefined> {
    const result = await this.repo.delete(id);

    if (result.error) console.log(`[E] UserService.delete(${id}): ${result.error}`); 
    else console.log(`[I] UserService.delete(${id}): ${JSON.stringify(result.data)}`);

    return result.data;
  }
}
