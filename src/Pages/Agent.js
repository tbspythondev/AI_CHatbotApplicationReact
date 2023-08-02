import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/styles/Chatbot.css';
import Loader from '../components/Loader';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UserChatCard from './UserChatCard';
import ChatBox from '../components/ChatBox';
import Header from '../components/Header';
import EditChatBox from '../components/EditChatBox';
import { getLocalStorage, getWithToken } from '../API/Api';
import { toast } from 'react-toastify';

const Agent = () => {
  const [loader, setLoader] = useState(false);
  const [childData, setChildData] = useState(false);
  const [widgetID, setWidgetID] = useState('');

  const handleChildData = (data) => {
    setChildData(data);
  };
  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      getWidgetDetails(JSON.parse(token));
    }
  }, []);

  const getWidgetDetails = (token) => {
    getWithToken('Webchat_widgetAPI/', token)
      .then((response) => {
        if (response.status === 200) {
          setWidgetID(response?.data?.id);
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
              <h3 className='opensans-bold mb-0 text-white'>Agent Knowledge</h3>
            </div>
            <div className='d-flex justify-content-end responsive-header-width'>
              <Header />
            </div>
          </div>
        </div>
        <div className='row m-0 mt-5 ps-md-5 ps-sm-3 ps-3 mb-5 message-chat-history'>
          <div className='col-xxl-8 col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12 position-relative p-0'>
            <div className='user-d-status d-flex'>
              <button type='button' className='user-d-status-btn d-flex me-2'>
                <div className='position-relative me-2 align-self-center'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='currentColor' className='bi bi-clock' viewBox='0 0 16 16'>
                    {' '}
                    <path d='M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z' />{' '}
                    <path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z' />{' '}
                  </svg>
                  <div className='small-online'></div>
                </div>
                <span className='align-self-center'>Available</span>
              </button>
              <button type='button' className='user-d-status-btn'>
                <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' fill='currentColor' className='bi bi-person-fill' viewBox='0 0 16 16'>
                  <path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' />
                </svg>
              </button>
            </div>
            <Tabs defaultActiveKey='facebook' id='uncontrolled-tab-example' className='mb-3'>
              <Tab eventKey='facebook' title='FACEBOOK'>
                <UserChatCard />
              </Tab>
              <Tab eventKey='whatsapp' title='WHATSAPP'>
                <UserChatCard />
              </Tab>
              <Tab eventKey='instagram' title='INSTAGRAM'>
                <UserChatCard />
              </Tab>
            </Tabs>
          </div>
          <div>
            <EditChatBox passChildData={handleChildData} />
          </div>
        </div>
      </div>
      {loader && (
        <div className='loader-center'>
          <Loader />
        </div>
      )}
      {/* )} */}
    </>
  );
};

export default Agent;
