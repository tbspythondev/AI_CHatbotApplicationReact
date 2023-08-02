import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../assets/styles/Chatbot.css';
import '../assets/styles/KnowledgeBase.css';
import INTELICHAT_LOGO from '../assets/images/InteliChatLogo.png';
import { FaBars, FaRegWindowClose } from 'react-icons/fa';

const SideBarChildObject = {
  dashboard: [
    {
      label: 'Performance',
      href: '/dashboard',
    },
  ],
  chatbot: [
    {
      label: 'Company Profile',
      href: '/chatbot',
    },
    {
      label: 'Bot Profile',
      href: '/chatbot/knowledgebase',
    },
    // {
    //   label: 'Set Message',
    //   href: '/chatbot/knowledgebase',
    // },
    {
      label: 'Scan URL',
      href: '/chatbot/websitescrape',
    },
    {
      label: 'Knowledge Base',
      href: '/chatbot/knowledgebasefaq',
    },
  ],
  integrations: [
    {
      label: 'All Integrations',
      href: '/integrations',
    },
  ],
  knowledgebase: [
    {
      label: 'Knowledge Base',
      href: '/knowledgebasefaq',
    },
  ],
  autoresponse: [
    {
      label: ' Agent Knowlwdge',
      href: '/agentknowledge',
    },
    {
      label: 'Auto Response',
      href: '/agentknowledge/knowledgebase',
    },
  ],
  setting: [
    {
      label: ' Profile',
      href: '/setting',
    },
    {
      label: 'Change password',
      href: '/setting/changepassword',
    },
  ],
  guide: [
    {
      label: 'Create Facebook Business Account',
      href: '#FbLink',
    },
    {
      label: 'Create Instagram Business Professional Account',
      href: '#IgLink',
    },
    {
      label: 'Create a Facebook Page',
      href: '#FbPageLink',
    },
    {
      label: 'Link Facebook & Instagram Account',
      href: '#Fb_IgPageLink',
    },
  ],
};
const SideBarChildObjectLabel = {
  dashboard: [{ label: 'Dashboard' }],
  chatbot: [{ label: 'Chatbot' }],
  knowledgebase: [{ label: 'Knowledge Base' }],
  autoresponse: [{ label: 'Auto Response' }],
  integrations: [{ label: 'Integrations' }],
  setting: [{ label: 'Profile' }],
  guide: [{ label: 'Guide' }],
};

const Layout = () => {
  const location = useLocation();
  let tabactive = null;

  if (location.pathname === '/dashboard' || location.pathname.includes('/dashboard')) {
    tabactive = 'dashboard';
  } else if (location.pathname === '/chatbot' || location.pathname.includes('/chatbot')) {
    tabactive = 'chatbot';
  } else if (location.pathname === '/knowledgebasefaq') {
    tabactive = 'knowledgebase';
  } else if (location.pathname === '/agentknowledge' || location.pathname.includes('/agentknowledge')) {
    tabactive = 'autoresponse';
  } else if (location.pathname === '/integrations' || location.pathname.includes('/integrations')) {
    tabactive = 'integrations';
  } else if (location.pathname === '/guide' || location.pathname.includes('/guide')) {
    tabactive = 'guide';
  } else if (location.pathname === '/setting' || location.pathname.includes('/setting')) {
    tabactive = 'setting';
  }

  const [isOpen, setIsOpen] = useState(true);
  const [tabSelected, setTabSelected] = useState(tabactive);
  return (
    <>
      <div className='d-flex app-layout'>
        <Sidebar setTabSelected={setTabSelected} />
        <div className='sideBarExtend d-flex' id='sidebar-wrapper'>
          {/* Main responsive sidebar............ */}
          {/* <div className={`${isOpen ? 'open' : 'close'} main-wrapper`}>
            <div className='intelichat-container h-100'>
              <div className='intelichat-conatiner-left'>
                <div className='intelichat-conatiner-contain'>
                  {SideBarChildObjectLabel[tabactive]?.map((opt) => (
                    <div className='intelichat-header-text mainMenuItem'>
                      <h3 className='opensans-semibold text-white'>{opt.label}</h3>
                    </div>
                  ))}

                  <div className='intelichat-body-text'>
                    <div className='intelichat-link row subMenuItem'>
                      {SideBarChildObject[tabactive]?.map((opt) => (
                        <Link to={opt.href} className={`${location?.pathname == opt.href ? 'active' : ''}`}>
                          {opt.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className='intelichat-logo'>
                    <img src={INTELICHAT_LOGO} alt='logo' />
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Mobile responsive sidebar............ */}
          {/* <div className='mobile-sideBarExtend d-flex' id='sidebar-wrapper'>
            <div className='toogle-icon' onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaRegWindowClose /> : ''}
            </div>
            <div className={`${isOpen ? 'open' : 'close'}`}>
              <div className='intelichat-container h-100'>
                <div className='intelichat-conatiner-left'>
                  <div className='intelichat-conatiner-contain'>
                    {SideBarChildObjectLabel[tabactive]?.map((opt) => (
                      <div className='intelichat-header-text mainMenuItem'>
                        <h3 className='opensans-semibold text-white'>{opt.label}</h3>
                      </div>
                    ))}

                    <div className='intelichat-body-text'>
                      <div className='intelichat-link row subMenuItem'>
                        {SideBarChildObject[tabactive]?.map((opt) => (
                          <Link to={opt.href} className={`${location?.pathname == opt.href ? 'active' : ''}`}>
                            {opt.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='intelichat-logo'>
                    <img src={INTELICHAT_LOGO} alt='logo' />
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* Main Components ....... */}
          <div className='w-100 intelichat-overflow'>
            {/* <div className='toogle-icon' onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaRegWindowClose /> : <FaBars />}
            </div> */}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
