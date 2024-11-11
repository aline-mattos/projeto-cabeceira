import { ApiProperty } from "@nestjs/swagger";

export class CreateRatingDto {
    @ApiProperty({ description: 'The book ID being rated' })
    bookId: string;
  
    @ApiProperty({ description: 'The user ID who is rating the book' })
    userId: string;
  
    @ApiProperty({ description: 'The rating score (1 to 5)' })
    rating: number;
  
    @ApiProperty({ description: 'Optional review text for the rating', required: false })
    review?: string;
}