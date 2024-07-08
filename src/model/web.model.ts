export class WebResponse<T> {
  data?: T;
  message?: string;
  error?: ErrorResponse[];
}

export class ErrorResponse {
  path?: (string | number)[];
  message?: string;
}
