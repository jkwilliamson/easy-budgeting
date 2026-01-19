import type { Account } from "../../models/Account";
import { type ChangeEvent } from "react";
import type { ColorResult } from "react-color";
import ColorPickerButton from "./ColorPickerButton";

interface Props {
  account: Account;
  setProperty: (key: string, value: string) => void;
  onDelete: () => void;
}

function AccountElement({ account, setProperty, onDelete }: Props) {

  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    setProperty('name', event.target.value);
  }

  const handleBalance = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (!value || value.match(/^(-)?(\d{1,})?(\.\d{0,2})?$/)) {
      setProperty('balance', value);
    }
  }

  const handleAPY = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (!value || value.match(/^(\d{1,3})(\.\d{0,2})?$/)) {
      setProperty('apy', value);
    }
  }

  const handleColor = (value: ColorResult) => {
    setProperty('color', value.hex.toUpperCase());
  }

  return (
    <div className='form-group rounded my-2 p-1'>
      <div className='input-group mb-1'>
        <input type='text' className='form-control form-control-sm border-end-0' placeholder='name' value={account.name} onChange={handleName}/>
        <ColorPickerButton value={account.color} onChange={handleColor}/>
      </div>
      <div className='input-group'>
        <span className='input-group-text input-group-prepend py-0' style={{fontFamily: 'monospace'}}>$</span>
        <input type='text' className='form-control form-control-sm' placeholder='balance' value={account.balance} onChange={handleBalance}></input>
        <input type='text' className='form-control form-control-sm' placeholder='APY (opt.)' value={account.apy} onChange={handleAPY}></input>
        <span className='input-group-text input-group-append py-0' style={{fontFamily: 'monospace'}}>%</span>
        <button className='input-group-text input-group-append py-0 px-3 btn btn-danger border border-start-0' onClick={() => {onDelete()}}>🗑︎</button>
      </div>
    </div>
  );
}

export default AccountElement;