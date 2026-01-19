import { useEffect, useRef, useState } from "react";
import type { Accounts } from "../../models/Account";

interface Props {
  keyName: string;
  defaultText: string;
  accounts: Accounts;
  activeID: number;
  excludeID: number;
  onChange: (id: number) => void;
}

function AccountDropdownButton({ keyName, defaultText, accounts, activeID, excludeID, onChange }: Props) {

  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const toggleDropdown = () => setDropdownVisibility(!isDropdownVisible);

  const dropdownRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownVisibility(false);
      }
    }
    document.body.addEventListener('click', handler);
    return () => document.body.removeEventListener('click', handler);
  }, []);

  let inactiveIDs = [0, ...accounts.ordering];
  inactiveIDs = inactiveIDs.filter(thisID => (thisID !== activeID) && (thisID !== excludeID));
  if (activeID !== -1) inactiveIDs = [-1, ...inactiveIDs];

  const getName = (id: number, dropdownItem: boolean = false) => {
    switch(id) {
      case -1:
        return dropdownItem ? '[clear selection]' : defaultText;
      case 0:
        return '(external)'
      default:
        return accounts[id].name ? accounts[id].name : '(unnamed)';
    }
  }

  const getBackgroundColor = (id: number) => {
    switch(id) {
      case -1:
      case 0:
        return '';
      default:
        return accounts[id].color;
    }
  }

  const getLuminance = (value: string) => {
    let luminance = parseInt(value.slice(1, 3), 16) * 0.2126; // R * 0.2126
    luminance +=    parseInt(value.slice(3, 5), 16) * 0.7152; // G * 0.7152
    luminance +=    parseInt(value.slice(5, 7), 16) * 0.0722; // B * 0.0722
    return luminance / 255;
  }

  const getTextColor = (id: number) => {
    switch(id) {
      case -1:
      case 0:
        return '';
      default:
        return (getLuminance(getBackgroundColor(id)) > 0.5) ? '#0f0f0f' : '#f0f0f0';
    }
  }

  return (
    <div className='dropdown form-control form-control-sm text-center' style={{backgroundColor: getBackgroundColor(activeID)}}>
      <button 
        className='dropdown-item' 
        onClick={toggleDropdown} 
        ref={dropdownRef} 
        style={{backgroundColor: getBackgroundColor(activeID), color: getTextColor(activeID)}}
      >{getName(activeID)}</button>
      <div className={'dropdown-menu ' + (isDropdownVisible && 'show')}>
        {
          inactiveIDs.length !== 0 ? (
            inactiveIDs.map((id) => (
              <button
                key={keyName + '-item-' + id} 
                className='dropdown-item text-center' 
                onClick={() => {onChange(id)}}
                style={{backgroundColor: getBackgroundColor(id), color: getTextColor(id)}}
              >{getName(id, true)}</button>
            ))
          ) : (
            <span className='p-3'>No other accounts!</span>
          )
        }
      </div>
    </div>
  );
}

export default AccountDropdownButton;