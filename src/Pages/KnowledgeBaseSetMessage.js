import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearLocalStorage, deleteWithToken, getLocalStorage, getWithToken, patchAvtarWithToken, patchWithToken, postWithToken } from '../API/Api';
import Header from '../components/Header';
import Loader from '../components/Loader';
import EditChatBox from '../components/EditChatBox';
import { FaUser, FaEdit } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import { AiOutlineCheck, AiFillCloseSquare } from 'react-icons/ai';
import { RiCloseCircleLine } from 'react-icons/ri';
import { List, arrayMove, arrayRemove } from 'react-movable';
import DotsSixDotted from '../assets/icons/DotsSixDotted.svg';

const ValidationErrors = {
  empty: {
    bot_name: 'Name required',
    tone: 'Tone required',
  },
};

const TONES = [
  { name: 'Funny' },
  { name: 'Humorous' },
  { name: 'Sales Genius' },
  { name: 'Empathetic' },
  { name: 'Calm' },
  { name: 'Friendly' },
  { name: 'Helpful' },
  { name: 'Mindful' },
  { name: 'Spiritual' },
  { name: 'Comedian' },
];

const ROLES = [{ name: 'Virtual Assistant' }, { name: 'Business Owner' }, { name: 'Sales representative' }, { name: 'Marketing specialist' }, { name: 'Financial manager' }];

