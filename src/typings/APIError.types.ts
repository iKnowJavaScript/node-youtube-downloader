export default interface APIErrorTypes {
  message: string;
  errors: object | null;
  stack?: string | undefined;
  status: number;
  isPublic?: boolean | undefined;
  payload?: object;
}
