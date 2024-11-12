import { Injectable } from '@nestjs/common';
import { RatingRepo } from './rating.repo';
import { EventService } from '../../shared/services/event.service';
import { Rating } from '../../shared/schemas/rating.schema';
import { UpsertRatingDTO } from './dto/upsert-rating.dto';
import { BookService } from '../book/book.service';
import { User } from '../../shared/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class RatingService {
  constructor(
    private readonly repo: RatingRepo,
    private readonly bookService: BookService,
    private readonly eventService: EventService,
  ) {}

  async upsert(dto: UpsertRatingDTO, user: User): Promise<Rating | undefined> {
    const book = await this.bookService.find({ _id: dto.bookId })
    
    if (book) {
      const result = await this.repo.upsert({
        _id: dto._id ? new Types.ObjectId(dto._id) : undefined,
        book,
        user,
        rating: dto.rating,
        review: dto.review,
      } as Rating);

      if (result.error) console.log(`[E] RatingService.upsert(${JSON.stringify(book)}): ${result.error}`);
      else console.log(`[I] RatingService.upsert(${JSON.stringify(book)}): ${JSON.stringify(result.data)}`);
  
      return result.data;
    } else {
      console.log(`[I] RatingService.upsert(${JSON.stringify(book)}): Book not found!`);
    }
  }

  async find(filter: Record<string, any>): Promise<Rating | undefined> {
    const result = await this.repo.find(filter);
  
    if (result.error) console.log(`[E] RatingService.find(${JSON.stringify(filter)}): ${result.error}`); 
    else console.log(`[I] RatingService.find(${JSON.stringify(filter)}): ${JSON.stringify(result.data)}`);
  
    return result.data;
  }

  async findAll(): Promise<Rating[] | undefined> {
    const result = await this.repo.findAll();

    if (result.error) console.log(`[E] RatingService.findAll(): ${result.error}`); 
    else console.log(`[I] RatingService.findAll(): ${JSON.stringify(result.data)}`);

    return result.data;
  }

  async delete(id: string): Promise<Rating | undefined> {
    const result = await this.repo.delete(id);

    if (result.error) console.log(`[E] RatingService.delete(${id}): ${result.error}`); 
    else console.log(`[I] RatingService.delete(${id}): ${JSON.stringify(result.data)}`);

    return result.data;
  }
}
