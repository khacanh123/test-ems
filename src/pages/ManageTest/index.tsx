import { Input, Modal, ScrollArea, Select } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import Pagination from 'components/Pagination';
import PreviewQuestion from 'components/PreviewQuestion';
import Table from 'components/Table';
import { Add, Edit2, Eye, FilterSearch, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Constant } from 'store/selector';
import { updateTestEdit } from 'store/slice/test';
import { slug } from 'utils/utils';
import './styles.css';
interface subject {
  idSubject: number;
  name: string;
}
interface ClassInfo {
  idClass: number;
  name: string;
  idSchoolLevel: number;
}
interface data {
  idBaikiemtra: number;
  name: string;
  listSubject: subject[];
  listClass: ClassInfo[];
  listTest: number[];
  listTestInfo: any[];
  testType: any;
  createdBy: any;
}
interface choice {
  label: string;
  value: string;
}
interface Choice {
  stt: boolean;
  themluot: boolean;
  show: boolean;
  id: boolean;
  ten: boolean;
  sdt: boolean;
  email: boolean;
  diem: boolean;
  thoigian: boolean;
  lanthi: boolean;
}
let choice: Choice = {
  stt: true,
  themluot: true,
  show: true,
  id: true,
  ten: true,
  sdt: true,
  email: true,
  diem: true,
  thoigian: true,
  lanthi: true,
};

const ManageTopicContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [listClass, setListClass] = useState<ClassInfo[]>([]);
  const [Test, setTest] = useState<data[]>([]);
  const [dataTest, setDataTest] = useState<data[]>([]);
  const [grade, setGrade] = useState<subject[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setID] = useState(0);
  const [name, setName] = useState('');
  // const [item, setItem] = useState<string[]>([]);
  const [arrLength, setArrLength] = useState(0);
  const [page, setPage] = useState(1);
  const [pageupdate, setPageupdate] = useState(1);
  const [display, setDisplay] = useState(10);
  const [deleted, setDeleted] = useState(false);
  const [opened1, setOpened1] = useState(false);
  const [listChoice, setListChoice] = useState<Choice>(choice);
  const [opened2, setOpened2] = useState(false);
  const [value, setValue] = useState('');
  const [typeSelect, setTypeSelect] = useState(1);
  const [loading, setLoading] = useState(false);
  const [realoadquest, setRealoadquest] = useState(false);
  const [isOpenPreview, setIsOpenPreview] = useState<any>({
    isOpen: false,
    id: '',
    content: [],
    questionPreview: {},
  });
  const [filter, setFilter] = useState(false);
  const [searchFill, setsearchFill] = useState<any>({
    idClass: '',
    idSubject: '',
    awareness_level: '',
    testType: '',
  });
  const [debounced] = useDebouncedValue(value, 200);
  const constantFormRedux = useSelector(Constant);
  const constantForm = JSON.parse(JSON.stringify(constantFormRedux));
  const handlePaging = (page: number) => {
    setPage(page);
    filterData(typeSelect, value, page);
  };

  const handleEditQuestion = async (isOpenPreview: any) => {
    const id = isOpenPreview.questionPreview.idQuestion;
    localStorage.setItem('idQuestion', '' + id);
    const toNewtab = document.getElementById('toNewtab');
    toNewtab?.click();
  };

  document.addEventListener('visibilitychange', function () {
    setRealoadquest(document.hidden);
  });

  const getDataEdit = (idTest: number, idBaikiemtra: number) => {
    RequestAPI({
      url: PathAPI.test + '/' + idTest,
      method: 'GET',
    }).then((res: any) => {
      if (res.status) {
        res.data.idBaikiemtra = idBaikiemtra;
        dispatch(updateTestEdit(res.data));
        navigate('/manage-topic/create');
      }
    });
  };

  const DeleteFunc = (id: number) => {
    setID(id);
    setDeleted(true);
  };

  const Show = (type: number, title: string) => {
    type = type;
    const typeE = document.getElementById(title + '-s');
    const showS = document.getElementById(title);

    if (type === 1) {
      setOpened2(true);
    } else if (type === 2) {
      setOpened1(true);
    } else {
      setOpened2(true);
    }
    if (typeE !== null && showS !== null) {
      typeE.style.display = 'block';
      showS.style.display = 'none';
    }
  };
  const ClosePopover = (type: number, title: string) => {
    const typeE = document.getElementById(title + '-s');
    const showS = document.getElementById(title);
    if (type === 1) {
      setOpened2(false);
    } else if (type === 2) {
      setOpened1(false);
    } else {
      setOpened2(false);
    }
    if (typeE !== null && showS !== null) {
      typeE.style.display = 'none';
      showS.style.display = 'block';
    }
  };

  const getSubject = (id: any) => {
    let name = '';
    grade.map((key) => {
      if (key.idSubject === id) {
        name = key.name;
      }
    });

    return name;
  };
  const DeleteData = async () => {
    await RequestAPI({
      url: PathAPI.baikiemtra + '/' + id,
      method: 'DELETE',
    });
    await RequestAPI({
      url: PathAPI.baikiemtra,
      method: 'GET',
      params: {
        page: page,
        limit: display,
      },
      notify: {
        type: 'success',
        message: 'Xóa đề bài thành công',
      },
    }).then((res: any) => {
      setTest(res.data);
      setDataTest(res.data);
    });
    setDeleted(false);
    setIsEdit(false);
    setName('');
  };
  const changeDisplay = (val: string) => {
    let num = val !== '' ? parseInt(val) : 10;
    setDisplay(num);
    filterData(typeSelect, value);
  };
  const filterData = (type: number, val?: string, page?: any) => {
    setTypeSelect(type);
    // setValue(val || value);
    if (val?.length === 0) {
      RequestAPI({
        url: PathAPI.baikiemtra,
        method: 'GET',
        params: {
          page: page || 1,
          limit: display,
        },
      }).then((res: any) => {
        if (res.data) {
          setArrLength(Math.ceil(res.total / display));
          setTest(res.data);
        }
        setLoading(false);
      });
    }
    if (type === 1) {
      RequestAPI({
        url: PathAPI.baikiemtra,
        method: 'GET',
        params: {
          page: page || 1,
          limit: display,
          name: val?.trim(),
        },
        hiddenMessage: true,
      }).then((res: any) => {
        if (res.data) {
          setArrLength(Math.ceil(res.total / display));
          setTest(res.data);
        }
        setLoading(false);
      });
    }

    if (type === 3) {
      RequestAPI({
        url: PathAPI.baikiemtra,
        method: 'GET',
        params: {
          page: page || 1,
          limit: display,
          idBaikiemtra: val || value,
        },
      }).then((res: any) => {
        setArrLength(Math.ceil(res.total / display));
        setTest(res.data);
      });
    }
    if (type === 4) {
      RequestAPI({
        url: PathAPI.baikiemtra,
        method: 'GET',
        params: {
          page: page || 1,
          limit: display,
          awareness_level: searchFill.awareness_level,
          testType: searchFill.testType,
          idClass: searchFill.idClass,
          idSubject: searchFill.idSubject,
        },
      }).then((res: any) => {
        setArrLength(Math.ceil(res.total / display));
        setTest(res.data);
      });
    }
  };

  const handleChangeQuestionPreview = (index: number) => {
    setPageupdate(index);
    setIsOpenPreview((prev: any) => {
      return {
        ...prev,
        questionPreview: prev.content[index - 1],
      };
    });
  };
  useEffect(() => {
    RequestAPI({
      url: PathAPI.test + '/' + isOpenPreview.id,
      method: 'GET',
    }).then((res: any) => {
      if (res.status) {
        setIsOpenPreview({
          ...isOpenPreview,
          content: res.data.listQuestion,
          isOpen: true,
          questionPreview: res.data.listQuestion[0],
        });
        handleChangeQuestionPreview(pageupdate);
      }
    });
  }, [realoadquest]);

  useEffect(() => {
    if (isOpenPreview.id !== '') {
      RequestAPI({
        url: PathAPI.test + '/' + isOpenPreview.id,
        method: 'GET',
      }).then((res: any) => {
        if (res.status) {
          setIsOpenPreview({
            ...isOpenPreview,
            content: res.data.listQuestion,
            isOpen: true,
            questionPreview: res.data.listQuestion[0],
          });
        }
      });
    }
  }, [isOpenPreview.id]);

  useEffect(() => {
    RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
    }).then((res: any) => {
      setGrade(res.data);
    });
    RequestAPI({
      url: PathAPI.class,
      method: 'GET',
    }).then((res: any) => {
      setListClass(res.data);
    });
  }, []);
  let i = 0;
  useEffect(() => {
    if (filter) {
      filterData(4);
      i++;
    }
  }, [searchFill]);

  useEffect(() => {
    const getData = async () => {
      if (!filter) {
        await setsearchFill({
          ...searchFill,
          idClass: '',
          idSubject: '',
          awareness_level: '',
          testType: '',
        });
        filterData(4);
      }
    };
    getData();
  }, [filter]);
  return (
    <div className=' mx-auto px-4'>
      <div className='flex'>
        <Breadcrumb />
        <div className='flex'>
          <Button
            className={` m-4 flex justify-center items-center px-4 py-1 text-sm border border-ct-secondary  rounded-[8px] hover:bg-ct-secondary hover:text-white transition-all ${
              filter ? `bg-ct-secondary text-white` : `bg-white text-ct-secondary`
            }`}
            variant='outline'
            onClick={() => setFilter((o) => !o)}
          >
            <div className='ml-2'>
              <FilterSearch size='25' color='currentColor' />
            </div>
            <p className='px-2'>Bộ lọc</p>
          </Button>
          <Link to='create'>
            <Button className='m-4 flex justify-center items-center px-4 py-1 text-sm'>
              <Add size='30' color='#FFF' variant='Outline' />
              Thêm mới
            </Button>
          </Link>
        </div>
      </div>
      <div className='flex justify-between'>
        <div>
          <div className=' mt-3 mb-2'>
            <label htmlFor='' style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
              Số kết quả hiển thị
            </label>
            <Select
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
              defaultValue={display + ''}
              onChange={(e) => changeDisplay(e + '')}
            />
          </div>
        </div>
      </div>
      {filter ? (
        <div className='grid grid-cols-6 gap-6'>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              ID
            </label>
            <Input
              radius={8}
              placeholder='Tìm kiếm ...'
              onChange={(e: any) => filterData(3, e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Tên đề
            </label>
            <Input
              radius={8}
              placeholder='Tìm kiếm ...'
              onChange={(e: any) => filterData(1, e.target.value)}
              rightSection
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Lớp học
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={listClass.map((item: any) => {
                item['label'] = item.name;
                item['value'] = '' + item.idClass;
                item['key'] = item.value;
                return item;
              })}
              radius={8}
              clearable
              onChange={(e: string) => setsearchFill({ ...searchFill, idClass: parseInt(e) })}
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Môn học
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={grade.map((item: any) => {
                item['label'] = item.name;
                item['value'] = '' + item.idSubject;
                item['key'] = item.value;
                return item;
              })}
              radius={8}
              clearable
              onChange={(e: string) => setsearchFill({ ...searchFill, idSubject: parseInt(e) })}
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Cấp độ nhận biết
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={constantForm.question.awarenessLevel?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
              radius={8}
              clearable
              onChange={(e: string) =>
                setsearchFill({ ...searchFill, awareness_level: parseInt(e) })
              }
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Kiểu đề
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={constantForm?.test?.testType?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
              radius={8}
              clearable
              onChange={(e: string) => setsearchFill({ ...searchFill, testType: parseInt(e) })}
            />
          </div>
        </div>
      ) : (
        ''
      )}
      <div className='overflow-x-auto w-full mt-4'>
        <Table
          dataSource={{
            columns: [
              {
                title: 'Hành động',
              },
              {
                title: 'ID',
                hidden: !listChoice.stt,
              },
              {
                title: 'Tên đề',
                hidden: !listChoice.themluot,
              },
              {
                title: 'Lớp học',
                hidden: !listChoice.id,
              },
              {
                title: 'Môn học',
                hidden: !listChoice.ten,
              },
              {
                title: 'Cấp độ nhận biết',
                // hidden: !listChoice.ten,
              },
              {
                title: 'Kiểu đề',
                // hidden: !listChoice.ten,
              },
              {
                title: 'Người tạo',
              },
            ],
            data: Test.map((key: any, index) => {
              return {
                action: (
                  <div className='flex' style={{ paddingLeft: 15 }}>
                    <Trash
                      size='20'
                      color='currentColor'
                      variant='Bold'
                      className='text-ct-red-300'
                      onClick={() => DeleteFunc(key.idBaikiemtra)}
                    />
                    <Edit2
                      size='20'
                      color='#017EFA'
                      variant='Bold'
                      className='ml-2'
                      onClick={() => getDataEdit(key.listTestInfo[0].idTest, key.idBaikiemtra)}
                    />
                    <Eye
                      size='20'
                      color='currentColor'
                      variant='Outline'
                      className='ml-2 text-ct-green-400'
                      onClick={() =>
                        setIsOpenPreview({
                          ...isOpenPreview,
                          id: key.listTest[0],
                          isOpen: true,
                        })
                      }
                    />
                  </div>
                ),
                id: key.idBaikiemtra,
                name: (
                  <Link
                    to={`/de-thi/${slug(key.name)}/${key.idBaikiemtra}`}
                    target={'_blank'}
                    className='text-ct-secondary'
                  >
                    {key.name}
                  </Link>
                ),
                class: key.listClass.map((key1: any) => 'Lớp ' + key1),
                subject: getSubject(key.listSubject[0]),
                level: constantForm.question.awarenessLevel?.map((item: any) => {
                  if (item.value == key.listTestInfo[0]?.awareness_level) {
                    return item.title;
                  }
                }),
                typeTest:
                  constantForm?.test?.testType?.map((it: any) => {
                    if (it.value == key.listTestInfo[0]?.testType) {
                      return it.title;
                    }
                  }) || '',

                user: key.createdBy,
              };
            }),
          }}
          loading={loading}
        />
      </div>
      <div className='flex justify-end mt-4'>
        <Pagination handlePaging={handlePaging} total={arrLength} />
      </div>
      <Modal opened={deleted} onClose={() => setDeleted(false)} hideCloseButton={true} radius={15}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Xác nhận xóa đề thi
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          Bạn có chắc muốn xóa đề thi này ?
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
              onClick={() => DeleteData()}
            >
              {' '}
              Đồng ý{' '}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={isOpenPreview.isOpen}
        onClose={() =>
          setIsOpenPreview({
            ...isOpenPreview,
            isOpen: false,
          })
        }
        radius={15}
        size='80vw'
      >
        <ScrollArea style={{ width: '100%' }}>
          <div className='flex'>
            <Pagination
              handlePaging={handleChangeQuestionPreview}
              total={isOpenPreview.content.length}
              border
              sibling={1000}
            />
          </div>
          <div className='my-8'>
            <div className='flex' style={{ justifyContent: 'end' }}>
              <Link
                to={'/manage-question/question/create'}
                onClick={() => {
                  handleEditQuestion(isOpenPreview);
                }}
                target='_blank'
                id='toNewtab'
              ></Link>
              <Edit2
                size='20'
                color='currentColor'
                variant='Bold'
                className='mx-2 text-ct-secondary'
                onClick={() => {
                  handleEditQuestion(isOpenPreview);
                }}
              />
            </div>
            <PreviewQuestion
              quiz_type={isOpenPreview?.questionPreview?.quiz_type}
              data={isOpenPreview.questionPreview}
            />
          </div>
        </ScrollArea>
      </Modal>
    </div>
  );
};

export default ManageTopicContainer;
