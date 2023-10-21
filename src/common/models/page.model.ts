import { ApiProperty } from "@nestjs/swagger";
import { PageRequest } from "./page-request.model";
import { IPageable } from "./pageable.interface";

export class Page<T> {
  @ApiProperty({ type: Object })
  public elements: T[];
  @ApiProperty()
  public totalElements: number;
  @ApiProperty()
  public totalPages: number;
  @ApiProperty({ type: PageRequest })
  public current: IPageable;
  @ApiProperty({ type: PageRequest })
  public next: IPageable;
  @ApiProperty({ type: PageRequest })
  public previous: IPageable;
}
