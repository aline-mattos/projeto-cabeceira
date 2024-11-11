import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  publisher: string;

  @Prop({ type: Number })
  launchYear: number;

  @Prop({ type: Number })
  pages: number;

  @Prop({ required: true, unique: true })
  ISBN: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
