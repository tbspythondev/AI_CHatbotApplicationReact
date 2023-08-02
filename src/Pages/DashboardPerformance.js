import React, { useState, useEffect } from 'react';
import '../App.css';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import USERS_ICON from '../assets/icons/newUsers.svg';
import MESSAGES_ICON from '../assets/icons/totalMessages.svg';
import { toast } from 'react-toastify';
import { clearLocalStorage, getLocalStorage, postWithToken } from '../API/Api';
import { useNavigate } from 'react-router-dom';
import ConversationChart from './ConversationChart';
import ContactChart from './ContactChart';
import CHATBOX_ICON from '../assets/icons/ChatBox_Icon.svg';
import CONTACT_ICON from '../assets/icons/Contact.svg';
import Loader from '../components/Loader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Header from '../components/Header';

const DashboardPerformance = () => {
  const Navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [dashData, setDashData] = useState('');
  const [apiTokenData, setApiTokenData] = useState('');
  const [userCount, setUserCount] = useState('');
  const [userPercent, setUserPercent] = useState('');
  const [messageToBot, setMessageToBot] = useState('');
  const [messageToBotPer, setMessageToBotPer] = useState('');
  const [messageFromBot, setMessageFromBot] = useState('');
  const [messageFromBotPer, setMessageFromBotPer] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  let newStartDate = startDate != null ? moment(startDate).format('YYYY-MM-DD') : null;
  let newEndDate = endDate != null ? moment(endDate).format('YYYY-MM-DD') : null;

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      setLoader(false);
      setApiTokenData(JSON.parse(token));
      getDashboardData(JSON.parse(token));
    } else {
      Navigate('/login');
    }
  }, [startDate, endDate]);

  const getDashboardData = (token) => {
    let body = {
      filter: { start: newStartDate, end: newEndDate },
    };
    postWithToken('DashboardAPI', token, body)
      .then((response) => {
        if (response.status == 200) {
          setDashData(response.data);
          setUserCount(response?.data?.user?.count);
          setUserPercent(response?.data?.user?.since_last_month);
          setMessageToBot(response?.data?.message_to_bot?.count);
          setMessageToBotPer(response?.data?.message_to_bot?.since_last_month);
          setMessageFromBot(response?.data?.message_from_bot?.count);
          setMessageFromBotPer(response?.data?.message_from_bot?.since_last_month);
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
      {loader ? (
        <div className='loader-center'>
          <Loader />
        </div>
      ) : (
        <>
          <div className='dashboard-performance-card '>
            <div className='chatbot-fixed header-responsive'>
              <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between'>
                <div className=''>
                  <h3 className='opensans-bold mb-0 text-white'></h3>
                </div>
                <div className='d-flex justify-content-end responsive-header-width'>
                  <Header />
                </div>
              </div>
            </div>
            <div className='row m-0 px-xl-3 px-lg-3 px-md-3 px-sm-2 px-xs-2'>
              <div className='col-xl-12 col-sm-12 mb-xl-0 mb-4 mt-3'>
                <div className='db-header-raw align-items-center flex-wrap pt-3'>
                  <span className='color-theme-blue opensans-bold'>Filter data from</span>
                  <div>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText='MM/DD/YYYY' isClearable />
                  </div>
                  <span className='color-theme-blue opensans-bold'>to</span>
                  <div>
                    <DatePicker selected={endDate} minDate={startDate} onChange={(date) => setEndDate(date)} placeholderText='MM/DD/YYYY' isClearable />
                  </div>
                </div>
              </div>
            </div>
            <div className='row m-0 pt-5 px-xl-3 px-lg-3 px-md-3 px-sm-2 px-xs-2'>
              <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 mb-xl-0 mb-4'>
                <div className='card'>
                  <div className='card-header p-3 pt-2'>
                    <div className='db-icons-fr'>
                      <img src={USERS_ICON} className='img-fluid' alt='users-icon' />
                    </div>
                    <div className='text-end pt-1'>
                      <p className='text-sm mb-0 text-white opensans-regular'>New Users</p>
                      <h4 className='mb-0 color-theme-blue opensans-regular'>{userCount.toLocaleString()}</h4>
                    </div>
                  </div>
                  <hr className='dark horizontal my-0 hr-custom' />
                  <div className='card-footer p-3 text-center'>
                    <p className='mb-0 text-grey opensans-regular'>
                      <span className={`text-green text-sm arrow-position ${userPercent >= 0 ? '' : 'text-red'}`}>
                        {userPercent >= 0 ? <BsArrowUp /> : <BsArrowDown />}
                        {userPercent}%
                      </span>
                      &nbsp; Since last month
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 mb-xl-0 mb-4'>
                <div className='card'>
                  <div className='card-header p-3 pt-2'>
                    <div className='db-icons-fr'>
                      <img src={MESSAGES_ICON} className='img-fluid' alt='messages-icon' />
                    </div>
                    <div className='text-end pt-1'>
                      <p className='text-sm mb-0 text-white opensans-regular'>Message to bots</p>
                      <h4 className='mb-0 color-theme-blue opensans-regular'>{messageToBot.toLocaleString()}</h4>
                    </div>
                  </div>
                  <hr className='dark horizontal my-0 hr-custom' />
                  <div className='card-footer p-3 text-center'>
                    <p className='mb-0 text-grey opensans-regular'>
                      <span className={`text-green text-sm arrow-position ${messageToBotPer >= 0 ? '' : 'text-red'}`}>
                        {messageToBotPer >= 0 ? <BsArrowUp /> : <BsArrowDown />}
                        {messageToBotPer}%
                      </span>
                      &nbsp; Since last month
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 mb-xl-0 mb-4'>
                <div className='card'>
                  <div className='card-header p-3 pt-2'>
                    <div className='db-icons-fr'>
                      <img src={MESSAGES_ICON} className='img-fluid' alt='messages-icon' />
                    </div>
                    <div className='text-end pt-1'>
                      <p className='text-sm mb-0 text-white opensans-regular'>Message from bots</p>
                      <h4 className='mb-0 color-theme-blue opensans-regular'>{messageFromBot.toLocaleString()}</h4>
                    </div>
                  </div>
                  <hr className='dark horizontal my-0 hr-custom' />
                  <div className='card-footer p-3 text-center'>
                    <p className='mb-0 text-grey opensans-regular'>
                      <span className={`text-green text-sm arrow-position ${messageFromBotPer >= 0 ? '' : 'text-red'}`}>
                        {messageFromBotPer >= 0 ? <BsArrowUp /> : <BsArrowDown />}
                        {messageFromBotPer}%
                      </span>
                      &nbsp; Since last month
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='row mt-5 mx-0'> */}
            <div className='row m-0 pt-5 px-xl-3 px-lg-3 px-md-3 px-sm-2 px-xs-2'>
              <div className='col-xl-5 col-lg-5 col-sm-12 mb-xl-0 mb-4'>
                <div className='charts-card p-2'>
                  <div className='d-flex align-items-center flex-wrap card-box-text'>
                    <img src={CHATBOX_ICON} alt='chatbox-icon' />
                    <h1 className='opensans-bold text-skyBlue me-2 my-0'>{dashData?.conversations?.count}</h1>
                    <h4 className='opensans-bold text-white my-0'>Conversations</h4>
                  </div>
                  <ConversationChart data={dashData?.conversations} />
                </div>
              </div>
              <div className='col-xl-7 col-lg-7 col-sm-12 mb-xl-0 mb-4'>
                <div className='charts-card p-2'>
                  <div className='d-flex align-items-center flex-wrap card-box-text'>
                    <img src={CONTACT_ICON} alt='contact-icon' />
                    <h1 className='opensans-bold text-skyBlue me-2 my-0'>{dashData?.contact?.count}</h1>
                    <h4 className='opensans-bold text-white my-0'>Contacts</h4>
                  </div>
                  <ContactChart data={dashData?.contact} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardPerformance;
