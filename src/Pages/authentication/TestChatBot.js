import React, { useState, useEffect, useRef } from 'react';
import CHATBOX_LOGO from '../../assets/icons/ChatBox_Logo.svg';
import CHATBOT_ICON from '../../assets/icons/ChatBot_icon.svg';
import INTELICHAT_NEW from '../../assets/images/chirpfloLogo.png';

import { IoSend } from 'react-icons/io5';

import ThreeDotLoader from '../../components/ThreeDotLoader';
import { toast } from 'react-toastify';
import { addClassToBody, deleteWithoutToken, getWithoutToken, postWithoutToken } from '../../API/Api';
import Linkify from 'react-linkify';
import { useLocation } from 'react-router-dom';

const TestChatBot = () => {
  const initial_value = {
    text: '',
  };

  const location = useLocation();

  const [chatData, setChatData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [values, setValues] = useState('');
  const [welcomeDeatils, setWelcomeDetails] = useState({
    welcome_msg: null,
    lead_choice: null,
    lead_status: false,
  });

  const [apiTokenData, setApiTokenData] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [hideButtons, setHideButtons] = useState(false);
  const [hideLeadClosingButtons, setHideLeadClosingButtons] = useState(false);
  const [customDisabled, setCustomDisabled] = useState(false);

  const bottomRef = useRef(null);

  const getWelcomeMsg = () => {
    getWithoutToken('welcomesms_linkAPI/' + `${location.search}`)
      .then((response) => {
        if (response.status == 200) {
          setWelcomeDetails({
            welcome_msg: response?.data?.welcome_msg,
            lead_choice: response?.data?.lead_choice,
            lead_status: response?.data?.status,
          });
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  useEffect(() => {
    const numbers = '0123456789';
    const length = 8;
    let randomId = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      randomId += numbers.charAt(randomIndex);
    }
    setSessionId(randomId);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (values != '') {
      let newObj = { prmt: values };
      chatData.push(newObj);
      let body = {
        prompt: values,
        session_id: sessionId,
      };
      setLoader(true);
      setValues('');
      chatPostApi(body);
    } else {
      toast.dismiss();
      toast.error('Message is blank.');
      setLoader(false);
    }
  };

  const chatPostApi = (body) => {
    setCustomDisabled(true);
    postWithoutToken('LoginChatGPTAPI' + `${location.search}`, body)
      .then((response) => {
        if (response.status == 200) {
          // chatData.pop();
          // setChatData([...chatData, response.data]);
          // setLoader(false);
          let tempChatData = [...chatData];

          response.data.forEach((element) => {
            let tempData = {
              choice: element,
              text: element.text,
              id: element.id,
            };
            if (!welcomeDeatils?.lead_choice) {
              setHideButtons(false);
            }
            if (tempData?.choice?.closing_lead_choice != undefined) {
              setHideLeadClosingButtons(false);
            }

            tempChatData.push(tempData);
          });
          setLoader(false);
          setCustomDisabled(false);
          setChatData(tempChatData);
        } else if (response.status == 400) {
          toast.error(response.message);
          setLoader(false);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong 1');
        setLoader(false);
      });
  };

  const handleChoice = (e, Data) => {
    setHideButtons(true);
    setHideLeadClosingButtons(true);
    let newObj = { prmt: Data };
    chatData.push(newObj);
    let body = {
      prompt: Data,
      session_id: sessionId,
    };
    setLoader(true);
    chatPostApi(body);
  };

  useEffect(() => {
    addClassToBody('no-chat');
    addClassToBody('auth-page');
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData, values]);

  useEffect(() => {
    getWelcomeMsg();
  }, []);

  const hanldeClearData = () => {
    deleteWithoutToken('LoginChatGPTAPI' + `${location.search}`)
      .then((response) => {
        if (response.status == 200) {
          setHideButtons(false);
          setChatData([]);
          toast.success(response?.message);
        } else if (response.code == 'token_not_valid') {
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  return (
    <>
      {
        <div className='d-flex align-items-center h-100'>
          <div className='test-chatbox-container'>
            <div className='chatbox-header'>
              <div className='chatbox-header-icon'>
                <div className='chatbox-logo'>
                  <img src={CHATBOX_LOGO} alt='chatbox-logo' />
                </div>
              </div>
              <div className='d-flex flex-wrap justify-content-between align-items-center w-100'>
                <div className='chatbox-header-text'>
                  <h3 className='opensans-bold'>Test bot</h3>
                  <p className='opensans-regular'>Online</p>
                </div>
                <div className='intelichatnew-logo'>
                  <img src={INTELICHAT_NEW} alt='chatbox-logo' />
                  {location?.search != '' && (
                    <button className='btn add-new-data px-3 bg-danger' onClick={() => hanldeClearData()}>
                      Clear History
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className='chatbox-body p-3'>
              <div className='chatbox-body-box' style={{ height: window.innerHeight - 250, maxHeight: '550px' }}>
                <>
                  {welcomeDeatils?.welcome_msg != null && (
                    <>
                      <div className='fix-content-welcomemsg d-flex align-items-center editdata-chatbox'>
                        <div className='chatbox-user-replytext '>
                          <p className='m-0 opensans-medium'>{welcomeDeatils?.welcome_msg}</p>
                        </div>
                      </div>
                      {!hideButtons && welcomeDeatils?.lead_choice != null && (
                        <div className='d-flex align-items-center mt-3'>
                          {welcomeDeatils?.lead_choice.map((choice, index) => (
                            <button key={index} className='btn btn-submit-login rounded bg-themePurple border-themePurple me-3' onClick={(e) => handleChoice(e, choice)}>
                              {choice}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {chatData.length > 0 &&
                    chatData?.map((obj, i) => {
                      return (
                        <>
                          <div className='mb-4'>
                            {obj.prmt && (
                              <div className='d-flex align-items-center justify-content-end mt-3'>
                                <div className='chatbox-user-quetext '>
                                  <p className='m-0 opensans-medium'>{obj?.prmt}</p>
                                </div>
                                {/* <div className='chatbox-user-icon' style={{ marginLeft: '10px' }}>
                              <img src={CHATBOT_ICON} alt='chatbot-icon' />
                            </div> */}
                              </div>
                            )}

                            {obj?.text && (
                              <div className='d-flex align-items-center mt-3'>
                                {/* <div className='chatbox-user-icon' style={{ marginRight: '10px' }}>
                                <img src={CHATBOT_ICON} alt='chatbot-icon' />
                              </div> */}
                                <div className='chatbox-user-replytext'>
                                  <p className='m-0 opensans-medium'>
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
                                <div ref={bottomRef} />
                              </div>
                            )}
                          </div>
                          {!hideLeadClosingButtons && obj?.choice?.closing_lead_choice != undefined && (
                            <div className='d-flex align-items-center mt-3'>
                              {obj?.choice?.closing_lead_choice?.length > 0 &&
                                obj?.choice?.closing_lead_choice?.map((choice, index) => (
                                  <button key={index} className='btn btn-submit-login rounded bg-themePurple border-themePurple me-3' onClick={(e) => handleChoice(e, choice)}>
                                    {choice}
                                  </button>
                                ))}
                            </div>
                          )}
                        </>
                      );
                    })}

                  {loader ? (
                    <>
                      <div className='d-flex align-items-center py-3' ref={bottomRef}>
                        {/* <div className='chatbox-user-icon'>
                          <img src={CHATBOT_ICON} alt='chatbot-icon' />
                        </div> */}
                        <ThreeDotLoader />
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </>
              </div>
              {(hideButtons && hideLeadClosingButtons) || !welcomeDeatils?.lead_status ? (
                <form className='chatbox-group d-flex justify-content-between align-items-center position-relative' type='submit'>
                  <input type='text' className='form-control' placeholder='Type Message..' name='' value={values} onChange={(e) => setValues(e.target.value)} autoComplete='off' />
                  <div className=' chatbox-input-group'>
                    <button className='btn btn-chabotsend rounded-pill new h-100' disabled={customDisabled} onClick={handleClick}>
                      <IoSend />
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default TestChatBot;

// {chatData.length == 0 && (
//   <>
//     <div className='mb-4'>
//       <div className='d-flex align-items-center mt-3'>
//         {/* <div className='chatbox-user-icon' style={{ marginRight: '10px' }}>
//         <img src={CHATBOT_ICON} alt='chatbot-icon' />
//       </div> */}
//         <div className='chatbox-user-replytext'>
//           <p className='m-0'>Hey there! I'm InteliChat.</p>
//         </div>
//       </div>
//       <div className='d-flex align-items-center mt-3'>
//         {/* <div className='chatbox-user-icon' style={{ marginRight: '10px' }}>
//         <img src={CHATBOT_ICON} alt='chatbot-icon' />
//       </div> */}
//         <div className='chatbox-user-replytext'>
//           <p className='m-0'>
//             <Linkify
//               componentDecorator={(decoratedHref, decoratedText, key) => (
//                 <a target='blank' href={decoratedHref} key={key}>
//                   {decoratedText}
//                 </a>
//               )}
//             >
//               I handle sales here at https://intelichat.com.au/ and could for your company as well! Want to test my skills?
//             </Linkify>
//           </p>
//         </div>
//       </div>
//     </div>
//   </>
// )}
