import type { Accounts } from "../../models/Account";
import { Transaction } from "../../models/Transaction";
import AccountDropdownButton from "./AccountDropdownButton";
import { type ChangeEvent } from "react";
import type { Range, RangeKeyDict } from "react-date-range";
import DateRangeButton from "./DateRangeButton";
import FrequencyDropdownButton from "./FrequencyDropdownButton";

interface Props {
  keyName:        string;
  transaction:    Transaction;
  accounts:       Accounts;
  minRangeBounds: Range;
  setProperty:  (key: string, value: number | string | Range) => void;
  onDelete:     () => void;
}

function TransactionElement({ keyName, transaction, accounts, minRangeBounds, setProperty, onDelete }: Props) {
  
  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    setProperty('name', event.target.value);
  };

  const handlePriority = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (!value || value.match(/^(?:[1-9]\d*)$/)) {
      setProperty('priority', value);
    }
  };

  const handleAmount = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (!value || value.match(/^(\d{1,})(\.\d{0,2})?$/)) {
      setProperty('amount', value);
    }
  };

  const handleSender = (id: number) => {
    setProperty('senderID', id);
  };

  const handleReceiver = (id: number) => {
    setProperty('receiverID', id);
  };

  const handleDateRange = (rangesByKey: RangeKeyDict) => {
    setProperty('range', rangesByKey.selection);
  };

  const handleFrequency = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (!value || value.match(/^(?:[1-9]\d*)$/)) {
      setProperty('freq', value);
    }
  };

  const handleFrequencyType = (type: string) => {
    setProperty('freqType', type);
  }

  const isFrequencyActive = () => {
    return transaction.freq.length !== 0;
  }

  return (
    <div className='form-group rounded my-2 p-1'>
      <div className='input-group mb-1'>
        <input type='text' className='form-control form-control-sm' placeholder='name' value={transaction.name} onChange={handleName}/>
        <input type='text' className='form-control form-control-sm' placeholder='priority (max=1 default=3)' value={transaction.priority} onChange={handlePriority}></input>
        <span className='input-group-text py-0' style={{fontFamily: 'monospace'}}>$</span>
        <input type='text' className='form-control form-control-sm' placeholder='amount' value={transaction.amount} onChange={handleAmount}></input>
      </div>
      <div className='input-group mb-1'>
        <AccountDropdownButton
          key         = {keyName + '-sender-dropdown'}
          keyName     = {keyName + '-sender-dropdown'}
          defaultText = 'Choose sender...' 
          accounts    = {accounts}
          activeID    = {transaction.senderID}
          excludeID   = {transaction.receiverID}
          onChange    = {handleSender}
        />
        <span className='input-group-text py-0'>→</span>
        <AccountDropdownButton
          key         = {keyName + '-receiver-dropdown'}
          keyName     = {keyName + '-receiver-dropdown'}
          defaultText = 'Choose receiver...' 
          accounts    = {accounts}
          activeID    = {transaction.receiverID}
          excludeID   = {transaction.senderID}
          onChange    = {handleReceiver}
        />
      </div>
      <div className='input-group'>
        <DateRangeButton 
          range           = {transaction.range} 
          onChange        = {handleDateRange}
          minRangeBounds  = {minRangeBounds}
        />
        <span className='input-group-text py-0' style={{color: isFrequencyActive() ? '' : '#B0B5B9'}}>every</span>
        <input type='text' className='form-control form-control-sm' placeholder='number of (opt.)' value={transaction.freq} onChange={handleFrequency}/>
        <FrequencyDropdownButton
          key       = {keyName + '-frequency-dropdown'}
          keyName   = {keyName + '-frequency-dropdown'}
          frequency = {transaction.freq}
          type      = {transaction.freqType}
          types     = {Transaction.FREQ_TYPES}
          onChange  = {handleFrequencyType}
        />
        <button className='input-group-text input-group-append py-0 px-3 btn btn-danger border border-start-0' onClick={() => {onDelete()}}>🗑︎</button>
      </div>
    </div>
  )
}

export default TransactionElement;