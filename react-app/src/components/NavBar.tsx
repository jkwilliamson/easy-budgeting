import { useEffect, useRef, useState } from "react";

function NavBar() {

  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const toggleDropdown = () => setDropdownVisibility(!isDropdownVisible);
  const dropdownRef = useRef<HTMLAnchorElement | null>(null);
  
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownVisibility(false);
      }
    }
    document.body.addEventListener('click', handler);
    return () => document.body.removeEventListener('click', handler);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div className='navbar-brand me-2'>
          <img className='d-inline-block pe-1' height='40' padding-right='5' src='/src/assets/favicon.svg'/>
          Easy Budgeting
        </div>
        <ul className="navbar-nav ms-1 me-auto mb-2 mb-lg-0">
          <li className='nav-item dropdown'>
            <a className='nav-link' onClick={toggleDropdown} ref={dropdownRef} role="button">File</a>
            <div className={'dropdown-menu ' + (isDropdownVisible && 'show')}>
              <button className='dropdown-item'>New</button>
              <button className='dropdown-item'>Open</button>
              <button className='dropdown-item'>Download</button>
            </div>
          </li>
          <li className="nav-item ms-1">
            <a className="nav-link" href="https://www.github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </li>
          <li className="nav-item ms-1">
            <a className="nav-link" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </li>
        </ul>
      </div>
    </nav>
  )
} 
export default NavBar;