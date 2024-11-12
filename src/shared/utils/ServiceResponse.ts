export class ServiceResponse<T> {
    constructor(
      public data: T | undefined,
      public error?: any,
    ) {}
  
    static success<T>(data: T): ServiceResponse<T> {
      return new ServiceResponse(data);
    }
  
    static failure<T>(error: any): ServiceResponse<T> {
      return new ServiceResponse<T>(undefined, error);
    }
}