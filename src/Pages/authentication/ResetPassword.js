import React, { useEffect, useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addClassToBody, postWithoutToken } from '../../API/Api';
import { validatePwd } from '../../assets/Helper/utils';
import INTELICHAT_LOGO from '../../assets/images/chirpfloLogo.png';

const ResetPassword = () => {
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const Navigate = useNavigate();

  const [values, setValues] = useState({
    password: '',
    confirm_password: '',
  });

  const { password, confirm_password } = values;

  const [formErorr, setformErorr] = useState({});

  const uid = window.location.href.split('/')[4];

  const token = window.location.href.split('/')[5];

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    addClassToBody('auth-page');
  }, []);

  const handleClick = () => {
    let flag = true;
    setformErorr({});

    if (!values.password) {
      setformErorr((prev) => {
        return {
          ...prev,
          password: 'Password required',
        };
      });
      flag = false;
    }
    if (!values.confirm_password) {
      setformErorr((prev) => {
        return {
          ...prev,
          confirm_password: 'Confirm Password required',
        };
      });
      flag = false;
    } else if (values.password && values.confirm_password && values.password !== values.confirm_password) {
      setformErorr((prev) => {
        return {
          ...prev,
          confirm_password: "Password doesn't match",
        };
      });
      flag = false;
    }

    let payload = {
      uid: uid,
      token: token,
      new_password: password,
      confirm_password: confirm_password,
    };

    if (flag) {
      postWithoutToken('forgetpassword', payload)
        .then((response) => {
          if (response.status == 200) {
            toast.success(response.message);
            Navigate('/login');
            setValues('');
          } else if (response.status == 400) {
            toast.error(response.message);
          }
        })
        .catch((error) => {
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      <div className='container h-100-vh'>
        <div className='row h-100-vh justify-content-center'>
          <div className='col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12 align-self-center'>
            <div className='auth-logo'>
              <img src={INTELICHAT_LOGO} alt='logo' />
            </div>
            <div className='login-card'>
              <div className='login-title'>
                <h4 className='opensans-bold mb-0 text-themeBlack text-center'>RESET PASSWORD</h4>
              </div>
              <div className='form-group position-relative input-GPT'>
                <label htmlFor='password' className='text-skyBlue opensans-semibold font16 mb-1'>
                  Password*:
                </label>
                <div className='input-group mb-0'>
                  <input
                    type={showPwd1 ? 'text' : 'password'}
                    className='form-control auth-input pass border-right-0'
                    value={password}
                    id='password'
                    name='password'
                    placeholder='**********'
                    onChange={handleChange}
                    autoComplete='off'
                  />
                  <div className='input-group-append'>
                    <button className='btn btn-show-eye' type='button' onClick={() => setShowPwd1(!showPwd1)}>
                      {!showPwd1 ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                    </button>
                  </div>
                </div>
                <span className='text-danger insta-smart-error'>{formErorr.password}</span>
              </div>
              <div className='form-group position-relative input-GPT'>
                <label htmlFor='password' className='text-skyBlue opensans-semibold font16 mb-1'>
                  Confirm Password*:
                </label>
                <div className='input-group mb-0'>
                  <input
                    type={showPwd2 ? 'text' : 'password'}
                    className='form-control auth-input pass border-right-0'
                    value={confirm_password}
                    id='confirm_password'
                    name='confirm_password'
                    placeholder='**********'
                    onChange={handleChange}
                    autoComplete='off'
                  />
                  <div className='input-group-append'>
                    <button className='btn btn-show-eye' type='button' onClick={() => setShowPwd2(!showPwd2)}>
                      {!showPwd2 ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                    </button>
                  </div>
                </div>
                <span className='text-danger insta-smart-error'>{formErorr.confirm_password}</span>
              </div>

              <div className='pt-2 d-flex justify-content-between'>
                <button className='btn btn-submit-login text-uppercase' onClick={handleClick}>
                  Reset Password
                </button>
                <div className='align-self-center text-right'>
                  <Link to='/login' className='opensans-semibold color-theme-blue'>
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
