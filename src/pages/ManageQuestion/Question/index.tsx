import { Input, Loader, Modal, Popover, Select } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import paperClip from 'assets/icon/paper-clip.svg';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import MathJaxRender from 'components/MathJax';
import Pagination from 'components/Pagination';
import PreviewQuestion from 'components/PreviewQuestion';
import Table from 'components/Table';
import {
  Add,
  ArrowDown2,
  ArrowUp2,
  DocumentUpload,
  Edit2,
  Eye,
  FilterSearch,
  Graph,
  Trash,
} from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Constant, QuestionPreview } from 'store/selector';
import { updateQuestion, updateQuestionEdit, updateQuestionPreview } from 'store/slice/question';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import toast, { notify } from 'utils/notify';
import { formatTimeString } from 'utils/utils';
import FilterComponent from './filter';
import './style.css';

interface question {
  idQuestion: number;
  grade: grade[];
  listClass: InfoClass[];
  listSubject: subject[];
  level: number;
  awareness_level: number;
  type: number;
  quiz_type: number;
  answer_type: number;
  name?: string;
  listTag: any[];
  text: string;
  createdBy: string;
}
interface choice {
  title: string;
  value: string;
}

interface grade {
  idSchoolLevel: number;
  name: string;
}
interface InfoClass {
  idSchoolLevel: number;
  idClass: number;
  name: string;
}
interface subject {
  idSubject: number;
  name: string;
}
interface dataCon {
  quiz_type: choice[];
  level: choice[];
  answerType: choice[];
  type: choice[];
  awarenessLevel: choice[];
}

