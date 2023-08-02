import React from 'react';
import { AiFillBell, AiFillQuestionCircle, AiOutlineSearch } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import profileIcon from '../assets/images/default.jpg';
import { IoLogOutOutline } from 'react-icons/io5';
import { TiArrowSortedDown } from 'react-icons/ti';
import { clearLocalStorage, getLocalStorage } from '../API/Api';

const Header = () => {
  const Navigate = useNavigate();

  const FullName = JSON.parse(getLocalStorage('FullName'));

  const handleClick = () => {
    clearLocalStorage();
    Navigate('/login');
  };

  return (
    <>
      <div className='header-bar'>
        <div className='d-flex align-items-center'>
          <p className='opensans-regular text-white mb-0'>{FullName}</p>

          <div className='header-dropdown'>
            <div className='header-pic dropdown d-flex align-items-center' data-bs-toggle='dropdown' data-bs-auto-close='inside' aria-expanded='false'>
              <img src={profileIcon} className='img-fluid' alt='Profile_icon' />
              <span className='header-dropdown-toggle ms-2'>
                <TiArrowSortedDown />
              </span>
            </div>
            <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
              <li>
                <a className='dropdown-item text-center' href='#' onClick={handleClick}>
                  <IoLogOutOutline style={{ fontSize: '25px', marginRight: '10px' }} />
                  Logout
                </a>
              </li>
            </ul>
          </div>
          {/* <a href='#' className='nav-link-icon ms-3'>
            <AiFillBell />
          </a> */}
        </div>
      </div>
    </>
  );
};

export default Header;
