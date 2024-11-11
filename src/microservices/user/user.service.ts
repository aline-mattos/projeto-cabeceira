import { Injectable } from '@nestjs/common';
import { RegistrationDTO } from './dto/registration.dto';
import { UserRepo } from './user.repo';
import { MessagePattern } from '@nestjs/microservices';
import { User } from '../../shared/schemas/user.schema';
import { EventService } from '../../shared/services/event.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly eventService: EventService,
  ) {}

  @MessagePattern('user-existence-request')
  async checkIfUserExists(message: { userId: string }) {
    const { userId } = message;

    return await this.userRepo.findById(userId)
  }

  async register(dto: RegistrationDTO): Promise<User | null> {
    const user = await this.userRepo.create(dto);

    if (!user) {
      console.log(`[E] UserService.register(${JSON.stringify(dto)}) - Erro ao registrar o usuário`);
      return null;
    }

    console.log(`Novo usuário criado: ${JSON.stringify(dto)}`)

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.findAll();
  }

  async login(dto: LoginDTO): Promise<User | null> {
    const user = await  this.userRepo.findByEmail(dto.email)

    if (user?.password === dto.password) {
      return user
    } else {
      return null
    }
  }

  async delete(id: string): Promise<User | null> {
    const user = await this.userRepo.delete(id);

    console.log(`UserService: deleting ${id} - ${JSON.stringify(user)}`)

    return user;
  }
}
