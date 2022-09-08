import {
  Checkbox,
  Modal,
  MultiSelect,
  NumberInput,
  ScrollArea,
  Select,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import DateTimePicker from 'components/DateTimePicker';
import Pagination from 'components/Pagination';
import PreviewQuestion from 'components/PreviewQuestion';
import Table from 'components/Table';
import { Add, ArrowDown2, Eye, Graph, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Constant } from 'store/selector';
import { notify } from 'utils/notify';
import { Link, useNavigate, useParams } from 'react-router-dom';

const stateDefault = {
  idSubject: ' ',
  idClass: ' ',
  // idTag: '',
  // numQuestion: '',
  name: ' ',
  testType: ' ',
};
const ManageAddTestSimpile = () => {
  const [showAddTest, setShowAddTest] = useState({
    show: false,
    type: 0,
  });
  const [isOpenPreview, setIsOpenPreview] = useState<any>({
    isOpen: false,
    id: '',
    content: [],
    questionPreview: {},
  });
  const constantFormRedux = useSelector(Constant);
  const constantForm = JSON.parse(JSON.stringify(constantFormRedux));
  const [classListForm, setClassListForm] = useState<any>([]);
  const [subjectListForm, setSubjectListForm] = useState<any>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [dataSearch, setDataSearch] = useState(stateDefault);
  const [choiceTestData, setChoiceTestData] = useState<any>({
    testTypeOne: [],
    testTypeTwo: [],
    testTypeThree: [],
  });
  const [testData, setTestData] = useState<any[]>([]);
  const [showTest, setShowTest] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleted, setDeleted] = useState({
    show: false,
    type: 0,
    idBaikiemtra: 0,
  });

  const [display, setDisplay] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedTest, setSelectedTest] = useState<any[]>([]);
  const [TestOld, setTestOld] = useState<any>({});
  const [title, setTitle] = useState<string>();
  const [section, setSection] = useState<string>();
  const [lesson, setLesson] = useState<string>();

  const handleSelectQuestionTempral = (e: any, item: any) => {
    let clone = JSON.parse(JSON.stringify(testData));
    if (item !== 'all') {
      const index = clone.findIndex((i: any) => i.idBaikiemtra === item.idBaikiemtra);
      clone[index]['checked'] = e.target.checked;

      clone.map((i: any) => {
        if (e.target.checked) {
          if (i.idBaikiemtra !== item.idBaikiemtra) {
            i['disabled'] = true;
          }
        } else {
          i['disabled'] = false;
        }
      });
      setTestData(clone);
      const arr: any[] = [];
      arr.push(clone[index]);
      setSelectedTest(e.target.checked ? arr : []);
      setChoiceTestData((pre: any) => {
        return {
          ...pre,
          testTypeOne: e.target.checked ? arr : [],
        };
      });
    } else {
      clone.forEach((i: any) => {
        i['checked'] = e.target.checked;
      });
    }
    // setTestData(clone);
    // const selectTest = clone.filter((item: any) => item.checked === true);
    // //
    // const data = checkSelectTest(selectTest);
    // if (showAddTest.type == 1) {
    //   setChoiceTestData((pre: any) => {
    //     return {
    //       ...pre,
    //       testTypeOne: data,
    //     };
    //   });
    // }
  };
  const checkSelectTest = (arr: any) => {
    const selected = selectedTest;
    arr.map((k: any) => {
      const ind = selected.findIndex((i: any) => i.idBaikiemtra == k.idBaikiemtra);
      if (ind == -1) {
        selected.push(k);
      }
    });
    return selected;
  };
  const handleChangeQuestionPreview = (index: number) => {
    setIsOpenPreview((prev: any) => {
      return {
        ...prev,
        questionPreview: prev.content[index - 1],
      };
    });
  };
  const getListTest = (page?: any) => {
    RequestAPI({
      url: PathAPI.baikiemtra + '/',
      method: 'GET',
      params: dataSearch,
      pagination: {
        pageSize: display,
        pageIndex: page ? page : 1,
      },
    }).then((res: any) => {
      if (res.status) {
        let clone = JSON.parse(JSON.stringify(res.data));

        clone.map((i: any) => {
          if (selectedTest.length > 0) {
            if (i.idBaikiemtra === selectedTest[0].idBaikiemtra) {
              i['checked'] = true;
            }
            if (i.idBaikiemtra !== selectedTest[0].idBaikiemtra) {
              i['disabled'] = true;
            }
          } else {
            i['disabled'] = false;
            i['checked'] = false;
          }
        });
        setTestData(clone);
        setTotalPage(Math.ceil(res.total / display));
        setShowTest(true);
      }
    });
    if (selectedTest.length === 0) {
      displayModalAddTest(1);
    }
  };
  const displayModalAddTest = async (id: any) => {
    await setShowAddTest((pre: any) => {
      return {
        show: true,
        type: id,
      };
    });
  };
  const ExitFunc = () => {
    setShowTest(false);
    setShowAddTest((pre: any) => {
      return {
        type: 0,
        show: false,
      };
    });
    setSelectedTest(choiceTestData.dataTestOne);
  };
  const navigate = useNavigate();
  const submitData = async () => {
    if (selectedTest.length === 0) {
      notify({
        type: 'error',
        message: 'Bạn chưa chọn bài kiểm tra',
      });
      return;
    }
    if (param.id !== undefined) {
      let data = TestOld;
      data.product.idLesson = null;
      data.product.idSection = null;
      await RequestAPI({
        url: PathAPI.baikiemtra + '/' + param.id,
        method: 'PATCH',
        payload: data,
      }).then((res: any) => {});
    }
    const data = localStorage.getItem('addTest');
    const idCourse = localStorage.getItem('idCourse');
    if (data !== null) {
      const parseData = JSON.parse(data);
      parseData.idSection = null;
      parseData.idBaikiemtra = selectedTest[0].idBaikiemtra;
      await RequestAPI({
        url: PathAPI.baikiemtra + `/attach`,
        method: 'POST',
        payload: parseData,
      }).then((res: any) => {
        if (res.status) {
          notify({
            type: 'success',
            message: 'Thêm bài kiểm tra thành công',
          });
          localStorage.removeItem('addTest');
          localStorage.removeItem('idCourse');
          navigate('/manage-course/' + idCourse);
        }
      });
    }
  };

  const DeleteTest = async () => {
    await setDeleted({ show: false, type: 0, idBaikiemtra: 0 });
    if (selectedTest.length === 1) {
      setSelectedTest([]);
      return true;
    }
  };
  useEffect(() => {
    RequestAPI({
      url: PathAPI.class,
      method: 'GET',
    }).then((res: any) => {
      // setClassAndSubjectForm(res.data);
      if (res.status) {
        const listClass = res.data.map((item: any) => {
          const classTemp = {
            value: '',
            label: '',
          };
          classTemp.value = `${item.idClass}`;
          classTemp.label = item.name;
          return classTemp;
        });
        setClassListForm(listClass);
      }
    });
  }, []);
  const param = useParams();
  const idCourse = localStorage.getItem('idCourse');
  useEffect(() => {
    const dataTest = localStorage.getItem('addTest');
    let Lesson: any = null;
    if (dataTest !== null) {
      Lesson = JSON.parse(dataTest);
    }
    RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
    }).then((res: any) => {
      // setClassAndSubjectForm(res.data);
      if (res.status) {
        const listClass = res.data.map((item: any) => {
          const classTemp = {
            value: '',
            label: '',
          };
          classTemp.value = `${item.idSubject}`;
          classTemp.label = item.name;
          return classTemp;
        });
        setSubjectListForm(listClass);
      }
    });
    RequestAPI({
      url: PathAPI.course + '/detail/' + idCourse,
      method: 'GET',
    }).then((res: any) => {
      const data = res.data.courseTree;
      setTitle(res.data.title);
      const arrData: any[] = [];
      data[Object.keys(data)[0]].listSection.map((item: any) => {
        if (item.id === Lesson.idSection) {
          arrData.push(item);
        }
      });
      setSection(arrData[0].threads);
      arrData[0].listLesson.map((item: any) => {
        if (item.id === Lesson.idLesson) {
          setLesson(item.title);
        }
      });
      // console.log(filterSection);
    });
  }, []);

  useEffect(() => {
    if (param.id !== undefined) {
      RequestAPI({
        url: PathAPI.baikiemtra + '/' + param.id,
        method: 'GET',
      }).then((res: any) => {
        if (res.status) {
          let arr: any[] = [];
          arr.push(res.data);
          setSelectedTest(arr);
          setTestOld(res.data);
        }
      });
    }
  }, []);
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

  return (
    <div className='mx-auto px-4'>
      <div className='relative w-full max-w-full flex flex-grow items-center flex-1 text-ct-neutral-400'>
        <h6 className='uppercase bg-ct-secondary w-min rounded-full p-2 mb-1 text-xs font-semibold'>
          <Graph size={20} color='white' />
        </h6>{' '}
        <Link to='/manage-course'>
          <div className='font-bold ml-5 text-xl text-[#8E8E8E]'>Quản lý khóa học /</div>
        </Link>
        <Link to={'/manage-course/' + idCourse}>
          <div className='font-bold ml-2 text-xl text-[#8E8E8E]'>{title}</div>
        </Link>
        <p className='text-blueGray-700 ml-2 text-xl font-semibold'> / {lesson}</p>
      </div>
      <div className='mx-10 my-5'>
        <div>
          {selectedTest &&
            selectedTest?.map((item: any, index: number) => (
              <div key={item.idBaikiemtra}>
                <div className='flex'>
                  <div
                    className='bg-ct-red-500 p-2 rounded-md ml-2'
                    onClick={() =>
                      setDeleted({
                        show: true,
                        type: 1,
                        idBaikiemtra: item.idBaikiemtra,
                      })
                    }
                  >
                    <Trash color='white' variant='Outline' size='15' />
                  </div>
                  <div className='bg-ct-green-400 p-2 ml-2 rounded-md'>
                    <Eye
                      size='15'
                      variant='Outline'
                      color='white'
                      onClick={() =>
                        setIsOpenPreview({
                          ...isOpenPreview,
                          id: item.listTest[0],
                          isOpen: true,
                        })
                      }
                    />
                  </div>
                </div>

                <div className='flex items-center'>
                  <div className='flex items-start w-full mt-4 border p-4 mb-4'>
                    <div className='w-1/2 flex'>
                      <table>
                        <tr>
                          <td>
                            <p className='pr-2'>Tên bộ đề:</p>
                          </td>
                          <td>
                            <p className='pl-4'>{item.name}</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p className='pr-2'>Kiểu đề:</p>
                          </td>
                          <td>
                            <p className='pl-4'>
                              {constantForm.test.testType?.map((it: any) => {
                                if (it.value == item.listTestInfo[0].testType) {
                                  return it.title;
                                }
                              })}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p className='pr-2 whitespace-nowrap '>Số lượng câu hỏi:</p>
                          </td>
                          <td>
                            <p className='pl-4'>{item.listTestInfo[0].numQuestion}</p>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div className='w-1/2 flex'>
                      <table>
                        <tr>
                          <td>
                            <p className='pr-2'>ID:</p>
                          </td>
                          <td>
                            <p className='pl-4'>{item.idBaikiemtra}</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p className='pr-2'>Lớp học:</p>
                          </td>
                          <td>
                            <p className='pl-4'>
                              {item.listClass?.map((item: any) => 'Lớp ' + item)}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p className='pr-2 whitespace-nowrap '>Môn học:</p>
                          </td>
                          <td>
                            <p className='pl-4'>
                              {subjectListForm?.map((it: any) => {
                                if (it.value == item.listSubject[0]) {
                                  return it.label;
                                }
                              })}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {selectedTest?.length === 0 ? (
            <>
              <Button
                className='m-4 flex justify-center items-center px-3 py-2 text-sm'
                onClick={() => displayModalAddTest(1)}
              >
                <Add size='32' color='#FFF' variant='Outline' />
                <p className='text-white'>Thêm bộ đề</p>
              </Button>
              <div className='ml-4'>Chưa chọn bài kiểm tra</div>
            </>
          ) : (
            <Button
              className='m-4 flex justify-center items-center px-3 py-2 text-sm'
              onClick={async () => {
                await setSelectedTest([]);
                displayModalAddTest(1);
              }}
            >
              Thay thế bộ đề
            </Button>
          )}
        </div>
        <div className='mt-3 flex justify-center'>
          <div className=' '>
            <Button
              className='m-4 flex justify-center items-center px-7 py-3 text-sm'
              onClick={() => {
                const idBaikiemtra = localStorage.getItem('idCourse');
                navigate('/manage-course/' + idBaikiemtra);
              }}
              type='button'
              variant='outline'
            >
              Hủy
            </Button>
          </div>
          <div className=' '>
            <Button
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-3 text-sm'
              onClick={() => submitData()}
              type='submit'
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </div>

      <Modal
        size='60%'
        radius={16}
        opened={showAddTest.show}
        onClose={() =>
          setShowAddTest((pre: any) => {
            return { type: 0, show: false };
          })
        } // opened={openDynamicPopup}
        // onClose={() => setOpenDynamicPopup(false)}
        hideCloseButton={true}
      >
        <div className='w-full'>
          <div className='flex items-center'>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='ml-3' style={{ fontSize: 17, fontWeight: '700' }}>
              Chọn đề
            </p>
          </div>
          <div className='flex w-full flex-wrap'>
            <TextInput
              // onChange={(e: any) => setName(e.target.value)}
              // defaultValue={name}
              label='Tên bộ đề'
              placeholder='Tên bộ đề'
              className='w-1/3 px-7 py-3'
              radius={15}
              onChange={(e: any) =>
                setDataSearch((pre: any) => {
                  return {
                    ...pre,
                    name: e.target.value.toLowerCase(),
                  };
                })
              }
            />
            <MultiSelect
              // onChange={(e: any) => setName(e.target.value)}
              // defaultValue={name}
              data={tagList?.map((item: any) => {
                const tag = {
                  label: item.name,
                  value: item.idTag,
                };
                return tag;
              })}
              label='Tags đề'
              placeholder='Tags đề'
              className='w-1/3 px-7 py-3'
              radius={15}
              disabled
              onChange={(e: string[]) =>
                setDataSearch((pre: any) => {
                  return {
                    ...pre,
                    idTag: e.join(','),
                  };
                })
              }
            />
            <NumberInput
              disabled
              label='Số lượng câu hỏi'
              className='w-1/3 px-7 py-3'
              radius={15}
              onChange={(e: any) =>
                setDataSearch((pre: any) => {
                  return {
                    ...pre,
                    numQuestion: e + '',
                  };
                })
              }
            />
            <Select
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              label='Kiểu đề'
              placeholder='Kiểu đề'
              data={constantForm.test.testType?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                return item;
              })}
              onChange={(e: any) =>
                setDataSearch((pre: any) => {
                  return {
                    ...pre,
                    testType: e,
                  };
                })
              }
            />
            <MultiSelect
              // {...questionForm.getInputProps('listSubject')}
              required
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              label='Chọn lớp học'
              placeholder='Chọn lớp học'
              data={classListForm}
              onChange={(e: any) =>
                setDataSearch((pre: any) => {
                  return {
                    ...pre,
                    idClass: e.join(','),
                  };
                })
              }
            />
            <Select
              // {...questionForm.getInputProps('type')}
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              clearable
              label='Chọn môn học'
              placeholder='Chọn môn học'
              data={subjectListForm}
              onChange={(e: any) =>
                setDataSearch((pre: any) => {
                  return {
                    ...pre,
                    idSubject: e,
                  };
                })
              }
            />
          </div>
          <div className='flex justify-start '>
            <Button
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => getListTest()}
            >
              Lấy danh sách đề
            </Button>
          </div>
          <br />
          {showTest ? (
            <>
              <div className='flex justify-between px-5 items-center'>
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
                  // defaultValue={display + ''}
                  onChange={(e: string) => setDisplay(parseInt(e))}
                />
                <div className='font-bold text-black'>
                  Đã chọn {testData.filter((item: any) => item.checked === true).length} đề
                </div>
              </div>
              <div className='overflow-x-auto w-full mt-4'>
                <Table
                  dataSource={{
                    columns: [
                      {
                        title: '',
                        centered: true,
                      },
                      {
                        title: 'Hành động',
                        centered: true,
                      },
                      {
                        title: 'ID',
                      },
                      {
                        title: 'Tên bộ đề',
                      },
                      {
                        title: 'Tag đề',
                      },
                      {
                        title: 'Số lượng câu hỏi',
                      },
                      {
                        title: 'Lớp học',
                      },
                      {
                        title: 'Môn học',
                      },
                    ],
                    data: testData.map((key: any) => {
                      return {
                        checkbox: (
                          <Checkbox
                            checked={key.checked}
                            onChange={(e: any) => handleSelectQuestionTempral(e, key)}
                            disabled={key?.disabled || false}
                          />
                        ),
                        action: (
                          <Eye
                            size='20'
                            color='currentColor'
                            variant='Bold'
                            className='text-ct-green-400'
                            onClick={() =>
                              setIsOpenPreview({
                                ...isOpenPreview,
                                id: key.listTest[0],
                                isOpen: true,
                              })
                            }
                          />
                        ),
                        id: key.idBaikiemtra,
                        name: key.name,
                        tag: '',
                        // class: key.listClass.map((c: any) => 'Lớp ' + c),
                        // subject: key.listSubject.map((k: any) => getSubject(k)),
                        numQuestion: key.listTestInfo[0]?.numQuestion,
                        class: key.listClass.map((c: any) => 'Lớp ' + c),
                        subject: subjectListForm?.map((it: any) => {
                          if (it.value == key.listSubject[0]) {
                            return it.label;
                          }
                        }),
                      };
                    }),
                  }}
                  // loading={loading}
                />
              </div>
              <div className='flex justify-end mr-10 mt-3'>
                <Pagination handlePaging={(page) => getListTest(page)} total={totalPage} />
              </div>
            </>
          ) : (
            ''
          )}
          <div className='flex justify-center items-center w-full mt-3'>
            <button
              type='button'
              onClick={() => {
                setShowAddTest((pre: any) => {
                  return { type: 0, show: false };
                });
                ExitFunc();
              }}
              className='m-4 px-8 py-1 rounded-lg border border-ct-secondary text-ct-secondary text-xl'
            >
              Hủy
            </button>
            <button
              className='m-4 px-8 py-1 rounded-lg bg-ct-secondary text-white text-xl'
              style={{ wordSpacing: '1px', letterSpacing: '1px' }}
              onClick={() => {
                setShowAddTest((pre: any) => {
                  return { type: 0, show: false };
                });
                setDataSearch(stateDefault);
                setShowTest(false);
              }}
              type='button'
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={deleted.show}
        onClose={() => setDeleted({ show: false, type: 0, idBaikiemtra: 0 })}
        hideCloseButton={true}
        radius={15}
      >
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Xác nhận xóa đề thi
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          Bạn có chắc muốn xóa đề thi này ?
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button
              variant='outline'
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => setDeleted({ show: false, type: 0, idBaikiemtra: 0 })}
            >
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => DeleteTest()}
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
export default ManageAddTestSimpile;