const KnowledgeBaseSetMessage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [values, setValues] = useState({
    bot_name: '',
    tone: '',
    role: '',
    welcome_msg: '',
    phone_number: '',
    name: '',
    email_address: '',
    call_to_actions: '',
  });
  const [loader, setLoader] = useState(false);
  const [blurPopup, setBlurPopup] = useState(false);
  const [openChatbox, setOpenChatbox] = useState(false);
  const [blurChange, setBlurChange] = useState(false);

  const [botId, setBotId] = useState('');
  const [apiTokenData, setApiTokenData] = useState('');
  const [childData, setChildData] = useState(false);

  const Navigate = useNavigate();
  const concernedElementRef = useRef(null);

  const { bot_name, tone, role, welcome_msg, phone_number, name, email_address, call_to_actions } = values;

  const [widgetValues, setWidgetValues] = useState({
    id: '',
    chat_name: '',
    heading: '',
    sub_heading: '',
    chat_status: '',
    color: '',
    chatbot_avtar: '',
    company: '',
    launcher_icon: '',
    default_launcher_icon: '',
    popup_status: '',
    timer_count: 0,
    background_color: '',
    client_bubble_color: '',
    bg_chatbot: '',
  });
  const [imgUrlPath, setImgUrlPath] = useState({
    id: '1',
    link: '',
    status: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bgPreview, setBgPreview] = useState('');
  const [status, setStatus] = useState(false);
  const [widgetCode, setWidgetCode] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [previewData, setPreviewData] = useState(false);
  const [bgPopup, setBgPopup] = useState(false);

  const {
    chat_name,
    heading,
    sub_heading,
    company,
    color,
    chatbot_avtar,
    launcher_icon,
    default_launcher_icon,
    chat_status,
    popup_status,
    timer_count,
    launcher_icon_status,
    client_bubble_color,
    background_color,
    bg_chatbot,
  } = widgetValues;

  const [errors, setErrors] = useState({
    bot_name: '',
    tone: '',
  });
  const [instruction, setInstruction] = useState('Find the </head> tag and paste the code snippet just before it. Save the HTML file.');

  const FullName = JSON.parse(getLocalStorage('FullName'));
  const handleChange = (e, index) => {
    setValues({ ...values, [e.target.name]: e.target.value || null });
    setErrors({ ...errors, [e.target.name]: null });
    setBlurChange(true);
  };

  const handleBlurClick = (event) => {
    if (blurChange) {
      if (concernedElementRef.current && concernedElementRef.current.contains(event.target)) {
        console.log('Clicked Inside');
      } else {
        setBlurPopup(true);
      }
    }
  };

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
      getBotMessageDetails(JSON.parse(token));
      getInformationValues(JSON.parse(token));
    } else {
      Navigate('/login');
    }
  }, [childData]);

  const handleChildData = (data) => {
    setChildData(data);
  };

  const getBotMessageDetails = (token) => {
    getWithToken('company_base/', token)
      .then((response) => {
        if (response.status == 201) {
          setBotId(response?.data?.id);
          setValues({
            ...values,
            bot_name: response?.data?.bot_name,
            tone: response?.data?.tone,
            role: response?.data?.role,
            welcome_msg: response?.data?.welcome_msg || null,
            email_address: response?.data?.email_address,
            name: response?.data?.name,
            phone_number: response?.data?.phone_number,
            call_to_actions: response?.data?.call_to_actions,
          });
          setChildData(false);
          // let setNewWeekArray = [];

          // response?.data?.bussiness_hour?.forEach((ele, i) => {
          //   if (inputList.length <= response?.data?.bussiness_hour.length) {
          //     setNewWeekArray.push(weekValues);
          //   }
          // });

          // let responseWeekArray = [];
          // let newResponseObj = {};

          // response?.data?.bussiness_hour?.forEach((ele, indx) => {
          //   setNewWeekArray.forEach((element, index) => {
          //     if (indx == index) {
          //       let openGetHours = ele.opening_time.split(':');
          //       let openHours = openGetHours[0];
          //       let openMins = openGetHours[1];
          //       let closeGetHours = ele.closing_time.split(':');
          //       let closeHours = closeGetHours[0];
          //       let closeMins = closeGetHours[1];
          //       newResponseObj = {
          //         week_day: ele.week_day,
          //         close_hours: closeHours,
          //         close_minutes: closeMins,
          //         open_hours: openHours,
          //         open_minutes: openMins,
          //       };
          //       responseWeekArray.push(newResponseObj);
          //     }
          //     setInputList(responseWeekArray);
          //   });
          // });
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        // toast.error('Something went wrong');
      });
  };

  const handleSubmit = async (valueName) => {
    const tempErrors = { ...errors };
    Object.keys(values).map((key) => {
      if (!values[key]) {
        tempErrors[key] = ValidationErrors.empty[key];
      }
    });

    setErrors(tempErrors);

    if (Object.values(tempErrors).filter((obj) => !!obj).length > 0) {
      return false;
    }

    const payload = {
      bot_name,
      tone,
      role,
      welcome_msg,
      // call_to_actions,
      // ...(valueName === 'email_address'
      //   ? { email_address: !email_address }
      //   : valueName === 'name'
      //   ? { name: !name }
      //   : valueName === 'phone_number'
      //   ? { phone_number: !phone_number }
      //   : {}),
    };
    try {
      // setLoader(true);
      const response = await patchWithToken(`company_base/${botId}/`, apiTokenData, payload);
      if (response.status === 200) {
        toast.dismiss();
        toast.success(response.message);
        // setValues(InitialValues);
        setBlurChange(false);
        getBotMessageDetails(apiTokenData);
      } else if (response.status === 400) {
        toast.error(response.message);
      } else if (response.code === 'token_not_valid') {
        clearLocalStorage();
      } else {
        toast.error('Please create the company.');
      }
    } catch (error) {
      // toast.error('Something went wrong');
    } finally {
      setLoader(false);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    // send state to server with e.g. `window.fetch`
  };

  const userHandleChange = async (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setWidgetValues({ ...widgetValues, [e.target.name]: file });

      // Generate a preview of the uploaded image
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      let fd = new FormData();
      fd.append('chatbot_avtar', file);

      try {
        const response = await patchAvtarWithToken('Avtar_Image_WidgetAPI/', apiTokenData, fd);
        if (response.status === 200) {
          toast.success(response.message);
          getWidgetDetails(apiTokenData);
        } else if (response.status === 400) {
          toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setWidgetValues({ ...widgetValues, [e.target.name]: e.target.value || '' });
    }
  };

  const userBgImageChange = async (e) => {
    const file = e.target.files[0];
    setWidgetValues({ ...widgetValues, [e.target.name]: file });

    // Generate a preview of the uploaded image
    const reader = new FileReader();
    reader.onload = () => {
      setBgPreview(reader.result);
    };
    reader.readAsDataURL(file);

    let fd = new FormData();
    fd.append('bg_chatbot', file);
    try {
      const response = await patchAvtarWithToken('Widget_bg_ColorAPI/', apiTokenData, fd);
      if (response.status === 200) {
        toast.success(response.message);
        getWidgetDetails(apiTokenData);
      } else if (response.status === 400) {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const launcherIconHandleChange = (e) => {
    e.preventDefault();
    let fd = new FormData();
    fd.append('launcher_icon', e.target.files[0]);

    patchAvtarWithToken('Icons_Image_WidgetAPI/', apiTokenData, fd)
      .then((response) => {
        if (response.status === 200) {
          setImgUrlPath({
            id: '',
            link: response.data.launcher_icon,
            // status: false,
          });
          setStatus(true);
          toast.success(response.message);
          getWidgetDetails(apiTokenData);
        } else if (response.status === 400) {
          toast.error(response.message);
        }
      })
      .catch((error) => {});
  };

  const getWidgetDetails = (token) => {
    getWithToken('Webchat_widgetAPI/', token)
      .then((response) => {
        if (response.status === 200) {
          setWidgetValues({
            id: response?.data?.id,
            chat_name: response?.data?.name,
            heading: response?.data?.heading,
            sub_heading: response?.data?.sub_heading,
            chat_status: response?.data?.status,
            color: response?.data?.color,
            default_launcher_icon: response?.data?.default_launcher_icon,
            chatbot_avtar: response?.data?.chatbot_avtar,
            launcher_icon: response?.data?.launcher_icon,
            company: response?.data?.company,
            popup_status: response?.data?.popup_status,
            launcher_icon_status: response?.data?.launcher_icon_status,
            timer_count: response?.data?.timer_count,
            background_color: response?.data?.background_color,
            bg_chatbot: response?.data?.bg_chatbot,
            client_bubble_color: response?.data?.client_bubble_color,
          });
          if (response?.data?.launcher_icon_status) {
            setImgUrlPath({
              id: '',
              link: response.data.launcher_icon,
              // status: false,
            });
          } else {
            response?.data?.default_launcher_icon.map((data, index) => {
              if (data.status) {
                setImgUrlPath({
                  id: index + 1,
                  link: data.link,
                });
              }
            });
          }
        }
      })
      .catch((error) => {
        // toast.error('Something went wrong');
      });
  };

  const getScriptCode = (token) => {
    getWithToken('Copy_WidgetAPI/', token)
      .then((response) => {
        const textToCopy = `<script src="${response.data.js_script_file}"></script>
      <script src="http://webapi.chirpflo.com/media/logo/Widget.js"></script>`;
        setWidgetCode(textToCopy);
      })
      .catch((error) => {
        // toast.error('Something went wrong');
      });
  };

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      getWidgetDetails(JSON.parse(token));
      setApiTokenData(JSON.parse(token));
      getScriptCode(JSON.parse(token));
    }
  }, []);

  const LauncherIconChange = (image, index) => {
    setStatus(false);
    const updatedIcons = default_launcher_icon.map((icon, i) => {
      if (i === index) {
        return {
          ...icon,
          status: true,
        };
      } else {
        return {
          ...icon,
          status: false,
        };
      }
    });
    setWidgetValues((prevValues) => ({
      ...prevValues,
      default_launcher_icon: updatedIcons,
    }));

    setImgUrlPath({
      id: index + 1,
      link: image.link,
      status: updatedIcons[index].status,
    });
  };

  const UpdateChatBotData = async (e, keyName) => {
    e.preventDefault();

    let fd = new FormData();
    fd.append('default_launcher_icon', imgUrlPath?.id);
    fd.append('name', chat_name);
    fd.append('heading', heading);
    fd.append('sub_heading', sub_heading);
    fd.append('status', keyName === 'chat_status' ? !chat_status : chat_status);
    fd.append('color', color);
    fd.append('popup_status', keyName === 'popup_status' ? !popup_status : popup_status);
    fd.append('timer_count', timer_count);
    fd.append('background_color', background_color);
    fd.append('client_bubble_color', client_bubble_color);

    patchAvtarWithToken('Webchat_widgetAPI/', apiTokenData, fd)
      .then((response) => {
        if (response.status === 200) {
          toast.dismiss();
          toast.success(response.message);
          getWidgetDetails(apiTokenData);
          scriptCode(apiTokenData);
        } else if (response.status === 400) {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        toast.error('An error occurred while updating chat bot data');
      });
  };

  const scriptCode = () => {
    const JS_Payload = {
      js: `const id='${widgetValues.id}';`,
    };

    patchWithToken('Copy_WidgetAPI/', apiTokenData, JS_Payload)
      .then((response) => {
        if (response.status == 200) {
          const textToCopy = `<script src="${response.data.js_script_file}"></script>
<script src="http://webapi.chirpflo.com/media/logo/Widget.js"></script>`;
          setWidgetCode(textToCopy);
        }
      })
      .catch((error) => {});
  };

  const handleCopyText = () => {
    const tempInput = document.createElement('textarea');
    tempInput.value = widgetCode;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    setCopySuccess(true);
    setTimeout(function () {
      setCopySuccess(false);
    }, 2000);
  };

  const handleNavigatePreview = () => {
    setPreviewData(true);

    const data = {
      id: widgetValues.id,
      previewData: true,
    };

    const url = '/preview';
    const params = new URLSearchParams(data);
    const fullUrl = `${url}?${params.toString()}`;

    const newWindow = window.open(fullUrl, '_blank');
    if (newWindow) {
      newWindow.opener = null; // Prevent the new window from having access to the opener
    }
  };

  const handleBgDelete = async () => {
    try {
      const response = await deleteWithToken('Widget_bg_ColorAPI/', apiTokenData);
      if (response.status === 200) {
        setBgPopup(false);
        toast.success(response.message);
        getWidgetDetails(apiTokenData);
        setBgPreview('');
      } else if (response.status === 400) {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [editLeadPopup, setEditLeadPopup] = useState(false);
  const [editLeadClosingPopup, setEditLeadClosingPopup] = useState(false);
  const [informationValues, setInformationValues] = useState({
    id: '',
    welcome_lead_message: '',
    lead_status: false,
    positive_lead_choice: '',
    continue_lead_choice: '',
    closing_lead_message: '',
    positive_lead_closing_choice: '',
    continue_lead_closing_choice: '',
  });
  const { id, welcome_lead_message, lead_status, positive_lead_choice, continue_lead_choice, closing_lead_message, positive_lead_closing_choice, continue_lead_closing_choice } =
    informationValues;

  const informationHndleChange = (e) => {
    const { name, checked, value } = e.target;
    if (name === 'lead_status') {
      setInformationValues({ ...informationValues, [name]: checked });
    } else {
      setInformationValues({ ...informationValues, [name]: value || null });
    }
  };

  const getInformationValues = (token) => {
    getWithToken('LeadsAPI', token)
      .then((response) => {
        if (response.status == 200) {
          const leadInformationQuestions = response?.data?.lead_information?.map((question) => {
            return {
              id: question.id,
              question: question.question,
              lead_info_status: question.lead_info_status,
              isQuestionEditable: question.isQuestionEditable,
              filedName: question.filedName,
            };
          });
          setQuestions(leadInformationQuestions);
          setInformationValues({
            ...informationValues,
            id: response?.data?.id,
            welcome_lead_message: response?.data?.welcome_lead_message,
            lead_status: response?.data?.lead_status,
            positive_lead_choice: response?.data?.positive_lead_choice,
            continue_lead_choice: response?.data?.continue_lead_choice,
            closing_lead_message: response?.data?.closing_lead_message,
            positive_lead_closing_choice: response?.data?.positive_lead_closing_choice,
            continue_lead_closing_choice: response?.data?.continue_lead_closing_choice,
          });
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        // toast.error('Something went wrong');
      });
  };
  const handleInformationSubmit = (e) => {
    e.preventDefault();
    let body = {
      welcome_lead_message: welcome_lead_message,
      lead_status: lead_status || false,
      positive_lead_choice: positive_lead_choice || 'Yes',
      continue_lead_choice: continue_lead_choice || 'I have a few questions first',
      closing_lead_message: closing_lead_message,
      positive_lead_closing_choice: positive_lead_closing_choice || "That's All",
      continue_lead_closing_choice: continue_lead_closing_choice || 'I have 1 more question',
    };
    setInformationValues('');
    setLoader(true);

    if (informationValues?.id) {
      patchWithToken('LeadsAPI', apiTokenData, body)
        .then((response) => {
          if (response.status == 200) {
            getInformationValues(apiTokenData);
            setLoader(false);
            toast.dismiss();
            toast.success(response.message);
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
      postWithToken('LeadsAPI', apiTokenData, body)
        .then((response) => {
          if (response.status == 200) {
            getInformationValues(apiTokenData);
            setLoader(false);
            toast.dismiss();
            toast.success(response.message);
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
    }
  };
  const [questions, setQuestions] = useState([{ id: 1, question: '', lead_info_status: false, isQuestionEditable: false }]);
  const addQuestion = () => {
    const newQuestion = {
      question: '',
      lead_info_status: false,
      isQuestionEditable: false,
    };

    postWithToken('Lead_Infos_API', apiTokenData, newQuestion)
      .then((response) => {
        if (response.status === 200) {
          getInformationValues(apiTokenData);
          setLoader(false);
        } else if (response.status === 400) {
          toast.error(response.message);
          setLoader(false);
        } else if (response.code === 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  var deboounce = null;
  const handleQuestionChange = (e, id) => {
    if (deboounce != null) {
      clearTimeout(deboounce);
    }

    deboounce = setTimeout(
      (e, id) => {
        const body = {
          question: e.target.value,
          lead_info_status: questions?.lead_info_status,
        };

        patchWithToken(`Lead_Infos_API/${id}`, apiTokenData, body)
          .then((response) => {
            if (response.status === 200) {
              getInformationValues(apiTokenData);
            } else if (response.status === 400) {
              toast.error(response.message);
            } else if (response.code === 'token_not_valid') {
              clearLocalStorage();
            }
          })
          .catch((error) => {
            toast.error(error);
          });
      },
      500,
      e,
      id
    );
  };

  const handleAddQuestion = (id) => {
    const updatedQuestions = [...questions];
    const questionIndex = updatedQuestions.findIndex((q) => q.id === id);

    if (questionIndex !== -1) {
      const updatedQuestion = { ...updatedQuestions[questionIndex] };
      updatedQuestion.lead_info_status = !updatedQuestion.lead_info_status;
      updatedQuestions[questionIndex] = updatedQuestion;

      const body = {
        question: updatedQuestion.question,
        lead_info_status: updatedQuestion.lead_info_status,
      };

      patchWithToken(`Lead_Infos_API/${id}`, apiTokenData, body)
        .then((response) => {
          if (response.status === 200) {
            setQuestions(updatedQuestions);
            setLoader(false);
          }
        })
        .catch((error) => {
          setLoader(false);
        });
    }
  };

  const handleQuestionDelete = (id) => {
    deleteWithToken(`Lead_Infos_API/${id}`, apiTokenData)
      .then((response) => {
        if (response.status == 200) {
          setLoader(false);
          getInformationValues(apiTokenData);
          toast.success(response.message);
        } else if (response.code == 'token_not_valid') {
          setLoader(false);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
        setLoader(false);
      });
  };
  const handleOrderList = (Data) => {
    Data.map((obj, index) => {
      const body = {
        order_id: index + 1,
      };
      patchWithToken(`Lead_Infos_API/${obj?.id}`, apiTokenData, body)
        .then((response) => {
          if (response.status === 200) {
            setLoader(false);
            getInformationValues(apiTokenData);
          }
        })
        .catch((error) => {
          setLoader(false);
        });
    });
  };
  return (
    <>
      <div className='intelichat-conatiner-right'>
        <div className='chatbot-container'>
          <div className='chatbot-fixed header-responsive'>
            <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between'>
              <div className=''>
                <h3 className='opensans-bold mb-0 text-white'>Bot Profile</h3>
              </div>
              <div className='d-flex justify-content-end responsive-header-width'>
                <Header />
              </div>
            </div>
          </div>
          <div className='row m-0 mt-5 ps-md-5 ps-sm-3 ps-3 mb-5'>
            <div className='col-xxl-8 col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12 p-0'>
              <form
                onSubmit={onFormSubmit}
                // onBlur={handleBlur}
              >
                <div className='chatbox-field bg-themeLightBlue'>
                  <div className='mb-5'>
                    <h1 className='text-skyBlue opensans-bold'>Hey, {FullName}</h1>
                    <p className='mb-0 br-regular text-white font16 mx-content'>
                      This is where all the excitement happens. This is where we can fine tune our agents learn our business with Mind Blowing accuracy.
                    </p>
                  </div>
                  <div className='chatbox-input-text d-unset input-GPT new'>
                    <label className='opensans-medium'>Bot Name*</label>
                    <div className='chatbox-input-field'>
                      <input
                        type='text'
                        placeholder='Bot Name'
                        className='form-control chatbox-input'
                        id='bot_name'
                        name='bot_name'
                        value={bot_name}
                        autoComplete='off'
                        onChange={handleChange}
                      />
                      <div className='chat-error'>{errors.bot_name && <p className='text-danger insta-smart-error'>{errors.bot_name}</p>}</div>
                    </div>
                  </div>

                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Role</label>
                    <div className='chatbox-input-field'>
                      <select className='form-control' name='role' value={role} onChange={handleChange}>
                        <option selected hidden>
                          Choose the Role
                        </option>
                        {ROLES.map((row, i) => (
                          <option key={i}>{row?.name}</option>
                        ))}
                      </select>
                      {/* <div className='chat-error'>{errors.role && <p className='text-danger insta-smart-error'>{errors.role}</p>}</div> */}
                    </div>
                  </div>

                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Tone*</label>
                    <div className='chatbox-input-field'>
                      <select className='form-control' name='tone' value={tone} onChange={handleChange}>
                        <option selected hidden>
                          Choose the Tone
                        </option>
                        {TONES.map((row, i) => (
                          <option key={i}>{row?.name}</option>
                        ))}
                      </select>
                      <div className='chat-error'>{errors.tone && <p className='text-danger insta-smart-error'>{errors.tone}</p>}</div>
                    </div>
                  </div>
                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Welcome Message</label>
                    <div className='chatbox-input-field'>
                      <textarea
                        rows='3'
                        className='form-control chatbox-input h-25'
                        placeholder='Message'
                        id='welcome_msg'
                        name='welcome_msg'
                        value={welcome_msg}
                        autoComplete='off'
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className='my-5'>
                    <button className='btn btn-submit-login rounded opensans-bold' onClick={handleSubmit}>
                      Train Agent
                    </button>
                  </div>
                </div>
              </form>
              <div className='chatbox-field bg-themeLightBlue mt-3'>
                <div>
                  <div className='py-5'>
                    <h3 className='opensans-bold mb-0 text-white'>Information For Bot To Gather</h3>
                  </div>

                  {/* <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Call To Action</label>
                    <div className='chatbox-input-field'>
                      <textarea
                        rows='3'
                        className='form-control chatbox-input h-25'
                        placeholder='Message'
                        id=''
                        name='call_to_actions'
                        value={call_to_actions}
                        autoComplete='off'
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className='toogle-body col-md-5 col-sm-12 col-12'>
                    <div className='chatbox-input-slider input-GPT new'>
                      <label className='opensans-medium'>Name</label>
                      <div className='switch-background ms-3'>
                        <label className='switch'>
                          <input type='checkbox' id='' name='name' checked={values.name} onChange={() => handleSubmit('name')} />
                          <span className='slider round'></span>
                        </label>
                      </div>
                    </div>
                    <div className='chatbox-input-slider input-GPT new'>
                      <label className='opensans-medium'>Email</label>
                      <div className='switch-background ms-3'>
                        <label className='switch'>
                          <input type='checkbox' id='' name='email_address' checked={values.email_address} onChange={() => handleSubmit('email_address')} />
                          <span className='slider round'></span>
                        </label>
                      </div>
                    </div>
                    <div className='chatbox-input-slider input-GPT new'>
                      <label className='opensans-medium'>Phone</label>
                      <div className='switch-background ms-3'>
                        <label className='switch'>
                          <input type='checkbox' id='' name='phone_number' checked={values.phone_number} onChange={() => handleSubmit('phone_number')} />
                          <span className='slider round'></span>
                        </label>
                      </div>
                    </div>
                  </div> */}
                  <div className='toogle-body col-md-5 col-sm-12 col-12'>
                    <div className='chatbox-input-slider input-GPT new'>
                      <h5 className='opensans-medium text-white'>Welcome Message For Lead</h5>
                      <div className='switch-background ms-3'>
                        <label className='switch'>
                          <input type='checkbox' id='' name='lead_status' checked={informationValues.lead_status} onChange={informationHndleChange} />
                          <span className='slider round'></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className='toogle-body col-md-9 col-sm-12 col-12'>
                    <div className='chatbox-input-text input-GPT new'>
                      <div className='chatbox-input-field'>
                        <textarea
                          rows='5'
                          className='form-control chatbox-input h-50'
                          placeholder='Welcome Message'
                          id='welcome_lead_message'
                          name='welcome_lead_message'
                          value={welcome_lead_message}
                          autoComplete='off'
                          onChange={informationHndleChange}
                        ></textarea>
                      </div>
                    </div>
                    <div className='d-flex align-items-center'>
                      <button className='btn btn-submit-login rounded bg-themePurple border-themePurple me-3'>{positive_lead_choice || 'Yes'}</button>
                      <button className='btn btn-submit-login rounded bg-themePurple border-themePurple'>{continue_lead_choice || 'I have a few questions first'}</button>
                      <div className='knowledge-pair-icon '>
                        <button className='btn' type='button' onClick={() => setEditLeadPopup(true)}>
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                    {informationValues?.id != '' && (
                      <>
                        <div className='chatbox-input-text d-unset input-GPT new mt-5'>
                          <h5 className='opensans-medium text-white pb-3'>Lead Information</h5>
                          {/* {questions.map((obj, index) => (
                        <div className='d-flex align-items-center my-3' key={obj.id}>
                          <div className='attach-icon me-4 cursor-pointer' onClick={() => handleQuestionDelete(obj.id)}>
                            <AiFillCloseSquare className='text-danger' />   
                          </div>
                          <div className='chatbox-input-field col-'>
                            <input
                              type='text'
                              placeholder='John'
                              className='form-control chatbox-input'
                              name={`question-${obj.id}`}
                              // value={obj.question}
                              defaultValue={obj.question}
                              onChange={(e) => handleQuestionChange(e, obj.id)}
                              autoComplete='off'
                            />
                          </div>
                          <div className='switch-background ms-3'>
                            <label className='switch'>
                              <input type='checkbox' id={`slider-${obj.id}`} name={`slider-${obj.id}`} checked={obj.lead_info_status} onChange={() => handleAddQuestion(obj.id)} />
                              <span className='slider round'></span>
                            </label>
                          </div>
                        </div>
                        ))} */}

                          <div className='d-flex align-items-center'>
                            <div className='align-items-center col-lg-12'>
                              {questions.map((obj, index) => (
                                <div className='d-flex align-items-center my-3' key={obj.id}>
                                  <div className='attach-icon me-4 cursor-pointer' onClick={() => handleQuestionDelete(obj.id)}>
                                    <AiFillCloseSquare className='text-danger' />
                                  </div>
                                  <div className='chatbox-input-field position-relative'>
                                    <input
                                      type='text'
                                      placeholder='Add Question'
                                      className='form-control chatbox-input'
                                      name={`question-${obj.id}`}
                                      // value={obj.question}
                                      defaultValue={obj.question}
                                      onChange={(e) => handleQuestionChange(e, obj.id)}
                                      autoComplete='off'
                                    />
                                    {obj?.filedName != null && <span className='field-name opensans-regular'>{obj?.filedName}</span>}
                                  </div>
                                  <div className='switch-background ms-3'>
                                    <label className='switch'>
                                      <input
                                        type='checkbox'
                                        id={`slider-${obj.id}`}
                                        name={`slider-${obj.id}`}
                                        checked={obj.lead_info_status}
                                        onChange={() => handleAddQuestion(obj.id)}
                                      />
                                      <span className='slider round'></span>
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className='align-items-center movable-dot-position'>
                              <List
                                values={questions}
                                onChange={({ oldIndex, newIndex }) => handleOrderList(arrayMove(questions, oldIndex, newIndex))}
                                renderList={({ children, props, isDragged }) => <div {...props}>{children}</div>}
                                renderItem={({ value: question, props, isDragged, isSelected }) => (
                                  <div
                                    {...props}
                                    style={{
                                      ...props.style,
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '10px',
                                      color: '#EEE',
                                      // backgroundColor: isDragged || isSelected ? "#EEE" : ""
                                    }}
                                  >
                                    <div className='align-items-center attach-icon me-4 cursor-pointer'>
                                      <img src={DotsSixDotted} alt='bell-icon' />
                                    </div>
                                    {/* <div className="chatbox-input-field">
                                <input
                                  type="hidden"
                                  placeholder='John'
                                  className='form-control chatbox-input'
                                  name={`question-${question.id}`}
                                  // value={obj.question}
                                  defaultValue={question.question}
                                  onChange={(e) => handleQuestionChange(e, question.id)}
                                  autoComplete='off'
                                />
                              </div> */}
                                  </div>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className='my-5'>
                          <button className='btn btn-submit-login bg-primary border-primary rounded opensans-bold' onClick={addQuestion}>
                            Add Question
                          </button>
                        </div>
                      </>
                    )}
                    <div className='chatbox-input-text d-unset input-GPT new mt-5'>
                      <h5 className='opensans-medium text-white pb-3'>Closing Message</h5>
                      <div className='chatbox-input-text input-GPT new'>
                        <div className='chatbox-input-field'>
                          <textarea
                            rows='5'
                            className='form-control chatbox-input h-50'
                            placeholder='Closing Message'
                            id='closing_lead_message'
                            name='closing_lead_message'
                            value={closing_lead_message}
                            autoComplete='off'
                            onChange={informationHndleChange}
                          ></textarea>
                        </div>
                      </div>
                      <div className='d-flex align-items-center'>
                        <button className='btn btn-submit-login rounded bg-themePurple border-themePurple me-3'>{positive_lead_closing_choice || "That's All"}</button>
                        <button className='btn btn-submit-login rounded bg-themePurple border-themePurple'>{continue_lead_closing_choice || 'I have 1 more question'}</button>
                        <div className='knowledge-pair-icon '>
                          <button className='btn' type='button' onClick={() => setEditLeadClosingPopup(true)}>
                            <FaEdit />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='my-5'>
                  <button className='btn btn-submit-login rounded opensans-bold' onClick={handleInformationSubmit}>
                    Save
                  </button>
                </div>
                {/* <div className='my-5'>
                  <button className='btn btn-submit-login rounded opensans-bold' onClick={handleSubmit}>
                    Train Agent
                  </button>
                </div> */}
              </div>
              <div className='chatbox-field bg-themeLightBlue mt-3'>
                <div className='py-5'>
                  <h3 className='opensans-bold mb-0 text-white'>Customized Your Chatbot</h3>
                </div>
                <div className='chatbox-input-text d-flex align-items-center justify-content-between input-GPT new mb-5'>
                  <label className='opensans-medium'>Available On/Off</label>
                  <div className='chatbox-input-field'>
                    <div className='switch-background '>
                      <label className='switch'>
                        <input type='checkbox' id='' name='chat_status' checked={widgetValues.chat_status} onChange={(e) => UpdateChatBotData(e, 'chat_status')} />
                        <span className='slider round'></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className='chatbox-input-text align-items-start input-GPT new mb-5'>
                  <div className='chatbox-input-field d-flex align-items-center'>
                    <div className='profile-pic-wrapper'>
                      <div className='pic-holder'>
                        {avatarPreview ? <img id='profilePic' className='pic' src={avatarPreview} /> : <img id='profilePic' className='pic' src={chatbot_avtar} />}

                        <input
                          className='uploadProfileInput'
                          type='file'
                          name='chatbot_avtar'
                          id='newProfilePhoto'
                          accept='image/*'
                          style={{ opacity: '0', position: 'absolute' }}
                          onChange={userHandleChange}
                        />
                        <label htmlFor='newProfilePhoto' className='upload-file-block'>
                          <div className='text-center'>
                            <div className='mb-2'>
                              <i className='fa fa-camera fa-2x'></i>
                            </div>
                            <div className=''>
                              Upload <br /> Profile Photo <br />
                              150px X 150px
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    {/* <button className='btn btn-submit-login rounded-pill ms-md-5 ms-0 mt-lg-0' disabled={!disable} onClick={avtarSubmit}>
                      Upload
                    </button> */}
                  </div>
                </div>
                <div className='chatbox-input-text input-GPT new mb-5'>
                  <label className='opensans-medium'>Name</label>
                  <div className='chatbox-input-field'>
                    <input
                      type='text'
                      placeholder='Name'
                      className='form-control chatbox-input'
                      name='chat_name'
                      value={chat_name}
                      autoComplete='off'
                      onChange={userHandleChange}
                    />
                  </div>
                </div>
                <div className='chatbox-input-text input-GPT new mb-5'>
                  <label className='opensans-medium'>Heading</label>
                  <div className='chatbox-input-field'>
                    <input type='text' placeholder='Heading' className='form-control chatbox-input' name='heading' value={heading} autoComplete='off' onChange={userHandleChange} />
                  </div>
                </div>
                <div className='chatbox-input-text input-GPT new mb-5'>
                  <label className='opensans-medium'>Sub Heading</label>
                  <div className='chatbox-input-field'>
                    <input
                      type='text'
                      placeholder='Sub Heading'
                      className='form-control chatbox-input'
                      name='sub_heading'
                      value={sub_heading}
                      autoComplete='off'
                      onChange={userHandleChange}
                    />
                  </div>
                </div>
                <div className='chatbox-input-text d-flex align-items-center justify-content-between input-GPT new mb-5'>
                  <label className='opensans-medium'>Popup</label>
                  <div className='chatbox-input-field'>
                    <div className='switch-background '>
                      <label className='switch'>
                        <input type='checkbox' id='' name='popup_status' checked={widgetValues.popup_status} onChange={(e) => UpdateChatBotData(e, 'popup_status')} />
                        <span className='slider round'></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className='chatbox-input-text input-GPT new mb-5'>
                  <label className='opensans-medium'>Timer Count</label>
                  <div className='chatbox-input-field'>
                    <input
                      type='number'
                      placeholder='000'
                      className='form-control chatbox-input counter-input'
                      name='timer_count'
                      value={timer_count}
                      autoComplete='off'
                      onChange={userHandleChange}
                      disabled={!popup_status}
                      min='0'
                    />
                  </div>
                </div>
                <div className='d-flex flex-wrap'>
                  <div className='chatbox-input-text input-GPT new mb-5'>
                    <label className='opensans-medium'>Header & Bubble</label>
                    <div className='chatbox-input-field'>
                      <input type='color' name='color' className='' value={color} autoComplete='off' onChange={userHandleChange} />
                    </div>
                  </div>
                  <div className='chatbox-input-text input-GPT new mb-5 mx-md-5 mx-0'>
                    <label className='opensans-medium'>Background</label>
                    <div className='chatbox-input-field'>
                      <input type='color' name='background_color' className='' value={background_color} autoComplete='off' onChange={userHandleChange} />
                    </div>
                  </div>
                  <div className='chatbox-input-text input-GPT new mb-5'>
                    <label className='opensans-medium'>Client Bubble</label>
                    <div className='chatbox-input-field'>
                      <input type='color' name='client_bubble_color' className='' value={client_bubble_color} autoComplete='off' onChange={userHandleChange} />
                    </div>
                  </div>
                </div>
                <div className='profile-pic-wrapper background-image d-flex align-items-center py-5'>
                  <label className='opensans-medium text-white me-5'>Background Image</label>
                  <div className='pic-holder'>
                    {bgPreview ? <img id='profilePic' className='pic' src={bgPreview} /> : <img id='profilePic' className='pic' src={bg_chatbot} />}

                    <input
                      className='uploadProfileInput'
                      type='file'
                      name='bg_chatbot'
                      id='newBackgroundImage'
                      accept='image/*'
                      style={{ opacity: '0', position: 'absolute' }}
                      onChange={userBgImageChange}
                    />
                    {bg_chatbot != null && (
                      <span className='bg-close' onClick={() => setBgPopup(true)}>
                        <RiCloseCircleLine />
                      </span>
                    )}
                    <label htmlFor='newBackgroundImage' className='upload-file-block'>
                      <div className=''>
                        Upload <br /> Image
                      </div>
                    </label>
                  </div>
                </div>
                <div className='chatbox-input-text input-GPT align-items-start new mb-3'>
                  <label className='opensans-medium'>Launcher Icon</label>
                  <div className='chatbox-input-field'>
                    <div className=' d-flex flex-wrap align-items-center'>
                      {default_launcher_icon.length > 0 &&
                        default_launcher_icon?.map((image, index) => (
                          <div key={index} className={`chatboxupdate-logo me-3 ${image.status ? 'active' : ''}`} onClick={() => LauncherIconChange(image, index)}>
                            <img src={image.link} alt='chatbox-logo' />
                          </div>
                        ))}
                    </div>
                    <div className='d-flex flex-wrap align-items-center mt-4'>
                      <p className='opensans-bold text-white mb-0 me-3'>Or</p>
                      {widgetValues?.launcher_icon?.length > 0 && (
                        <div className={`chatboxupdate-logo me-3 ${widgetValues.launcher_icon_status ? 'active' : ''}`}>
                          <img src={launcher_icon} alt='chatbox-logo' className='launcher-icon' />
                        </div>
                      )}
                      <div className='launcher-upload-button'>
                        <input type='file' id='fileInput' onChange={(e) => launcherIconHandleChange(e)} />
                        <label for='fileInput'>
                          <FaUser className='me-2' />
                          Upload your own launcher icon ( up to 60px X 60px )
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='d-flex flex-wrap align-items-center py-5'>
                  <button className='btn btn-submit-login rounded-4 mt-lg-0' onClick={UpdateChatBotData}>
                    Save
                  </button>
                  <button className='btn  btn-submit-copy rounded-4 ms-md-2 ms-0 my-md-0 my-3' type='button' onClick={() => handleNavigatePreview()}>
                    Preview
                  </button>
                </div>
                <div className='py-5'>
                  <h3 className='opensans-bold mb-0 color-theme-blue '>Chirpflo Widget Instructions</h3>
                  {widgetCode != '' && (
                    <div className='chatbox-input-text input-GPT new mt-3'>
                      <label className='opensans-medium'></label>
                      <div className='chatbox-input-field'>
                        <div className='input-group mb-3'>
                          <textarea
                            type='text'
                            className='form-control chatbox-input'
                            placeholder="Recipient's username"
                            aria-label="Recipient's username"
                            aria-describedby='basic-addon2'
                            value={widgetCode}
                            style={{ height: '60px' }}
                            disabled
                          />
                          <span className='input-group-text px-4 cursor-pointer' id='basic-addon2' onClick={handleCopyText}>
                            {!copySuccess ? <MdContentCopy /> : <AiOutlineCheck />}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className=''>
                    <p className='opensans-regular m-0 text-white pt-2'>
                      To seamlessly integrate chirpflo with your website, please refer to the instructions below for integrating the code with the appropriate location on your
                      site.
                    </p>
                  </div>
                  <div className='my-3 '>
                    <h4 className='guide-subheading text-white opensans-bold'>Please begin by following these basic steps:</h4>
                  </div>
                  <p className='opensans-regular mb-3 text-white'>Follow the provided instructions to customize your Chatbot and complete all the necessary processes.</p>
                  <div className='chirpflo-widget'>
                    <ul>
                      <li>Click the "save button" to generate the widget script and copy the code provided.</li>
                      <li>Once the steps are completed, preview any updates or modifications by clicking the preview button.</li>
                      <li>Please note that some websites may not display the preview correctly.</li>
                      <li>Navigate to your website and open the HTML file using a text editor.</li>
                      <li>{instruction}</li>
                      <li>Refresh your website, and you should now see the Chatbot visible, usually appearing as a symbol or icon in the bottom right corner of the webpage.</li>
                    </ul>
                  </div>
                  <div className='my-3'>
                    <h4 className='guide-subheading text-white opensans-bold'>IMPORTANT NOTE :</h4>
                  </div>
                  <div className='my-3'>
                    <p className='opensans-regular m-0 text-white'>
                      It is important to note that modifying your website's code, partilarly if you are not familiar with the code, can cause issues with your website. Be sure to
                      test the changes and make a backup of your website before making any code modifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <EditChatBox passChildData={handleChildData} ref={concernedElementRef} handleBlurClick={handleBlurClick} />
            </div>
          </div>
        </div>
      </div>
      {loader && (
        <div className='loader-center'>
          <Loader />
        </div>
      )}

      {blurPopup && (
        <div className='custom-popup'>
          <div className='popup-content'>
            <div className={'popup-head text-center'}>
              <h4>Train Agent Again</h4>
            </div>
            <hr />
            <div className='popup-footer text-center'>
              <button
                className='btn danger-btn mx-1 text-capitalize'
                data-dismiss='modal'
                onClick={() => {
                  setBlurPopup(false);
                  setBlurChange(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {bgPopup && (
        <div className='custom-popup'>
          <div className='popup-content'>
            <h4 className='opensans-bold'>Are you sure you want to delete?</h4>
            <hr />
            <div className={'popup-head'}>
              <p className='opensans-regular'> </p>
            </div>
            <hr />
            <div className='popup-footer'>
              <button className='btn success-btn mx-1 text-capitalize' onClick={() => handleBgDelete()}>
                Delete
              </button>
              <button className='btn danger-btn mx-1 text-capitalize' data-dismiss='modal' onClick={() => setBgPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {editLeadPopup && (
        <div className='custom-popup'>
          <div className='popup-content'>
            {/* <h4 className='opensans-bold'>Are you sure you want to delete?</h4> */}
            {/* <hr /> */}
            <div className={'popup-head chatbox-field'}>
              <div className='chatbox-input-text input-GPT new mb-5'>
                <label className='opensans-medium text-white'>Positive Lead Choice</label>
                <div className='chatbox-input-field w-100'>
                  <input
                    type='text'
                    placeholder='Lead choice'
                    className='form-control chatbox-input'
                    name='positive_lead_choice'
                    value={positive_lead_choice}
                    maxLength={30}
                    autoComplete='off'
                    onChange={informationHndleChange}
                  />
                </div>
              </div>
              <div className='chatbox-input-text input-GPT new mb-5'>
                <label className='opensans-medium text-white'>Continue Lead Choice</label>
                <div className='chatbox-input-field  w-100'>
                  <input
                    type='text'
                    placeholder='Lead choice'
                    className='form-control chatbox-input'
                    name='continue_lead_choice'
                    value={continue_lead_choice}
                    maxLength={30}
                    autoComplete='off'
                    onChange={informationHndleChange}
                  />
                </div>
              </div>
            </div>
            <div className='popup-footer'>
              <button className='btn bg-primary mx-1 text-white' onClick={() => setEditLeadPopup(false)}>
                Save
              </button>
              {/* <button className='btn danger-btn mx-1 text-capitalize' data-dismiss='modal' onClick={() => setEditPopup(false)}>
                Cancel
              </button> */}
            </div>
          </div>
        </div>
      )}
      {editLeadClosingPopup && (
        <div className='custom-popup'>
          <div className='popup-content'>
            {/* <h4 className='opensans-bold'>Are you sure you want to delete?</h4> */}
            {/* <hr /> */}
            <div className={'popup-head chatbox-field'}>
              <div className='chatbox-input-text input-GPT new mb-5'>
                <label className='opensans-medium text-white'>Lead Closing Choice</label>
                <div className='chatbox-input-field w-100'>
                  <input
                    type='text'
                    placeholder='Lead choice'
                    className='form-control chatbox-input'
                    name='positive_lead_closing_choice'
                    value={positive_lead_closing_choice}
                    maxLength={30}
                    autoComplete='off'
                    onChange={informationHndleChange}
                  />
                </div>
              </div>
              <div className='chatbox-input-text input-GPT new mb-5'>
                <label className='opensans-medium text-white'>Continue Chat Choice</label>
                <div className='chatbox-input-field  w-100'>
                  <input
                    type='text'
                    placeholder='Lead choice'
                    className='form-control chatbox-input'
                    name='continue_lead_closing_choice'
                    value={continue_lead_closing_choice}
                    maxLength={30}
                    autoComplete='off'
                    onChange={informationHndleChange}
                  />
                </div>
              </div>
            </div>
            <div className='popup-footer'>
              <button className='btn bg-primary mx-1 text-white' onClick={() => setEditLeadClosingPopup(false)}>
                Save
              </button>
              {/* <button className='btn danger-btn mx-1 text-capitalize' data-dismiss='modal' onClick={() => setEditPopup(false)}>
                Cancel
              </button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KnowledgeBaseSetMessage;
