import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import EmplyImg from '../assets/images/profile_image.png';
import { clearLocalStorage, getLocalStorage, getWithToken, patchWithToken, postWithToken } from '../API/Api';
import { toast } from 'react-toastify';
import CHATBOX_LOGO from '../assets/icons/ChatBox_Logo.svg';
// import CHATBOT_ICON from '../assets/icons/ChatBot_icon.svg';
import { FiSearch } from 'react-icons/fi';
import Linkify from 'react-linkify';
import Loader from '../components/Loader';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import moment from 'moment';

const MyLeads = () => {
  const [leadData, setLeadData] = useState([]);
  const [apiTokenData, setApiTokenData] = useState('');
  const [getLeadData, setGetLeadData] = useState('');
  const [leadName, setLeadName] = useState('');
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [leadCount, setLeadCount] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      getLeadDetails(JSON.parse(token));
      setApiTokenData(JSON.parse(token));
      getSortLeadDetails(JSON.parse(token));
    }
  }, []);
  const getLeadDetails = (token) => {
    setLoader(true);
    getWithToken('Lead_ListAPI', token)
      .then((response) => {
        if (response.status == 200) {
          setLeadData(response?.data);
          setLoader(false);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        toast.error('Something went wrong');
      });
  };

  // const ScrollToBottom = () => {
  //   const elementRef = useRef();
  //   useEffect(() => {
  //     elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  //   }, []);
  //   return <div ref={elementRef} />;
  // };
  const handleLeadsDetails = (obj) => {
    setLeadName(obj?.name);
    const payload = {
      recipient_id: obj?.recipient_id,
    };
    postWithToken('Lead_ListAPI', apiTokenData, payload)
      .then((response) => {
        if (response.status == 200) {
          setGetLeadData(response?.data);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    const filtered = leadData.filter(
      (obj) =>
        obj?.name?.toLowerCase().includes(search.toLowerCase()) ||
        obj?.email?.toLowerCase().includes(search.toLowerCase()) ||
        obj?.phone_number?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, leadData]);

  const handleDateChange = (e) => {
    const payload = {
      date: moment(e).format('YYYY-MM-DD'),
    };
    postWithToken('lead_SortingAPI', apiTokenData, payload)
      .then((response) => {
        if (response.status == 200) {
          setLeadData(response?.data);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const getSortLeadDetails = (token) => {
    getWithToken('lead_SortingAPI', token)
      .then((response) => {
        if (response.status == 200) {
          setLeadCount(response?.data?.today_lead_count);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        setLoader(false);
        toast.error('Something went wrong');
      });
  };

  const handleStatusChange = (e, id) => {
    patchWithToken(`Lead_ListAPI/${id}`, apiTokenData, { status: e.target.value })
      .then((response) => {
        if (response.status == 200) {
          setLoader(false);
          getLeadDetails(apiTokenData);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        toast.error('Something went wrong');
      });
  };
  const formattedDates = filteredData.map((obj) => {
    const currentDate = new Date();
    const createdAtDate = new Date(obj?.createdAt);

    let formattedDate;

    if (isSameDay(currentDate, createdAtDate)) {
      formattedDate = 'Today';
    } else if (isYesterday(currentDate, createdAtDate)) {
      formattedDate = 'Yesterday';
    } else {
      formattedDate = moment(createdAtDate).format('DD-MM-YYYY');
    }

    function isSameDay(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    }

    function isYesterday(date1, date2) {
      const yesterday = new Date(date1);
      yesterday.setDate(date1.getDate() - 1);

      return isSameDay(yesterday, date2);
    }

    return formattedDate;
  });

  return (
    <>
      <div className='intelichat-conatiner-right'>
        <div className='chatbot-container'>
          <div className='chatbot-fixed header-responsive'>
            <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between'>
              <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12'>
                <h3 className='opensans-bold mb-0 text-white'>My Leads</h3>
              </div>
              <div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12'>
                <div className='d-block d-md-flex justify-content-between align-items-center'>
                  <div className='search-lead input-group'>
                    <span className='input-group-text' id='basic-addon1'>
                      <FiSearch />
                    </span>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Username'
                      aria-label='Username'
                      aria-describedby='basic-addon1'
                      value={search}
                      onChange={(e) => handleSearch(e)}
                    />
                  </div>
                  <div className='responsive-header-width'>
                    <Header />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row m-0 mt-5 ps-md-5 ps-sm-3 ps-3 mb-5'>
            <div className='col-xxl-7 col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12'>
              <div className='d-flex align-items-center'>
                <div className='lead-count bg-themeLightBlue me-5'>
                  <span className='opensans-bold'>Today New Leads</span>
                  <div className='lead-count-data mt-4'>
                    <CircularProgressbar text={leadCount || '0'} value={0} strokeWidth={5} />
                  </div>
                </div>
                <div className='custom-calendar'>
                  <Calendar onChange={(e) => handleDateChange(e)} />
                </div>
              </div>
              <div className='tablerounededCorner overflowX-scroll mt-5'>
                <table className='table table-striped roundedTable mb-0'>
                  <thead>
                    <tr>
                      <th className='opensans-bold'>Name</th>
                      <th className='opensans-bold'>Phone</th>
                      <th className='opensans-bold'>Email</th>
                      <th className='opensans-bold'>Time</th>
                      <th className='opensans-bold'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.length > 0 ? (
                      filteredData?.map((obj, index) => {
                        return (
                          <tr className='cursor-pointer' onClick={() => handleLeadsDetails(obj)} key={index}>
                            <td>
                              <div className='table-rounded-img'>
                                {/* <span className='Empl-img me-3'>
                                  <img src={EmplyImg} alt='image' />
                                </span> */}
                                <span className='opensans-regular'>{obj?.name}</span>
                              </div>
                            </td>
                            <td className='opensans-regular'>{obj?.phone_number}</td>
                            <td className='opensans-regular'>{obj?.email}</td>
                            <td className='opensans-regular'>{formattedDates[index]}</td>
                            <td className='opensans-regular'>
                              <select
                                className='lead-select'
                                value={obj?.status}
                                onChange={(e) => handleStatusChange(e, obj?.id)}
                                style={{
                                  background: obj?.status == '1' ? '#dfaa21' : obj.status == '2' ? '#45B610' : obj.status == '3' ? '#0CA8EE' : obj.status == '4' ? '#CB1414' : '',
                                }}
                              >
                                <option value='1'>Pending</option>
                                <option value='2'>Completed</option>
                                <option value='3'>Follow Up</option>
                                <option value='4'>Declined</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3}>
                          <p className='text-center text-white py-3' style={{ fontSize: '20px' }}>
                            No Records Found
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {getLeadData?.length > 0 && (
              <div className='col-xxl-5 col-xl-5 col-lg-12 col-md-12 col-sm-12 col-12'>
                <div className='d-flex align-items-center position-sticky-chat'>
                  <div className='chatbox-container'>
                    <div className='chatbox-header'>
                      <div className='chatbox-header-icon'>
                        <div className='chatbox-logo'>
                          <img src={CHATBOX_LOGO} alt='chatbox-logo' />
                        </div>
                      </div>
                      <div className='d-flex flex-wrap justify-content-between align-items-center w-100'>
                        <div className='chatbox-header-text'>
                          <h3 className='opensans-bold'>{leadName}</h3>
                          {/* <p className='opensans-regular'>Online</p> */}
                        </div>
                      </div>
                    </div>
                    <div className='chatbox-body p-3'>
                      <div className='chatbox-body-box' style={{ height: window.innerHeight - 360, maxHeight: '470px' }}>
                        <div>
                          {getLeadData?.length > 0 &&
                            getLeadData?.map((obj, index) => (
                              <div className='mb-4' key={index}>
                                <div className='d-flex align-items-center justify-content-end mt-3'>
                                  <div className='chatbox-user-quetext '>
                                    <p className='m-0'>{obj?.prmt}</p>
                                  </div>
                                  {/* <div className='chatbox-user-icon ms-3'>
                                  <img src={CHATBOT_ICON} alt='chatbot-icon' />
                                </div> */}
                                </div>
                                <div className='d-flex align-items-center editdata-chatbox mt-3'>
                                  {/* <div className='chatbox-user-icon me-3'>
                                  <img src={CHATBOT_ICON} alt='chatbot-icon' />
                                </div> */}
                                  {obj?.text?.length > 0 && (
                                    <div className='chatbox-user-replytext '>
                                      <p className='m-0'>
                                        <Linkify
                                          componentDecorator={(decoratedHref, decoratedText, key) => (
                                            <a target='blank' href={decoratedHref} key={key}>
                                              {decoratedText}
                                            </a>
                                          )}
                                        >
                                          {obj?.text}
                                        </Linkify>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          {/* <ScrollToBottom /> */}
                        </div>
                      </div>
                      {/* <form className='chatbox-group d-flex justify-content-between align-items-center position-relative' type='submit'>
                      <input type='text' className='form-control click-text' placeholder='Type Message..' name='' autoComplete='off' />
                      <div className=' chatbox-input-group'>
                        <button className='btn btn-chabotsend rounded-pill new h-100'>
                          <IoSend />
                        </button>
                      </div>
                    </form> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default MyLeads;
