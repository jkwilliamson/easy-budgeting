import { useEffect, useRef, useState } from "react";

interface Props {
  keyName:    string;
  frequency:  string;
  type:       string;
  types:      string[];
  onChange:   (type: string) => void;
}

function FrequencyDropdownButton({ keyName, frequency, type, types, onChange }: Props) {

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

  const getTextColor = () => {
    if (frequency.length === 0) {
      return '#B0B5B9';
    }
    return '';
  }

  const getName = (freqType: string) => {
    if (frequency === '1') {
      return freqType.substring(0, freqType.length - 1);
    }
    return freqType;
  }

  const inactiveTypes = types.filter(thisType => (thisType !== type));
  
  return (
    <div className='dropdown form-control form-control-sm text-center'>
      <button 
        className='dropdown-item' 
        onClick={toggleDropdown} 
        ref={dropdownRef} 
        style={{color: getTextColor()}}
      >{getName(type)}</button>
      <div className={'dropdown-menu ' + (isDropdownVisible && 'show')}>
        {
          inactiveTypes.map((freqType) => (
            <button
              key={keyName + '-item-' + freqType} 
              className='dropdown-item text-center' 
              onClick={() => {onChange(freqType)}}
              style={{color: getTextColor()}}
            >{getName(freqType)}</button>
          ))
        }
      </div>
    </div>
  )
}

export default FrequencyDropdownButton;