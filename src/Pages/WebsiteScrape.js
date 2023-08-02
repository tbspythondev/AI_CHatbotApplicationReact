import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addClassToBody, clearLocalStorage, deleteWithToken, getLocalStorage, getWithToken, patchWithPdf, patchWithToken, postWithToken } from '../API/Api';
import { AiFillDelete, AiFillCloseSquare } from 'react-icons/ai';
import { IoMdCloudUpload } from 'react-icons/io';
import { FaEdit, FaSave, FaRegFilePdf } from 'react-icons/fa';
import { FcApproval } from 'react-icons/fc';
import Header from '../components/Header';
import Loader from '../components/Loader';
import EditChatBox from '../components/EditChatBox';
import GifLoader from '../components/GifLoader';

const WebsiteScrape = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [scan_url, setScan_url] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [checkedUrlList, setCheckedUrlList] = useState([]);
  const [urlListScan, setUrlListScan] = useState([]);
  const [apiTokenData, setApiTokenData] = useState('');
  const [loader, setLoader] = useState(false);
  const [gifLoader, setGifLoader] = useState(false);
  const Navigate = useNavigate();
  const [selectedScanUrl, setSelectedScanUrl] = useState([]);
  const [displayContinue, setDisplayContinue] = useState(false);

  const [editData, setEditData] = useState([]);
  const [editChatData, setEditChatData] = useState([]);
  const [DeleteAllPopUpOpen, setDeleteAllPopUpOpen] = useState(false);
  const [DeletePopUpOpen, setDeletePopUpOpen] = useState(false);
  const [deleteData, setDeleteData] = useState('');
  const [moveToScroll, setMoveToScroll] = useState(false);
  const [selectAllData, setSelectAllData] = useState(false);
  const [childData, setChildData] = useState(false);
  const [postDataPopUp, setPostDataPopUp] = useState(false);
  const [scaning, setScaning] = useState(false);
  const [addText, setAddText] = useState('');
  const [addTextBox, setAddTextBox] = useState(false);
  const [uploadFile, setUploadFile] = useState([]);
  const [uploadedPdf, setUploadedPdf] = useState('');
  const [dotLoader, setDotLoader] = useState(false);
  const [dotLoaderIndex, setDotLoaderIndex] = useState('false');

  const [editPostValues, setEditPostValues] = useState({
    questions: '',
    answers: '',
  });

  const state = useLocation();

  const { questions, answers } = editPostValues;

  const moveToBottomref = useRef(null);
  const moveToTopref = useRef(null);
  useEffect(() => {
    addClassToBody('no-chat');
    let token = getLocalStorage('apiToken');
    let ScanUrl = getLocalStorage('scanUrl');
    if (token) {
      setApiTokenData(JSON.parse(token));
      knowledgeLibrary(JSON.parse(token));
      if (state.state != null) {
        if (!ScanUrl) {
          getUploadPdf(JSON.parse(token));
        } else {
          setUploadedPdf('');
        }
      } else {
        getUploadPdf(JSON.parse(token));
      }
    } else {
      Navigate('/login');
    }
  }, [childData]);

  useEffect(() => {
    let ScanUrl = getLocalStorage('scanUrl');
    let token = getLocalStorage('apiToken');
    if (state.state != null) {
      if (ScanUrl != undefined) {
        setApiTokenData(JSON.parse(token));
        setScan_url(ScanUrl);
        getUrlListData(ScanUrl, JSON.parse(token));
      }
    } else {
      localStorage.removeItem('scanUrl');
    }
  }, []);

  const companyHandleChange = (e) => {
    setUploadFile([]);
    if (e.target.value) {
      setUploadedPdf('');
    } else {
      getUploadPdf(apiTokenData);
    }
    setSelectedScanUrl([]);
    setScan_url(e.target.value);
  };

  const getUrlListData = (ScanUrl, token) => {
    setUploadFile([]);
    setUrlList([]);
    setUrlListScan([]);
    if (ScanUrl != '') {
      let obj = {
        url: ScanUrl,
      };
      localStorage.setItem('scanUrl', ScanUrl);
      setScaning(true);
      postWithToken('Knowledge_baseURLAPI', token, obj)
        .then((response) => {
          let urlData = [];
          if (response.status == 200) {
            response?.data.forEach((element) => {
              urlData.push({ data: element.url, checked: element.scan, disableChecked: element.scan });
            });
            setScaning(false);
            setUrlList(urlData);
            setCheckedUrlList(urlData);
            setDisplayContinue(true);
          } else if (response.code == 'token_not_valid') {
            clearLocalStorage();
          } else {
            toast.error(response?.message);
          }
        })
        .catch((error) => {
          toast.error('Something went wrong');
        });
    } else {
      toast.error('Enter website URL');
    }
  };

  const onChangeofScan = (e, index) => {
    if (e.target.checked == true) {
      setSelectedScanUrl([...selectedScanUrl, { value: e.target.value, index: index }]);
      let newUrlData = [...urlList];
      newUrlData = newUrlData.filter((value, ind) => {
        if (index == ind) {
          newUrlData.splice(ind, 1, { data: value.data, checked: true });
          setUrlList(newUrlData);
        }
      });
    } else {
      let newArray = [...selectedScanUrl];
      newArray = newArray.filter((value, i) => value.index !== index);
      setSelectedScanUrl(newArray);
      let newUrlData = [...urlList];
      newUrlData = newUrlData.filter((value, ind) => {
        if (index == ind) {
          newUrlData.splice(ind, 1, { data: value.data, checked: false });
          setUrlList(newUrlData);
        }
      });
    }
  };

  const handleSelectAllData = () => {
    setSelectAllData(true);
    let setUrlData = [];
    let selectedData = [];
    urlList.forEach((element, index) => {
      selectedData.push({ value: element.data, index: index });
      setUrlData.push({ data: element.data, checked: true, disableChecked: element.disableChecked });
    });
    setSelectedScanUrl(selectedData);
    setUrlList(setUrlData);
  };
  const handleDeSelectAllData = () => {
    setSelectAllData(false);
    let setUrlData = [];
    let selectedData = [];
    urlList.forEach((element, index) => {
      setUrlData.push({ data: element.data, checked: false, disableChecked: element.disableChecked });
    });
    setSelectedScanUrl([]);
    setUrlList(checkedUrlList);
  };

  const submitScanData = () => {
    if (selectedScanUrl.length > 0) {
      setGifLoader(true);
      setEditData([]);
      let sendUrlData = [];
      selectedScanUrl.forEach((data) => {
        sendUrlData.push(data.value);
      });
      let obj = {
        url_links: sendUrlData,
      };
      postWithToken('KB_questionsURLAPI', apiTokenData, obj)
        .then((response) => {
          if (response.status == 200) {
            setTimeout(() => {
              setGifLoader(false);
              Navigate('/chatbot/knowledgebasefaq', { state: { id: response?.task_id, length: sendUrlData?.length } });
            }, 8000);
            knowledgeLibrary(apiTokenData);
          } else if (response.code == 'token_not_valid') {
            clearLocalStorage();
          } else if (response.status == 504) {
            toast.error('Extracting knowledge base in the background, you may proceed.');
          } else {
            toast.dismiss();
            toast.error(response.message);
          }
        })
        .catch((error) => {
          toast.error('Something went wrong');
        });
    } else {
      toast.error('Select minimum 1 URL');
    }
  };

  const knowledgeLibrary = (token) => {
    setLoader(true);
    postWithToken('Questions_API/', token, { source: '2' })
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
          setLoader(false);
          setChildData(false);
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
          toast.success('Value updated');
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
          toast.success('Value Deleted');
          setLoader(false);
          setDeletePopUpOpen(false);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
      });
  };
  const handleDeleteAllData = () => {
    deleteWithToken('Questions_ALL_API/', apiTokenData)
      .then((response) => {
        if (response.status == 200) {
          setActiveTab('1');
          knowledgeLibrary(apiTokenData);
          handleBack();
          toast.success('All Values Deleted');
          setLoader(false);
          setDeleteAllPopUpOpen(false);
        } else if (response.code == 'token_not_valid') {
          // clearLocalStorage();
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
  const handleBack = () => {
    setUrlList([]);
    setSelectedScanUrl([]);
    setDisplayContinue(false);
    setScan_url('');
    setActiveTab('1');
  };

  const onChangeEditNewData = (e) => {
    setEditPostValues({
      ...editPostValues,
      [e.target.name]: e.target.value,
    });
  };

  const savePostData = () => {
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
          setEditPostValues('');
          toast.success(response.message);
        } else if (response.status == 400) {
          toast.error(response.message);
          setLoader(false);
        }
      })
      .catch((error) => {
        toast.error(error);
        setLoader(false);
      });
  };

  const handleGetText = () => {
    setAddTextBox(true);
    setUploadFile([]);
    setUploadedPdf('');
    getWithToken('Text_questionsURLAPI', apiTokenData)
      .then((response) => {
        if (response.status == 200) {
          setAddText(response?.data);
        } else if (response.status == 400) {
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleAddText = () => {
    const obj = {
      text: addText,
    };
    patchWithToken('Text_questionsURLAPI', apiTokenData, obj)
      .then((response) => {
        if (response.status == 200) {
          setAddTextBox(false);
          getUploadPdf(apiTokenData);
          toast.success(response.message);
        } else if (response.status == 400) {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSelectFile = (e) => {
    const file = Array.from(e.target.files);
    getUploadPdf(apiTokenData);
    setUploadFile((prevSelectedFiles) => [...prevSelectedFiles, ...file]);
    setAddTextBox(false);
  };

  const getUploadPdf = (token) => {
    getWithToken('PDF_questionsURLAPI', token)
      .then((response) => {
        if (response.status == 200) {
          setUploadedPdf(response?.data);
        } else if (response.code == 'token_not_valid') {
          clearLocalStorage();
        }
      })
      .catch((error) => {
        // toast.error('Something went wrong');
      });
  };

  const handleFileOpen = (file) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, '_blank');
    }
  };
  const handleSelectFileDelete = (index) => {
    setUploadFile((prevUploadFiles) => {
      const updatedFiles = [...prevUploadFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB (adjust the size as needed)

  const handleUploadFile = async (file, index) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Please upload files no larger than 15MB!');
        return;
      }

      const allowedExtensions = ['pdf'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        toast.error('Unsupported file format. Please use PDF files.');
        return;
      }
      let fd = new FormData();
      fd.append('pdf', file);

      setDotLoaderIndex(index);
      setDotLoader(true);
      try {
        const response = await patchWithPdf('PDF_questionsURLAPI', apiTokenData, fd);
        if (response.status === 200) {
          toast.success(response.message);
          setDotLoader(false);
          getUploadPdf(apiTokenData);
          setUploadFile((prevUploadFiles) => {
            const updatedFiles = [...prevUploadFiles];
            updatedFiles.splice(index, 1);
            return updatedFiles;
          });
        } else if (response.status === 400) {
          toast.error(response.message);
          setDotLoader(false);
        }
      } catch (error) {
        console.error(error);
        setDotLoader(false);
      }
    }
  };

  const handleUploadedDelete = async () => {
    try {
      const response = await deleteWithToken('PDF_questionsURLAPI', apiTokenData);
      if (response.status === 200) {
        getUploadPdf(apiTokenData);
        toast.success(response.message);
      } else if (response.status === 400) {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='intelichat-conatiner-right'>
        <div className='chatbot-container'>
          <div className='chatbot-fixed header-responsive'>
            <div className='d-block d-md-flex flex-wrap align-items-center justify-content-between'>
              <div className=''>
                <h3 className='opensans-bold mb-0 text-white'>Website Scrape</h3>
              </div>
              <div className='d-flex justify-content-end responsive-header-width'>
                <Header />
              </div>
            </div>
          </div>

          <div className='row m-0 ps-md-5 ps-sm-3 ps-3 pe-2'>
            <>
              <div ref={moveToTopref}>
                {activeTab == '1' && (
                  <>
                    <div className='website-scrape-body mb-5'>
                      <div className='position-sticky-FAQ'>
                        <h4 className='opensans-bold'>Scan Website</h4>
                        <div className='row'>
                          <div className='col-xxl-6 col-xl-8 col-lg-9 col-md-7 col-sm-12 col-12 website-scrape-text'>
                            <p className='opensans-regular text-white mt-3'>
                              Enter your URL, select the subpages you'd like to scan, and watch us convert your website into organized question answer pairs.
                            </p>

                            <div className='websitescrape-input-field w-75'>
                              <input
                                type='text'
                                placeholder='Enter a website URL to scan'
                                className='form-control chatbox-input rounded-2'
                                autoComplete='off'
                                value={scan_url}
                                onChange={companyHandleChange}
                                disabled={displayContinue}
                              />
                            </div>
                            <div className='row align-items-center mt-5'>
                              <div className='col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12'>
                                {!displayContinue ? (
                                  <button
                                    className={`btn btn-submit-login  text-uppercase ${scaning && 'dot-loading d-flex justify-content-center align-items-center'} `}
                                    onClick={() => getUrlListData(scan_url, apiTokenData)}
                                  >
                                    {scaning ? 'Scanning' : 'Scan'}
                                  </button>
                                ) : (
                                  <button className='btn btn-submit-login  text-uppercase' onClick={() => submitScanData()}>
                                    Continue
                                  </button>
                                )}
                              </div>
                              {scan_url == '' && (
                                <>
                                  <div className='col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12 mt-lg-0 mt-3'>
                                    <button className='btn btn-submit-login  text-uppercase' onClick={() => handleGetText()}>
                                      Add Text
                                    </button>
                                  </div>
                                  <div className='col-xl-4 col-lg-6 col-md-12 col-sm-8 col-12 mt-xl-0 mt-3'>
                                    <label htmlFor='uploadDocument' className='custom-upload-btn text-uppercase'>
                                      <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' className='bi bi-arrow-up-short' viewBox='0 0 16 16'>
                                        <path
                                          fill-rule='evenodd'
                                          d='M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z'
                                          fill='white'
                                        ></path>
                                      </svg>
                                      Select Document
                                    </label>
                                    <input type='file' name='uploadDocument' id='uploadDocument' className='d-none' onChange={(e) => handleSelectFile(e)} />
                                  </div>
                                </>
                              )}
                            </div>
                            {displayContinue && (
                              <div className='pt-4'>
                                {!selectAllData ? (
                                  <button className='btn btn-submit-add me-2' onClick={() => handleSelectAllData()}>
                                    Select All
                                  </button>
                                ) : (
                                  <button className='btn btn-submit-add me-2 ' onClick={() => handleDeSelectAllData()}>
                                    Deselect All
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {urlList.map((row, i) => (
                        <>
                          <div className='d-flex align-items-center mt-4 websitescrape-label'>
                            <label style={{ opacity: row?.disableChecked ? '0.5' : '1' }} className={row?.disableChecked ? 'scrapeSelected' : 'noScrapeSelected'}>
                              <input
                                type='checkbox'
                                id='i'
                                name='i'
                                disabled={row?.disableChecked}
                                onChange={(e) => onChangeofScan(e, i)}
                                value={row.data}
                                checked={row?.checked}
                              />
                              {row?.data}
                            </label>
                          </div>
                        </>
                      ))}
                      {addTextBox && (
                        <>
                          {scan_url == '' && (
                            <>
                              <div>
                                <textarea
                                  placeholder='Add Your Text'
                                  className='addtextbox-textarea px-3 py-2 mt-3'
                                  value={addText}
                                  rows={30}
                                  onChange={(e) => setAddText(e.target.value)}
                                />
                              </div>
                              <button className='btn bg-themeBlue text-white me-2' onClick={() => handleAddText()}>
                                Save
                              </button>
                              <button
                                className='btn bg-white color-theme-blue'
                                onClick={() => {
                                  setAddTextBox(false);
                                  getUploadPdf(apiTokenData);
                                }}
                              >
                                Close
                              </button>
                            </>
                          )}
                        </>
                      )}

                      <div className='attach-file-upload mt-5'>
                        {((uploadedPdf?.pdf_url && uploadedPdf.pdf_url.length > 0) || uploadFile.length > 0) && <h2 className='opensans-bold color-theme-blue'>File Preview:</h2>}
                        {uploadedPdf?.pdf_url?.length > 0 && (
                          <div className='d-flex align-items-center attach-file-documents mt-3'>
                            <div className='attach-icon me-4 cursor-pointer' onClick={() => handleUploadedDelete()}>
                              <AiFillCloseSquare className='text-danger' />
                            </div>
                            <div className='attach-icon me-4'>
                              <FaRegFilePdf className='color-theme-blue' />
                            </div>
                            <a href={uploadedPdf?.pdf_url} target='_blank' rel='noopener noreferrer' className='m-0'>
                              {uploadedPdf?.name}
                            </a>
                            <div className='uploadpdf-icon ms-4 cursor-pointer'>
                              <IoMdCloudUpload className='color-theme-blue' />
                              <span className='uploadpdf-check'>
                                <FcApproval />
                              </span>
                            </div>
                            <div className='uploadpdf-icon ms-2 cursor-pointer'>
                              <button className='btn btn-success'>Uploaded</button>
                            </div>
                          </div>
                        )}

                        {uploadFile.map((file, index) => (
                          <div className='d-flex align-items-center attach-file-documents mt-3'>
                            <div className='attach-icon me-4 cursor-pointer' onClick={() => handleSelectFileDelete(index)}>
                              <AiFillCloseSquare className='text-danger' />
                            </div>
                            <div className='attach-icon me-4'>
                              <FaRegFilePdf className='color-theme-blue' />
                            </div>

                            <a href='#' target='_blank' rel='noopener noreferrer' className='m-0' onClick={() => handleFileOpen(file)} key={index}>
                              {file.name}
                            </a>

                            <div className='uploadpdf-icon ms-4 cursor-pointer'>
                              <IoMdCloudUpload className='color-theme-blue' />
                            </div>
                            <div className='uploadpdf-icon ms-2 cursor-pointer' onClick={() => handleUploadFile(file, index)}>
                              <button className={`btn btn-primary d-flex align-items-end ${index === dotLoaderIndex && dotLoader ? 'dot-loading' : ''}`}>
                                {dotLoader && index === dotLoaderIndex ? 'Uploading' : 'Upload to Hub'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
            {/* )} */}

            {activeTab == '2' && (
              <>
                <div className='col-xxl-8 col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12 p-0'>
                  <div className='website-scrape-body mb-5'>
                    <div className='website-scrape-body mb-5'>
                      <div className='position-sticky-FAQ'>
                        <h4 className='opensans-bold'>Library Of Knowledge</h4>
                        <div className='d-flex flex-wrap align-items-center justify-content-between pt-4 mb-4'>
                          {editData.length !== 0 && (
                            <button className='btn btn-submit-add' onClick={() => setDeleteAllPopUpOpen(true)}>
                              Clear All FAQs
                            </button>
                          )}
                          <div></div>
                          <button className='btn add-new-data me-5 mt-md-0 mt-3' onClick={() => setPostDataPopUp(true)}>
                            Add New FAQs
                          </button>
                        </div>
                        <span className='opensans-regular text-white'>
                          Learned Pairs:<span className='mx-1'>{editData.length}</span>
                        </span>
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
                              {editPostValues.answers != '' && (
                                <button className='btn' type='button' onClick={() => savePostData()}>
                                  <FaSave />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* <p className='opensans-regular text-white mt-3'>
                        Enter your URL, select the subpages you'd like to scan, and watch us convert your website into organized question answer pairs.
                      </p> */}
                      <div className='my-4 card-body knowledge-pair-overflow'>
                        <div className='knowledge-pair-container'>
                          {editData?.map((data, index) => (
                            <div className='my-3'>
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
                                  <div className='text-white knowledge-pair-icon'>
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
                            // </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xxl-4 col-xl-5 col-lg-12 col-md-12 col-sm-12 col-12'>
                  <EditChatBox passChildData={setChildData} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {loader && (
        <div className='loader-center'>
          <Loader />
        </div>
      )}
      {gifLoader && (
        <div className='custom-popup'>
          <GifLoader />
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
    </>
  );
};

export default WebsiteScrape;
