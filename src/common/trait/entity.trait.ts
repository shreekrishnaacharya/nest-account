import {
  Repository,
  FindOptionsWhere,
  FindOptionsOrder,
  FindManyOptions,
  Like,
  In
} from "typeorm";
import { Page } from "../models/page.model";
import { IPageable } from "../models/pageable.interface";
import { IQueryClause, IQueryDto } from "./query.dto";

interface CustomQuery {
  [key: string]: string
}

export class CommonEntity<T> {
  constructor(private readonly _currentRepo: Repository<T>) { }
  public async findAllByPage(
    pageable: IPageable,
    queryDto?: IQueryDto,
    customQuery?: IQueryClause[]
  ): Promise<Page<T>> {
    let whereCondition = null;
    let whereRaw = [];
    const sort: { [key: string]: string } = pageable.getSort()?.asKeyValue();
    whereRaw = this._buildWhereConditions(customQuery, whereRaw, "AND")
    whereRaw = this._buildWhereConditions(queryDto?.getAndQuery(), whereRaw, "AND")
    whereRaw = this._buildWhereConditions(queryDto?.getOrQuery(), whereRaw, "OR")

    if (whereRaw.length > 1) {
      whereCondition = whereRaw
    } else {
      whereCondition = whereRaw[0]
    }
    const options: FindManyOptions<T> = {
      where: whereCondition as unknown as FindOptionsWhere<T>,
      order: sort as unknown as FindOptionsOrder<T>,
      relations: queryDto?.getRelation(),
      skip: pageable.getSkip(),
      take: pageable.getTake(),
    };
    const result = await this._currentRepo.findAndCount(options);
    const elements: T[] = result[0];
    const totalElements: number = result[1];
    return this._generatePageResult(elements, totalElements);
  }

  protected async _generatePageResult(
    elements: T[],
    totalElements: number,
  ): Promise<Page<T>> {
    return {
      elements: elements,
      totalElements: totalElements,
    } as Page<T>;
  }

  private _buildWhereConditions(
    conditions: IQueryClause[],
    whereConditions: Array<{ [key: string]: any }> = [],
    operator: "AND" | "OR"
  ): Array<{ [key: string]: any }> {
    if (conditions && conditions.length > 0) {
      conditions.forEach(condition => {
        const { key, value, clause } = condition;
        const cond = {};
        if (clause.toLowerCase() === "like") {
          cond[key] = Like(`%${value}%`)
        } else if (clause.toLowerCase() === "in") {
          cond[key] = In(value)
        } else {
          cond[key] = value
        }
        if (operator == "OR") {
          whereConditions.push(cond)
        } else {
          const cind = (whereConditions.length > 0 ? whereConditions.length - 1 : 0)
          whereConditions[cind] = {
            ...whereConditions[cind],
            ...cond
          }
        }
      });
    }
    return whereConditions;
  }
}
