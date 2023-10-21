import { ApiProperty } from "@nestjs/swagger";
import { IPageable } from "./pageable.interface";
import { Sort } from "./sort.model";
import { ISortable } from "./sortable.interface";

export class PageRequest implements IPageable {
  @ApiProperty({ required: false })
  public page: number;
  @ApiProperty({ required: false })
  public size: number;
  @ApiProperty({ type: Sort, required: false })
  public sort: ISortable;

  constructor(
    page: number = 1,
    size: number = 10,
    sort: ISortable = new Sort()
  ) {
    this.page = page;
    this.size = size;
    this.sort = sort;
  }

  public getPageNumber(): number {
    return this.page;
  }

  public getPageSize(): number {
    return this.size;
  }

  public getSort(): ISortable {
    return this.sort;
  }

  public next(totalElements: number): IPageable {
    const totalPages: number =
      Math.ceil(totalElements / this.getPageSize()) || 1;
    const nextPage: number =
      +this.getPageNumber() === totalPages ? 1 : +this.getPageNumber() + 1;
    return new PageRequest(nextPage, this.getPageSize(), this.getSort());
  }

  public previous(totalElements: number): IPageable {
    const totalPages: number =
      Math.ceil(totalElements / this.getPageSize()) || 1;
    const previousPage: number =
      +this.getPageNumber() === 1 ? totalPages : +this.getPageNumber() - 1;
    return new PageRequest(previousPage, this.getPageSize(), this.getSort());
  }

  public static from(
    page: number,
    size: number,
    sortColumn: string,
    sortDirection: string
  ): IPageable {
    const sort: ISortable = Sort.from(sortColumn, sortDirection);
    return new PageRequest(page, size, sort);
  }
}
