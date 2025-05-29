export interface GlobalResponse<T> {
  ok?: boolean;
  message: string;
  data: T;
  dateTime?: Date;
  detail: string;
  statusCode?: number;
}

export const createResponse = <T>({
  message = "",
  data = {} as T,
  detail = "",
  statusCode = 200,
}: GlobalResponse<T>) => ({
  ok: statusCode >= 200 && statusCode < 300,
  message,
  data,
  dateTime: new Date().toISOString(),
  detail,
  statusCode,
});
