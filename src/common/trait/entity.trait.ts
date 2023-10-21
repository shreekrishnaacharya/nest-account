import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { Page } from "../models/page.model";
import { IPageable } from "../models/pageable.interface";

export class CommonEntity<T> {
  constructor(private readonly _currentRepo: Repository<T>) {}
  public async findAllByPage(
    pageable: IPageable,
    where?: object,
    relations?: object
  ): Promise<Page<T>> {
    const sort: { [key: string]: string } = pageable.getSort().asKeyValue();
    const options: FindManyOptions<T> = {
      where: { ...where } as unknown as FindOptionsWhere<T>,
      order: sort as unknown as FindOptionsOrder<T>,
      relations,
      skip: (pageable.getPageNumber() - 1) * pageable.getPageSize(),
      take: pageable.getPageSize(),
    };
    const result = await this._currentRepo.findAndCount(options);
    const elements: T[] = result[0];
    const totalElements: number = result[1];
    return this._generatePageResult(elements, totalElements, pageable);
  }

  // public async findOne(where: object, relations?: object): Promise<> {
  // }

  protected async _generatePageResult(
    elements: T[],
    totalElements: number,
    pageable: IPageable
  ): Promise<Page<T>> {
    return {
      elements: elements,
      totalElements: totalElements,
      totalPages: Math.ceil(totalElements / pageable.getPageSize()),
      current: pageable,
      next: pageable.next(totalElements),
      previous: pageable.previous(totalElements),
    } as Page<T>;
  }
}
