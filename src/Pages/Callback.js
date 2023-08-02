import React, { useEffect } from 'react';
import { getLocalStorage, postWithToken } from '../API/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const Navigate = useNavigate();

  var parameter = window.location.search.split('code=')[1].split('&')[0];
  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      postData(JSON.parse(token));
    }
  }, []);

  const postData = async (token) => {
    const payload = {
      code: parameter,
    };
    await postWithToken('oauth/callback/', token, payload)
      .then((response) => {
        if (response.status == 200) {
          toast.dismiss();
          toast.success(response.message);
          Navigate('/integrations');
        } else if (response.status == 400) {
          // toast.error(response.message);
        }
      })
      .catch((error) => {});
  };

  return <></>;
};

export default Callback;
