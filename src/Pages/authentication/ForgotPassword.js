import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addClassToBody, postWithoutToken } from '../../API/Api';
import { validateEmail, validatePwd } from '../../assets/Helper/utils';
import INTELICHAT_LOGO from '../../assets/images/chirpfloLogo.png';

const ValidationErrors = {
  empty: {
    email: 'Email id Required',
  },
  invalid: {
    email: 'Invalid Email',
  },
};

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({
    email: '',
  });

  const { email } = values;

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
        if (key == 'email' && !validateEmail(values[key])) {
          tempErrors.email = ValidationErrors.invalid.email;
        }
      }
    });
    setErrors(tempErrors);

    if (Object.values(tempErrors).filter((obj) => !!obj).length > 0) {
      return false;
    }
    postWithoutToken('forgetpassword_mail', values)
      .then((response) => {
        if (response.status == 200) {
          toast.success(response.message);
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
                    <h4 className='rd-semiblod mb-0 text-white text-center'>Forgot password</h4>
                  </div>
                  <div className='form-group position-relative input-GPT'>
                    {/* <label htmlFor='email' className='text-skyBlue opensans-semibold font16 mb-1'>
                      Email*:
                    </label> */}
                    <input type='text' className='form-control auth-input' id='email' name='email' value={email} placeholder='Email' autoComplete='off' onChange={handleChange} />
                    {errors.email && <p className='text-danger insta-smart-error'>{errors.email}</p>}
                  </div>

                  <div className='pt-2 d-flex justify-content-between'>
                    <button className='btn btn-submit-login rd-semibold' onClick={handleClick}>
                      Send Mail
                    </button>
                    <div className='align-self-center text-right'>
                      <span className='text-white me-2 rd-Light'> Back to</span>
                      <Link to='/login' className='rd-Light color-theme-blue decoration'>
                        Log In
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default ForgotPassword;
