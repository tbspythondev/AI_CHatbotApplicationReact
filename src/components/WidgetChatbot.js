import React, { useState, useEffect, useRef } from 'react';
import CHATBOX_LOGO from '../assets/icons/ChatBox_Logo.svg';
import INTELICHAT_NEW from '../assets/images/Intelichat_new.png';
import { IoSend } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import ThreeDotLoader from '../components/ThreeDotLoader';
import { toast } from 'react-toastify';
import Linkify from 'react-linkify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { clearLocalStorage, deleteWithToken, getLocalStorage, getWithoutToken, getWithToken, patchWithToken, postWithoutToken, postWithToken } from '../API/Api';
import { FaEdit, FaSave } from 'react-icons/fa';
import TextareaAutosize from 'react-textarea-autosize';
import CHATBOT_ICON from '../assets/icons/ChatBot_icon.svg';
import { IoClose } from 'react-icons/io5';

const WidgetChatbot = (props) => {
  const [chatData, setChatData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [values, setValues] = useState('');
  const [apiTokenData, setApiTokenData] = useState('');
  const [widgetDetails, setWidgetDetails] = useState('');
  const [openChatbox, setOpenChatbox] = useState(false);
  const [smallPopup, setSmallPopup] = useState(false);
  const [website, setWebsite] = useState('');
  const [companyID, setCompanyID] = useState('');
  const widgetData = useLocation();
  const [sessionId, setSessionId] = useState('');
  const [hideButtons, setHideButtons] = useState(false);
  const [hideLeadClosingButtons, setHideLeadClosingButtons] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const [customDisabled, setCustomDisabled] = useState(false);

  const paramsID = params.get('id');
  const paramsPreData = params.get('previewData');

  const [welcomeDeatils, setWelcomeDetails] = useState({
    welcome_msg: null,
    lead_choice: null,
    lead_status: false,
  });

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
      getWelcomeMsg(JSON.parse(token));
      getBotDetails(JSON.parse(token));
    }
  }, [chatData]);

  useEffect(() => {
    if (paramsID) {
      getWidgetDetails(paramsID);
    }
  }, [widgetData, chatData]);

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

  const getBotDetails = (token) => {
    getWithToken('company/', token)
      .then((response) => {
        if (response.status == 201) {
          setWebsite(response?.data?.website);
          setCompanyID(response?.data?.id);
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

  const ScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }, [chatData]);
    return <div ref={elementRef} />;
  };

  const getWelcomeMsg = (token) => {
    getWithToken('wellcomeSmsApi/', token)
      .then((response) => {
        if (response.status == 200) {
          setWelcomeDetails({
            welcome_msg: response?.data?.welcome_msg,
            lead_choice: response?.data?.lead_choice,
            lead_status: response?.data?.status,
          });
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

  const postChatData = (e) => {
    e.preventDefault();
    if (values.trim().length > 0) {
      let newObj = { prmt: values };
      chatData.push(newObj);
      let body = {
        prompt: values,
        session_id: sessionId,
      };
      setValues('');
      setLoader(true);
      chatPostApi(body);
    } else {
      toast.dismiss();
      toast.error('Message is blank.');
      setLoader(false);
    }
  };

  const chatPostApi = (body) => {
    setCustomDisabled(true);
    postWithToken('LoginChatGPTAPI?company=' + companyID, apiTokenData, body)
      .then((response) => {
        if (response.status == 200) {
          // chatData.pop();
          // setChatData([...chatData, response.data]);
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
            if (tempData?.choice?.closing_chatbot == true) {
              setTimeout(() => {
                setOpenChatbox(false);
              }, 2000);
            }
            tempChatData.push(tempData);
          });
          setChatData(tempChatData);
          // setScrollValue(true);
          setCustomDisabled(false);
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

  const getWidgetDetails = (id) => {
    if (paramsPreData) {
      getWithoutToken(`WidgetGetAPI/${id}`)
        .then((response) => {
          if (response.status == 200) {
            setWidgetDetails(response?.data);
            if (response?.data?.popup_status) {
              setTimeout(() => {
                setSmallPopup(true);
              }, response?.data?.timer_count * 1000);
            }
          } else if (response.code == 'token_not_valid') {
            clearLocalStorage();
          }
        })
        .catch((error) => {
          // toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      <div className='widgetChabot-iframe h-100'>
        <iframe src={website} title='W3Schools Free Online Web Tutorials'></iframe>
      </div>

      {openChatbox && (
        <div className='d-flex align-items-center position-sticky-chat'>
          <div
            className='widget-chatbox-container'
            style={{ background: widgetDetails?.background_color?.includes('http') ? `url(${widgetDetails?.background_color})` : widgetDetails?.background_color }}
          >
            <div className='background-svg'>
              <svg width='432' height='149' viewBox='0 0 296 98' fill={widgetDetails?.color} xmlns='http://www.w3.org/2000/svg'>
                <g filter='url(#filter0_d_74_92)'>
                  <path d='M135 84.5C62.5 90 0 61.5 0 61.5V-2H296.5V65.5C217.5 65.5 216 78.3552 135 84.5Z' fill='${bg_color}' />
                </g>
                <defs>
                  <filter id='filter0_d_74_92' x='-8' y='-6' width='312.5' height='103.205' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'>
                    <feFlood flood-opacity='0' result='BackgroundImageFix' />
                    <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
                    <feOffset dy='4' />
                    <feGaussianBlur stdDeviation='4' />
                    <feComposite in2='hardAlpha' operator='out' />
                    <feColorMatrix type='matrix' values='0 0 0 0 0.0216493 0 0 0 0 0.0335989 0 0 0 0 0.179167 0 0 0 0.25 0' />
                    <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_74_92' />
                    <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_74_92' result='shape' />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className='chatbox-header d-flex align-items-center justify-content-between'>
              <div className='d-flex flex-wrap justify-content-between align-items-center w-100'>
                <div className='chatbox-header-text ps-0'>
                  <h3 className='opensans-bold'>{widgetDetails?.name}</h3>
                  <p className='opensans-regular'>{widgetDetails?.heading}</p>
                  <p className='opensans-regular'>{widgetDetails?.sub_heading}</p>
                </div>
              </div>
              <div className='chatbox-header-icon'>
                <div className='chatbox-logo'>
                  <img src={widgetDetails?.chatbot_avtar} alt='chatbox-logo' />
                </div>
              </div>
            </div>
            <div className='chatbox-body'>
              <div className='chatbox-body-box' style={{ height: window.innerHeight - 360, maxHeight: '400px' }}>
                <div>
                  {welcomeDeatils?.welcome_msg != null && (
                    <>
                      <div className='fix-content-welcomemsg d-flex align-items-center editdata-chatbox'>
                        <div className='chatbox-user-replytext' style={{ background: widgetDetails?.color }}>
                          <p className='m-0 opensans-medium text-white'>{welcomeDeatils?.welcome_msg}</p>
                        </div>
                      </div>
                      {!hideButtons && welcomeDeatils?.lead_choice != null && (
                        <div className='d-flex align-items-center mt-3'>
                          {welcomeDeatils?.lead_choice.map((choice, index) => (
                            <button
                              key={index}
                              className='btn btn-submit-login preview-btn-style rounded me-3'
                              style={{ background: widgetDetails?.client_bubble_color, borderColor: widgetDetails?.client_bubble_color }}
                              onClick={(e) => handleChoice(e, choice)}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {chatData.length > 0 &&
                    chatData?.map((obj, index) => {
                      return (
                        <>
                          <div className='mb-4' key={index}>
                            {obj.prmt && (
                              <div className='d-flex align-items-center justify-content-end mt-3'>
                                <div className='chatbox-user-quetext ' style={{ background: widgetDetails?.client_bubble_color }}>
                                  <p className='m-0 opensans-medium'>{obj?.prmt}</p>
                                </div>
                              </div>
                            )}
                            {obj?.text && (
                              <div className='d-flex align-items-center editdata-chatbox mt-3'>
                                <div className='chatbox-user-replytext ' style={{ background: widgetDetails?.color }}>
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
                              </div>
                            )}
                          </div>
                          {!hideLeadClosingButtons && obj?.choice?.closing_lead_choice != undefined && (
                            <div className='d-flex align-items-center mt-3'>
                              {obj?.choice?.closing_lead_choice?.length > 0 &&
                                obj?.choice?.closing_lead_choice?.map((choice, index) => (
                                  <button
                                    key={index}
                                    className='btn btn-submit-login preview-btn-style rounded  me-3'
                                    style={{ background: widgetDetails?.client_bubble_color, borderColor: widgetDetails?.client_bubble_color }}
                                    onClick={(e) => handleChoice(e, choice)}
                                  >
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
                      <div className='d-flex align-items-center py-3'>
                        <ThreeDotLoader />
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                  <ScrollToBottom />
                </div>
              </div>
            </div>

            {(hideButtons && hideLeadClosingButtons) || !welcomeDeatils?.lead_status ? (
              <>
                <hr />
                <form
                  className='chatbox-group d-flex justify-content-between align-items-center position-relative'
                  type='submit'
                  style={{ border: `1px solid ${widgetDetails?.client_bubble_color}` }}
                >
                  <input
                    type='text'
                    className='form-control click-text'
                    placeholder='Type Message..'
                    name=''
                    value={values}
                    onChange={(e) => setValues(e.target.value)}
                    autoComplete='off'
                    onClick={props.handleBlurClick}
                  />
                  <div className=' chatbox-input-group'>
                    <button
                      className='btn btn-chabotsend rounded-pill new h-100'
                      style={{ background: widgetDetails?.client_bubble_color }}
                      disabled={customDisabled}
                      onClick={postChatData}
                    >
                      <IoSend />
                    </button>
                  </div>
                </form>
              </>
            ) : null}
          </div>
        </div>
      )}
      {widgetDetails?.status && smallPopup && (
        <div className='chatbot-popup-msg'>
          <div className='chatbot-popup-closeIcon' onClick={() => setSmallPopup(false)}>
            <IoClose />
          </div>
          <div className='chatbot-popup-inner d-flex align-items-center'>
            <div className='flex-shrink-0 chatbot-popup-logo'>
              <img src={widgetDetails?.chatbot_avtar} alt='chatbox-logo' />
            </div>
            <div className='flex-grow-1 ms-md-3 ms-1 chatbot-popup-text'>
              <p className='opensans-regular text-dark mb-0'>{welcomeDeatils?.welcome_msg}</p>
              {/* <h6 className='opensans-regular mb-0 text-notBlack'>Chatbot ID</h6> */}
            </div>
          </div>
        </div>
      )}

      {widgetDetails?.status && (
        <div
          className='chatbot-popup me-3'
          onClick={() => {
            setOpenChatbox(!openChatbox);
            setSmallPopup(false);
          }}
          style={{ background: widgetDetails?.color }}
        >
          {!openChatbox ? <img src={widgetDetails?.launcher_icon} alt='chatbot-icon' /> : <IoClose />}
        </div>
      )}
    </>
  );
};

export default WidgetChatbot;
