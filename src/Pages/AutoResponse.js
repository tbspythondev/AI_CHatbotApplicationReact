import React, { useEffect, useState } from 'react';
import '../assets/styles/AutoResponse.css';
import FACEBOOK_ICON from '../assets/icons/Facebook.svg';
import WHATSAPP_ICON from '../assets/icons/Whatsapp.svg';
import INSTAGRAM_ICON from '../assets/icons/Instagram.svg';
import CHATBOX_LOGO from '../assets/icons/ChatBox_Logo.svg';
import { AiOutlineSearch } from 'react-icons/ai';
import { clearLocalStorage, getLocalStorage, getWithToken, patchWithToken } from '../API/Api';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Header from '../components/Header';

const AutoResponse = () => {
  const [autoresponseValues, setAutoResponseValue] = useState(false);
  const [loader, setLoader] = useState(false);
  const Navigate = useNavigate();
  const [apiTokenData, setApiTokenData] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [userName, setUserName] = useState('');
  const [userFbId, setUserFbId] = useState('');
  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
      getBotDetails(JSON.parse(token));
      GetFBAuthFlow(JSON.parse(token));
    } else {
      Navigate('/login');
    }
  }, []);

  const getBotDetails = (token) => {
    setLoader(true);
    getWithToken('company/', token)
      .then((response) => {
        if (response.status == 201) {
          setAutoResponseValue(response?.data?.is_autoresponce);
          setCompanyId(response?.data?.id);
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

  const GetFBAuthFlow = (token) => {
    setLoader(true);
    getWithToken('facebook_authflow', token)
      .then((response) => {
        if (response.status == 200) {
          setUserName(response?.data?.insta_username);
          setUserFbId(response?.data?.instagram_bussiness_account_id);
          setLoader(false);
        } else if (response.status == 400) {
          toast.dismiss();
          // toast.error(response.message);
          setLoader(false);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        // setLoader(false);
        toast.error('Something went wrong');
      });
  };

  const changeAutoResponseStatus = () => {
    // setLoader(true);
    if (companyId) {
      const payload = {
        is_autoresponce: autoresponseValues == false ? true : false,
      };
      patchWithToken('company/' + companyId + '/', apiTokenData, payload)
        .then((response) => {
          if (response.status == 200) {
            if (response.data.is_autoresponce) {
              setAutoResponseValue(true);
              getBotDetails(apiTokenData);
              toast.dismiss();
              toast.success('Autoresponse Activated.');
            } else if (response.code == 'token_not_valid') {
              clearLocalStorage();
            } else {
              setAutoResponseValue(false);
              getBotDetails(apiTokenData);
              toast.dismiss();
              toast.error('Autoresponse deactivated.');
            }
            setLoader(false);
          } else if (response.status == 400) {
            setLoader(false);
            toast.dismiss();
            toast.error(response.message);
          }
        })
        .catch((error) => {
          toast.dismiss();
          toast.error('Something went wrong');
          setLoader(false);
        });
    } else {
      toast.dismiss();
      toast.error('Please create the company.');
    }
  };

  return (
    <>
      {/* {loader ? (
        <div className='loader-center'>
          <Loader />
        </div>
      ) : ( */}
      <div className='chatbot-container'>
        <div className='chatbot-fixed header-responsive'>
          <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between'>
            <div className=''>
              <h3 className='opensans-bold mb-0 text-white'>Auto Response</h3>
            </div>
            <div className='d-flex justify-content-end responsive-header-width'>
              <Header />
            </div>
          </div>
        </div>
        <div className='m-0 pt-5 ps-md-5 ps-sm-3 ps-3'>
          <div className='chatbox-field'>
            <div className='col-xxl-5 col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12 p-0'>
              <div className='instagram mt-5'>
                <div className='autoresponse-main'>
                  <div className='autoresponse-header p-2 d-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center header-icon'>
                      <img src={INSTAGRAM_ICON} alt='facebook-icon' />
                      <h3 className='opensans-regular ms-2 mb-0 text-white'>Instagram</h3>
                    </div>
                    <div className='switch-background'>
                      <label className='switch'>
                        <input type='checkbox' id='' name='autoresponseValues' checked={autoresponseValues} onChange={() => changeAutoResponseStatus()} />
                        <span className='slider round'></span>
                      </label>
                    </div>
                  </div>
                  <div className='autoresponse-body row mx-0 align-items-center py-4 px-2'>
                    <div className='d-flex'>
                      <div className='flex-shrink-0 autoresponse-chatbox-logo'>
                        <img src={CHATBOX_LOGO} alt='chatbox-logo' />
                      </div>
                      {userName ? (
                        <div className='flex-grow-1 ms-3 autoresponse-body-text'>
                          <h4 className='opensans-bold text-lightSky'>{userName}</h4>
                          <h6 className='opensans-regular mb-0 text-notBlack'>{userFbId}</h6>
                        </div>
                      ) : (
                        <div className='flex-grow-1 ms-md-3 ms-1 autoresponse-body-text'>
                          <h4 className='opensans-bold text-lightSky'>Chatbot Agent</h4>
                          <h6 className='opensans-regular mb-0 text-notBlack'>Chatbot ID</h6>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loader && (
        <div className='loader-center'>
          <Loader />
        </div>
      )}
      {/* )} */}
    </>
  );
};

export default AutoResponse;
