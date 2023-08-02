import React from 'react';

const ThreeDotLoader = () => {
  const snippets = document.querySelectorAll('.snippet');

  for (let i = 0; i < snippets.length; i++) {
    snippets[i].addEventListener('mouseleave', clearTooltip);
    snippets[i].addEventListener('blur', clearTooltip);
  }

  function clearTooltip(e) {
    e.currentTarget.setAttribute('className', 'snippet');
    e.currentTarget.removeAttribute('aria-label');
  }
  return (
    <>
      <div className='threedot-loader'>
        <div className='snippet' data-title='dot-flashing'>
          <div className='stage'>
            <div className='dot-flashing'></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreeDotLoader;
