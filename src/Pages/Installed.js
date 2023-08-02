import React, { useEffect, useState } from 'react';
import { addClassToBody, clearLocalStorage, getLocalStorage, getWithToken, postWithToken } from '../API/Api';
import '../assets/styles/Installed.css';
import INSTAGRAM_ICON from '../assets/icons/Instagram.svg';
import CHATBOX_LOGO from '../assets/icons/ChatBox_Logo.svg';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Header from '../components/Header';

const Installed = () => {
  const [loader, setLoader] = useState(false);
  const [apiTokenData, setApiTokenData] = useState('');
  const [facebookUserAccessToken, setFacebookUserAccessToken] = useState('');
  const [userName, setUserName] = useState('');
  const [userFbId, setUserFbId] = useState('');
  let newObj = {};

  useEffect(() => {
    addClassToBody('no-chat');

    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
      GetFBAuthFlow(JSON.parse(token));
    }
  }, []);

  const GetFBAuthFlow = (token) => {
    setLoader(true);
    getWithToken('facebook_authflow', token)
      .then((response) => {
        if (response.status == 200) {
          setUserName(response?.data?.insta_username);
          setUserFbId(response?.data?.instagram_bussiness_account_id);
          setFacebookUserAccessToken(response?.data?.page_access_token);
          setLoader(false);
        } else if (response.status == 400) {
          setUserName('');
          setUserFbId('');
          setFacebookUserAccessToken('');
          setLoader(false);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
        setLoader(false);
      });
  };

  const FBAuthFlow = (apiTokenData, accessToken, status) => {
    let newObj = {
      access_token: accessToken,
    };
    setLoader(true);
    postWithToken('facebook_authflow', apiTokenData, newObj)
      .then((response) => {
        if (response.status == 200) {
          setUserName(response?.data?.insta_username);
          setUserFbId(response?.data?.instagram_bussiness_account_id);
          setLoader(false);
          if (status) {
            toast.success('Login successful with Meta');
          }
        } else if (response.status == 400) {
          logOutOfFB();
          toast.error(response.message);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const logInToFB = () => {
    window.FB.login(
      (response) => {
        setFacebookUserAccessToken(response?.authResponse?.accessToken);
        if (response?.authResponse?.accessToken) {
          FBAuthFlow(apiTokenData, response?.authResponse?.accessToken, true);
        }
      },
      {
        scope:
          'pages_show_list, read_page_mailboxes, ads_management, business_management, pages_messaging, instagram_basic, instagram_manage_comments, instagram_manage_insights, instagram_content_publish, instagram_manage_messages, pages_read_engagement, pages_manage_metadata, public_profile',
      }
    );
  };

  const FBAuthFlowLogout = (status) => {
    let newObj = {
      logout: true,
    };
    setLoader(true);
    postWithToken('facebook_authflow_logout', apiTokenData, newObj)
      .then((response) => {
        if (response.status == 200) {
          setUserName('');
          setUserFbId('');
          setLoader(false);
          if (status) {
            toast.success('Logout successful with Meta');
          }
          setFacebookUserAccessToken(undefined);
        } else if (response.status == 400) {
          logOutOfFB();
          toast.error(response.message);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };
  const logOutOfFB = () => {
    FBAuthFlowLogout(true);
    window.FB.logout(facebookUserAccessToken);
  };

  return (
    <>
      <div className='chatbot-container'>
        <div className='chatbot-fixed header-responsive'>
          <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between'>
            <div className=''>
              <h3 className='opensans-bold mb-0 text-white'>Installed</h3>
            </div>
            <div className='d-flex justify-content-end responsive-header-width'>
              <Header />
            </div>
          </div>
        </div>
        <div className='mt-5 ps-md-5 ps-sm-3 ps-3 pe-xxl-5 pe-xl-4 pe-md-4 pe-sm-3 pe-3'>
          <div className='knowledgebase-text mb-5'>
            <h4 className='opensans-bold'>Connect Channels</h4>
          </div>
          <div className='row mx-0'>
            {/* <div className='col-xxl-3 col-xl-3 col-lg-4 col-md-12 col-sm-12 col-12 px-0'> */}
            {/* <div className='installed-btn p-2 activeLink'>
                <div className='d-flex align-items-center installed-icon'>
                  <img src={INSTAGRAM_ICON} alt='instagram-icon' />
                  <h4 className='opensans-regular ms-2 mb-0'>Instagram</h4>
                </div>
              </div> */}
            <div className='installed-right'>
              <div className='installed-right-text'>
                <div className='d-flex align-items-center'>
                  <img src={INSTAGRAM_ICON} alt='instagram-icon' />
                  <h3 className='opensans-bold color-theme-blue mb-0 pb-2'>Instagram</h3>
                </div>

                <div className='mt-4'>
                  <div className='d-flex flex-wrap'>
                    <div className='flex-shrink-0 installed-chatbox-logo'>
                      <img src={CHATBOX_LOGO} alt='chatbox-logo' />
                    </div>
                    {userName ? (
                      <div className='flex-grow-1 ms-md-3 ms-1 autoresponse-body-text'>
                        <h5 className='opensans-semibold text-lightSky'>{userName}</h5>
                        <h6 className='opensans-regular text-notBlack'>{userFbId}</h6>
                      </div>
                    ) : (
                      <div className='flex-grow-1 ms-md-3 ms-1 autoresponse-body-text'>
                        <h5 className='opensans-semibold text-lightSky'>Chatbot Agent</h5>
                        <h6 className='opensans-regular mb-0 text-notBlack'>Chatbot ID</h6>
                      </div>
                    )}

                    <div className='mt-xxl-0 mt-4'>
                      {facebookUserAccessToken ? (
                        <button onClick={logOutOfFB} className='btn btn-submit-login text-uppercase rounded-3'>
                          {/* Log out of META */}
                          Disconnect
                        </button>
                      ) : (
                        <button onClick={logInToFB} className='btn btn-submit-login text-uppercase rounded-3'>
                          {/* Login with META */}
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                  <p className='opensans-regular pt-4 mb-0'>A simple, fun & creative way to capture, edit & share photos, videos & messages with friends & family.</p>
                </div>
              </div>
            </div>
            {/* </div> */}
            {/* <div className='col-xxl-5 col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12 px-0 offset-xxl-2 offset-xl-2 offset-lg-1 offset-md-0 offset-sm-0 offset-xs-0 m-auto'> */}
            {/* <div className='installed-right'>
                <div className='installed-right-text'>
                  <h2 className='opensans-semibold text-black mb-0 pb-2'>Instagram</h2>

                  <div className='mt-4'>
                    <div className='d-flex flex-wrap'>
                      <div className='flex-shrink-0 installed-chatbox-logo'>
                        <img src={CHATBOX_LOGO} alt='chatbox-logo' />
                      </div>
                      {userName ? (
                        <div className='flex-grow-1 ms-md-3 ms-1 autoresponse-body-text'>
                          <h4 className='opensans-semibold text-lightSky'>{userName}</h4>
                          <h6 className='opensans-regular text-notBlack'>{userFbId}</h6>
                        </div>
                      ) : (
                        <div className='flex-grow-1 ms-md-3 ms-1 autoresponse-body-text'>
                          <h4 className='opensans-semibold text-lightSky'>Chatbot Agent</h4>
                          <h6 className='opensans-regular mb-0 text-notBlack'>Chatbot ID</h6>
                        </div>
                      )}

                      <div className='mt-xxl-0 mt-4'>
                        {facebookUserAccessToken ? (
                          <button onClick={logOutOfFB} className='btn btn-submit-login text-uppercase rounded-3'>
                            Log out of META
                          </button>
                        ) : (
                          <button onClick={logInToFB} className='btn btn-submit-login text-uppercase rounded-3'>
                            Login with META
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
      {loader && (
        <div className='loader-center'>
          <Loader />
        </div>
      )}
    </>
  );
};

export default Installed;