const ManageQuestionContainer = () => {
  const toastId = useRef<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questionPreviewRedux = useSelector(QuestionPreview);

  const [listQuestion, setListQuestion] = useState<question[]>([]);
  const [DataQuestion, setDataQuestion] = useState<any[]>([]);
  const [dataContaint, setDataContaint] = useState<dataCon>();
  const [opened, setOpened] = useState(false);
  const [opened1, setOpened1] = useState(false);
  const [opened2, setOpened2] = useState(false);
  const [filter, setFilter] = useState(false);
  const [item, setItem] = useState('');
  const [show, setShow] = useState(false);
  const [listClass, setListClass] = useState<InfoClass[]>([]);
  const [grade, setGrade] = useState<grade[]>([]);
  const [subject, setSubject] = useState<subject[]>([]);
  const [arrLength, setArrLength] = useState(0);
  const [typeSelect, setTypeSelect] = useState(1);
  const [page, setPage] = useState(1);
  const [deleted, setDeleted] = useState(false);
  const [idQuestion, setIDQuestion] = useState(0);
  const [selectedFileWord, setSelectedFileWord] = useState<any>(null);
  const [selectedFileExcel, setSelectedFileExcel] = useState<any>(null);
  const [selectedFileAttr, setSelectedFileAttr] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [searchDefault, setSearchDefault] = useState<any>({
    idSubject: null,
    idClass: null,
    quiz_type: null,
    type: null,
    level: null,
    awareness_level: null,
    limit: 10,
    page: 1,
  });
  const [display, setDisplay] = useState(10);
  const constantFormRedux = useSelector(Constant);
  const constantForm = JSON.parse(JSON.stringify(constantFormRedux));
  const textTable = 'table';

  const getGrade = (id: number) => {
    let name = '';
    let i = 0;
    listClass.map((key) => {
      if (key.idClass === id) {
        i = key.idSchoolLevel;
      }
    });
    grade.map((key) => {
      if (key.idSchoolLevel === i) {
        name = key.name;
      }
    });
    return name;
  };
  const DeleteQuestion = () => {
    RequestAPI({
      url: PathAPI.question + '/' + idQuestion,
      method: 'DELETE',
      notify: {
        type: 'success',
        message: 'Xóa câu hỏi thành công',
      },
    });
    setDeleted(false);
    setLoading(true);
    RequestAPI({
      url: PathAPI.question,
      params: {
        page: page,
        limit: display,
      },
      method: 'GET',
    }).then((res: any) => {
      setListQuestion(res.data);
      setArrLength(Math.ceil(res.total / display));
      setLoading(false);
    });
  };
  // upload câu hỏi bằng file word
  const changeUploadFileWord = (event: any) => {
    // show tên file upload
    setSelectedFileWord(event.target.files[0]);
    const show = document.getElementById('file-word');
    if (show !== null) show.textContent = selectedFileWord.name;
  };
  // upload file thuộc tính câu hỏi
  const changeUploadFileExel = (event: any) => {
    // show tên file upload
    const show = document.getElementById('file-excel1');
    if (show !== null) show.textContent = event.target.files[0].name;
    setSelectedFileAttr(event.target.files[0]);
  };
  // upload câu hỏi bằng file excel
  const changeUploadFileExelV2 = (event: any) => {
    // show tên file upload
    const show = document.getElementById('file-excel');
    if (show !== null) show.textContent = event.target.files[0].name;
    setSelectedFileExcel(event.target.files[0]);
  };
  function getExtension(filename: string) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }
  // submit
  const submitData = (type: number) => {
    // type = 1: thêm câu hỏi file word
    localStorage.setItem('typeUpload', type + '');
    if (type === 1) {
      if (selectedFileWord == null) {
        notify({
          type: 'error',
          message: 'Chưa chọn file upload!',
        });
        return false;
      }
      var ext = getExtension(selectedFileWord.name);
      if (ext.toLowerCase() === 'docx') {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFileWord, selectedFileWord.name);
        if (selectedFileAttr) {
          formData.append('file', selectedFileAttr, selectedFileAttr.name);
        }
        formData.append('quiz_type', item);

        toastId.current = toast('Đã tải lên, đang xử lý file...', {
          type: toast.TYPE.INFO,
          icon: <Loader />,
          autoClose: false,
          hideProgressBar: true,
          closeButton: false,
          closeOnClick: false,
        });
        RequestAPI({
          url: PathAPI.question + '/upload/docx',
          method: 'POST',
          payload: formData,
        })
          .then((res: any) => {
            if (res.status) {
              // dispatch(updateQuestion(res.data));
              // navigate('create/import');
              const autoRequest = function () {
                const idFile = res.data.idFile;
                RequestAPI({
                  url: `${PathAPI.question}/upload/docx/check?idFile=${idFile}`,
                  method: 'GET',
                }).then((res: any) => {
                  if (res.data.status === constantFormRedux.file.statusMap.success) {
                    dispatch(updateQuestion(res.data.listQuestion));
                    toast.update(toastId.current, {
                      render: 'Tải lên thành công!',
                      type: toast.TYPE.SUCCESS,
                      autoClose: 5000,
                      closeButton: true,
                      closeOnClick: true,
                      hideProgressBar: false,
                      icon: <CircleCheck size={25} strokeWidth={2} color={'#07bc0c'} />,
                    });
                    setIsUploading(false);
                    navigate('create/import');
                  } else if (res.data.status === constantFormRedux.file.statusMap.failed) {
                    toast.update(toastId.current, {
                      render: 'Tải lên thất bại!',
                      type: toast.TYPE.SUCCESS,
                      autoClose: 5000,
                      closeButton: true,
                      closeOnClick: true,
                      hideProgressBar: false,
                      icon: <CircleX size={25} strokeWidth={2} color={'#e74c3c'} />,
                    });
                    setIsUploading(false);
                  } else {
                    setIsUploading(false);

                    setTimeout(() => {
                      autoRequest();
                    }, 5000);
                  }
                });
              };
              autoRequest();
            }
          })
          .catch((err) => {
            setIsUploading(false);
            console.log(err);
          }),
          console.log(formData);
      } else
        return notify({
          type: 'error',
          message: 'Bạn chưa chọn đúng file định dạng .docx',
        });
    }
    if (type === 2) {
      if (selectedFileExcel == null) {
        notify({
          type: 'error',
          message: 'Chưa chọn file upload!',
        });
        return false;
      }
      var ext = getExtension(selectedFileExcel.name);
      if (ext.toLowerCase() === 'xlsx') {
        const formData = new FormData();
        formData.append('file', selectedFileExcel, selectedFileExcel.name);
        formData.append('quiz_type', item);

        toast.promise(
          RequestAPI({
            url: PathAPI.question + '/upload/excel',
            method: 'POST',
            payload: formData,
          })
            .then((res: any) => {
              setIsUploading(false);
              if (res.status) {
                dispatch(updateQuestion(res.data));
                navigate('create/import');
              }
            })
            .catch((err) => {
              setIsUploading(false);
              console.log(err);
            }),
          {
            pending: 'Đang tải tệp lên...',
            success: 'Tải lên thành công',
            error: 'Đã xảy ra lỗi',
          }
        );
      } else
        return notify({
          type: 'error',
          message: 'Bạn chưa chọn đúng file định dạng .xlsx',
        });
    }
  };
  const handlePaging = async (page: number) => {
    setPage(page);
    let data = searchDefault;
    data.page = page;
    data.limit = display;
    setLoading(true);
    RequestAPI({
      url: PathAPI.question,
      params: data,
      method: 'GET',
    }).then((res: any) => {
      setListQuestion(res.data);
      setArrLength(Math.ceil(res.total / display));
      setLoading(false);
    });
  };
  const filterData = async (val: string) => {
    setLoading(true);
    if (val.length === 0) {
      RequestAPI({
        url: PathAPI.question,
        params: {
          page: 1,
          limit: display,
        },
        method: 'GET',
      }).then((res: any) => {
        if (res.status) {
          setListQuestion(res.data);
          setArrLength(1);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
      return;
    }
    if (typeSelect === 1) {
      RequestAPI({
        url: PathAPI.question,
        params: {
          idQuestion: parseInt(val),
          limit: display,
        },
        method: 'GET',
      }).then((res: any) => {
        if (res.status) {
          setListQuestion(res.data);
          setArrLength(1);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    }
    if (typeSelect === 2) {
      RequestAPI({
        url: PathAPI.question,
        params: {
          name: val,
          limit: display,
        },
        method: 'GET',
      }).then((res: any) => {
        if (res.status) {
          setListQuestion(res.data);
          setArrLength(1);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    }
    if (typeSelect === 4) {
      RequestAPI({
        url: PathAPI.question,
        params: {
          text: val,
          limit: display,
        },
        method: 'GET',
      }).then((res: any) => {
        if (res.status) {
          setListQuestion(res.data);
          setArrLength(1);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    }
    if (typeSelect === 3) {
      let idTags = '';
      await RequestAPI({
        url: PathAPI.tag,
        params: {
          name: val.trim(),
        },
        method: 'GET',
      }).then((res: any) => {
        // setListQuestion(res.data);
        // setArrLength(1);
        idTags = res.data.map((key: any) => key.idTag).join(',');
      });
      RequestAPI({
        url: PathAPI.question,
        params: {
          idTag: idTags,
          limit: display,
        },
        method: 'GET',
      }).then((res: any) => {
        if (res.status) {
          setListQuestion(res.data);
          setArrLength(1);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    }
    if (typeSelect === 5) {
      let idTags = '';
      await RequestAPI({
        url: PathAPI.knowledgeUnit,
        params: {
          name: val.trim(),
        },
        method: 'GET',
      }).then((res: any) => {
        // setListQuestion(res.data);
        // setArrLength(1);
        idTags = res.data.map((key: any) => key.idKnowledgeUnit).join(',');
      });
      RequestAPI({
        url: PathAPI.question,
        params: {
          idKnowledgeUnit: idTags,
          limit: display,
        },
        method: 'GET',
      }).then((res: any) => {
        if (res.status) {
          setListQuestion(res.data);
          setArrLength(1);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    }
  };

  const handlePreviewQuestion = (id: number) => {
    RequestAPI({
      url: PathAPI.question + '/' + id,
      method: 'GET',
    }).then((res: any) => {
      dispatch(updateQuestionPreview(res.data));
      setIsOpenPreview(true);
    });
  };
  const handleEditQuestion = (id: number) => {
    RequestAPI({
      url: PathAPI.question + '/' + id,
      method: 'GET',
    }).then((res: any) => {
      // console.log('chien',res.data);

      dispatch(updateQuestionEdit(res.data));
      navigate('create');
    });
  };

  const formatTime = (time: string) => {
    return `${formatTimeString(time).hours}:${formatTimeString(time).minutes}:${
      formatTimeString(time).seconds
    }, ${formatTimeString(time).date}/${formatTimeString(time).month}/${
      formatTimeString(time).year
    }`;
  };
  const changeDisplay = (val: any) => {
    setDisplay(val);
    setLoading(true);
    RequestAPI({
      url: PathAPI.question,
      method: 'GET',
      params: {
        page: page,
        limit: val,
      },
      payload: searchDefault,
    }).then((res: any) => {
      setListQuestion(res.data);
      setArrLength(Math.ceil(res.total / display));
      setLoading(false);
    });
  };

  useEffect(() => {
    setDataContaint(constantFormRedux.question);
    RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
    }).then((res: any) => {
      setSubject(res.data);
    });

    RequestAPI({
      url: PathAPI.class,
      method: 'GET',
    }).then((res: any) => {
      setListClass(res.data);
    });
  }, []);
  const filterByData = (dt: any) => {
    if (filter) {
      let data = dt;
      data.page = page;
      data.limit = display;
      setSearchDefault(dt);
      setLoading(true);
      RequestAPI({
        url: PathAPI.question,
        params: data,
        method: 'GET',
      }).then((res: any) => {
        setListQuestion(res.data);
        setArrLength(Math.ceil(res.total / display));
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    // xóa hết bộ lọc
    if (!filter) {
      setLoading(true);
      RequestAPI({
        url: PathAPI.question,
        params: {
          limit: display,
          page: page,
        },
        method: 'GET',
      }).then((res: any) => {
        setListQuestion(res.data);
        setArrLength(Math.ceil(res.total / display));
        const typeQuestion = localStorage.getItem('typeQuestion') as string;
        if (typeQuestion !== null) {
          const typeUpload = localStorage.getItem('typeUpload') as string;
          if (typeUpload == '1') {
            setOpened1(true);
          } else {
            setOpened2(true);
          }
          setItem(typeQuestion);
          localStorage.removeItem('typeQuestion');
        }
        setLoading(false);
      });
    }
  }, [filter]);

  return (
    <div className=' mx-auto px-4'>
      <div className='flex justify-between'>
        <Breadcrumb />
        <div className=' flex select-none'>
          <Select
            className='mt-4 px-2 py-1 w-48'
            data={[
              {
                label: 'ID',
                value: '1',
              },
              {
                label: 'Tên câu hỏi',
                value: '2',
              },
              {
                label: 'Tag',
                value: '3',
              },
              {
                label: 'Nội dung',
                value: '4',
              },
              // {
              //   label: 'Đơn vị kiến thức',
              //   value: '5',
              // },
            ]}
            defaultValue={'1'}
            radius={8}
            onChange={(e: string) => setTypeSelect(parseInt(e))}
          />
          <Input
            radius={8}
            placeholder='Tìm kiếm ...'
            className='mt-4 py-1 w-48'
            onChange={(e: any) => filterData(e.target.value)}
          />

          <Button
            className={`bg-white text-ct-secondary m-4 flex justify-center items-center px-4 py-1 text-sm border border-ct-secondary  rounded-[8px] hover:bg-ct-secondary hover:text-white transition-all ${
              filter ? `active-button` : null
            }`}
            variant='outline'
            onClick={() => setFilter((o) => !o)}
          >
            <div className='ml-2'>
              <FilterSearch size='25' color='currentColor' />
            </div>
            <p className='px-2'>Bộ lọc</p>
          </Button>
          <Popover
            opened={opened}
            onClose={() => setOpened(false)}
            radius={12}
            styles={{
              inner: { padding: '8px 0px', overflow: 'hidden' },
              body: { overflow: 'hidden' },
            }}
            zIndex={50}
            target={
              <div
                className='bg-ct-secondary  text-white font-bold rounded-[8px] ml-2 m-4 flex justify-center items-center px-4 py-1 text-sm'
                onClick={() => setOpened((o) => !o)}
              >
                <div className='pl-[2px]'>
                  <Add size='32' color='currentColor' />
                </div>
                <p className='tracking-wider'>THÊM MỚI</p>
              </div>
            }
            width={187}
            position='bottom'
            placement='center'
          >
            <div>
              <div
                onClick={() => {
                  dispatch(updateQuestion([]));
                  navigate('create');
                }}
              >
                <p className='hover:bg-ct-secondary hover:text-white p-1 pl-8'>Nhập thủ công</p>
              </div>
              <Link
                to=''
                onClick={() => {
                  //đặt mặc định option là 1 đáp án
                  setItem('1');
                  setOpened2(true);
                }}
              >
                <p className='hover:bg-ct-secondary hover:text-white p-1 pl-8'>
                  Nhập từ file Excel
                </p>
              </Link>
              <Link to='' onClick={() => setOpened1(true)}>
                <p className='hover:bg-ct-secondary hover:text-white p-1 pl-8'>Nhập từ file Word</p>
              </Link>
            </div>
          </Popover>
        </div>
      </div>
      <div>
        <Select
          label='Số kết quả hiển thị'
          data={[
            {
              label: '10',
              value: '10',
            },
            {
              label: '55',
              value: '55',
            },
            {
              label: '100',
              value: '100',
            },
          ]}
          radius={8}
          className='w-[220px]'
          defaultValue={display + ''}
          onChange={(e: string) => changeDisplay(parseInt(e))}
        />
      </div>

      <FilterComponent
        show={filter}
        listClass={listClass}
        listSubject={subject}
        dataContaint={constantForm}
        filter={filterByData}
      />
      <div className='overflow-x-auto w-full mt-4'>
        <Table
          dataSource={{
            columns: [
              {
                title: 'Hành động',
              },
              {
                title: 'Mã câu hỏi',
              },
              {
                title: 'Tên câu hỏi',
              },
              {
                title: 'Tags',
              },
              {
                title: 'Nội dung',
              },
              {
                title: 'Lớp',
              },
              {
                title: 'Môn học',
              },
              {
                title: 'Độ khó',
              },
              {
                title: 'Kiểu câu hỏi',
              },
              {
                title: 'Loại câu hỏi',
              },
              {
                title: ' Cấp độ nhận biết',
              },
              {
                title: 'Người tạo',
              },
            ],
            data: listQuestion.map((key, index) => {
              return {
                action: (
                  <div className='flex'>
                    <Trash
                      size='20'
                      className='mr-2 text-ct-red-300'
                      color='currentColor'
                      variant='Bold'
                      onClick={() => {
                        setIDQuestion(key.idQuestion);
                        setDeleted(true);
                      }}
                    />
                    <Edit2
                      size='20'
                      color='currentColor'
                      variant='Bold'
                      className='mx-2 text-ct-secondary'
                      onClick={() => {
                        handleEditQuestion(key.idQuestion);
                      }}
                    />
                    <Eye
                      size='20'
                      color='currentColor'
                      className='ml-2 text-ct-green-300'
                      onClick={() => handlePreviewQuestion(key.idQuestion)}
                    />
                  </div>
                ),
                id: key.idQuestion,
                name: key.name,
                tags: key.listTag?.map((key1, index) => {
                  return key.listTag.length > index + 1 ? key1.name + ', ' : key1.name + '';
                }),
                grade:
                  key.text.search(textTable) >= 2 ? (
                    ''
                  ) : (
                    <MathJaxRender
                      className='whitespace-pre-wrap line-clamp-3'
                      math={`${key.text}`}
                    />
                  ),
                // <MathJaxRender
                //     className='whitespace-pre-wrap line-clamp-3'
                //     math={`${key.text}`}
                //   />,
                class: key.listClass.map((key1, index) => {
                  return key.listClass.length > index + 1 ? key1.name + ', ' : key1.name + '';
                }),
                subject: key.listSubject.map((key1, index) => {
                  return key.listSubject.length > index + 1 ? key1.name + ', ' : key1.name + '';
                }),
                level:
                  constantForm?.question.level.filter(
                    (key1: any) => parseInt(key1.value) == key.level
                  )[0]?.title || '',
                choice: constantForm?.question.quiz_type.filter(
                  (key1: any) => parseInt(key1.value) == key.quiz_type
                )[0]?.title,
                type:
                  constantForm?.question.type.filter(
                    (key1: any) => parseInt(key1.value) == key.type
                  )[0]?.title || '',
                awarenessLevel:
                  constantForm?.question.awarenessLevel.filter(
                    (key1: any) => parseInt(key1.value) == key.awareness_level
                  )[0]?.title || '',
                createdBy: key.createdBy,
              };
            }),
          }}
          loading={loading}
        />
      </div>
      <div className='flex justify-end mt-3'>
        <Pagination handlePaging={(page) => handlePaging(page)} total={arrLength} />
      </div>
      <Modal
        opened={opened1}
        hideCloseButton={true}
        closeOnClickOutside={false}
        radius={15}
        onClose={() => setOpened1(false)}
        zIndex={100}
        size={600}
      >
        <div className='container mx-auto px-4'>
          <div className='flex flex-1'>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='ml-3' style={{ fontSize: 17, fontWeight: '700' }}>
              Thêm Word
            </p>
          </div>
          <div className='px-[30px] pt-3'>
            <label htmlFor='' style={{ fontSize: 16, fontWeight: '700' }}>
              Kiểu câu hỏi <sup className='text-[red] text-[16px]'>*</sup>
            </label>
            <Select
              defaultValue={item}
              data={constantForm?.question?.quiz_type?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                item['disabled'] =
                  item.value == 1 || item.value == 4 || item.value == 6 ? false : true;
                return item;
              })}
              placeholder='Chọn kiểu câu hỏi'
              radius={15}
              onChange={(value: string) => {
                setItem(value);
              }}
              className='mt-2 w-[330px]'
              // error
            />
            {/* khi chọn kiểu câu hỏi thì mới show các option bên dưới */}
            {item !== '' ? (
              <>
                <div className='mt-3'>
                  <label htmlFor='' style={{ fontSize: 16, fontWeight: '700' }}>
                    Kiểu câu hỏi <sup className='text-[red] text-[16px]'>*</sup>
                  </label>
                  <div className=' flex mt-2'>
                    <div>
                      <input
                        type='file'
                        id='actual-btn'
                        hidden
                        accept='.docx'
                        onChange={(e) => changeUploadFileWord(e)}
                      />

                      <label
                        htmlFor='actual-btn'
                        className='border border-ct-secondary rounded-[8px] w-[130px] px-2 py-1 flex items-center'
                      >
                        <DocumentUpload size='17' color='#017EFA' />
                        <p className='text-[14px] ml-2'>Upload file</p>
                      </label>
                    </div>
                    <div className='ml-3'>
                      {selectedFileWord !== null ? (
                        <div className='mt-2 flex items-center'>
                          <img src={paperClip} alt='' />
                          <span id='file-word' className='text-[14px] pl-2 pr-2'>
                            {selectedFileWord.name}
                          </span>
                          <Trash size='17' color='red' onClick={() => setSelectedFileWord(null)} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className='mt-2 text-ct-secondary flex items-center text-[14px]'>
                    <a
                      href={
                        item == '1'
                          ? 'https://docs.google.com/document/d/1CPzp_TM45nDaoHyhN2KnwKrWNATTDhsh/edit'
                          : item == '6'
                          ? 'https://docs.google.com/document/d/1GY50G675tHPWeTq8qRX4pGhqhCppykMl/edit#heading=h.c06uzy2c2r7k'
                          : 'https://docs.google.com/document/d/1tyrtEMV3LPMHry405zuHpI5KVjGi_2B2/edit'
                      }
                      target={'_blank'}
                    >
                      File Word mẫu
                    </a>
                    <a
                      href={
                        item == '1'
                          ? 'https://drive.google.com/drive/folders/1IWFUvHP_26gwzRCRDhVLVqRV_YbjXG1X?usp=sharing'
                          : item == '6'
                          ? 'https://docs.google.com/spreadsheets/d/123obD3LUphFNy5bwdjscKU6VJQyKVH_GQ-2CWN1xP5A/edit#gid=0'
                          : 'https://drive.google.com/drive/u/1/folders/1uJ_Pxk3vvqlwkjXFlJ2sukXSDuqc_TkL'
                      }
                      target={'_blank'}
                      className='ml-2'
                    >
                      Hướng dẫn nhập
                    </a>
                  </div>
                </div>
                <div className='mt-3'>
                  <div
                    className='flex items-center justify-between'
                    onClick={() => setShow((o) => !o)}
                  >
                    <p className='font-bold text-[18px]'>Nâng cao</p>
                    {show ? (
                      <ArrowUp2 size='15' color='#017EFA' variant='Bold' />
                    ) : (
                      <ArrowDown2 size='15' color='#017EFA' variant='Bold' />
                    )}
                  </div>
                  <hr />
                  {/* show tùy chọn nâng cao */}
                  {show ? (
                    <div className='mt-3'>
                      <label htmlFor='' style={{ fontSize: 16, fontWeight: '700' }}>
                        Thuộc tính câu hỏi{' '}
                      </label>
                      <div className=' flex mt-2'>
                        <div>
                          <input
                            type='file'
                            id='actual-btn14'
                            hidden
                            accept='.xlsx'
                            onChange={(e) => changeUploadFileExel(e)}
                          />

                          <label
                            htmlFor='actual-btn14'
                            className='border border-ct-secondary rounded-[8px] w-[130px] px-2 py-1 flex items-center'
                          >
                            <DocumentUpload size='15' color='#017EFA' />
                            <p className='text-[13px] ml-2'>Upload file</p>
                          </label>
                        </div>
                        <div className='ml-3'>
                          {selectedFileAttr !== null ? (
                            <div className='mt-2 flex items-center'>
                              <img src={paperClip} alt='' />
                              <span id='file-excel1' className='text-[14px] pl-2 pr-2'>
                                {selectedFileAttr.name}
                              </span>
                              <Trash
                                size='17'
                                color='red'
                                onClick={() => setSelectedFileAttr(null)}
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className='mt-2 text-ct-secondary flex items-center text-[14px]'>
                        <a
                          href={
                            item == '1'
                              ? 'https://docs.google.com/spreadsheets/d/1_EnQKUxW_-krdMuOd9mo6LjwYfCxaPHoOVM3ph4Oa4I/edit#gid=0'
                              : 'https://docs.google.com/spreadsheets/d/1hRUNBOV0VBZ8CBG9It0YJ1EzT_TwaGVLfY5I6ZthSuk/edit#gid=0'
                          }
                          target={'_blank'}
                        >
                          File Excel mẫu
                        </a>
                        <a
                          href={
                            item == '1'
                              ? 'https://drive.google.com/drive/folders/1r9SXKRiMk2gJwnOvjrTKKof_o8CX3B-W'
                              : 'https://drive.google.com/drive/u/1/folders/1uJ_Pxk3vvqlwkjXFlJ2sukXSDuqc_TkL'
                          }
                          target={'_blank'}
                          className='ml-2'
                        >
                          Hướng dẫn nhập
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button variant='outline' color='#017EFA' onClick={() => setOpened1(false)}>
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              style={{ backgroundColor: '#017EFA' }}
              onClick={() => {
                submitData(1);
              }}
              disabled={isUploading}
            >
              {/* //     {isEdit ? 'Cập nhật' : ''}{' '} */}Thêm mới
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={opened2}
        hideCloseButton={true}
        radius={15}
        onClose={() => setOpened2(false)}
        zIndex={100}
        size={600}
      >
        <div className='container mx-auto px-4'>
          <div className='flex flex-1'>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='ml-3' style={{ fontSize: 17, fontWeight: '700' }}>
              Thêm Excel
            </p>
          </div>
          <div className='px-[30px] pt-3'>
            <label htmlFor='' style={{ fontSize: 16, fontWeight: '700' }}>
              Kiểu câu hỏi
            </label>
            <Select
              defaultValue={item}
              data={constantForm?.question.quiz_type?.map((item: any) => {
                let option: any = {};
                option['label'] = item.title;
                option['value'] = '' + item.value;
                option['key'] = item.value;
                option['disabled'] = item.value == 1 ? false : true;

                return option;
              })}
              placeholder='Chọn kiểu câu hỏi'
              radius={15}
              onChange={(value: string) => {
                setItem(value);
              }}
              className='w-[330px]'
              // error
            />
            <div className='mt-3'>
              <div className=' flex mt-2'>
                <div>
                  <input
                    type='file'
                    id='actual-btn'
                    hidden
                    accept='.xlsx'
                    onChange={(e) => changeUploadFileExelV2(e)}
                  />

                  <label
                    htmlFor='actual-btn'
                    className='border border-ct-secondary rounded-[8px] w-[130px] px-2 py-1 flex items-center'
                  >
                    <DocumentUpload size='17' color='#017EFA' />
                    <p className='text-[14px] ml-2'>Upload file</p>
                  </label>
                </div>
                {selectedFileExcel ? (
                  <div className='ml-3'>
                    <div className='mt-2 flex items-center'>
                      <img src={paperClip} alt='' />
                      <span className='text-[14px] pl-2 pr-2'>{selectedFileExcel.name}</span>
                      <Trash size='15' color='red' onClick={() => setSelectedFileExcel(null)} />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className='mt-2 text-ct-secondary flex items-center text-[14px]'>
                <a
                  href='https://docs.google.com/spreadsheets/d/1xDbR-9gN1IPOz7ED0zsm5hvHR3Jfc4a4JpSZNdJmghY/edit#gid=0'
                  target={'_blank'}
                >
                  File Excel mẫu
                </a>
                <a
                  href='https://drive.google.com/drive/folders/1r9SXKRiMk2gJwnOvjrTKKof_o8CX3B-W'
                  target={'_blank'}
                  className='ml-2'
                >
                  Hướng dẫn nhập
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button variant='outline' color='#017EFA' onClick={() => setOpened2(false)}>
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              style={{ backgroundColor: '#017EFA' }}
              onClick={() => submitData(2)}
            >
              {/* //     {isEdit ? 'Cập nhật' : ''}{' '} */}Thêm mới
            </Button>
          </div>
        </div>
      </Modal>
      <Modal opened={deleted} onClose={() => setDeleted(false)} hideCloseButton={true} radius={15}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Xác nhận xóa câu hỏi
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          Bạn có chắc muốn xóa câu hỏi này ?
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button variant='outline' color='#017EFA' onClick={() => setDeleted(false)}>
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              style={{ backgroundColor: '#017EFA' }}
              onClick={() => DeleteQuestion()}
            >
              {' '}
              Đồng ý{' '}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal opened={isOpenPreview} onClose={() => setIsOpenPreview(false)} radius={15} size='80vw'>
        <div className='px-10 pb-8'>
          <p className='font-bold text-2xl'>
            Chi tiết câu hỏi / {questionPreviewRedux?.idQuestion}
          </p>
          <div className='flex flex-wrap my-4'>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Tên câu hỏi: </span>
              {questionPreviewRedux?.name}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Lớp: </span>

              {questionPreviewRedux?.listClass
                ?.map((item: any) => {
                  return item.name.split(' ')[1];
                })
                .join(', ')}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Môn học: </span>
              {questionPreviewRedux?.listSubject
                ?.map((item: any) => {
                  return item.name;
                })
                .join(', ')}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Ngày tạo: </span>
              {formatTime(questionPreviewRedux?.createdAt)}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Độ khó: </span>
              {
                constantForm?.question.level.filter(
                  (key1: any) => parseInt(key1.value) == questionPreviewRedux.level
                )[0]?.title
              }
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Cấp độ nhận biết: </span>
              {constantForm?.question.awarenessLevel.filter(
                (key1: any) => parseInt(key1.value) == questionPreviewRedux.awareness_level
              )[0]?.title || ''}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Loại câu hỏi: </span>
              {constantForm?.question.type.filter(
                (key1: any) => parseInt(key1.value) == questionPreviewRedux.type
              )[0]?.title || ''}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Kiểu câu hỏi: </span>
              {constantForm?.question.quiz_type.filter(
                (key1: any) => parseInt(key1.value) == questionPreviewRedux.quiz_type
              )[0]?.title || ''}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Tags: </span>
              {questionPreviewRedux?.listTag?.map((item: any) => item.name).join(', ')}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Người tạo: </span>
              {questionPreviewRedux?.createdBy}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Người sửa cuối: </span>
              {questionPreviewRedux?.updatedBy}
            </p>
            <p className='w-1/4 my-4'>
              <span className='font-bold'>Thời gian: </span>
              {formatTime(questionPreviewRedux?.updatedAt)}
            </p>
          </div>
          <PreviewQuestion quiz_type={questionPreviewRedux.quiz_type} data={questionPreviewRedux} />
        </div>
      </Modal>
    </div>
  );
};

export default ManageQuestionContainer;
