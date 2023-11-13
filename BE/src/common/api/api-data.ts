export class ApiData<T> {
  success: boolean;
  data?: T;
  message?: string;

  constructor(success: boolean, content: string | T) {
    this.success = success;

    if (typeof content === 'string') this.message = content;
    else this.data = content;
  }

  static success<T>(data: T): ApiData<T> {
    return new ApiData<T>(true, data);
  }

  static error<T>(data: T): ApiData<T> {
    return new ApiData<T>(false, data);
  }
}
