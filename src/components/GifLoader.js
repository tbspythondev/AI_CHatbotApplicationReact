import React from 'react';

const GifLoader = () => {
  return (
    <div id='preloader' className='text-center p-md-5 p-2'>
      <h3 className='opensans-semibold text-white'>Chirpflo Learning</h3>
      <p className='opensans-bold text-white loader-text pt-md-3 pt-2'>
        Chirpflo is on a quest to learn everything about your business, like a brave explorer in uncharted territory. So please sit tight as it maps out the perfect set of FAQs for
        you. In a moment, you'll see how amazing it is as it creates a set of answers based on what it's learning right now. And if it times out, just hit retry and we'll continue
        from where we left off!
      </p>
      <div id='status'>&nbsp;</div>
    </div>
  );
};

export default GifLoader;
