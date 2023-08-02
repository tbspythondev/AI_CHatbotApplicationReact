import React, { useState } from 'react';

const UserChatCard = () => {
  return (
    <>
      <div className='d-flex media-custom-object-main justify-content-between align-items-center'>
        <div className='d-flex align-items-center'>
          <div className='media-image me-3 position-relative'>
            <img src='https://mdbcdn.b-cdn.net/img/new/avatars/2.webp' className='rounded-circle' />
            <div className='user-status'></div>
          </div>
          <div className='media-custom-object align-self-center'>
            <h5>Michael Jonson</h5>
            <p>Today is a bit rush bro!</p>
          </div>
        </div>
        <div className='media-time p-0 '>
          <p>12.45 AM</p>
        </div>
      </div>

      <div className='d-flex media-custom-object-main justify-content-between align-items-center active'>
        <div className='d-flex align-items-center'>
          <div className='media-image me-3 position-relative'>
            <img src='http://eliteadmin.themedesigner.in/demos/bt4/university/dist/images/users/11.jpg' className='rounded-circle' />
            <div className='user-status'></div>
          </div>
          <div className='media-custom-object align-self-center'>
            <h5>Malika Zoe</h5>
            <p>After 10 am</p>
          </div>
        </div>
        <div className='media-time p-0 '>
          <p>12.41 AM</p>
        </div>
      </div>

      <div className='d-flex media-custom-object-main justify-content-between align-items-center'>
        <div className='d-flex align-items-center'>
          <div className='media-image me-3 position-relative'>
            <img src='https://www.corporatephotographerslondon.com/wp-content/uploads/2021/07/LinkedIn_profile_photo_sample_1-300x300.jpg' className='rounded-circle' />
            <div className='user-status away'>10 min</div>
          </div>
          <div className='media-custom-object align-self-center'>
            <h5>Chris Lai</h5>
            <p>What will best for my business?</p>
          </div>
        </div>
        <div className='media-time p-0 '>
          <p>Fri</p>
        </div>
      </div>

      <div className='d-flex media-custom-object-main justify-content-between align-items-center'>
        <div className='d-flex align-items-center'>
          <div className='media-image me-3 position-relative'>
            <img src='https://www.webxcreation.com/event-recruitment/images/profile-1.jpg' className='rounded-circle' />
            <div className='user-status away'>1 day</div>
          </div>
          <div className='media-custom-object align-self-center'>
            <h5>Jonson Bae</h5>
            <p>Please book a meeting.</p>
          </div>
        </div>
        <div className='media-time p-0 '>
          <p>Sat</p>
        </div>
      </div>

      <div className='d-flex media-custom-object-main justify-content-between align-items-center'>
        <div className='d-flex align-items-center'>
          <div className='media-image me-3 position-relative'>
            <img src='https://www.corporatephotographerslondon.com/wp-content/uploads/2021/07/LinkedIn_profile_photo_sample_smiling-300x300.jpg' className='rounded-circle' />
            <div className='user-status away'>1 hour</div>
          </div>
          <div className='media-custom-object align-self-center'>
            <h5>Adrina Adam</h5>
            <p>Sure</p>
          </div>
        </div>
        <div className='media-time p-0 '>
          <p>Mar 1</p>
        </div>
      </div>
    </>
  );
};

export default UserChatCard;
