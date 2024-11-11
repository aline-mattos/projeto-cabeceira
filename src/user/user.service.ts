import { Injectable } from '@nestjs/common';
import { EventService } from '../shared/services/event.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserRepo } from './user.repo';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly eventService: EventService,
  ) {}

  @MessagePattern('user-existence-request')
  async checkIfUserExists(message: { userId: string }) {
    const { userId } = message;

    return await this.userRepo.findOne(userId)
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(`creating new user: ${JSON.stringify(createUserDto)}`)
    const user = await this.userRepo.create(createUserDto);
    await this.eventService.emit('user.created', user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepo.findOne(id);
  }

  async delete(id: string): Promise<User | null> {
    const user = await this.userRepo.delete(id);

    console.log(`UserService: deleting ${id} - ${JSON.stringify(user)}`)

    await this.eventService.emit('user.deleted', user);
    return user;
  }
}
