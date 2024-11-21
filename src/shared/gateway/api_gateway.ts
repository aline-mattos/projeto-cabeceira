import { BookClient } from "./clients/book.client";
import { BookshelfClient } from "./clients/bookshelf.client";
import { RatingClient } from "./clients/rating.client";
import { UserClient } from "./clients/user.client";

export class APIGateway {
    public static readonly user = UserClient.getInstance();
    public static readonly book = BookClient.getInstance();
    public static readonly bookshelf = BookshelfClient.getInstance();
    public static readonly rating = RatingClient.getInstance();
  }
  