import { IncomeTaxRule } from "../enums/all.enum";
import TaxRule from "../list/taxslab.list"
interface TaxData {
    taxable: number
    tax: number
}
export function CalculateTax(activeYear: IncomeTaxRule, taxable: number): number {
    const taxRule = TaxRule[activeYear];
    const amount = taxRule.reduce(({ taxable, tax }: TaxData, rule) => {
        if (taxable > rule[0]) {
            tax += (rule[0] * (rule[1] / 100))
            taxable -= rule[0]
        } else {
            tax += (taxable * (rule[1] / 100))
            taxable = 0;
        }
        return { taxable, tax }
    }, { taxable, tax: 0 })
    return amount.tax
}