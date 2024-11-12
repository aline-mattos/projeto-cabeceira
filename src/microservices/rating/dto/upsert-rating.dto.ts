import { ApiProperty } from "@nestjs/swagger";

export class UpsertRatingDTO {
    @ApiProperty({ description: 'The title of the book', required: false  })
    _id?: string;

    @ApiProperty({ description: 'The book ID being rated' })
    bookId: string;
  
    @ApiProperty({ description: 'The rating score (1 to 5)' })
    rating: number;
  
    @ApiProperty({ description: 'Optional review text for the rating', required: false })
    review?: string;
}