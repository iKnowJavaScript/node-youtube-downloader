export default interface ErrorResponseTypes {
  message: string;
  errors: string;
  stack: string | undefined;
  statusCode: number;
  payload?: object | null;
}
