import { API_BASE_URLS } from './Constant';
import { toast } from 'react-toastify';

export const setLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = (key) => {
  return localStorage.getItem(key);
};
export const clearLocalStorage = () => {
  return localStorage.clear();
};

export const addClassToBody = (nameOfClass) => {
  var body = document.getElementsByTagName('body')[0];
  body.classList.add(nameOfClass);
};
export const removeClassToBody = (nameOfClass) => {
  var body = document.getElementsByTagName('body')[0];
  body.classList.remove(nameOfClass);
};

export const postWithoutToken = (url, values) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};

export const postWithToken = (url, token, values) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};

export const patchWithPdf = (url, token, values) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'PATCH',
    body: values,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};

export const patchWithToken = (url, token, values) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'PATCH',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};

export const getWithToken = (url, token) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};

export const getWithoutToken = (url, values) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};

export const deleteWithToken = (url, token) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};
export const deleteWithoutToken = (url) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};
export const deleteAllWithToken = (url, token, values) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(values),
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};

export const Chatbot_Update = (url, token, values) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'POST',
    body: values,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};

export const patchAvtarWithToken = (url, token, values) => {
  return fetch(API_BASE_URLS.baseUrl + url, {
    method: 'PATCH',
    body: values,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch((error) => toast.error(error?.response?.data?.message));
};
