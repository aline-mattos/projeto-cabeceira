import { Injectable } from '@nestjs/common';
import { BookRepo } from './book.repo';
import { Book } from '../../shared/schemas/book.schema';
import { EventService } from '../../shared/event.service';
import { APIGateway } from '../../shared/gateway/api_gateway';

@Injectable()
export class BookService {
  constructor(
    private readonly repo: BookRepo,
    private readonly eventService: EventService,
  ) {}

  async upsert(book: Book, auth: string): Promise<Book | undefined> {
    const user = await APIGateway.user.authorize(auth);

    if (!user) {
      console.log(`[I] BookService.upsert(${JSON.stringify(user)}): Unauthorized!`);
      return undefined
    }
    
    const result = await this.repo.upsert(book)

    if (result.error) console.log(`[E] BookService.upsert(${JSON.stringify(book)}): ${result.error}`);
    else console.log(`[I] BookService.upsert(${JSON.stringify(book)}): ${JSON.stringify(result.data)}`);

    return result.data;
  }

  async findById(id:string, auth: string): Promise<Book | undefined> {
    const user = await APIGateway.user.authorize(auth);

    if (!user) {
      console.log(`[I] BookService.findById(${JSON.stringify(user)}): Unauthorized!`);
      return undefined
    }

    const result = await this.repo.findById(id);
  
    if (result.error) console.log(`[E] BookService.findById(${JSON.stringify(id)}): ${result.error}`); 
    else console.log(`[I] BookService.findById(${JSON.stringify(id)}): ${JSON.stringify(result.data)}`);
  
    return result.data;
  }

  async find(filter: Record<string, any>, auth: string): Promise<Book | undefined> {
    const user = await APIGateway.user.authorize(auth);

    if (!user) {
      console.log(`[I] BookService.find(${JSON.stringify(user)}): Unauthorized!`);
      return undefined
    }

    const result = await this.repo.find(filter);
  
    if (result.error) console.log(`[E] BookService.find(${JSON.stringify(filter)}): ${result.error}`); 
    else console.log(`[I] BookService.find(${JSON.stringify(filter)}): ${JSON.stringify(result.data)}`);
  
    return result.data;
  }

  async findAll(auth: string): Promise<Book[] | undefined> {
    const user = await APIGateway.user.authorize(auth);

    if (!user) {
      console.log(`[I] BookService.findAll(${JSON.stringify(user)}): Unauthorized!`);
      return undefined
    }

    const result = await this.repo.findAll();

    if (result.error) console.log(`[E] BookService.findAll(): ${result.error}`); 
    else console.log(`[I] BookService.findAll(): ${JSON.stringify(result.data)}`);

    return result.data;
  }

  async delete(id: string, auth: string): Promise<Book | undefined> {
    const user = await APIGateway.user.authorize(auth);

    if (!user) {
      console.log(`[I] BookService.delete(${JSON.stringify(user)}): Unauthorized!`);
      return undefined
    }

    const result = await this.repo.delete(id);

    if (result.error) console.log(`[E] BookService.delete(${id}): ${result.error}`); 
    else console.log(`[I] BookService.delete(${id}): ${JSON.stringify(result.data)}`);

    this.eventService.emit("book.delete", id)

    return result.data;
  }
}
