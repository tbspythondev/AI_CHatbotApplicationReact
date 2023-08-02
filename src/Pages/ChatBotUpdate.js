// import React, { useEffect, useState } from 'react';
// import Header from '../components/Header';
// import { getLocalStorage, getWithToken, patchAvtarWithToken, patchWithToken, postWithToken } from '../API/Api';
// import { toast } from 'react-toastify';
// import DEFAULT from '../assets/images/profile_image.png';
// import Chatpath from '../components/WidgetChatbot';

// const ChatBotUpdate = () => {
//   const [apiTokenData, setApiTokenData] = useState('');
//   const [widgetValues, setWidgetValues] = useState({ bot_names: '', color: '', chatbot_avtar: '', launcher_icon: '', default_launcher_icon: '' });

//   const [imgUrlPath, setImgUrlPath] = useState({
//     id: '',
//     link: '',
//     status: '',
//   });
//   const [avatarPreview, setAvatarPreview] = useState('');
//   const [status, setStatus] = useState(false);
//   const [disable, setDisable] = useState(false);

//   const { bot_names, color, chatbot_avtar, launcher_icon, default_launcher_icon } = widgetValues;

//   const userHandleChange = (e) => {
//     if (e.target.files) {
//       const file = e.target.files[0];
//       setWidgetValues({ ...widgetValues, [e.target.name]: file });

//       // Generate a preview of the uploaded image
//       const reader = new FileReader();
//       reader.onload = () => {
//         setAvatarPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//       setDisable(true);
//     } else {
//       setWidgetValues({ ...widgetValues, [e.target.name]: e.target.value });
//     }
//   };

//   const launcherIconHandleChange = (e) => {
//     e.preventDefault();
//     let fd = new FormData();
//     fd.append('launcher_icon', e.target.files[0]);

//     patchAvtarWithToken('Icons_Image_WidgetAPI/', apiTokenData, fd)
//       .then((response) => {
//         console.log('response: ', response);
//         if (response.status === 200) {
//           setImgUrlPath({
//             id: response.data.user,
//             link: response.data.launcher_icon,
//             // status: false,
//           });
//           setStatus(true);
//           toast.success(response.message);
//           getWidgetDetails(apiTokenData);
//         } else if (response.status === 400) {
//           toast.error(response.message);
//         }
//       })
//       .catch((error) => {});
//   };

//   const getWidgetDetails = (token) => {
//     getWithToken('Webchat_widgetAPI/', token)
//       .then((response) => {
//         if (response.status === 200) {
//           setWidgetValues({
//             bot_names: response?.data?.bot_name,
//             color: response?.data?.color,
//             default_launcher_icon: response?.data?.default_launcher_icon,
//             chatbot_avtar: response?.data?.chatbot_avtar,
//             launcher_icon: response?.data?.launcher_icon,
//           });
//           console.log(widgetValues, 'widgetValues');
//         }
//       })
//       .catch((error) => {
//         toast.error('Something went wrong');
//       });
//   };

//   useEffect(() => {
//     let token = getLocalStorage('apiToken');
//     if (token) {
//       getWidgetDetails(JSON.parse(token));
//       setApiTokenData(JSON.parse(token));
//     }
//   }, []);

//   const LauncherIconChange = (image, index) => {
//     setStatus(false);
//     const updatedIcons = default_launcher_icon.map((icon, i) => {
//       if (i === index) {
//         return {
//           ...icon,
//           status: true,
//         };
//       } else {
//         return {
//           ...icon,
//           status: false,
//         };
//       }
//     });
//     setWidgetValues((prevValues) => ({
//       ...prevValues,
//       default_launcher_icon: updatedIcons,
//     }));

//     setImgUrlPath({
//       id: index,
//       link: image.link,
//       status: updatedIcons[index].status,
//     });
//   };

//   const UpdateChatBotData = (e) => {
//     e.preventDefault();

//     let fd = new FormData();
//     fd.append('default_launcher_icon', imgUrlPath?.id);
//     fd.append('bot_name', bot_names);
//     fd.append('color', color);

//     patchAvtarWithToken('Webchat_widgetAPI/', apiTokenData, fd)
//       .then((response) => {
//         if (response.status === 200) {
//           toast.success(response.message);
//           getWidgetDetails(apiTokenData);
//         } else if (response.status === 400) {
//           toast.error(response.message);
//         }
//       })
//       .catch((error) => {});
//   };

//   const avtarSubmit = (e) => {
//     e.preventDefault();
//     let fd = new FormData();
//     fd.append('chatbot_avtar', chatbot_avtar);

//     patchAvtarWithToken('Avtar_Image_WidgetAPI/', apiTokenData, fd)
//       .then((response) => {
//         if (response.status === 200) {
//           toast.success(response.message);
//           getWidgetDetails(apiTokenData);
//           setDisable(false);
//         } else if (response.status === 400) {
//           toast.error(response.message);
//         }
//       })
//       .catch((error) => {});
//   };

//   const handleCopyText = () => {
//     const JS_Payload = {
//       js: `function initChatWidget(){const testName='${bot_names}';const avtarImg='${chatbot_avtar}';const icon='${imgUrlPath.link}';const bg_color='${color}';initializeChatWidget(testName,avtarImg,icon,bg_color);}window.addEventListener('load',function(){initChatWidget();});`,
//     };

