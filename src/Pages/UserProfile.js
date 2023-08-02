import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addClassToBody, clearLocalStorage, deleteWithToken, getLocalStorage, getWithToken, patchWithToken, postWithToken, setLocalStorage } from '../API/Api';
import { validateEmail, validName } from '../assets/Helper/utils';
import Loader from '../components/Loader';
import Header from '../components/Header';

const ValidationErrors = {
  empty: {
    first_name: 'First Name id Required',
    last_name: 'Last Name id Required',
    email: 'Email id Required',
  },
  invalid: {
    first_name: 'Invalid name',
    last_name: 'Invalid name',
    email: 'Invalid Email',
  },
};

const UserProfile = () => {
  const [inputShow, setInputShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [apiTokenData, setApiTokenData] = useState('');
  const [userId, setUserId] = useState('');
  const [DeleteAllPopUpOpen, setDeleteAllPopUpOpen] = useState(false);

  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const Navigate = useNavigate();
  const { first_name, last_name, email } = values;

  const userHandleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  useEffect(() => {
    addClassToBody('no-chat');
    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
      getUserProfileDetails(JSON.parse(token));
    } else {
      Navigate('/login');
    }
  }, []);

  const getUserProfileDetails = (token) => {
    setLoader(true);
    getWithToken('userprofile/', token)
      .then((response) => {
        if (response.status == 200) {
          setUserId(response?.data?.id);
          setValues({
            ...values,
            first_name: response?.data?.first_name,
            last_name: response?.data?.last_name,
            email: response?.data?.email,
          });
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

  const userHandleClick = () => {
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
      }
    });
    setErrors(tempErrors);

    if (Object.values(tempErrors).filter((obj) => !!obj).length > 0) {
      return false;
    }
    setLoader(true);
    if (userId) {
      patchWithToken('userprofile/' + userId + '/', apiTokenData, values)
        .then((response) => {
          if (response.status == 200) {
            setLocalStorage('FullName', response?.data?.first_name + ' ' + response?.data?.last_name);
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
          toast.error('Something went wrong');
          setLoader(false);
        });
    }
  };
  const handleDeleteAllData = () => {
    deleteWithToken('Content_DeleteAPI/', apiTokenData)
      .then((response) => {
        if (response.status == 200) {
          toast.success('All Data Deleted');
          setLoader(false);
          setDeleteAllPopUpOpen(false);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        } else if (response.status == 400) {
          toast.error(response.message);
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
              <h3 className='opensans-bold mb-0 text-white'>Profile</h3>
            </div>
            <div className='d-flex justify-content-end responsive-header-width'>
              <Header />
            </div>
          </div>
        </div>
        <div className='m-0 pt-5 ps-md-5 ps-sm-3 ps-3'>
          <div className='col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 p-0'>
            <div className='chatbox-field bg-themeLightBlue'>
              <div className='chatbox-input-text input-GPT new mb-3'>
                <label className='opensans-medium'>First Name*</label>
                <div className='chatbox-input-field'>
                  <input
                    type='text'
                    placeholder='John'
                    className='form-control chatbox-input'
                    name='first_name'
                    value={first_name}
                    autoComplete='off'
                    onChange={userHandleChange}
                  />
                  <div className='chat-error'>{errors.first_name && <span className='text-danger insta-smart-error'>{errors.first_name}</span>}</div>
                </div>
              </div>
              <div className='chatbox-input-text input-GPT new mb-3'>
                <label className='opensans-medium'>Last Name*</label>
                <div className='chatbox-input-field'>
                  <input
                    type='text'
                    placeholder='Luna Design Agent'
                    className='form-control chatbox-input'
                    name='last_name'
                    value={last_name}
                    autoComplete='off'
                    onChange={userHandleChange}
                  />
                  <div className='chat-error'>{errors.last_name && <span className='text-danger insta-smart-error'>{errors.last_name}</span>}</div>
                </div>
              </div>
              <div className='chatbox-input-text input-GPT new mb-3'>
                <label className='opensans-medium'>Email Address*</label>
                <div className='chatbox-input-field user-profile-email'>
                  <input type='text' placeholder='John' className='form-control chatbox-input' name='email' value={email} autoComplete='off' onChange={userHandleChange} />

                  <div className='chat-error'>{errors.email && <span className='text-danger insta-smart-error'>{errors.email}</span>}</div>
                  <div className='d-flex align-items-center justify-content-between mt-5'>
                    <button className='btn btn-submit-login rounded-3' onClick={() => setDeleteAllPopUpOpen(true)}>
                      Delete All Data
                    </button>
                    <button className='btn btn-submit-login rounded-3 ms-3 mt-lg-0' onClick={userHandleClick}>
                      Update
                    </button>
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
        {DeleteAllPopUpOpen && (
          <div className='custom-popup'>
            <div className='popup-content'>
              <h4 className='opensans-bold'>You're about to delete your data?</h4>
              <hr />
              <div className={'popup-head'}>
                <p className='opensans-regular'> Your Company Profile, FAQ’s and Bot Messages will be permenently deleted, you won't be able to see them again.</p>
              </div>
              <hr />
              <div className='popup-footer'>
                <button className='btn success-btn mx-1 text-capitalize' onClick={() => handleDeleteAllData()}>
                  Delete
                </button>
                <button className='btn danger-btn mx-1 text-capitalize' data-dismiss='modal' onClick={() => setDeleteAllPopUpOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
