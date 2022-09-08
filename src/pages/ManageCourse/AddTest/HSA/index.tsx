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
import Button from 'components/Button';
import DateTimePicker from 'components/DateTimePicker';
import Pagination from 'components/Pagination';
import PreviewQuestion from 'components/PreviewQuestion';
import Table from 'components/Table';
import { Add, ArrowDown2, Eye, Graph, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Constant } from 'store/selector';
import { notify } from 'utils/notify';

const stateDefault = {
  idSubject: ' ',
  idClass: ' ',
  // idTag: '',
  // numQuestion: '',
  name: ' ',
  testType: ' ',
};
const dataAddTest = {
  examFormat: 2,
  idMockContest: 1,
  active: true,
  gradingSingleQuestionType: 0,
  guide: '<p>666666666</p>',
  isChangeScore: false,
  isPauseAllow: false,
  isQuickTest: false,
  listClass: [4],
  listSubject: [1],
  maxMark: 10,
  maxNumAttempt: 1,
  minQuestionSubmit: 0,
  minusWhenWrong: false,
  name: 'Đề luyện tập HSA',
  resultReturnType: 0,
  sort: 0,
  timeAllow: 2700,
  timeEnd: '2222-08-27T08:26:01.857Z',
  timeStart: 'Sat Aug 27 2022',
};
const AddHSAToCourse = () => {
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
  const [roundTest, setRoundTest] = useState<any>(null);
  const [checked, setChecked] = useState(true);
  const [deleted, setDeleted] = useState({
    show: false,
    type: 0,
    idBaikiemtra: 0,
  });
  const [title, setTitle] = useState<string>();
  const [lesson, setLesson] = useState<string>();
  const [TestOld, setTestOld] = useState<any>({});
  const dataHSA = useForm({
    initialValues: {
      start: '',
      finnish: '',
    },
    validationRules: {
      start: (value: string) => value !== '',
      finnish: (value: string) => value !== '',
    },
    errorMessages: {
      start: 'Bạn chưa nhập thời gian bắt đầu',
      finnish: 'Bạn chưa nhập thời gian kết thúc',
    },
  });
  const [display, setDisplay] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedTest, setSelectedTest] = useState<any[]>([]);
  const handleSelectQuestionTempral = async (e: any, item: any) => {
    let clone = JSON.parse(JSON.stringify(testData));
    if (item !== 'all') {
      const index = clone.findIndex((i: any) => i.idBaikiemtra === item.idBaikiemtra);
      clone[index]['checked'] = e.target.checked;
    } else {
      clone.forEach((i: any) => {
        i['checked'] = e.target.checked;
      });
    }
    const selectTest = clone.filter((item: any) => item.checked === true);
    //

    if (showAddTest.type === 1) {
      const data = checkSelectTest(selectTest, choiceTestData.testTypeOne);
      await setChoiceTestData((pre: any) => {
        return {
          ...pre,
          testTypeOne: data,
        };
      });
    }
    if (showAddTest.type == 2) {
      const data = checkSelectTest(selectTest, choiceTestData.testTypeTwo);
      await setChoiceTestData((pre: any) => {
        return {
          ...pre,
          testTypeTwo: data,
        };
      });
    }
    if (showAddTest.type == 3) {
      await setChoiceTestData((pre: any) => {
        const data = checkSelectTest(selectTest, choiceTestData.testTypeThree);
        return {
          ...pre,
          testTypeThree: data,
        };
      });
    }
  };
  const checkSelectTest = (arr: any, data: any) => {
    const selected = data;
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
        const test: any[] = [];
        testData.map((it: any) => {
          test.push(it);
        });
        let i = testData.length;
        res.data.map((it: any, k: number) => {
          if (i <= display) {
            const ind = testData.findIndex((key: any) => key.idBaikiemtra == it.idBaikiemtra);
            if (ind == -1) {
              test.push(it);
            }
          }
          i++;
        });
        setTestData(res.data);
        setTotalPage(Math.ceil(res.total / display));
        setShowTest(true);
      }
    });
  };
  const displayModalAddTest = async (id: any) => {
    await setShowAddTest((pre: any) => {
      return {
        show: true,
        type: id,
      };
    });
    if (id == 1 && choiceTestData.testTypeOne.length) {
      setSelectedTest(choiceTestData.testTypeOne);
    }
    if (id == 2 && choiceTestData.testTypeTwo.length) {
      setSelectedTest(choiceTestData.testTypeTwo);
    }
    if (id == 3 && choiceTestData.testTypeThree.length) {
      setSelectedTest(choiceTestData.testTypeThree);
    }
  };
  const ExitFunc = () => {
    setShowTest(false);
    setShowAddTest((pre: any) => {
      return {
        type: 0,
        show: false,
      };
    });
    setDataSearch(stateDefault);
    setShowTest(false);
    if (showAddTest.type == 1) {
      setChoiceTestData((pre: any) => {
        return {
          ...pre,
          testTypeOne: [],
        };
      });
    }
    if (showAddTest.type == 2) {
      setChoiceTestData((pre: any) => {
        return {
          ...pre,
          testTypeTwo: [],
        };
      });
    }
    if (showAddTest.type == 3) {
      setChoiceTestData((pre: any) => {
        return {
          ...pre,
          testTypeThree: [],
        };
      });
    }
  };
  const navigate = useNavigate();
  const submitData = () => {
    var d1 = new Date(dataHSA.values.start);
    var d2 = new Date(dataHSA.values.finnish);
    var same = d2.getTime() > d1.getTime();
    console.log(same);

    if (same == false) {
      notify({
        type: 'error',
        message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
      });
      return false;
    }
    const dataTestOne: any[] = [];
    const dataTestTwo: any[] = [];
    const dataTestThree: any[] = [];
    choiceTestData.testTypeOne.map((key: any) => {
      dataTestOne.push(key.idBaikiemtra);
    });
    choiceTestData.testTypeTwo.map((key: any) => {
      dataTestTwo.push(key.idBaikiemtra);
    });
    choiceTestData.testTypeThree.map((key: any) => {
      dataTestThree.push(key.idBaikiemtra);
    });
    let dt = {
      name: 'HSA',
      idContest: 100,
      maxNumAttempt: 0,
      rounds: [
        {
          name: 'Tư duy định tính',
          listBaikiemtra: dataTestOne,
        },
        {
          name: 'Tư duy định lượng',
          listBaikiemtra: dataTestTwo,
        },
        {
          name: 'Khoa học',
          listBaikiemtra: dataTestThree,
        },
      ],
      isActive: checked,
      timeStart: new Date(dataHSA.values.start).toISOString(),
      timeEnd: new Date(dataHSA.values.finnish).toISOString(),
    };
    if (param.id !== undefined) {
      let data = TestOld;
      data.product.idLesson = null;
      data.product.idSection = null;
      RequestAPI({
        url: PathAPI.baikiemtra + '/' + param.id,
        method: 'PATCH',
        payload: data,
      }).then((res: any) => {});
    }
    RequestAPI({
      url: PathAPI.contest + '/mock',
      method: 'POST',
      payload: dt,
    }).then((res: any) => {
      if (res.status) {
        let changeData = dataAddTest;
        changeData.idMockContest = res.data.idMockContest;
        RequestAPI({
          url: PathAPI.baikiemtra,
          method: 'POST',
          payload: changeData,
        }).then((res1) => {
          const data = localStorage.getItem('addTest');
          const idCourse = localStorage.getItem('idCourse');
          if (data !== null) {
            const parseData = JSON.parse(data);
            parseData.idSection = null;
            parseData.idBaikiemtra = res1.data.idBaikiemtra;
            RequestAPI({
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
        });
      } else {
        alert('Đã xảy ra lỗi!');
      }
    });
  };
  const DeleteTest = async () => {
    await setDeleted({ show: false, type: 0, idBaikiemtra: 0 });
    if (deleted.type === 1) {
      if (choiceTestData.testTypeOne.length === 1) {
        setChoiceTestData((pre: any) => {
          return {
            ...pre,
            testTypeOne: [],
          };
        });
        return true;
      }
      const dt = choiceTestData.testTypeOne.filter(
        (item: any) => item.idBaikiemtra != deleted.idBaikiemtra
      );
      setChoiceTestData((pre: any) => {
        return {
          ...pre,
          testTypeOne: dt,
        };
      });
    }
    if (deleted.type === 2) {
      if (choiceTestData.testTypeTwo.length === 1) {
        setChoiceTestData((pre: any) => {
          return {
            ...pre,
            testTypeTwo: [],
          };
        });
        return true;
      }
      const dt = choiceTestData.testTypeTwo.filter(
        (item: any) => item.idBaikiemtra != deleted.idBaikiemtra
      );
      setChoiceTestData((pre: any) => {
        return {
          ...pre,
          testTypeTwo: dt,
        };
      });
    }
    if (deleted.type === 3) {
      if (choiceTestData.testTypeThree.length === 1) {
        setChoiceTestData((pre: any) => {
          return {
            ...pre,
            testTypeThree: [],
          };
        });
        return true;
      }
      const dt = choiceTestData.testTypeThree.filter(
        (item: any) => item.idBaikiemtra != deleted.idBaikiemtra
      );
      setChoiceTestData((pre: any) => {
        return {
          ...pre,
          testTypeThree: dt,
        };
      });
    }
  };
  const getTypeTest = (type: number) => {
    if (type == 0) {
      return 'Đề tĩnh';
    } else if (type == 1) {
      return 'Đề động';
    } else {
      return 'Bộ đề điều kiện';
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
  useEffect(() => {
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
  }, []);

  const param = useParams();
  useEffect(() => {
    const getData = () => {
      if (param.id !== undefined) {
        let rounds: any = null;
        RequestAPI({
          url: PathAPI.baikiemtra + '/' + param.id,
          method: 'GET',
        }).then((res: any) => {
          if (res.status) {
            setTestOld(res.data);
            RequestAPI({
              url: PathAPI.contest,
              params: {
                idMockContest: res.data.idMockContest,
              },
              method: 'GET',
            }).then((res: any) => {
              // console.log(res.data.rounds[0].listBaikiemtra);
              rounds = res.data.rounds;
              setRoundTest(rounds);
              dataHSA.values.start = res.data.timeStart;
              dataHSA.values.finnish = res.data.timeEnd;
            });
          }
        });
      }
    };

    getData();
  }, []);
  useEffect(() => {
    const TypeOne: any[] = [];
    const TypeTwo: any[] = [];
    const TypeThree: any[] = [];
    const getRoundTest = async () => {
      if (roundTest != null) {
        // RequestAPI({
        //     url: PathAPI.baikiemtra + '/' + roundTest[0].listBaikiemtra[0],
        //     method: 'GET',
        // }).then((res: any) => {
        //     TypeOne.push(res.data);
        // });
        roundTest[0].listBaikiemtra.map((it: any) => {
          RequestAPI({
            url: PathAPI.baikiemtra + '/' + it,
            method: 'GET',
          }).then((res: any) => {
            if (res.data) {
              TypeOne.push(res.data);
              setChoiceTestData((pre: any) => {
                return {
                  ...pre,
                  testTypeOne: TypeOne,
                };
              });
            }
          });
        });

        roundTest[1].listBaikiemtra.map((it: any) => {
          RequestAPI({
            url: PathAPI.baikiemtra + '/' + it,
            method: 'GET',
          }).then((res: any) => {
            if (res.data) {
              TypeTwo.push(res.data);
              setChoiceTestData((pre: any) => {
                return {
                  ...pre,
                  testTypeTwo: TypeTwo,
                };
              });
            }
          });
        });
        roundTest[2].listBaikiemtra.map((it: any) => {
          RequestAPI({
            url: PathAPI.baikiemtra + '/' + it,
            method: 'GET',
          }).then((res: any) => {
            if (res.data) {
              TypeThree.push(res.data);
              setChoiceTestData((pre: any) => {
                return {
                  ...pre,
                  testTypeThree: TypeThree,
                };
              });
            }
          });
        });
        // await setChoiceTestData((pre: any) => {
        //     return {
        //         ...pre,
        //         testTypeOne: TypeOne,
        //         testTypeThree: TypeThree,
        //     };
        // });
      }
    };
    getRoundTest();
  }, [roundTest]);
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
  const idCourse = localStorage.getItem('idCourse');
  useEffect(() => {
    const dataTest = localStorage.getItem('addTest');
    let Lesson: any = null;
    if (dataTest !== null) {
      Lesson = JSON.parse(dataTest);
    }
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
      arrData[0].listLesson.map((item: any) => {
        if (item.id === Lesson.idLesson) {
          setLesson(item.title);
        }
      });
      // console.log(filterSection);
    });
  }, []);
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
          <div className='font-bold text-[20px] text-black mb-2'>Phần 1: Tư duy định lượng</div>
          {choiceTestData &&
            choiceTestData?.testTypeOne?.map((item: any, index: number) => (
              <div key={item.idBaikiemtra}>
                <div className='flex'>
                  <p className='text-md font-bold pt-2 text-black pr-4'>Đề thi {index + 1}</p>
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
                            <p className='pl-4'>{item.listTestInfo[0]?.numQuestion}</p>
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
          <Button
            className='m-3 flex justify-center items-center px-4 py-1 text-sm'
            onClick={() => displayModalAddTest(1)}
          >
            <Add size='32' color='#FFF' variant='Outline' />
            <p className='text-white'>Thêm đề</p>
          </Button>
        </div>
        <div className='mt-5'>
          <div className='font-bold text-[20px] text-black mb-2'>Phần 2: Tư duy định tính</div>
          {choiceTestData.testTypeTwo
            ? choiceTestData.testTypeTwo?.map((item: any, index: number) => (
                <div key={item.idBaikiemtra}>
                  <div className='flex'>
                    <p className='text-md font-bold pt-2 text-black pr-4'>Đề thi {index + 1}</p>
                    <div
                      className='bg-ct-red-500 p-2 rounded-md ml-2'
                      onClick={() =>
                        setDeleted({
                          show: true,
                          type: 2,
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
                              <p className='pl-4'>{item.listTestInfo[0]?.numQuestion}</p>
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
              ))
            : ''}
          <Button
            className='m-3 flex justify-center items-center px-4 py-1 text-sm'
            onClick={() => displayModalAddTest(2)}
          >
            <Add size='32' color='#FFF' variant='Outline' />
            <p className='text-white'>Thêm đề</p>
          </Button>
        </div>
        <div className='mt-5'>
          <div className='font-bold text-[20px] text-black mb-2'>Phần 3: Khoa học</div>
          {choiceTestData.testTypeThree
            ? choiceTestData.testTypeThree?.map((item: any, index: number) => (
                <div key={item.idBaikiemtra}>
                  <div className='flex'>
                    <p className='text-md font-bold pt-2 text-black pr-4'>Đề thi {index + 1}</p>
                    <div
                      className='bg-ct-red-500 p-2 rounded-md ml-2'
                      onClick={() =>
                        setDeleted({
                          show: true,
                          type: 3,
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
                              <p className='pl-4'>{item.listTestInfo[0]?.numQuestion}</p>
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
              ))
            : ''}
          <Button
            className='m-3 flex justify-center items-center px-4 py-1 text-sm'
            onClick={() => displayModalAddTest(3)}
          >
            <Add size='32' color='#FFF' variant='Outline' />
            <p className='text-white'>Thêm đề</p>
          </Button>
        </div>
        <div className='grid grid-cols-4 gap-4 mt-6 text-black'>
          <div className=''>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Thời gian bắt đầu
            </label>
            <DateTimePicker
              {...dataHSA.getInputProps('start')}
              required
              placeholder='Thời gian bắt đầu'
              inputFormat={'DD-MMM-YYYY hh:mm a'}
              value={dataHSA.values.start !== '' ? new Date(dataHSA.values.start) : null}
            />
          </div>
          <div>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Thời gian kết thúc
            </label>
            <DateTimePicker
              {...dataHSA.getInputProps('finnish')}
              required
              placeholder='Thời gian kết thúc'
              inputFormat={'DD-MMM-YYYY hh:mm a'}
              value={dataHSA.values.finnish !== '' ? new Date(dataHSA.values.finnish) : null}
            />
          </div>
        </div>
        <div className='mt-4'>
          <Checkbox
            className='w-full'
            label='Active bộ đề'
            classNames={{
              label: 'font-bold text-inherit',
            }}
            defaultChecked={checked}
            onChange={(e: any) => setChecked(e.target.checked)}
          />
        </div>
        <div className='mt-3 flex justify-center'>
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
                        title: <Checkbox onChange={(e) => handleSelectQuestionTempral(e, 'all')} />,
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
              onClick={() =>
                setShowAddTest((pre: any) => {
                  return { type: 0, show: false };
                })
              }
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
      <Modal opened={success} onClose={() => setSuccess(false)} hideCloseButton={true} radius={15}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Tạo cuộc thi thành công
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button
              variant='outline'
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => setSuccess(false)}
            >
              Quay lại{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => (window.location.href = 'https://hm-hsa.vercel.app/')}
            >
              {' '}
              Xem cuộc thi{' '}
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
export default AddHSAToCourse;
