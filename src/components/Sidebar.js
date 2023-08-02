import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import LOGO from '../assets/icons/Logo.svg';
import DASHBOARD_ICON from '../assets/icons/Dashboard_icon.svg';
import CHATBOT_ICON from '../assets/icons/ChatBot_icon.svg';
import LIVE_CHAT_ICON from '../assets/icons/Live_Chat.svg';
import INTEGRATIONS_ICON from '../assets/icons/Integrations_icon.svg';
import SETTINGS_ICON from '../assets/icons/Settings_icon.svg';
import SHARE_ICON from '../assets/icons/Share_icon.svg';
import BELL_ICON from '../assets/icons/Bell_icon.svg';
import USER_ICON from '../assets/icons/User1_icon.svg';
import GUIDEUSER_ICON from '../assets/icons/GuideUser.svg';
import LEAD_ICON from '../assets/icons/leads_icon.svg';
import '../assets/styles/Sidebar.css';
import INTELICHAT_LOGO from '../assets/images/chirpfloLogo.png';
import { Link } from 'react-router-dom';

const Sidebar = ({ setTabSelected }) => {
  const location = useLocation();
  return (
    <div className='sidebar-menu-left'>
      <div className='sidebar-conatiner'>
        <div className='logo-icon' onClick={() => setTabSelected('dashboard')}>
          <NavLink to='/dashboard'>
            <img src={LOGO} alt='logo' className='simple-logo' />
            <img src={INTELICHAT_LOGO} alt='logo' className='full-logo' />
          </NavLink>
        </div>
        <nav className='sidebar-nav-content'>
          <ul className='m-0'>
            <li className={`sidebar-icon ${location?.pathname == '/dashboard' && 'active-border-left'}`} onClick={() => setTabSelected('dashboard')}>
              <NavLink to='/dashboard'>
                <img src={DASHBOARD_ICON} alt='dashboard-icon' />
                <h2 className={`hover-effect opensans-bold ${location?.pathname == '/dashboard' && 'hoverActive'}`}>Analytics</h2>
              </NavLink>
            </li>
            <li
              className={`sidebar-icon ${
                (location?.pathname == '/chatbot' ||
                  location?.pathname == '/chatbot/knowledgebase' ||
                  location?.pathname == '/chatbot/websitescrape' ||
                  location?.pathname == '/chatbot/knowledgebasefaq') &&
                'active-border-left'
              }`}
              onClick={() => setTabSelected('chatbot')}
            >
              <NavLink to='/chatbot'>
                <img src={CHATBOT_ICON} alt='chatbot-icon' />
                <div className='accordion' id='accordiontrainbot'>
                  <div className='accordion-item'>
                    <h2
                      className={`hover-effect accordion-header ${
                        (location?.pathname == '/chatbot' ||
                          location?.pathname == '/chatbot/knowledgebase' ||
                          location?.pathname == '/chatbot/websitescrape' ||
                          location?.pathname == '/chatbot/knowledgebasefaq') &&
                        'hoverActive'
                      }`}
                      id='train-bot'
                    >
                      <button
                        className='accordion-button collapsed opensans-bold'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#collapsetrainbot'
                        aria-expanded='true'
                        aria-controls='collapsetrainbot'
                      >
                        Train Bot
                      </button>
                    </h2>
                  </div>
                </div>
                {/* <h1
                  className={`hover-effect ${
                    (location?.pathname == '/chatbot' ||
                      location?.pathname == '/chatbot/knowledgebase' ||
                      location?.pathname == '/chatbot/websitescrape' ||
                      location?.pathname == '/chatbot/knowledgebasefaq') &&
                    'hoverActive'
                  }`}
                >
                  Train Bot
                </h1> */}
              </NavLink>
            </li>
            <div id='collapsetrainbot' className='accordion-collapse collapse' aria-labelledby='train-bot' data-bs-parent='#accordiontrainbot'>
              <div className='accordion-body'>
                <div className='accordion-modify'>
                  <Link to='/chatbot' className={`opensans-semibold ${location?.pathname == '/chatbot' ? 'hoverActive' : ''}`}>
                    Company Profile
                  </Link>
                </div>
                <div className='accordion-modify'>
                  <Link to='/chatbot/knowledgebase' className={`opensans-semibold ${location?.pathname == '/chatbot/knowledgebase' ? 'hoverActive' : ''}`}>
                    Bot Profile
                  </Link>
                </div>
                <div className='accordion-modify'>
                  <Link to='/chatbot/websitescrape' className={`opensans-semibold ${location?.pathname == '/chatbot/websitescrape' ? 'hoverActive' : ''}`}>
                    Train Agent
                  </Link>
                </div>
                <div className='accordion-modify'>
                  <Link to='/chatbot/knowledgebasefaq' className={`opensans-semibold ${location?.pathname == '/chatbot/knowledgebasefaq' ? 'hoverActive' : ''}`}>
                    Knowledge Base
                  </Link>
                </div>
              </div>
            </div>

            {/* <li className={`sidebar-icon ${location?.pathname == '/knowledgebasefaq' && 'active-border-left'}`} onClick={() => setTabSelected('knowledgebasefaq')}>
              <NavLink to='/knowledgebasefaq'>
                <img src={KNOWLEDGE_BASEFAQ_ICON} alt='chatbot-icon' />
                <h1 className={`hover-effect ${location?.pathname == '/knowledgebasefaq' && 'hoverActive'}`}>Knowledge Base</h1>
              </NavLink>
            </li> */}

            {/* <li
              className={`sidebar-icon ${(location?.pathname == '/agentknowledge' || location?.pathname == '/agentknowledge/knowledgebase') && 'active-border-left'}`}
              onClick={() => setTabSelected('autoresponse')}
            >
              <NavLink to='/agentknowledge'>
                <img src={LIVE_CHAT_ICON} alt='knowledgebase-icon' />
                <div className='accordion' id='accordionlivechat'>
                  <div className='accordion-item'>
                    <h2
                      className={`hover-effect ${(location?.pathname == '/agentknowledge' || location?.pathname == '/agentknowledge/knowledgebase') && 'hoverActive'}`}
                      id='live-chat'
                    >
                      <button
                        className='accordion-button collapsed opensans-bold'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#collapselivechat'
                        aria-expanded='true'
                        aria-controls='collapselivechat'
                      >
                        Live Chat
                      </button>
                    </h2>
                  </div>
                </div>
              </NavLink>
            </li> */}

            <div id='collapselivechat' className='accordion-collapse collapse' aria-labelledby='train-bot' data-bs-parent='#accordionlivechat'>
              <div className='accordion-body'>
                <div className='accordion-modify'>
                  <Link to='/agentknowledge' className={`opensans-semibold ${location?.pathname == '/agentknowledge' ? 'hoverActive' : ''}`}>
                    Agent Knowledge
                  </Link>
                </div>
                <div className='accordion-modify'>
                  <Link to='/agentknowledge/knowledgebase' className={`opensans-semibold ${location?.pathname == '/agentknowledge/knowledgebase' ? 'hoverActive' : ''}`}>
                    Auto Response
                  </Link>
                </div>
              </div>
            </div>

            <li className={`sidebar-icon ${location?.pathname == '/integrations' && 'active-border-left'}`} onClick={() => setTabSelected('integrations')}>
              <NavLink to='/integrations'>
                <img src={INTEGRATIONS_ICON} alt='integrations_icon' />
                <h2 className={`hover-effect opensans-bold ${location?.pathname == '/integrations' && 'hoverActive'}`}>Integrations</h2>
              </NavLink>
            </li>
            <li className={`sidebar-icon ${location?.pathname == '/guide' && 'active-border-left'}`} onClick={() => setTabSelected('guide')}>
              <NavLink to='/guide'>
                <img src={GUIDEUSER_ICON} alt='share-icon' />
                <h2 className={`hover-effect opensans-bold ${location?.pathname == '/guide' && 'hoverActive'}`}>Guide</h2>
              </NavLink>
            </li>
            <li
              className={`sidebar-icon ${(location?.pathname == '/setting' || location?.pathname == '/setting/changepassword') && 'active-border-left'}`}
              onClick={() => setTabSelected('setting')}
            >
              <NavLink to='/setting'>
                <img src={SETTINGS_ICON} alt='knowledgebase-icon' />
                <div className='accordion' id='accordionsetting'>
                  <div className='accordion-item'>
                    <h2 className={`hover-effect ${(location?.pathname == '/setting' || location?.pathname == '/setting/changepassword') && 'hoverActive'}`} id='setting'>
                      <button
                        className='accordion-button collapsed opensans-bold'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#collapsesetting'
                        aria-expanded='true'
                        aria-controls='collapsesetting'
                      >
                        Setting
                      </button>
                    </h2>
                  </div>
                </div>
                {/* <h1 className={`hover-effect ${(location?.pathname == '/setting' || location?.pathname == '/setting/changepassword') && 'hoverActive'}`}>Setting</h1> */}
              </NavLink>
            </li>

            <div id='collapsesetting' className='accordion-collapse collapse' aria-labelledby='setting' data-bs-parent='#accordionsetting'>
              <div className='accordion-body'>
                <div className='accordion-modify'>
                  <Link to='/setting' className={`opensans-semibold ${location?.pathname == '/setting' ? 'hoverActive' : ''}`}>
                    Profile
                  </Link>
                </div>
                <div className='accordion-modify'>
                  <Link to='/setting/changepassword' className={`opensans-semibold ${location?.pathname == '/setting/changepassword' ? 'hoverActive' : ''}`}>
                    Change password
                  </Link>
                </div>
              </div>
            </div>
            <li className={`sidebar-icon ${location?.pathname == '/leads' && 'active-border-left'}`} onClick={() => setTabSelected('leads')}>
              <NavLink to='/leads'>
                <img src={LEAD_ICON} alt='share-icon' />
                <h2 className={`hover-effect opensans-bold ${location?.pathname == '/leads' && 'hoverActive'}`}>Leads</h2>
              </NavLink>
            </li>
          </ul>
          <ul className='m-0 d-none'>
            <li className='sidebar-icon'>
              <NavLink to='/upcoming'>
                <img src={SHARE_ICON} alt='share-icon' />
              </NavLink>
            </li>
            <li className='sidebar-icon'>
              <NavLink to='/notification'>
                <img src={BELL_ICON} alt='bell-icon' />
              </NavLink>
            </li>
            <li className='sidebar-icon'>
              <NavLink to='/profile'>
                <img src={USER_ICON} alt='user-icon' />
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
