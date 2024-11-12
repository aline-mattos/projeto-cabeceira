import { Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { User } from '../../shared/schemas/user.schema';
import { EventService } from '../../shared/services/event.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepo,
    private readonly eventService: EventService,
  ) {}

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