//     patchWithToken('Copy_WidgetAPI/', apiTokenData, JS_Payload)
//       .then((response) => {
//         if (response.status == 200) {
//           const textToCopy = `<script src="${response.data.js_script_file}"></script>
//           <script src="http://webapi.chirpflo.com/media/logo/Widget.js"></script>`;
//           const tempInput = document.createElement('textarea');
//           tempInput.value = textToCopy;
//           document.body.appendChild(tempInput);
//           tempInput.select();
//           document.execCommand('copy');
//           document.body.removeChild(tempInput);
//         }
//       })
//       .catch((error) => {});
//   };

//   return (
//     <>
//       <div className='chatbot-container'>
//         <div className='chatbot-fixed'>
//           <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between px-2 px-md-5'>
//             <div></div>
//             <div className='chatbot-header'>
//               <h3 className='opensans-bold mb-0'>Chatbot Update</h3>
//             </div>
//             <div className='d-flex justify-content-end responsive-header-width'>
//               <Header />
//             </div>
//           </div>
//         </div>
//         <div className='m-0 pt-5 ps-md-5 ps-sm-3 ps-3'>
//           <div className='col-xxl-7 col-xl-7 col-lg-8 col-md-12 col-sm-12 col-12 p-0'>
//             <div className='chatbox-field'>
//               {/* <div className='chatbox-input-text input-GPT new mb-5'>
//                 <label className='opensans-medium'>Turn On/Off</label>
//                 <div className='chatbox-input-field'>
//                   <div className='switch-background '>
//                     <label className='switch'>
//                       <input type='checkbox' id='' name='name' />
//                       <span className='slider round'></span>
//                     </label>
//                   </div>
//                 </div>
//               </div> */}
//               <div className='chatbox-input-text align-items-start input-GPT new mb-5'>
//                 <label className='opensans-medium'>Chatbot Avatar</label>
//                 <div className='chatbox-input-field d-flex align-items-end'>
//                   <div className='profile-pic-wrapper'>
//                     <div className='pic-holder'>
//                       {avatarPreview ? <img id='profilePic' className='pic' src={avatarPreview} /> : <img id='profilePic' className='pic' src={chatbot_avtar} />}

//                       <input
//                         className='uploadProfileInput'
//                         type='file'
//                         name='chatbot_avtar'
//                         id='newProfilePhoto'
//                         accept='image/*'
//                         style={{ opacity: '0' }}
//                         onChange={userHandleChange}
//                       />
//                       <label htmlFor='newProfilePhoto' className='upload-file-block'>
//                         <div className='text-center'>
//                           <div className='mb-2'>
//                             <i className='fa fa-camera fa-2x'></i>
//                           </div>
//                           <div className='text-uppercase'>
//                             Update <br /> Profile Photo
//                           </div>
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                   <button className='btn btn-submit-login rounded ms-3 mt-lg-0' disabled={!disable} onClick={avtarSubmit}>
//                     Upload
//                   </button>
//                 </div>
//               </div>
//               <div className='chatbox-input-text input-GPT new mb-5'>
//                 <label className='opensans-medium'>Bot Name*</label>
//                 <div className='chatbox-input-field'>
//                   <input type='text' placeholder='John' className='form-control chatbox-input' name='bot_names' value={bot_names} autoComplete='off' onChange={userHandleChange} />
//                 </div>
//               </div>
//               <div className='chatbox-input-text input-GPT new mb-5'>
//                 <label className='opensans-medium'>Color*</label>
//                 <div className='chatbox-input-field'>
//                   <input type='color' name='color' className='' value={color} autoComplete='off' onChange={userHandleChange} />
//                 </div>
//               </div>
//               <div className='chatbox-input-text input-GPT align-items-start new mb-3'>
//                 <label className='opensans-medium'>Launcher Icon</label>
//                 <div className='chatbox-input-field'>
//                   <div className=' d-flex flex-wrap align-items-center'>
//                     {default_launcher_icon.length > 0 &&
//                       default_launcher_icon?.map((image, index) => (
//                         <div key={index} className={`chatboxupdate-logo me-3 ${image.status ? 'active' : ''}`} onClick={() => LauncherIconChange(image, index)}>
//                           <img src={image.link} alt='chatbox-logo' />
//                         </div>
//                       ))}
//                   </div>
//                   <div className='d-flex flex-wrap align-items-center mt-4'>
//                     <p className='opensans-bold text-white mb-0 me-3'>Or</p>
//                     {widgetValues?.launcher_icon?.length > 0 && (
//                       <div className={`chatboxupdate-logo me-3 ${status ? 'active' : ''}`}>
//                         <img src={launcher_icon} alt='chatbox-logo' />
//                       </div>
//                     )}
//                     <div class='launcher-upload-button'>
//                       <input type='file' id='fileInput' onChange={(e) => launcherIconHandleChange(e)} />
//                       <label for='fileInput'>Choose File</label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className='d-flex align-items-center justify-content-center pt-5'>
//                 <button className='btn btn-submit-login ms-3 mt-lg-0' onClick={UpdateChatBotData}>
//                   Update
//                 </button>
//                 <button className='btn  btn-submit-copy  text-uppercase ms-md-2 ms-0' type='button' onClick={handleCopyText}>
//                   Copy data
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatBotUpdate;
