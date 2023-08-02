import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearLocalStorage, deleteAllWithToken, deleteWithToken, getLocalStorage, getWithToken, patchWithToken, postWithToken } from '../API/Api';
import { FaEdit, FaSave } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import Loader from '../components/Loader';
import EditChatBox from '../components/EditChatBox';
import { AiFillDelete } from 'react-icons/ai';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const initialValue = {
  questions: '',
  answers: '',
};

const KnowledgeBaseFAQ = () => {
  const [apiTokenData, setApiTokenData] = useState('');
  const [loader, setLoader] = useState(false);
  const [dotLoader, setDotLoader] = useState(false);
  const Navigate = useNavigate();
  const [editData, setEditData] = useState([]);
  const [DeleteAllPopUpOpen, setDeleteAllPopUpOpen] = useState(false);
  const [DeletePopUpOpen, setDeletePopUpOpen] = useState(false);
  const [deleteData, setDeleteData] = useState('');
  const [childData, setChildData] = useState(false);
  const [postDataPopUp, setPostDataPopUp] = useState(false);
  const [editPostValues, setEditPostValues] = useState({
    questions: '',
    answers: '',
  });
  const [source, setSource] = useState('2');
  const [proccessData, setProccessData] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [widgetID, setWidgetID] = useState('');

  const proccessId = useLocation();

  const { questions, answers } = editPostValues;
  useEffect(() => {
    let token = getLocalStorage('apiToken');
    if (token) {
      setApiTokenData(JSON.parse(token));
      knowledgeLibrary(JSON.parse(token));
      getWidgetDetails(JSON.parse(token));
    } else {
      Navigate('/login');
    }
  }, [childData, source]);

  useEffect(() => {
    let token = getLocalStorage('apiToken');
    let intervalId;

    const fetchData = () => {
      setDotLoader(true);
      getWithToken('KB_questionsURLAPI/' + proccessId?.state?.id, JSON.parse(token))
        .then((response) => {
          if (response.status === 200) {
            setProccessData(response?.data);
            knowledgeLibrary(JSON.parse(token));
            if (response.data.percentange === 100) {
              clearInterval(intervalId);
              setDotLoader(false);
              setTimeout(() => {
                // toast.dismiss();
                // toast.success('Successfully');
                Navigate(window.location.pathname, {});
                knowledgeLibrary(JSON.parse(token));
              }, 10000);
            }
          } else if (response.code === 'token_not_valid') {
            // clearLocalStorage();
          }
        })
        .catch((error) => {
          toast.error('Something went wrong');
        });
    };

    if (proccessId?.state?.id != null && token) {
      setTimeout(() => {
        fetchData();
        intervalId = setInterval(fetchData, 5000);
      }, 0);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [proccessId?.state?.id]);

  const handleChildData = (data) => {
    setChildData(data);
  };

  const knowledgeLibrary = (token) => {
    setLoader(true);
    postWithToken('Questions_API/', token, { source: source })
      .then((response) => {
        if (response.status == 200) {
          let editDataValue = [];
          response.data.forEach((element, index) => {
            editDataValue.push({
              value: false,
              index: index,
              question: element.questions,
              answer: element.answers,
              id: element.id,
              source: element.source,
              source_name: element.source_name,
            });
          });
          setEditData(editDataValue);
          setChildData(false);
          setLoader(false);
        } else if (response.code == 'token_not_valid') {
          setLoader(false);
          clearLocalStorage();
        }
      })
      .catch((error) => {
        setLoader(false);
        toast.error('Something went wrong');
      });
  };

  // const handleTabActive = (sourceIndex) => {
  //   console.log('sourceIndex: ', sourceIndex);
  //   setSource(sourceIndex);
  // };

  const handelEditData = (newData) => {
    let handlerEdit = [...editData];
    handlerEdit[newData.index].value = true;
    setEditData(handlerEdit);
  };

  const handelSaveData = (newData) => {
    let handlerEdit = [...editData];
    handlerEdit[newData.index].value = false;
    setEditData(handlerEdit);

    let obj = {
      source: newData.source,
      questions: newData.question,
      answers: newData.answer,
    };

    patchWithToken('Questions_API/' + newData.id, apiTokenData, obj)
      .then((response) => {
        if (response.status == 200) {
          toast.dismiss();
          toast.success('Message successfully updated.');
          knowledgeLibrary(apiTokenData);
          setLoader(false);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const handleDelete = (newData) => {
    setDeleteData(newData);
    setDeletePopUpOpen(true);
  };
  const handleDeleteData = () => {
    deleteWithToken('Questions_API/' + deleteData.id, apiTokenData)
      .then((response) => {
        if (response.status == 200) {
          knowledgeLibrary(apiTokenData);
          toast.success('Message Deleted');
          setLoader(false);
          setDeletePopUpOpen(false);
        } else if (response.code == 'token_not_valid') {
          knowledgeLibrary(apiTokenData);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };
  const handleDeleteAllData = () => {
    deleteAllWithToken('Questions_ALL_API/', apiTokenData, { source: source })
      .then((response) => {
        if (response.status == 200) {
          knowledgeLibrary(apiTokenData);
          toast.success("All FAQ's cleared successfully.");
          setLoader(false);
          setDeleteAllPopUpOpen(false);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        } else if (response.status == 400) {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };

  const editQuestion = (event, newData, key) => {
    if (key == 'question') {
      let handlerEdit = [...editData];
      handlerEdit[newData.index].value = true;
      handlerEdit[newData.index].question = event.target.value;
      setEditData(handlerEdit);
    } else {
      let handlerEdit = [...editData];
      handlerEdit[newData.index].value = true;
      handlerEdit[newData.index].answer = event.target.value;
      setEditData(handlerEdit);
    }
  };
  const onChangeEditNewData = (e) => {
    setEditPostValues({
      ...editPostValues,
      [e.target.name]: e.target.value,
    });
  };

  const resolveAfter3Sec = new Promise((resolve) => setTimeout(resolve, 2800));

  const savePostData = () => {
    if (editPostValues.answers != '') {
      setLoader(true);
      const obj = {
        questions: editPostValues.questions,
        answers: editPostValues.answers,
      };
      postWithToken('Questions_ALL_API/', apiTokenData, obj)
        .then((response) => {
          if (response.status == 200) {
            knowledgeLibrary(apiTokenData);
            setLoader(false);
            setPostDataPopUp(false);
            setEditPostValues(initialValue);
            // toast.success(response.message);
            toast.promise(new Promise((response) => setTimeout(response, 2800)), {
              pending: response.message,
              success: response.message,
              // error: 'Promise rejected 🤯',
            });
          } else if (response.status == 400) {
            toast.error(response.message);
            setLoader(false);
          }
        })
        .catch((error) => {
          toast.error(error);
          setLoader(false);
        });
    } else {
      toast.dismiss();
      toast.error('Enter The Answers!');
    }
  };
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
      <div className='intelichat-conatiner-right'>
        <div className='chatbot-container'>
          <div className='chatbot-fixed header-responsive'>
            <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between'>
              <div className=''>
                <h3 className='opensans-bold mb-0 text-white'>Knowledge Base</h3>
              </div>
              <div className='d-flex justify-content-end responsive-header-width'>
                <Header />
              </div>
            </div>
          </div>
          <div className='row m-0 ps-md-5 ps-sm-3 ps-3 mb-5'>
            <div className='col-xxl-8 col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12'>
              <div className='website-scrape-body mb-5'>
                <div className='position-sticky-FAQ'>
                  <h4 className='opensans-bold'>Library Of Knowledge</h4>
                  <div className='d-flex flex-wrap align-items-center mt-3'>
                    <button className={`btn btn-tab me-2  mt-2 ${source == '2' ? 'color-theme-blue' : 'text-black'} `} onClick={() => setSource('2')}>
                      By Chirpflo
                    </button>

                    <button className={`btn btn-tab me-2 mt-2 ${source == '1' ? 'color-theme-blue' : 'text-black'}`} onClick={() => setSource('1')}>
                      Created By You
                    </button>
                    <button className={`btn btn-tab me-2  mt-2 ${source == '3' ? 'color-theme-blue' : 'text-black'}`} onClick={() => setSource('3')}>
                      Live Edited Response
                    </button>
                  </div>

                  <div className='d-flex flex-wrap align-items-center justify-content-between pt-4 mb-4'>
                    <div className='mt-3'>
                      {editData.length !== 0 && (
                        <button className='btn btn-submit-add' onClick={() => setDeleteAllPopUpOpen(true)}>
                          Clear All FAQs
                        </button>
                      )}
                      {!proccessId?.state?.id && (
                        <button className='btn btn-submit-add ms-md-2 ms-0 mt-md-0 mt-2' onClick={() => Navigate('/chatbot/websitescrape', { state: 'scanurl' })}>
                          Continue Scanning URL
                        </button>
                      )}
                    </div>
                    {source == '1' && (
                      <div className='mt-3'>
                        <button className='btn add-new-data me-5' onClick={() => setPostDataPopUp(true)}>
                          Add New FAQs
                        </button>
                      </div>
                    )}
                  </div>

                  <div className='d-flex flex-wrap justify-content-between align-items-center'>
                    <span className='opensans-regular text-white '>
                      Learned Pairs:<span className='mx-1'>{editData.length}</span>
                    </span>
                    {proccessId?.state != null && (
                      <div>
                        <div>
                          <h6 className={`opensans-bold color-theme-blue d-flex align-items-center ${dotLoader && 'dot-loading'}`}>Create in your Knowledgebase</h6>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                          {proccessId?.state?.length != null ? (
                            <div className='opensans-bold text-white'>Success URL : {proccessData?.success_url != undefined ? proccessData?.success_url : 0} </div>
                          ) : null}
                          {/* <div className='opensans-bold text-white'>Success URL : {proccessId?.state?.length != null ? proccessData?.success_url : null} </div> */}

                          {proccessId?.state?.length != null ? (
                            <div className='opensans-bold text-white mx-3'>Total URL : {proccessId?.state?.length}</div>
                          ) : (
                            <div className='opensans-bold text-white me-3'>Generating the FAQ : </div>
                          )}
                          <div className='progress me-3' style={{ width: '150px' }}>
                            <div
                              className='progress-bar progress-bar-striped '
                              role='progressbar'
                              style={{ width: `${proccessData?.percentange}%`, background: '#04bcff' }}
                              aria-valuenow='10'
                              aria-valuemin='0'
                              aria-valuemax='100'
                            >
                              {proccessData?.percentange}%
                            </div>
                          </div>
                          {/* <CircularProgressbar
                            value={proccessData?.percentange}
                            // maxValue={1}
                            text={`${proccessData?.percentange != undefined ? proccessData?.percentange : 0}%`}
                            styles={buildStyles({
                              textColor: '#ffffff',
                              pathColor: 'turquoise',
                              trailColor: '#ffffff',
                            })}
                          /> */}
                          {/* </div> */}
                          <button className='btn add-new-data  mt-md-0 mt-3 me-5' onClick={() => knowledgeLibrary(apiTokenData)}>
                            <FiRefreshCw /> <span className='opensans-semibold ms-2'>Update FAQs List</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row align-items-center m-0'>
                  <div className='col-xl-10 col-lg-10 col-md-10 col-sm-12 col-12 p-0'>
                    {postDataPopUp && (
                      <div className='knowledge-pair-body'>
                        <textarea
                          placeholder='Enter your question here.'
                          id='questions'
                          name='questions'
                          values={questions}
                          onChange={(e) => onChangeEditNewData(e)}
                          autoComplete='off'
                          className='px-3 py-2'
                        ></textarea>
                        <hr className='text-white m-0' />
                        <textarea
                          placeholder='Enter your answer here.'
                          id='answers'
                          name='answers'
                          values={answers}
                          onChange={(e) => onChangeEditNewData(e)}
                          autoComplete='off'
                          className='px-3 py-2'
                        ></textarea>
                      </div>
                    )}
                  </div>
                  <div className='col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12 p-0'>
                    {postDataPopUp && (
                      <div className='text-white knowledge-pair-icon text-left text-md-center'>
                        {editPostValues.questions != '' && (
                          <button className='btn' type='button' onClick={() => savePostData()}>
                            <FaSave />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className='my-4 card-body knowledge-pair-overflow'>
                  <div className='knowledge-pair-container'>
                    {editData?.map((data, index) => (
                      <div className='my-3' key={index}>
                        <div className='row align-items-center m-0'>
                          <div className='col-xl-10 col-lg-10 col-md-10 col-sm-12 col-12 p-0'>
                            <div className='knowledge-pair-body'>
                              {!editData[index].value ? (
                                <p className='opensans-regular color-theme-blue px-3 py-2 m-0'>{data.question}</p>
                              ) : (
                                <textarea placeholder='Add question' className='px-3 py-2' onChange={(e) => editQuestion(e, data, 'question')}>
                                  {data.question}
                                </textarea>
                              )}
                              <hr className='text-white m-0' />
                              {!editData[index].value ? (
                                <p className='opensans-regular text-white px-3 py-2 m-0'>{data.answer}</p>
                              ) : (
                                <textarea placeholder='Add answer' className='px-3 py-2' onChange={(e) => editQuestion(e, data, 'answer')}>
                                  {data.answer}
                                </textarea>
                              )}
                            </div>
                            {data.source_name != '' && (
                              <p className='opensans-regular text-white px-3 py-2 m-0'>
                                <span className='opensans-bold'>Source Name :</span> {data.source_name}
                              </p>
                            )}
                          </div>

                          <div className='col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12 p-0'>
                            <div className='text-white knowledge-pair-icon text-left text-md-center'>
                              {!editData[index].value ? (
                                <button className='btn' type='button' onClick={() => handelEditData(data)}>
                                  <FaEdit />
                                </button>
                              ) : (
                                <button className='btn' type='button' onClick={() => handelSaveData(data)}>
                                  <FaSave />
                                </button>
                              )}
                              <button className='btn' type='button' onClick={() => handleDelete(data)}>
                                <AiFillDelete />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <EditChatBox passChildData={handleChildData} />
            </div>
          </div>
          {loader && (
            <div className='loader-center'>
              <Loader />
            </div>
          )}
          {DeleteAllPopUpOpen && (
            <div className='custom-popup'>
              <div className='popup-content'>
                <hr />
                <div className={'popup-head'}>
                  <h4>Are you sure you want to delete all data?</h4>
                </div>
                <hr />
                <div className='popup-footer'>
                  <button className='btn success-btn mx-1 text-capitalize' onClick={() => handleDeleteAllData()}>
                    Delete
                  </button>
                  <button className='btn danger-btn mx-1 text-capitalize' data-dismiss='modal' onClick={() => setDeleteAllPopUpOpen(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {DeletePopUpOpen && (
            <div className='custom-popup'>
              <div className='popup-content'>
                <hr />
                <div className={'popup-head'}>
                  <h4>Are you sure you want to delete?</h4>
                </div>
                <hr />
                <div className='popup-footer'>
                  <button className='btn success-btn mx-1 text-capitalize' onClick={() => handleDeleteData()}>
                    Delete
                  </button>
                  <button className='btn danger-btn mx-1 text-capitalize' data-dismiss='modal' onClick={() => setDeletePopUpOpen(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KnowledgeBaseFAQ;
