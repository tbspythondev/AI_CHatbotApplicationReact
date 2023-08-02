import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearLocalStorage, getLocalStorage, patchWithToken } from '../API/Api';
import { validatePwd } from '../assets/Helper/utils';
import Header from '../components/Header';

const ValidationErrors = {
  empty: {
    old_password: 'Old Password Required',
    password: 'New Password Required',
    confirm_password: 'Confirm new Password Required',
  },
  invalid: {
    password: 'Password must be of 8 to 10 characters; including 1 uppercase & 1 lowercase letter, 1 numeric character & 1 special character (@#$/_-!&*).',
  },
};

const ChangePassword = () => {
  const [apiTokenData, setApiTokenData] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const Navigate = useNavigate();

  const [values, setValues] = useState({
    old_password: '',
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState({
    confirm_password: '',
    old_password: '',
    password: '',
  });

  const { old_password, password, confirm_password } = values;

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
    }
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleClick = () => {
    const tempErrors = { ...errors };
    Object.keys(values).map((key) => {
      if (!values[key]) {
        tempErrors[key] = ValidationErrors.empty[key];
      } else {
        if (key == 'password' && !validatePwd(values[key])) {
          tempErrors.password = ValidationErrors.invalid.password;
        }
      }
    });
    setErrors(tempErrors);

    if (Object.values(tempErrors).filter((obj) => !!obj).length > 0) {
      return false;
    }
    patchWithToken('change_password/', apiTokenData, values)
      .then((response) => {
        if (response.status == 200) {
          toast.success(response.message);
          clearLocalStorage();
          Navigate('/login');
        } else if (response.status == 400) {
          toast.error(response.message);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  return (
    <>
      <div className='chatbot-container'>
        <div className='chatbot-fixed header-responsive'>
          <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between'>
            <div className=''>
              <h3 className='opensans-bold mb-0 text-white'>Change Password</h3>
            </div>
            <div className='d-flex justify-content-end responsive-header-width'>
              <Header />
            </div>
          </div>
        </div>
        <div className='row m-0 mt-5 ps-md-5 ps-sm-3 ps-3 mb-5'>
          <div className='col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12 px-0 pe-md-3 pe-3'>
            <div className='bg-themeLightBlue no-height change-password-card'>
              <div className='card border-0'>
                <div className='card-header  border-0'>
                  <div className='chatbox-input-text  input-GPT new'>
                    <label className='opensans-medium font16 text-white'>Old Password*</label>
                    <div className='chatbox-input-field change-input-width  pt-2'>
                      <div className='input-group change-password-field mb-0'>
                        <input
                          type={showPwd ? 'text' : 'password'}
                          className='form-control change-input-field pass border-right-0'
                          value={old_password}
                          id='old_password'
                          name='old_password'
                          placeholder='**********'
                          onChange={handleChange}
                          autoComplete='off'
                        />
                        <div className='input-group-append'>
                          <button className='btn btn-input-group' type='button' onClick={() => setShowPwd(!showPwd)}>
                            {!showPwd ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                          </button>
                        </div>
                      </div>
                      {errors.old_password && <p className='text-danger insta-smart-error'>{errors.old_password}</p>}
                    </div>
                  </div>
                  <div className='chatbox-input-text input-GPT new pt-2'>
                    <label className='opensans-medium font16 text-white'>New Password*</label>
                    <div className='chatbox-input-field change-input-width  pt-2'>
                      <div className='input-group change-password-field mb-0'>
                        <input
                          type={showPwd1 ? 'text' : 'password'}
                          className='form-control change-input-field pass border-right-0'
                          value={password}
                          id='password'
                          name='password'
                          placeholder='**********'
                          onChange={handleChange}
                          autoComplete='off'
                        />
                        <div className='input-group-append'>
                          <button className='btn btn-input-group' type='button' onClick={() => setShowPwd1(!showPwd1)}>
                            {!showPwd1 ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                          </button>
                        </div>
                      </div>
                      {errors.password && <p className='text-danger mb-0 mb-0 opensans-bold'>{errors.password}</p>}
                    </div>
                  </div>
                  <div className='chatbox-input-text input-GPT new pt-2'>
                    <label className='opensans-medium font16 text-white'>Confirm Password*</label>
                    <div className='chatbox-input-field change-input-width  pt-2'>
                      <div className='input-group change-password-field mb-0'>
                        <input
                          type={showPwd2 ? 'text' : 'password'}
                          className='form-control change-input-field pass border-right-0'
                          value={confirm_password}
                          id='confirm_password'
                          name='confirm_password'
                          placeholder='**********'
                          onChange={handleChange}
                          autoComplete='off'
                        />
                        <div className='input-group-append'>
                          <button className='btn btn-input-group' type='button' onClick={() => setShowPwd2(!showPwd2)}>
                            {!showPwd2 ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                          </button>
                        </div>
                      </div>
                      {errors.confirm_password && <p className='text-danger insta-smart-error'>{errors.confirm_password}</p>}
                    </div>
                  </div>
                  <div className=''>
                    <button className='btn btn-submit-login rounded-3' onClick={handleClick}>
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
