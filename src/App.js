import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './assets/styles/Global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Installed from './Pages/Installed';
import UpComing from './Pages/UpComing';
import ChangePassword from './Pages/ChangePassword';
import RegisterForm from './Pages/authentication/RegisterForm';
import OtpVerification from './Pages/authentication/OtpVerification';
import LoginForm from './Pages/authentication/LoginForm';
import { Slide, ToastContainer } from 'react-toastify';
import ForgotPassword from './Pages/authentication/ForgotPassword';
import Guide from './Pages/Guide';
import ResetPassword from './Pages/authentication/ResetPassword';
import Loader from './components/Loader';
import AuthGaurd from './components/Guards/AuthGaurd';
import UnAuthGaurd from './components/Guards/UnAuthGaurd';
import DashboardPerformance from './Pages/DashboardPerformance';
import CustomerInteractions from './Pages/CustomerInteractions';
import KnowledgeBaseSetMessage from './Pages/KnowledgeBaseSetMessage';
import Notification from './Pages/Notification';
import { getLocalStorage } from './API/Api';
import NotFound from './Pages/NotFound';
import ChatBotProfile from './Pages/ChatBotProfile';
import ComingSoon from './Pages/ComingSoon';
import ThreeDotLoader from './components/ThreeDotLoader';
import AutoResponse from './Pages/AutoResponse';
import TestChatBot from './Pages/authentication/TestChatBot';
import UserProfile from './Pages/UserProfile';
import Policy from './components/Policy';

import WebsiteScrape from './Pages/WebsiteScrape';
import Agent from './Pages/Agent';
import KnowledgeBaseFAQ from './Pages/KnowledgeBaseFAQ';
import Layout from './components/Layout';
import WidgetChatbot from './components/WidgetChatbot';
import MyLeads from './Pages/MyLeads';
import Callback from './Pages/Callback';

function App() {
  let token = getLocalStorage('apiToken');
  return (
    <>
      <ToastContainer autoClose={1000} transition={Slide} />
      <BrowserRouter>
        <Routes>
          {!token && <Route path='/' element={<Navigate to='/login' />} />}
          {token && <Route path='/' element={<Navigate to='/dashboard' />} />}

          <Route path='/' element={<Layout />}>
            <Route element={<AuthGaurd />}>
              <Route path='/dashboard' element={<DashboardPerformance />} />
              <Route path='/dashboard/customerinteractions' element={<CustomerInteractions />} />
              <Route path='/chatbot' element={<ChatBotProfile />} />
              <Route path='/chatbot/knowledgebase' element={<KnowledgeBaseSetMessage />} />
              <Route path='/chatbot/websitescrape' element={<WebsiteScrape />} />
              <Route path='/chatbot/knowledgebasefaq' element={<KnowledgeBaseFAQ />} />
              <Route path='/integrations' element={<Installed />} />
              <Route path='/agentknowledge' element={<Agent />} />
              <Route path='/agentknowledge/knowledgebase' element={<AutoResponse />} />
              <Route path='/setting' element={<UserProfile />} />
              <Route path='/setting/changepassword' element={<ChangePassword />} />
              <Route path='/setting/integration' element={<ComingSoon />} />
              <Route path='/upcoming' element={<UpComing />} />
              <Route path='/guide' element={<Guide />} />
              <Route path='/leads' element={<MyLeads />} />
            </Route>
          </Route>
          <Route path='/preview' element={<WidgetChatbot />} />
          <Route path='/testchatbot' element={<TestChatBot />} />
          <Route path='/policy' element={<Policy />} />
          <Route path='/callback' element={<Callback />} />

          <Route path='/threedot' exact element={<ThreeDotLoader />} />

          <Route path='/notification' element={<Notification />} />
          <Route path='/notification' element={<Notification />} />
          <Route path='/loader' element={<Loader />} />

          <Route element={<UnAuthGaurd />}>
            <Route path='/' element={<LoginForm />}>
              <Route path='/login' element={<LoginForm />} />
            </Route>
            <Route path='/register' element={<RegisterForm />} />

            <Route path='/otpverification/:code' element={<OtpVerification />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='/resetpassword/:code/:code' element={<ResetPassword />} />
          </Route>
          <Route path='/*' exact element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
