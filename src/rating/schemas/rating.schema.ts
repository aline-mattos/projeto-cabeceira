import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Book } from '../../book/schemas/book.schema';
import { User } from '../../user/schemas/user.schema';

@Schema()
export class Rating {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  book: Book;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, required: true })
  review: string;
}

export type RatingDocument = Rating & Document;

export const RatingSchema = SchemaFactory.createForClass(Rating);
