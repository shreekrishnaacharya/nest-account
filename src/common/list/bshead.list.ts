import { BsHeads, BsType, DrCr } from "../enums/all.enum";

export const BsHeadList = {
  [BsHeads.RESERVE_AND_SURPLUS]: {
    account_side: DrCr.DR,
    bs_type: BsType.Capital,
  },
  [BsHeads.CURRENT_ASSETS]: {
    account_side: DrCr.CR,
    bs_type: BsType.Assets,
  },
  [BsHeads.FIXED_ASSETS]: {
    account_side: DrCr.CR,
    bs_type: BsType.Assets,
  },
  [BsHeads.CURRENT_LIABILITIES]: {
    account_side: DrCr.DR,
    bs_type: BsType.Liabilities,
  },
  [BsHeads.LOAN_PAYABLE]: {
    account_side: DrCr.DR,
    bs_type: BsType.Liabilities,
  },
  [BsHeads.DIRECT_INCOME]: {
    account_side: DrCr.CR,
    bs_type: BsType.Income,
  },
  [BsHeads.DIRECT_EXPENSES]: {
    account_side: DrCr.DR,
    bs_type: BsType.Expenses,
  },
  [BsHeads.INDIRECT_INCOME]: {
    account_side: DrCr.CR,
    bs_type: BsType.Income,
  },
  [BsHeads.INDIRECT_EXPENSES]: {
    account_side: DrCr.DR,
    bs_type: BsType.Expenses,
  },
};
