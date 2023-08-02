import React, { useEffect, useState } from 'react';
import { addClassToBody, clearLocalStorage, getLocalStorage, postWithToken } from '../../API/Api';
import '../../assets/styles/authentication/OtpVerification.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import INTELICHAT_LOGO from '../../assets/images/chirpfloLogo.png';

const OtpVerification = () => {
  const [otp, setOtp] = useState({
    code1: (Number = ''),
    code2: (Number = ''),
    code3: (Number = ''),
    code4: (Number = ''),
    code5: (Number = ''),
    code6: (Number = ''),
  });
  const [counter, setCounter] = useState(60);
  const Navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [apiTokenData, setApiTokenData] = useState('');

  const handleOtpInput = (e, item, i) => {
    const CurrentElement = document.getElementById(item);

    if (CurrentElement?.value?.length == 1) {
      const NextElement = document.getElementById(item.replace(item.charAt(item.length - 1), (i + 2).toString()));
      NextElement?.focus();
    }
    if (e.key == 'Backspace') {
      const PreviousElement = document.getElementById(item.replace(item.charAt(item.length - 1), i.toString()));
      PreviousElement?.focus();
    }
  };

  useEffect(() => {
    addClassToBody('auth-page');
    const token = window.location.href.split('/')[4];
    setApiTokenData(token);
    setUserEmail(JSON.parse(getLocalStorage('userEmail')));
  }, []);

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength);
    }
  };

  useEffect(() => {
    const timer =
      counter > 0 &&
      setInterval(() => {
        setCounter(counter - 1);
      }, 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const handleClick = () => {
    let newOtp = otp.code1 + otp.code2 + otp.code3 + otp.code4 + otp.code5 + otp.code6;
    let otpPayload = {};
    if (newOtp.length == 6) {
      if (newOtp == '000000') {
        otpPayload = {
          otp: newOtp,
        };
      } else {
        otpPayload = {
          otp: JSON.parse(newOtp),
        };
      }

      postWithToken('userprofile/', apiTokenData, otpPayload)
        .then((response) => {
          if (response.status == 200) {
            Navigate('/login');
            localStorage.removeItem('apiToken');
            localStorage.removeItem('userEmail');
            toast.success(response.message);
          } else if (response.status == 400) {
            toast.error(response.message);
          } else if (response.code == 'token_not_valid') {
            clearLocalStorage();
          }
        })
        .catch((error) => {
          toast.error('Something went wrong');
        });
    } else {
      toast.dismiss();
      toast.error('OTP is not correct');
    }
  };

  const reSend = () => {
    if (counter != 0) return;
    if (apiTokenData) {
      let reSendPayload = {
        email: userEmail,
      };
      postWithToken('resendotp/', apiTokenData, reSendPayload)
        .then((response) => {
          if (response.status == 200) {
            setCounter(60);
            toast.dismiss();
            toast.success(response.message);
          } else if (response.status == 400) {
            toast.error(response.message);
          } else if (response.code == 'token_not_valid') {
            clearLocalStorage();
          }
        })
        .catch((error) => {
          toast.error('Something went wrong');
        });
    } else {
    }
  };
  const onFormSubmit = (e) => {
    e.preventDefault();
    // send state to server with e.g. `window.fetch`
  };

  return (
    <>
      <div className='container h-100-vh'>
        <div className='row h-100-vh justify-content-center'>
          <div className='col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 align-self-center'>
            <div className='auth-logo'>
              <img src={INTELICHAT_LOGO} alt='logo' />
            </div>
            <form onSubmit={onFormSubmit}>
              <div className='login-card'>
                <div className='login-title'>
                  <h4 className='opensans-bold mb-0 text-themeBlack text-center'>VERIFY YOUR ACCOUNT</h4>
                </div>
                <div className='form-group mb-3 position-relative'>
                  <p className='opensans-regular text-center text-white'>
                    we have sent you an email at {userEmail}. Enter the code below to confirm your email address Have you not received the OTP?{' '}
                  </p>
                  <div className='d-flex otp-input-field justify-content-center'>
                    {Object.keys(otp).map((item, i) => (
                      <input
                        key={item}
                        autocomplete='off'
                        type='number'
                        onInput={maxLengthCheck}
                        className='Otp_BodyBox text-dark'
                        value={otp[item]}
                        maxLength={1}
                        id={item}
                        placeholder='-'
                        onChange={(e) => {
                          let temp = { ...otp };
                          temp[item] = e.target.value;
                          setOtp(temp);
                        }}
                        onKeyUp={(e) => {
                          handleOtpInput(e, item, i);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className='text-center'>
                  <p className='opensans-regular text-white mb-0'>Have You Not Received The One-Time-</p>
                  <div className='resend-otp text-white'>
                    Password ? &nbsp;
                    <span onClick={reSend} style={{ opacity: counter != 0 && 0.2 }}>
                      Please Resend
                    </span>
                    <span style={{ color: '#00D6CD', fontWeight: 'bold' }}>&nbsp; 00 : {counter < 10 ? `0${counter}` : counter}</span>
                  </div>
                </div>
                <div className='pt-2 text-center'>
                  <button className='btn btn-submit-login text-uppercase m-auto' disabled={counter == 0 || otp.code6 == ''} onClick={handleClick}>
                    Verify OTP
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
