import { SortDirection } from "../enums/response-status.enum";

export interface ISortable {
  getSortDirection(): SortDirection;
  getSortColumn(): string;
  asKeyValue(): { [key: string]: string };
}
