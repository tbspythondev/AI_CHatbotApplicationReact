import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import '../assets/styles/Chatbot.css';
import COUNTRYLIST from '../Country_Nationality_List.json';
import { clearLocalStorage, getLocalStorage, getWithToken, patchWithToken, postWithToken, removeClassToBody } from '../API/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import ChatBox from '../components/ChatBox';
import Header from '../components/Header';
import EditChatBox from '../components/EditChatBox';

const ValidationErrors = {
  empty: {
    company: 'Company name required',
    country: 'Country name required',
    city: 'City name required',
    address: 'Address required',
    // product: 'Product name required',
    // product_price: 'Price required',
    // website: 'Website required',
    // about_company: 'About Company required',
    // booking_link: 'Booking Link required',
  },
};

const ChatBotProfile = () => {
  const [loader, setLoader] = useState(false);

  const Navigate = useNavigate();
  const [companyValues, companySetValues] = useState({
    company: '',
    country: '',
    city: '',
    address: '',
    product_price: '',
    website: '',
    about_company: '',
    booking_link: '',
  });

  const [errors, setErrors] = useState({
    company: '',
    country: '',
    city: '',
    address: '',
    // product: '',
    // product_price: '',
    // website: '',
    // about_company: '',
    // booking_link: '',
  });

  const { company, country, city, address, website, booking_link, product_price, about_company } = companyValues;

  const [apiTokenData, setApiTokenData] = useState('');
  const [botId, setBotId] = useState('');
  const [chatbotUrl, setChatbotUrl] = useState('');
  const [childData, setChildData] = useState(false);
  const [blurPopup, setBlurPopup] = useState(false);
  const [blurChange, setBlurChange] = useState(false);
  const [widgetID, setWidgetID] = useState('');

  const FullName = JSON.parse(getLocalStorage('FullName'));

  const concernedElementRef = useRef(null);

  // const bottomRef = useRef(null);

  const companyHandleChange = (e) => {
    companySetValues({ ...companyValues, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
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
    removeClassToBody('no-chat');
    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
      getWidgetDetails(JSON.parse(token));
      getBotDetails(JSON.parse(token));
    } else {
      Navigate('/login');
    }
  }, []);

  const getBotDetails = (token) => {
    setLoader(true);
    getWithToken('company/', token)
      .then((response) => {
        if (response.status == 201) {
          setBotId(response?.data?.id);
          companySetValues({
            ...companyValues,
            company: response?.data?.company,
            country: response?.data?.country,
            city: response?.data?.city,
            address: response?.data?.address,
            product_price: response?.data?.product_price,
            website: response?.data?.website,
            about_company: response?.data?.about_company,
            booking_link: response?.data?.booking_link,
          });
          setChatbotUrl(response?.data?.CHATBOT_URL);
          setLoader(false);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
        if (response.status == 200) {
          setLoader(false);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const companyHandleClick = () => {
    const tempErrors = { ...errors };
    Object.keys(companyValues).map((key) => {
      if (!companyValues[key]) {
        tempErrors[key] = ValidationErrors.empty[key];
      }
    });
    setErrors(tempErrors);

    if (Object.values(tempErrors).filter((obj) => !!obj).length > 0) {
      return false;
    }
    setLoader(true);

    if (botId) {
      patchWithToken('company/' + botId + '/', apiTokenData, companyValues)
        .then((response) => {
          if (response.status == 200) {
            getBotDetails(apiTokenData);
            toast.success(response.message);
            setLoader(false);
            setBlurChange(false);
          } else if (response.status == 400) {
            setLoader(false);
            toast.error(response.message);
          }
        })
        .catch((error) => {
          toast.error('Something went wrong');
          setLoader(false);
        });
    } else {
      postWithToken('company/', apiTokenData, companyValues)
        .then((response) => {
          if (response.status == 201) {
            getBotDetails(apiTokenData);
            toast.success(response.message);
            setLoader(false);
          } else if (response.status == 400) {
            setLoader(false);
            toast.error(response.message);
          } else if (response.code == 'token_not_valid') {
            clearLocalStorage();
          }
        })
        .catch((error) => {
          setLoader(false);
          toast.error('Something went wrong');
        });
    }
  };
  const onFormSubmit = (e) => {
    e.preventDefault();
    // send state to server with e.g. `window.fetch`
  };

  const [copySuccess, setCopySuccess] = useState('');
  const textArea = useRef(null);

  const copyToClipboard = async (e) => {
    var range = document.createRange();
    range.selectNode(document.getElementById('copy-text'));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    setCopySuccess('Copied!');
    setTimeout(function () {
      setCopySuccess('Copy Test Link');
    }, 1000);
  };

  const getWidgetDetails = (token) => {
    getWithToken('Webchat_widgetAPI/', token)
      .then((response) => {
        if (response.status === 200) {
          setWidgetID(response?.data?.id);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  return (
    <>
      <div className='intelichat-conatiner-right'>
        <div className='chatbot-container'>
          <div className='chatbot-fixed header-responsive'>
            <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between'>
              <div className=''>
                <h3 className='opensans-bold mb-0 text-white'>Company Profile</h3>
              </div>
              <div className='d-flex justify-content-end responsive-header-width'>
                <Header />
              </div>
            </div>
          </div>
          <div className='row m-0 mt-5 ps-md-5 ps-sm-3 ps-3 mb-5'>
            <div className='col-xxl-8 col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12'>
              <form onSubmit={onFormSubmit}>
                <div className='chatbox-field bg-themeLightBlue'>
                  <div className='mb-5'>
                    <h1 className='text-skyBlue opensans-bold'>Hey, {FullName}</h1>
                    <p className='mb-0 br-regular text-white font16 mx-content'>
                      This is where all the excitement happens. This is where we can fine tune our agents learn our business with Mind Blowing accuracy.
                    </p>
                  </div>
                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Company Name*</label>
                    <div className='chatbox-input-field'>
                      <input
                        type='text'
                        placeholder='Luna Compnay Ltd'
                        className='form-control chatbox-input'
                        id='company'
                        name='company'
                        value={company}
                        autoComplete='off'
                        onChange={companyHandleChange}
                      />
                      <div className='chat-error'>{errors.company && <p className='text-danger insta-smart-error'>{errors.company}</p>}</div>
                    </div>
                  </div>

                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Address*</label>
                    <div className='chatbox-input-field'>
                      <input
                        type='text'
                        placeholder='13th Street. 47 W 13th St'
                        className='form-control chatbox-input'
                        id='address'
                        name='address'
                        value={address}
                        autoComplete='off'
                        onChange={companyHandleChange}
                      />
                      <div className='chat-error'>{errors.address && <p className='text-danger insta-smart-error'>{errors.address}</p>}</div>
                    </div>
                  </div>

                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>City Name*</label>
                    <div className='chatbox-input-field'>
                      <input
                        type='text'
                        placeholder='New York'
                        className='form-control chatbox-input'
                        id='city'
                        name='city'
                        value={city}
                        autoComplete='off'
                        onChange={companyHandleChange}
                      />
                      <div className='chat-error'>{errors.city && <p className='text-danger insta-smart-error'>{errors.city}</p>}</div>
                    </div>
                  </div>

                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Country*</label>
                    <div className='chatbox-input-field'>
                      <select className='form-control' name='country' value={country} onChange={companyHandleChange}>
                        <option selected hidden>
                          Choose the country
                        </option>
                        {COUNTRYLIST.map((row, i) => (
                          <option key={i}>{row?.en_short_name}</option>
                        ))}
                      </select>
                      <div className='chat-error'>{errors.country && <p className='text-danger insta-smart-error'>{errors.country}</p>}</div>
                    </div>
                  </div>

                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Website</label>
                    <div className='chatbox-input-field'>
                      <input
                        type='text'
                        placeholder='https://chirpflo.com/'
                        className='form-control chatbox-input'
                        id='website'
                        name='website'
                        value={website}
                        autoComplete='off'
                        onChange={companyHandleChange}
                      />
                      {/* <div className='chat-error'>{errors.website && <p className='text-danger insta-smart-error'>{errors.website}</p>}</div> */}
                    </div>
                  </div>

                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Booking Link</label>
                    <div className='chatbox-input-field'>
                      <input
                        type='text'
                        placeholder='https://chirpflo.com/'
                        className='form-control chatbox-input'
                        id='booking_link'
                        name='booking_link'
                        value={booking_link}
                        autoComplete='off'
                        onChange={companyHandleChange}
                      />
                      {/* <div className='chat-error'>{errors.booking_link && <p className='text-danger insta-smart-error'>{errors.booking_link}</p>}</div> */}
                    </div>
                  </div>

                  {/* <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Product Name</label>
                    <div className='chatbox-input-field'>
                      <input
                        type='text'
                        placeholder='Sales'
                        className='form-control chatbox-input'
                        id='product'
                        name='product'
                        value={product}
                        autoComplete='off'
                        onChange={companyHandleChange}
                      />
                    </div>
                  </div> */}

                  {/* <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Price</label>
                    <div className='chatbox-input-field'>
                      <input
                        type='number'
                        placeholder='00.00'
                        className='form-control chatbox-input'
                        id='product_price'
                        name='product_price'
                        value={product_price}
                        autoComplete='off'
                        onChange={companyHandleChange}
                      />
                    </div>
                  </div> */}

                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>Product Name & Price</label>
                    <div className='chatbox-input-field'>
                      <textarea
                        className='form-control chatbox-input textarea-height'
                        placeholder='Enter  your product name & price here'
                        id='product_price'
                        name='product_price'
                        value={product_price}
                        autoComplete='off'
                        onChange={companyHandleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className='chatbox-input-text input-GPT new'>
                    <label className='opensans-medium'>About Company</label>
                    <div className='chatbox-input-field'>
                      <textarea
                        rows='10'
                        className='form-control chatbox-input textarea-height'
                        placeholder='Describe about your company '
                        id='about_company'
                        name='about_company'
                        value={about_company}
                        autoComplete='off'
                        onChange={companyHandleChange}
                      ></textarea>
                      <div className='pt-5 mb-4 text-center d-flex flex-wrap align-items-center'>
                        <button className='btn btn-submit-login rounded-4 text-uppercase' onClick={companyHandleClick}>
                          Train Agent
                        </button>
                        {chatbotUrl && (
                          <div className='ms-md-2 ms-0 mt-md-0 mt-2'>
                            <button className='btn  btn-submit-copy rounded-4' onClick={copyToClipboard}>
                              {copySuccess || 'Copy Test Link'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* <div className='chat-error'>{errors.about_company && <p className='text-danger insta-smart-error'>{errors.about_company}</p>}</div> */}
                    </div>
                  </div>

                  <div className='opacity-0'>
                    <a href={chatbotUrl} target='_blank' className='opensans-semibold mb-0 me-3' id='copy-text' ref={textArea}>
                      {chatbotUrl}
                    </a>
                  </div>
                </div>
              </form>
            </div>
            <div>
              <EditChatBox passChildData={setChildData} ref={concernedElementRef} handleBlurClick={handleBlurClick} />
            </div>
          </div>
          {loader && (
            <div className='loader-center'>
              <Loader />
            </div>
          )}
        </div>
      </div>

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
    </>
  );
};

export default ChatBotProfile;
