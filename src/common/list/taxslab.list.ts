import { IncomeTaxRule } from "../enums/all.enum";

export default {
    [IncomeTaxRule.Y7879]: [
        [500000, 1],
        [200000, 10],
        [300000, 20],
        [1000000, 30],
        [Number.MAX_VALUE, 36]
    ],
    [IncomeTaxRule.Y7980]: [
        [500000, 1],
        [200000, 10],
        [300000, 20],
        [1000000, 30],
        [Number.MAX_VALUE, 36]
    ],
}