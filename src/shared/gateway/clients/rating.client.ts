import { UpsertRatingDTO } from "../../../microservices/rating/dto/upsert-rating.dto";
import { AxiosClient } from "../axios_client";

export class RatingClient {
  private static _instance: RatingClient | null = null;

  private api: AxiosClient;

  private constructor() {
    this.api = new AxiosClient('http://rating-service:3004/rating');
  }

  public static getInstance(): RatingClient {
    if (!this._instance) {
      this._instance = new RatingClient();
    }
    return this._instance;
  }

  public async upsert(authToken: string, dto: UpsertRatingDTO): Promise<any> {
    return this.api.post('/upsert', dto, {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async findByUser(authToken: string, userId: string): Promise<any> {
    return this.api.get(`/user/${userId}`, {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async findByBook(authToken: string, bookId: string): Promise<any> {
    return this.api.get(`/book/${bookId}`, {
      headers: {
        authorization: authToken,
      },
    });
  }

  public async delete(authToken: string, ratingId: string): Promise<any> {
    return this.api.delete(`/${ratingId}`, {
      headers: {
        authorization: authToken,
      },
    });
  }
}
