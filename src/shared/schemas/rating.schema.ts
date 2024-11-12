import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Book } from './book.schema';
import { User } from './user.schema';

export type RatingDocument = Rating & Document;

@Schema()
export class Rating {

  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  book: Book;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, required: false })
  review?: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
