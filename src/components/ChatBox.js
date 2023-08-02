import React, { useEffect, useRef, useState } from 'react';
import '../assets/styles/Chatbot.css';
import { MdArrowBackIos } from 'react-icons/md';
import { HiDotsVertical } from 'react-icons/hi';
import { IoMdSend } from 'react-icons/io';
import CHATBOX_LOGO from '../assets/icons/ChatBox_Logo.svg';
import INSTA_LOGO from '../assets/images/Insta_Logo.png';
import CHATBOT_ICON from '../assets/icons/ChatBot_icon.svg';
import CHATBOX_ICON from '../assets/icons/ChatBox_Icon.svg';
import { toast } from 'react-toastify';
import { IoClose, IoSend } from 'react-icons/io5';
import { clearLocalStorage, getLocalStorage, getWithToken, postWithToken } from '../API/Api';
import ThreeDotLoader from './ThreeDotLoader';
import Linkify from 'react-linkify';

// const initial_value = {
//   text: '',
// };

const ChatBox = ({ companyValues }) => {
  const [chatBoxPopUp, setChatBoxPopUp] = useState(true);
  const [values, setValues] = useState('');
  // const [values, setValues] = useState({
  //   text: '',
  // });

  const [messages, setMessages] = useState([]);

  const [loader, setLoader] = useState(false);

  const [chatData, setChatData] = useState([]);

  const [apiTokenData, setApiTokenData] = useState('');
  const [botName, setBotName] = useState('');
  const [welcomeMsg, setWelcomeMsg] = useState(null);

  // const handleChange = (e) => {
  //   setValues({ ...values, [e.target.name]: e.target.value });
  // };

  const getBotDetails = (token) => {
    // setLoader(true);
    getWithToken('company/', token)
      .then((response) => {
        if (response.status == 201) {
          setBotName(response?.data?.bot_name);
          // setLoader(false);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
        if (response.status == 200) {
          // setLoader(false);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const getWelcomeMsg = (token) => {
    getWithToken('wellcomeSmsApi/', token)
      .then((response) => {
        if (response.status == 200) {
          setWelcomeMsg(response.data.welcome_msg);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
        if (response.status == 200) {
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const handleClick = (e) => {
    setValues('');

    e.preventDefault();
    if (values.trim().length > 0) {
      let newObj = { prmt: values };
      chatData.push(newObj);
      let body = {
        prompt: values,
      };

      setLoader(true);
      postWithToken('ChatGPTAPI_', apiTokenData, body)
        .then((response) => {
          if (response.status == 200) {
            chatData.pop();
            setChatData([...chatData, response.data]);
            setLoader(false);
          } else if (response.status == 400) {
            toast.error(response.message);
            setLoader(false);
          } else if (response.code == 'token_not_valid') {
            clearLocalStorage();
          }
        })
        .catch((error) => {
          setLoader(false);
        });
    } else {
      toast.dismiss();
      toast.error('Message is blank.');
      setLoader(false);
    }
  };
  const ScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }, [chatData]);
    return <div ref={elementRef} />;
  };

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
    }
  }, [chatData, chatBoxPopUp, values]);

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      getBotDetails(JSON.parse(token));
      getWelcomeMsg(JSON.parse(token));
    }
  }, [companyValues]);

  // const dynamicHeight = window.innerHeight - 217;

  return (
    <>
      {/* {chatBoxPopUp && <div className='chatbox-overlay' onClick={() => setChatBoxPopUp(!chatBoxPopUp)}></div>} */}
      {chatBoxPopUp && (
        <div className='position-sticky-chat mt-lg-0 mt-5 '>
          <div className='chatbox-container'>
            <div className='chatbox-header'>
              <div className='chatbox-header-icon'>
                {/* <div className='cursor-pointer backarrow-icon' onClick={() => setChatBoxPopUp(!chatBoxPopUp)}>
                <MdArrowBackIos />
              </div> */}
                {/* <div className='cursor-pointer chatbox-close-icon d-none' onClick={() => setChatBoxPopUp(!chatBoxPopUp)}>
                <IoClose />
              </div> */}
                <div className='chatbox-logo'>
                  <img src={CHATBOX_LOGO} alt='chatbox-logo' />
                </div>
              </div>
              <div className='chatbox-header-text'>
                <h3>{botName}</h3>
                <p>Online</p>
              </div>
              {/* <div className='insta-chabox-logo ms-5'>
              <img src={INSTA_LOGO} alt='chatbox-logo' />
            </div> */}
              {/* <div className='threedot-icon'>
                <HiDotsVertical />
              </div> */}
            </div>
            <div className='chatbox-body m-3'>
              <div className='chatbox-body-box' style={{ height: window.innerHeight - 345, maxHeight: '550px' }}>
                <>
                  {welcomeMsg != null && (
                    <div className='fix-content-welcomemsg'>
                      <div className='chatbox-user-replytext position-relative answer-msg-design'>
                        <p className='m-0 opensans-medium'>{welcomeMsg}</p>
                      </div>
                    </div>
                  )}
                  {chatData.length > 0 &&
                    chatData?.map((obj, i) => {
                      return (
                        <>
                          <div className='mb-4'>
                            <div className='d-flex align-items-center justify-content-end mt-3'>
                              <div className='chatbox-user-quetext question-msg-design position-relative'>
                                <p className='m-0 opensans-regular'>{obj?.prmt || 'helllo'}</p>
                              </div>
                              {/* <div className='chatbox-user-icon' style={{ marginLeft: '10px' }}>
                              <img src={CHATBOT_ICON} alt='chatbot-icon' />
                            </div> */}
                            </div>

                            {obj?.text && (
                              <div className='d-flex align-items-center mt-3'>
                                {/* <div className='chatbox-user-icon' style={{ marginRight: '10px' }}>
                                <img src={CHATBOT_ICON} alt='chatbot-icon' />
                              </div> */}
                                <div className='chatbox-user-replytext answer-msg-design position-relative'>
                                  <p className='m-0 opensans-regular'>
                                    <Linkify
                                      componentDecorator={(decoratedHref, decoratedText, key) => (
                                        <a target='blank' href={decoratedHref} key={key}>
                                          {decoratedText}
                                        </a>
                                      )}
                                    >
                                      {obj?.text}
                                    </Linkify>
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })}
                  {/* {chatData.length == 0 && (
                    <>
                      <div className='mb-4'>
                        <div className='d-flex align-items-center mt-3'>
                         
                          <div className='chatbox-user-replytext answer-msg-design position-relative'>
                            <p className='m-0'>Hey there! I'm InteliChat.</p>
                          </div>
                        </div>
                        <div className='d-flex align-items-center mt-3'>
                          
                          <div className='chatbox-user-replytext answer-msg-design position-relative'>
                            <p className='m-0'>
                              <Linkify
                                componentDecorator={(decoratedHref, decoratedText, key) => (
                                  <a target='blank' href={decoratedHref} key={key}>
                                    {decoratedText}
                                  </a>
                                )}
                              >
                                I handle sales here at https://intelichat.com.au/ and could for your company as well! Want to test my skills?
                              </Linkify>
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )} */}
                  {loader ? (
                    <>
                      <div className='d-flex align-items-center py-3'>
                        {/* <div className='chatbox-user-icon'>
                        <img src={CHATBOT_ICON} alt='chatbot-icon' />
                      </div> */}
                        <ThreeDotLoader />
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                  <ScrollToBottom />
                </>
              </div>
              <form className='chatbox-group d-flex justify-content-between align-items-center position-relative' type='submit'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Type Message..'
                  name=''
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                  autoComplete='off'
                ></input>
                <div className=' chatbox-input-group' onClick={handleClick}>
                  <button className='btn btn-chabotsend rounded-pill new h-100'>
                    <IoSend />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* <div className='chatbox-icon' onClick={() => setChatBoxPopUp(!chatBoxPopUp)}>
        <img src={CHATBOX_ICON} alt='chatbox-icon' />
      </div> */}
    </>
  );
};

export default ChatBox;
