import { IS_AND_CLAUSE, IS_LIKE_CHECK, IS_RELATIONAL } from "../constants";

export interface IQueryDto {
    getRelation(): object
    getAndQuery(): Array<IQueryClause>;
    getOrQuery(): Array<IQueryClause>;
}

export interface IQueryClause {
    key: string;
    value: string | number | any;
    clause: string;
}

export abstract class QueryDto implements IQueryDto {
    getRelation() {
        const relations: any = {};
        for (const key in this) {
            if (Reflect.getMetadata(IS_RELATIONAL, this, key)) {
                relations[key] = this[key];
            }
        }
        return relations;
    }
    getAndQuery(): IQueryClause[] {
        const query: IQueryClause[] = [];
        let i = 0;
        for (const key in this) {
            if (!Reflect.getMetadata(IS_RELATIONAL, this, key) && Reflect.getMetadata(IS_AND_CLAUSE, this, key)) {
                query[i] = {
                    key,
                    value: this[key],
                    clause: "="
                };
                if (Reflect.getMetadata(IS_LIKE_CHECK, this, key)) {
                    query[i]["clause"] = "like"
                }
                i++;
            }
        }
        return Object.values(query);
    }
    getOrQuery(): IQueryClause[] {
        const query: IQueryClause[] = [];
        let i = 0;
        for (const key in this) {
            if (!Reflect.getMetadata(IS_RELATIONAL, this, key) && !Reflect.getMetadata(IS_AND_CLAUSE, this, key)) {
                query[i] = {
                    key,
                    value: this[key],
                    clause: "="
                };
                if (Reflect.getMetadata(IS_LIKE_CHECK, this, key)) {
                    query[i]["clause"] = "like"
                }
                i++
            }
        }
        return Object.values(query);
    }
}