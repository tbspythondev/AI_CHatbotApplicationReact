import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/styles/authentication/RegisterForm.css';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { validateEmail, validatePwd, validName } from '../../assets/Helper/utils';
import { HashLink as Link } from 'react-router-hash-link';
import { addClassToBody, postWithoutToken, setLocalStorage } from '../../API/Api';
import INTELICHAT_LOGO from '../../assets/images/chirpfloLogo.png';
import GOOGLEICON from '../../assets/icons/GoogleIcon.svg';
import MICROSOFTICON from '../../assets/icons/MicrosoftIcon.svg';
import FACEBOOKICON from '../../assets/icons/FacebookIcon.svg';

const ValidationErrors = {
  empty: {
    first_name: 'First name Required',
    last_name: 'Last name Required',
    email: 'Email id Required',
    password: 'Password Required',
  },
  invalid: {
    first_name: 'Invalid name',
    last_name: 'Invalid name',
    email: 'Invalid Email',
    password: 'Password must be of 8 to 10 characters; including 1 uppercase & 1 lowercase letter, 1 numeric character & 1 special character (@#$/_-!&*).',
  },
};

const RegisterForm = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [data, setData] = useState('');
  const [values, setValues] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_type: '1',
  });

  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const { email, password, first_name, last_name } = values;
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  useEffect(() => {
    addClassToBody('auth-page');
  }, []);

  const handleClick = () => {
    const tempErrors = { ...errors };
    Object.keys(values).map((key) => {
      if (!values[key]) {
        tempErrors[key] = ValidationErrors.empty[key];
      } else {
        if (key == 'first_name' && !validName(values[key])) {
          tempErrors.first_name = ValidationErrors.invalid.first_name;
        }
        if (key == 'last_name' && !validName(values[key])) {
          tempErrors.last_name = ValidationErrors.invalid.last_name;
        }
        if (key == 'email' && !validateEmail(values[key])) {
          tempErrors.email = ValidationErrors.invalid.email;
        }
        if (key == 'password' && !validatePwd(values[key])) {
          tempErrors.password = ValidationErrors.invalid.password;
        }
      }
    });
    setErrors(tempErrors);

    if (Object.values(tempErrors).filter((obj) => !!obj).length > 0) {
      return false;
    }

    postWithoutToken('user/', values)
      .then((response) => {
        if (response.status == 201) {
          toast.success(response.message);
          setData(response?.data);
          // setLocalStorage('apiToken', response?.data?.user?.accesstoken);
          setLocalStorage('userEmail', response?.data?.user?.email);
          Navigate('/otpverification/' + response?.data?.user?.accesstoken);
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
            <div className='start-for-free'>
              <p className='rd-Light'>Start for free</p>
            </div>
            <div className='login-card'>
              <div className='login-title'>
                <h4 className='rd-semiblod mb-0 text-white text-center'>Create new account</h4>
              </div>
              <form onSubmit={onFormSubmit}>
                <div className='row'>
                  <div className='col-lg-6'>
                    <div className='form-group position-relative input-GPT'>
                      {/* <label className='text-skyBlue opensans-semibold font16 mb-1'>First Name*</label> */}
                      <input
                        type='text'
                        name='first_name'
                        value={first_name}
                        placeholder='First Name'
                        className='form-control auth-input'
                        onChange={handleChange}
                        autoComplete='off'
                      />
                      {errors.first_name && <p className='text-danger insta-smart-error'>{errors.first_name}</p>}
                    </div>
                  </div>
                  <div className='col-lg-6'>
                    <div className='form-group position-relative input-GPT'>
                      {/* <label className='text-skyBlue opensans-semibold font16 mb-1'>Last Name*</label> */}
                      <input
                        type='text'
                        name='last_name'
                        value={last_name}
                        placeholder='Last Name'
                        className='form-control auth-input'
                        onChange={handleChange}
                        autoComplete='off'
                      />
                      {errors.last_name && <p className='text-danger insta-smart-error'>{errors.last_name}</p>}
                    </div>
                  </div>
                </div>

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
                  {/* {errors.password && <p className='text-danger insta-smart-error'>{errors.password}</p>} */}
                  {errors.password && <p className={`text-danger ${errors.password.length < 18 ? 'insta-smart-error' : 'validation-error'}`}>{errors.password}</p>}
                </div>

                <div className='pt-2 d-flex justify-content-between'>
                  <button className='btn btn-submit-login rd-semibold' onClick={handleClick}>
                    Create Account
                  </button>
                  <div className='align-self-center text-right'>
                    <span className='text-white me-2 rd-Light'> Already a member?</span>
                    <Link to='/login' className='rd-Light color-theme-blue decoration'>
                      Log In
                    </Link>
                  </div>
                </div>
              </form>

              {/* <div className='d-flex align-items-center justify-content-center  my-4'>
                <div className='w-25'>
                  <hr className='hr-color' />
                </div>
                <span className='mx-4 text-center text-white rd-Light'>
                  or <br />
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

export default RegisterForm;
