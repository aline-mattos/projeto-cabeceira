import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Book } from '../../book/schemas/book.schema';
import { User } from '../../user/schemas/user.schema';

@Schema({ _id: false, timestamps: false })
export class BookState {
  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  book: Book;
}

export type BookshelfDocument = Bookshelf & Document;

@Schema()
export class Bookshelf {

  @Prop([BookState])
  books: BookState[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const BookshelfSchema = SchemaFactory.createForClass(Bookshelf);
