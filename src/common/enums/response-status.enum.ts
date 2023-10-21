export enum ResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export enum SortDirection {
  ASCENDING = "ASC",
  DESCENDING = "DESC",
}

export class ResponseMessage {
  public status: ResponseStatus;
  public message: string;
}
