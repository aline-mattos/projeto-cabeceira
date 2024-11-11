import { Injectable } from '@nestjs/common';
import { RatingRepo } from './rating.repo';
import { EventService } from '../../shared/services/event.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from '../../shared/schemas/rating.schema';

@Injectable()
export class RatingService {
  constructor(
    private readonly repo: RatingRepo,
    private readonly eventService: EventService,
  ) {}

  async create(dto: CreateRatingDto): Promise<Rating | null> {
    console.log(`RatingService.create: ${JSON.stringify(dto)}`);
    return await this.repo.create(dto);
  }

  async findAll(): Promise<Rating[]> {
    return await this.repo.findAll();
  }

  async findByUser(id:string): Promise<Rating[]> {
    return await this.repo.findByUser(id);
  }

  async findByBook(id:string): Promise<Rating[]> {
    return await this.repo.findByBook(id);
  }

  async delete(id: string): Promise<Rating | null> {
    const book = await this.repo.delete(id);
    console.log(`RatingService.delete: ${id} - ${JSON.stringify(book)}`);
    return book;
  }
}
