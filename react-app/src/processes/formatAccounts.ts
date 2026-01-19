import type { Accounts } from "../models/Account";
import { FormattedAccount, type FormattedAccounts } from "../models/FormattedAccount";

/** 
 * Validates and reformats each account's properties to be their proper types.
 */
function formatAccounts(accounts: Accounts) {
  const formattedAccounts = {
    ordering: []
  } as FormattedAccounts;
  
  accounts.ordering.forEach((id, index) => {
    const currAccount = accounts[id];
    const errorMessage = (appendMessage: string) => {
      if (currAccount.name.trim() !== '') {
        return `Account "${currAccount.name.trim()}" ${appendMessage}`;
      }
      return `Account ${index + 1} ${appendMessage}`;
    }

    // name validation
    if (currAccount.name.trim() === '') {
      throw new Error(errorMessage(`must be named!`));
    }

    // balance validation
    if (currAccount.balance.trim() === '') {
      throw new Error(errorMessage(`must have a balance!`));
    }
    if (isNaN(Number(currAccount.balance.trim()))) {
      throw new Error(errorMessage(`has invalid balance: '${currAccount.balance.trim()}'`));
    }

    // apy validation (optional field)
    if (currAccount.apy.trim() !== '') {
      if (isNaN(Number(currAccount.apy.trim()))) {
        throw new Error(errorMessage(`has invalid APY: '${currAccount.balance.trim()}'`));
      }
      if (Number(currAccount.apy.trim()) <= 0) {
        throw new Error(errorMessage(`cannot have an APY of 0% or less! Leave field empty if not a savings account.`));
      }
    }

    // no validation needed for id and color
    formattedAccounts[id] = new FormattedAccount(currAccount);
    formattedAccounts.ordering.push(id);
  });
  
  return formattedAccounts;
}

export default formatAccounts;