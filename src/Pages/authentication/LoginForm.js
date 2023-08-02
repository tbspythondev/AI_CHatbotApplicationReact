import React, { useEffect, useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { HashLink as Link } from 'react-router-hash-link';
import { toast } from 'react-toastify';
import { addClassToBody, getLocalStorage, postWithoutToken, setLocalStorage, setLocalStorageFLag } from '../../API/Api';
import { validateEmail, validatePwd } from '../../assets/Helper/utils';
import { useNavigate } from 'react-router-dom';
import INTELICHAT_LOGO from '../../assets/images/chirpfloLogo.png';
import GOOGLEICON from '../../assets/icons/GoogleIcon.svg';
import MICROSOFTICON from '../../assets/icons/MicrosoftIcon.svg';
import FACEBOOKICON from '../../assets/icons/FacebookIcon.svg';

const ValidationErrors = {
  empty: {
    email: 'Email id Required',
    password: 'Password Required',
  },
  invalid: {
    email: 'Invalid Email',
    // password: 'Invalid password',
  },
};

const LoginForm = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: '',
    type: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const Navigate = useNavigate();

  const { email, password } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  useEffect(() => {
    addClassToBody('auth-page');
    let token = getLocalStorage('apiToken');
    if (token) {
      Navigate('/dashboard');
    }
  }, []);

  const handleClick = () => {
    const tempErrors = { ...errors };
    Object.keys(values).map((key) => {
      if (!values[key]) {
        tempErrors[key] = ValidationErrors.empty[key];
      } else {
        if (key == 'email' && !validateEmail(values[key])) {
          tempErrors.email = ValidationErrors.invalid.email;
        }
        // if (key == 'password' && !validatePwd(values[key])) {
        //   tempErrors.password = ValidationErrors.invalid.password;
        // }
      }
    });
    setErrors(tempErrors);

    if (Object.values(tempErrors).filter((obj) => !!obj)?.length > 0) {
      return false;
    }

    postWithoutToken('login/', values)
      .then((response) => {
        if (response.status == 200) {
          setLocalStorage('sidebarToggle', 'false');
          setLocalStorage('apiToken', response?.data?.access);
          setLocalStorage('FullName', response?.data?.first_name + ' ' + response?.data?.last_name);
          toast.success(response.message);
          window.location.reload();
          Navigate('/dashboard');
        } else if (response.status == 400) {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
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
            {/* <div className='start-for-free'>
              <p className='opensans-regular'>Start for free</p>
            </div> */}
            <div className='login-card'>
              <div className='login-title'>
                <h4 className='rd-semiblod mb-0 text-themeBlack text-center'>Login to your account</h4>
              </div>
              <form onSubmit={onFormSubmit}>
                <div className='form-group position-relative input-GPT'>
                  {/* <label htmlFor='email' className='text-skyBlue opensans-semibold font16 mb-1'>
                    Email*:
                  </label> */}
                  <input type='text' className='form-control auth-input' id='email' name='email' value={email} placeholder='Email' autoComplete='off' onChange={handleChange} />
                  {errors.email && <p className='text-danger insta-smart-error'>{errors.email}</p>}
                </div>

                <div className='form-group position-relative input-GPT'>
                  {/* <label htmlFor='password' className='text-skyBlue opensans-semibold font16 mb-1'>
                    Password*:
                  </label> */}
                  <div className='input-group mb-0'>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className='form-control auth-input border-right-0'
                      value={password}
                      id='password'
                      name='password'
                      placeholder='Password'
                      onChange={handleChange}
                      autoComplete='off'
                    />
                    <div className='input-group-append'>
                      <button className='btn btn-show-eye' type='button' onClick={() => setShowPwd(!showPwd)}>
                        {!showPwd ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                      </button>
                    </div>
                  </div>
                  {errors.password && <p className='text-danger insta-smart-error'>{errors.password}</p>}
                </div>

                <div className='pt-2'>
                  <button className='btn btn-submit-login rd-semibold mx-100' onClick={handleClick}>
                    Log In
                  </button>
                </div>
              </form>

              <div className='row'>
                <div className='col-md-6 col-sm-12 col-xs-12 mt-4'>
                  <div className='text-start'>
                    <Link to='/forgotpassword' className='rd-Light color-theme-blue decoration'>
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className='col-md-6 col-sm-12 col-xs-12 mt-4'>
                  <div className='text-md-end text-sm-start text-xs-start'>
                    <Link to='/register' className='rd-Light color-theme-blue decoration'>
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
              <div className='col-md-12 col-sm-12 col-xs-12 mt-3'>
                <div className='text-start'>
                  <Link to='/testchatbot' className='rd-Light color-theme-blue decoration'>
                    Chatbot
                  </Link>
                </div>
              </div>
              {/* <div className='d-flex align-items-center justify-content-center mt-3 mb-4'>
                <div className='w-25'>
                  <hr className='hr-color' />
                </div>
                <span className='mx-4 text-center text-white rd-Light'>
                  Or <br />
                  Sign up with
                </span>
                <div className='w-25'>
                  <hr className='hr-color' />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <div className='auth-login-icon'>
                  <img src={GOOGLEICON} alt='GoogleIcon' />
                </div>
                <div className='auth-login-icon'>
                  <img src={MICROSOFTICON} alt='MicrosoftIcon' />
                </div>
                <div className='auth-login-icon'>
                  <img src={FACEBOOKICON} alt='FacebookIcon' />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
