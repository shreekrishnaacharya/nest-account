import { IS_AND_CLAUSE, IS_LIKE_CHECK, IS_OR_CLAUSE, IS_RELATIONAL } from "../constants";

export function IsRelational() {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(IS_RELATIONAL, true, target, propertyKey);
    };
}

export function IsOrClause() {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(IS_OR_CLAUSE, true, target, propertyKey);
    };
}

export function IsAndClause() {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(IS_AND_CLAUSE, true, target, propertyKey);
    };
}

export function IsLikeCheck() {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(IS_LIKE_CHECK, true, target, propertyKey);
    };
}