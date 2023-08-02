import React, { useEffect, useState } from 'react';
import INTELICHAT_LOGO from '../assets/images/InteliChatLogo.png';
import Header from '../components/Header';
import { FaFlagCheckered } from 'react-icons/fa';
import { FcPlus } from 'react-icons/fc';
import { BsFillFileEarmarkPdfFill } from 'react-icons/bs';
import { BiText } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import DraggableGraph from './DagAutomaticLayout';

const UpComing = () => {
  const [option, setOption] = useState(false);
  const [selectOption, setSelectOption] = useState('');

  const CHOOSE_OPTION = () => {
    return (
      <>
        <div className='choose-option'>
          <h6 className='opensans-bold color-theme-blue'>CHOOSE AN OPTION</h6>
          <div className='mt-2'>
            <div className='d-flex align-items-center cursor-pointer' onClick={() => setSelectOption('button')}>
              <div className='flex-shrink-0 choose-option-icon'>
                <BsFillFileEarmarkPdfFill />
              </div>
              <div className='flex-grow-1 ms-3 choose-option-text'>
                <h6 className='opensans-bold text-white mb-0'>Buttons</h6>
                <p className='opensans-regular mb-0 text-white'>Add some choices</p>
              </div>
            </div>
          </div>
          <div className='mt-2'>
            <div className='d-flex align-items-center cursor-pointer' onClick={() => setSelectOption('text')}>
              <div className='flex-shrink-0 choose-option-icon'>
                <BiText />
              </div>
              <div className='flex-grow-1 ms-3 choose-option-text'>
                <h6 className='opensans-bold text-white mb-0'>Ask a question</h6>
                <p className='opensans-regular mb-0 text-white'>Ask anything</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Welcome_Wrapper = () => {
    return (
      <>
        <div className='choose-option'>
          <h6 className='opensans-bold color-theme-blue '>Welcome</h6>
          <div className='mt-2'>
            <div className='d-flex align-items-center welcome-textarea'>
              <textarea name='' rows='4' className='form-control'>
                Hi there, I'm IT!
              </textarea>
            </div>
          </div>
          {selectOption === 'button' && (
            <div className='mt-2'>
              <div className='d-flex align-items-center welcome-inputtext'>
                <input aria-label='piece-editable-text' className='' placeholder='Click here to edit' value='Hi there!' />
                <div className='plus-icon'>
                  <FcPlus />
                </div>
              </div>
            </div>
          )}
          {selectOption === 'text' && (
            <div className='text-option mt-2'>
              <div className='d-flex align-items-center cursor-pointer' onClick={() => setSelectOption('text')}>
                <div className='flex-shrink-0 choose-option-icon'>
                  <BiText />
                </div>
                <div className='flex-grow-1 ms-3 choose-option-text'>
                  <h6 className='opensans-bold text-dark mb-0'>Ask a question</h6>
                  <p className='opensans-regular mb-0 text-dark'>Ask anything</p>
                </div>
                <div className='plus-icon'>
                  <FcPlus />
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const Option_Sidebar = () => {
    return (
      <>
        <div className='option-sidebar'>
          <div className='option-header mt-2'>
            <div className='d-flex align-items-center justify-content-between cursor-pointer' onClick={() => setSelectOption('text')}>
              <div className='flex-shrink-0 choose-option-icon'>
                <BiText />
              </div>
              <div className='flex-grow-1 ms-3 choose-option-text'>
                <h6 className='opensans-bold text-dark mb-0'>Ask a question</h6>
                <p className='opensans-regular mb-0 text-dark'>Ask anything</p>
              </div>
              <div className='close-icon'>
                <IoClose />
              </div>
            </div>
          </div>
          <div className='pt-2 option-body'>
            <div className='option-textarea'>
              <label className='opensans-bold'>Question Text</label>
              <textarea name='' rows='4' className='form-control'>
                Hi there, I'm IT!
              </textarea>
            </div>
          </div>
          {selectOption === 'button' && (
            <div className='mt-2'>
              <div className='d-flex align-items-center welcome-inputtext'>
                <input aria-label='piece-editable-text' className='' placeholder='Click here to edit' value='Hi there!' />
              </div>
            </div>
          )}
          {selectOption === 'text' && (
            <div className='text-option mt-2'>
              <div className='d-flex align-items-center cursor-pointer' onClick={() => setSelectOption('text')}>
                <div className='flex-shrink-0 choose-option-icon'>
                  <BiText />
                </div>
                <div className='flex-grow-1 ms-3 choose-option-text'>
                  <h6 className='opensans-bold text-dark mb-0'>Ask a question</h6>
                  <p className='opensans-regular mb-0 text-dark'>Ask anything</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className='intelichat-conatiner-right'>
        <div className='chatbot-container'>
          <div className='chatbot-fixed'>
            <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between px-2 px-md-5'>
              <div></div>
              <div className='chatbot-header'>
                <h3 className='opensans-bold mb-0'></h3>
              </div>
              <div className='d-flex justify-content-end responsive-header-width'>
                <Header />
              </div>
            </div>
          </div>
          <div className='d-flex align-items-start m-0 ps-md-5 ps-sm-3 ps-3 mb-5'>
            <div className='starting-point px-2 py-3 d-flex align-items-center'>
              <div className='start-icon'>
                <FaFlagCheckered />
              </div>
              <div className=''>
                <h6 className='opensans-bold mb-0'>Starting point</h6>
                <p className='opensans-regular mb-0'>Where your bot begins</p>
              </div>
              <div className='plus-icon' onClick={() => setOption(true)}>
                <FcPlus />
              </div>
            </div>
            <div className='ms-5'>{option && CHOOSE_OPTION()}</div>
            <div className='ms-5'>{option && Welcome_Wrapper()}</div>
          </div>
          {Option_Sidebar()}
        </div>
      </div>
    </>
  );
};

export default UpComing;
