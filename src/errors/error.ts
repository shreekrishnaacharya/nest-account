export enum Errors {
  CONFLICT = "23505",
}

export const ErrorMessage = {
  NO_ITEMS_IN_CART: "No items in your cart",
  JOURNAL_ENTRY_DR_CR_NOT_EQUAL: "DR CR total should be equal",
  JOURNAL_ENTRY_DUPLICATE_ENTRY_OF_SAME_LEDGER:
    "Cannot have same ledger twice on same site",
  JOURNAL_ENTRY_INVALID_LEDGER: "Invalid ledger",
};
