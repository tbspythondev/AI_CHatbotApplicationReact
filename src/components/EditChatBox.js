import React, { useState, useEffect, useRef } from 'react';
import CHATBOX_LOGO from '../assets/icons/ChatBox_Logo.svg';
import INTELICHAT_NEW from '../assets/images/Intelichat_new.png';
import { IoSend } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import ThreeDotLoader from '../components/ThreeDotLoader';
import { toast } from 'react-toastify';
import Linkify from 'react-linkify';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearLocalStorage, deleteWithToken, getLocalStorage, getWithoutToken, getWithToken, patchWithToken, postWithoutToken, postWithToken } from '../API/Api';
import { FaEdit, FaSave } from 'react-icons/fa';
import TextareaAutosize from 'react-textarea-autosize';
import CHATBOT_ICON from '../assets/icons/ChatBot_icon.svg';
import { IoClose } from 'react-icons/io5';

const EditChatBox = (props) => {
  const [chatData, setChatData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [values, setValues] = useState('');
  const [apiTokenData, setApiTokenData] = useState('');
  const [editIndex, setEditIndex] = useState('');
  const [editValue, setEditValue] = useState('');
  const [openEditMsg, setOpenEditMsg] = useState(false);
  const [openChatbox, setOpenChatbox] = useState(false);
  const [widgetDetails, setWidgetDetails] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [hideLeadButtons, setHideLeadButtons] = useState(false);
  const [hideLeadClosingButtons, setHideLeadClosingButtons] = useState(false);
  const [companyDetails, setCompanyDetails] = useState('');
  const [customDisabled, setCustomDisabled] = useState(false);

  const [editWelcomeMsg, setEditWelcomeMsg] = useState('');
  const [welcomeDeatils, setWelcomeDetails] = useState({
    welcome_msg: null,
    lead_choice: null,
    lead_status: false,
  });

  const Navigate = useNavigate();

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
      getCompanyDetails(JSON.parse(token));
      getWelcomeMsg(JSON.parse(token));
    }
  }, [chatData]);
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

  useEffect(() => {
    if (props?.widgetID) {
      getWidgetDetails(props?.widgetID);
    }
  }, [props, chatData]);

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
  const getCompanyDetails = (token) => {
    getWithToken('company_base/', token)
      .then((response) => {
        if (response.status == 201) {
          setCompanyDetails(response?.data);
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
    postWithToken('ChatGPTAPI_', apiTokenData, body)
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
              setHideLeadButtons(false);
            }
            if (tempData?.choice?.closing_chatbot == true) {
              setTimeout(() => {
                setOpenChatbox(false);
              }, 2000);
            }
            if (tempData?.choice?.closing_lead_choice != undefined) {
              setHideLeadClosingButtons(false);
            } else {
              setCustomDisabled(true);
            }

            tempChatData.push(tempData);
          });
          setCustomDisabled(false);
          setChatData(tempChatData);
          // setScrollValue(true);
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
    setHideLeadButtons(true);
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
  const handelEditChatData = (newData, index) => {
    setEditIndex(newData.id);
    setEditValue(newData.text);
  };

  const sendToChild = (data) => {
    props.passChildData(data);
  };

  const handelSaveChatData = (newData) => {
    let obj = {
      text: editValue,
    };
    if (editValue != '') {
      patchWithToken('Chat_logAPI/' + newData.id, apiTokenData, obj)
        .then((response) => {
          if (response.status == 200) {
            setEditIndex('');
            const tempArray = [...chatData];
            tempArray.forEach((element, index) => {
              if (element.id === newData.id) {
                tempArray[index].text = editValue;
              }
            });
            sendToChild(true);
            toast.success('Value updated');
            setLoader(false);
          } else if (response.code == 'token_not_valid') {
            clearLocalStorage();
          }
        })
        .catch((error) => {
          toast.error('Something went wrong');
        });
    } else {
      toast.dismiss();
      toast.error('Empty text field');
    }
  };

  const hanldeEditWelcomeMsg = () => {
    let obj = {
      welcome_msg: editWelcomeMsg,
    };
    if (editWelcomeMsg != '') {
      patchWithToken('company_base/' + companyDetails?.id + '/', apiTokenData, obj)
        .then((response) => {
          if (response.status == 200) {
            getWelcomeMsg(apiTokenData);
            setOpenEditMsg(false);
            sendToChild(true);
            toast.success(response?.message);
          } else if (response.code == 'token_not_valid') {
            clearLocalStorage();
          }
        })
        .catch((error) => {
          toast.error('Something went wrong');
        });
    } else {
      toast.dismiss();
      toast.error('Empty text field');
    }
  };

  const hanldeClearData = () => {
    deleteWithToken('ChatGPTAPI_', apiTokenData)
      .then((response) => {
        if (response.status == 200) {
          setHideLeadButtons(false);
          setChatData([]);
          toast.success(response?.message);
        } else if (response.code == 'token_not_valid') {
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const getWidgetDetails = (id) => {
    getWithoutToken(`WidgetGetAPI/${id}`)
      .then((response) => {
        if (response.status == 200) {
          setWidgetDetails(response?.data);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  console.log(!welcomeDeatils?.lead_status, '!welcomeDeatils?.lead_status');

  return (
    <>
      {openChatbox && (
        <div className='d-flex align-items-center position-sticky-chat'>
          <div className='chatbox-container'>
            <div className='chatbox-header'>
              <div className='chatbox-header-icon'>
                <div className='chatbox-logo'>
                  <img src={CHATBOX_LOGO} alt='chatbox-logo' />
                </div>
              </div>
              <div className='d-flex flex-wrap justify-content-between align-items-center w-100'>
                <div className='chatbox-header-text'>
                  <h3 className='opensans-bold'>{companyDetails?.bot_name}</h3>
                  <p className='opensans-regular'>Online</p>
                </div>
                <div className=''>
                  <button className='btn add-new-data px-3 bg-danger' onClick={() => hanldeClearData()}>
                    Clear History
                  </button>
                </div>
              </div>
            </div>
            <div className='chatbox-body p-3'>
              <div className='chatbox-body-box' style={{ height: window.innerHeight - 360, maxHeight: '470px' }}>
                <div>
                  {welcomeDeatils?.welcome_msg != '' && (
                    <>
                      <div className='fix-content-welcomemsg d-flex align-items-center editdata-chatbox'>
                        {/* <div className='chatbox-user-icon me-3'>
                      <img src={CHATBOT_ICON} alt='chatbot-icon' />
                    </div> */}
                        <div className='chatbox-user-replytext '>
                          {!openEditMsg ? (
                            <p className='m-0 text-white'>{welcomeDeatils?.welcome_msg}</p>
                          ) : (
                            <div className='d-flex align-items-center'>
                              <TextareaAutosize className='py-2' placeholder='Enter category here...' onChange={(e) => setEditWelcomeMsg(e.target.value)}>
                                {welcomeDeatils?.welcome_msg}
                              </TextareaAutosize>
                              <div className='knowledge-pair-icon editchat-box-icon'>
                                <button className='btn' type='button' onClick={() => hanldeEditWelcomeMsg('')}>
                                  <FaSave />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {!openEditMsg && (
                          <div className='knowledge-pair-icon '>
                            <button
                              className='btn'
                              type='button'
                              onClick={() => {
                                setOpenEditMsg(true);
                                setEditWelcomeMsg(welcomeDeatils?.welcome_msg);
                              }}
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </div>
                      {!hideLeadButtons && welcomeDeatils?.lead_choice != null && (
                        <div className='d-flex align-items-center mt-3'>
                          {welcomeDeatils?.lead_choice.map((choice, index) => (
                            <button
                              key={index}
                              className='btn btn-submit-login preview-btn-style rounded bg-themePurple border-themePurple me-3'
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
                                <div className='chatbox-user-quetext '>
                                  <p className='m-0'>{obj?.prmt}</p>
                                </div>
                                {/* <div className='chatbox-user-icon ms-3'>
                                <img src={CHATBOT_ICON} alt='chatbot-icon' />
                              </div> */}
                              </div>
                            )}
                            <div>
                              {obj?.text && (
                                <div className='d-flex align-items-center editdata-chatbox mt-3'>
                                  {/* <div className='chatbox-user-icon me-3'>
                                <img src={CHATBOT_ICON} alt='chatbot-icon' />
                              </div> */}
                                  <div className='chatbox-user-replytext '>
                                    {editIndex != obj.id ? (
                                      <p className='m-0'>
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
                                    ) : (
                                      <>
                                        <div className='d-flex align-items-center'>
                                          <TextareaAutosize className='py-2' placeholder='Enter category here...' onChange={(e) => setEditValue(e.target.value)}>
                                            {obj.text}
                                          </TextareaAutosize>
                                          <div className='knowledge-pair-icon editchat-box-icon'>
                                            <button className='btn' type='button' onClick={() => handelSaveChatData(obj, index)}>
                                              <FaSave />
                                            </button>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className='knowledge-pair-icon '>
                                    <button className='btn' type='button' onClick={() => handelEditChatData(obj, index)}>
                                      <FaEdit />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {!hideLeadClosingButtons && obj?.choice?.closing_lead_choice != undefined && (
                            <div className='d-flex align-items-center mt-3'>
                              {obj?.choice?.closing_lead_choice?.length > 0 &&
                                obj?.choice?.closing_lead_choice?.map((choice, index) => (
                                  <button
                                    key={index}
                                    className='btn btn-submit-login preview-btn-style rounded bg-themePurple border-themePurple me-3'
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
              {(hideLeadButtons && hideLeadClosingButtons) || !welcomeDeatils?.lead_status ? (
                <>
                  <form className='chatbox-group d-flex justify-content-between align-items-center position-relative' type='submit'>
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
                      <button className='btn btn-chabotsend rounded-pill new h-100' disabled={customDisabled} onClick={postChatData}>
                        <IoSend />
                      </button>
                    </div>
                  </form>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className='chatbot-popup me-3' onClick={() => setOpenChatbox(!openChatbox)} style={{ background: widgetDetails?.color }}>
        {!openChatbox ? <img src={CHATBOT_ICON} alt='chatbot-icon' /> : <IoClose />}
      </div>
    </>
  );
};

export default EditChatBox;
