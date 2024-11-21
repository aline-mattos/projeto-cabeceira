import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false, timestamps: false })
export class BookStatus {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  book: Types.ObjectId;

  @Prop({ type: String, required: true })
  status: string;
}

export type BookshelfDocument = Bookshelf & Document;

@Schema()
export class Bookshelf {

  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop([BookStatus])
  statuses: BookStatus[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const BookshelfSchema = SchemaFactory.createForClass(Bookshelf);
