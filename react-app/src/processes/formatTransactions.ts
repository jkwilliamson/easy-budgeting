import type { Accounts } from "../models/Account";
import { FormattedTransaction, type FormattedTransactions } from "../models/FormattedTransaction";
import type { Transactions } from "../models/Transaction";

function formatTransactions(transactions: Transactions, accounts: Accounts) {
  const formattedTransactions = {
    ordering: []
  } as FormattedTransactions;

  transactions.ordering.forEach((id, index) => {

    const currTransaction = transactions[id];
    const errorMessage = (appendMessage: string) => {
      if (currTransaction.name.trim() !== '') {
        return `Transaction "${currTransaction.name.trim()}" ${appendMessage}`;
      }
      return `Transaction ${index + 1} ${appendMessage}`;
    }

    // name validation
    if (currTransaction.name.trim() === '') {
      throw new Error(errorMessage(`must be named!`));
    }

    // priority validation (optional field)
    if (currTransaction.priority.trim() !== '') {
      if (isNaN(Number(currTransaction.priority))) {
        throw new Error(errorMessage(`has invalid priority: '${currTransaction.priority.trim()}'`));
      }

      if (Number(currTransaction.priority) < 1) {
        throw new Error(errorMessage(`cannot have a priority of less than 1!`));
      }
    }

    // amount validation
    if (currTransaction.amount.trim() === '') {
      throw new Error(errorMessage(`must have an amount!`));
    }

    if (isNaN(Number(currTransaction.amount.trim()))) {
      throw new Error(errorMessage(`has invalid amount: '${currTransaction.amount.trim()}'`));
    }

    if (Number(currTransaction.amount.trim()) <= 0) {
      throw new Error(errorMessage(`cannot have an amount of $0 or less!`));
    }

    // sender and receiver ID validation
    let foundSender = currTransaction.senderID === 0;
    let foundReceiver = currTransaction.receiverID === 0;
    for (const id of accounts.ordering) {
      if (!foundSender && currTransaction.senderID === id) {
        foundSender = true;
        if (foundReceiver) break;
      }
      if (!foundReceiver && currTransaction.receiverID === id) { 
        foundReceiver = true; 
        if (foundSender) break;
      }
    }

    if (!foundSender) {
      throw new Error(errorMessage(`has an invalid sender account ID! (id ${currTransaction.senderID} does not exist)`));
    }

    if (!foundReceiver) {
      throw new Error(errorMessage(`has an invalid receiver account ID! (id ${currTransaction.receiverID} does not exist)`));
    }

    if (currTransaction.senderID === currTransaction.receiverID) {
      throw new Error(errorMessage(`sends and receives from the same account ID! (id ${currTransaction.senderID} → ${currTransaction.receiverID})`));
    }

    // range validation
    if (typeof(currTransaction.range.startDate) === 'undefined') {
      throw new Error(errorMessage(`must at least have a start date!`));
    }

    if (currTransaction.range.endDate && currTransaction.range.endDate.getTime() < currTransaction.range.startDate.getTime()) {
      throw new Error(errorMessage(`cannot have an end date earlier than its start date!`));
    }

    // frequency validation (optional field)
    if (currTransaction.freq.trim() !== '') {
      if (isNaN(Number(currTransaction.freq))) {
        throw new Error(errorMessage(`has invalid frequency: '${currTransaction.freq.trim()}'`));
      }

      if (Number(currTransaction.freq) < 1) {
        throw new Error(errorMessage(`cannot have a frequency of less than 1!`));
      }
    }

    // no validation for id and freqType
    formattedTransactions[id] = new FormattedTransaction(currTransaction);
    formattedTransactions.ordering.push(id);
  });
  
  return formattedTransactions;
}

export default formatTransactions;