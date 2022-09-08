import {
  Checkbox,
  LoadingOverlay,
  Modal,
  MultiSelect,
  NumberInput,
  ScrollArea,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Button from 'components/Button';
import Loading from 'components/Loading';
import MathJaxRender from 'components/MathJax';
import Pagination from 'components/Pagination';
import PreviewQuestion from 'components/PreviewQuestion';
import Table from 'components/Table';
import { questionEnumType, TagType } from 'enum';
import { Add, ArrowDown2, ArrowLeft, Eye, Trash } from 'iconsax-react';
import { subjectType } from 'pages/ManageQuestion/Question/type';
import { useEffect, useState } from 'react';
import { DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Constant, QuestionPreview, TestEdit } from 'store/selector';
import { updateQuestionPreview } from 'store/slice/question';
import { storeQuestion } from 'store/slice/test';
import { notify } from '../../../utils/notify';
import { CountQuestionType, CreateStaticTestType, FormType } from './type';

const CreateStaticTest = ({
  openStaticPopup,
  setOpenStaticPopup,
  handleChangeListQuestion,
  handleCountQuestion,
  className,
  handleChangeScore,
}: CreateStaticTestType) => {
  const testRedux = useSelector(TestEdit);
  const dispatch = useDispatch();
  const constantFormRedux = useSelector(Constant);
  const questionPreviewRedux = useSelector(QuestionPreview);
  const constantForm = JSON.parse(JSON.stringify(constantFormRedux));

  const [classAndSubjectForm, setClassAndSubjectForm] = useState<any>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [classListForm, setClassListForm] = useState<any>([]);
  const [subjectListForm, setSubjectListForm] = useState<any>([]);
  const [pagination, setPagiantion] = useState({
    active: 1,
    total: 1,
    pageSize: 10,
  });
  const [listQuestion, setListQuestion] = useState<any>([]);
  const [listQuestionTemp, setListQuestionTemp] = useState<any>([]);
  const [listQuestionSelected, setListQuestionSelected] = useState<any>([]);
  const [isCheckAllQuestion, setIsCheckAllQuestion] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<CountQuestionType>({
    Essay: 0,
    Sort: 0,
    YesNo: 0,
    Pair: 0,
    Reading: 0,
    ShortAnswer: 0,
    MultiChoiceOneRight: 0,
    MultiChoiceMultiRight: 0,
    FillBlank: 0,
  });

  const questionForm = useForm<FormType>({
    initialValues: {
      idClass: [],
      quiz_type: '',
      idSubject: '',
      format: '',
      awareness_level: '',
      level: '',
      idTag: [],
    },
    validationRules: {
      // idClass: (value: string[]) => value.length > 0,
      // idSubject: (value: string) => value !== '',
    },
    errorMessages: {
      idClass: 'Bạn chưa chọn lớp',
      idSubject: 'Bạn chưa chọn môn học',
    },
  });

  const handlePaging = (page: number) => {
    setPagiantion((pre: any) => {
      return {
        ...pre,
        active: page,
      };
    });
  };

  const handleSelectQuestionTempral = (e: any, item: any) => {
    const clone = JSON.parse(JSON.stringify(listQuestion));
    if (item !== 'all') {
      const index = clone.findIndex((i: any) => i.idQuestion === item.idQuestion);
      clone[index]['checked'] = e.target.checked;
    } else {
      clone.forEach((i: any) => {
        i['checked'] = e.target.checked;
      });
    }
    setListQuestion(clone);
    const filterSelected = clone.filter((i: any) => i.checked === true);
    let pushSelectQues: any[] = listQuestionTemp;
    console.log(pushSelectQues);

    if (e.target.checked === false && pushSelectQues.length === 1) {
      pushSelectQues = [];
    } else {
      filterSelected.map((i: any) => {
        const filter = listQuestionTemp.findIndex((j: any) => i.idQuestion === j.idQuestion);
        if (filter === -1) {
          if (e.target.checked) pushSelectQues.push(i);
        } else {
          if (e.target.checked === false) pushSelectQues.splice(filter, 1);
        }
      });
    }
    console.log(pushSelectQues);
    setListQuestionTemp(pushSelectQues);
  };
  const handleAddQuestionSelected = () => {
    // console.log(clone.filter((i: any) => i.checked));

    const clone = JSON.parse(JSON.stringify(listQuestionTemp));
    const checkedQuestion = clone.filter((i: any) => i.checked);
    const selectedQuestion = listQuestionSelected.map((k: any) => k);
    checkedQuestion.map((ques: any) => {
      const isExist = listQuestionSelected.find((i: any) => i.idQuestion === ques.idQuestion);
      if (!isExist) {
        setListQuestionSelected((pre: any) => [...pre, ques]);
      }
    });
    listQuestion
      .filter((i: any) => i.checked)
      .map((ques: any) => {
        const checkItem = listQuestionSelected.findIndex(
          (i: any) => i.idQuestion === ques.idQuestion
        );
        if (checkItem == -1) {
          selectedQuestion.push(ques);
        }
      });
    localStorage.setItem('selectedQuestion', JSON.stringify(listQuestionTemp));
    setOpenStaticPopup(false);
  };
  const handleChangePointQuestion = (id: number, point: any) => {
    const clone = JSON.parse(JSON.stringify(listQuestionSelected));
    const index = clone.findIndex((i: any) => i.idQuestion === id);
    clone[index]['point'] = point;
    setListQuestionSelected(clone);
  };
  const handleChangeClass = (classListSelected: any) => {
    const listSubject: any[] = [];
    classListSelected.map((item: any) => {
      classAndSubjectForm[item].listSubject.map((item: any) => {
        const subject = {
          value: '' + item.idSubject,
          label: item.name,
        };
        const index = listSubject.findIndex((item: any) => item.value == subject.value);
        if (index === -1) {
          listSubject.push(subject);
        }
        return subject;
      });
    });
    //xử lý chỉ lấy môn thỏa mãn tất cả cá lớp được chọn
    const arrListSubjectWithClass: any[][] = questionForm.values.idClass.map((item: any) => {
      return classAndSubjectForm[item].listSubject;
    });
    let subjectMatchAllClass: subjectType[] = [];
    listSubject.map((subject: subjectType) => {
      let count = 0;
      for (let index = 0; index < arrListSubjectWithClass.length; index++) {
        arrListSubjectWithClass[index].map((item: any) => {
          if (subject.value == item.idSubject) {
            count++;
          }
        });
      }
      if (count === arrListSubjectWithClass.length) {
        subjectMatchAllClass.push(subject);
        count = 0;
      }
    });
    questionForm.setFieldValue('idSubject', '');
    setSubjectListForm(subjectMatchAllClass);
  };

  const handleGetQuestion = () => {
    if (!questionForm.validate()) {
      notify({
        type: 'error',
        message: 'Bạn chưa chọn lớp hoặc môn học',
      });
      setListQuestion([]);
    } else {
      setIsLoading(true);
      RequestAPI({
        url: PathAPI.question,
        method: 'GET',
        params: {
          ...questionForm.values,
        },
        pagination: {
          pageSize: pagination.pageSize,
          pageIndex: pagination.active,
        },
      }).then((res: any) => {
        if (res.status) {
          setListQuestion(res.data);
          setPagiantion((pre: any) => {
            return {
              ...pre,
              total: Math.ceil(res.total / 10) > 0 ? Math.ceil(res.total / 10) : 1,
            };
          });
          setIsLoading(false);
        }
      });
    }
  };
  const handlePreviewQuestion = (id: number) => {
    const index = listQuestion.findIndex((item: any) => item.idQuestion === id);
    dispatch(updateQuestionPreview(listQuestion[index]));
    setIsOpenPreview(true);
  };

  useEffect(() => {
    RequestAPI({
      url: PathAPI.tag,
      method: 'GET',
      params: {
        type: TagType.QUESTION,
      },
      pagination: {
        pageSize: 100,
        pageIndex: 1,
      },
    }).then((res: any) => {
      if (res.status) {
        setTagList(res.data);
      }
    });
  }, []);

  useEffect(() => {
    RequestAPI({
      url: PathAPI.class,
      method: 'GET',
    }).then((res: any) => {
      setClassAndSubjectForm(res.data);
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
    // setPagiantion((pre: any) => {
    //     return {
    //         ...pre,
    //         total: Math.ceil(pagination.pageSize / 10),
    //     };
    // });
    setIsLoading(true);
    RequestAPI({
      url: PathAPI.question,
      method: 'GET',
      params: {
        ...questionForm.values,
      },
      pagination: {
        pageSize: pagination.pageSize,
        pageIndex: pagination.active,
      },
    }).then((res: any) => {
      if (res.status) {
        isCheckAllQuestion && setIsCheckAllQuestion(false);
        let data = res.data.map((item: any) => {
          item['checked'] = false;
          return item;
        });
        let setChecked: any[] = [];
        data.map((item: any) => {
          listQuestionTemp.map((item1: any) => {
            if (item.idQuestion === item1.idQuestion) {
              item.checked = item1.checked;
            }
          });
          setChecked.push(item);
        });
        console.log(setChecked);

        setListQuestion(data);
        setPagiantion((pre: any) => {
          return {
            ...pre,
            total: Math.ceil(res.total / 10) > 0 ? Math.ceil(res.total / 10) : 1,
          };
        });
        setIsLoading(false);
      }
    });
  }, [pagination.active, pagination.pageSize]);

  useEffect(() => {
    const tempCount: CountQuestionType = {
      Essay: 0,
      Sort: 0,
      YesNo: 0,
      Pair: 0,
      Reading: 0,
      ShortAnswer: 0,
      MultiChoiceOneRight: 0,
      MultiChoiceMultiRight: 0,
      FillBlank: 0,
    };

    listQuestionSelected.map((ques: any) => {
      switch (Number(ques.quiz_type)) {
        case questionEnumType.ESSAY:
          tempCount.Essay++;
          break;
        case questionEnumType.MULTIPLE_RIGHT:
          tempCount.MultiChoiceMultiRight++;
          break;
        case questionEnumType.ONE_RIGHT:
          tempCount.MultiChoiceOneRight++;
          break;
        case questionEnumType.FILL_BLANK:
          tempCount.FillBlank++;
          break;
        case questionEnumType.PAIR:
          tempCount.Pair++;
          break;
        case questionEnumType.READING:
          tempCount.Reading = tempCount.Reading++ + ques.listQuestionChildren.length;
          break;
        case questionEnumType.SHORT:
          tempCount.ShortAnswer++;
          break;
        case questionEnumType.SORT:
          tempCount.Sort++;
          break;
        case questionEnumType.YES_NO:
          tempCount.YesNo++;
          break;
        default:
          break;
      }
    });

    const countPoint = { totalQuestion: 0, totalPointSelected: 0 };
    const totalScore =
      tempCount.Essay +
      tempCount.MultiChoiceMultiRight +
      tempCount.MultiChoiceOneRight +
      tempCount.FillBlank +
      tempCount.Pair +
      tempCount.Reading +
      tempCount.ShortAnswer +
      tempCount.Sort +
      tempCount.YesNo;
    countPoint.totalQuestion = totalScore;
    listQuestionSelected.map((ques: any) => {
      if (ques.point) {
        countPoint.totalPointSelected += ques.point;
      }
    });

    handleCountQuestion(countPoint);
    setQuestionCount(tempCount);
    handleChangeListQuestion(listQuestionSelected);
  }, [listQuestionSelected]);

  useEffect(() => {
    if (testRedux?.listQuestion?.length > 0) {
      setListQuestionSelected(testRedux.listQuestion);
      setListQuestion(testRedux.listQuestion);
      dispatch(storeQuestion(testRedux.listQuestion));
    }
  }, [testRedux]);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(listQuestionSelected);
    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder);
    setListQuestion(items);
    setListQuestionSelected(items);
  };

  return (
    <>
      <div className={`mx-5 w-full mt-4 ${className}`}>
        <div className='mr-14 mb-8'>
          <div className='flex'>
            <div className='w-1/3 flex'>
              <div className='w-max'>
                <p>Câu hỏi {constantForm?.question?.quiz_type[0].title}: </p>
                <p>Câu trả {constantForm?.question?.quiz_type[1].title}: </p>
                <p>Câu hỏi {constantForm?.question?.quiz_type[2].title}: </p>
              </div>
              <div className='ml-2'>
                <p>{questionCount.Essay}</p>
                <p>{questionCount.MultiChoiceOneRight}</p>
                <p>{questionCount.MultiChoiceMultiRight}</p>
              </div>
            </div>
            <div className='w-1/3 flex justify-center'>
              <div className='w-max'>
                <p>Câu hỏi {constantForm?.question?.quiz_type[3].title}: </p>
                <p>Câu hỏi {constantForm?.question?.quiz_type[4].title}: </p>
                <p>Câu hỏi {constantForm?.question?.quiz_type[5].title}: </p>
              </div>
              <div className='ml-2'>
                <p>{questionCount.YesNo}</p>
                <p>{questionCount.ShortAnswer}</p>
                <p>{questionCount.Pair}</p>
              </div>
            </div>
            <div className='w-1/3 flex justify-end'>
              <div className='w-max'>
                <p>Câu hỏi {constantForm?.question?.quiz_type[6].title}: </p>
                <p>Câu hỏi {constantForm?.question?.quiz_type[7].title}: </p>
                <p>Câu hỏi {constantForm?.question?.quiz_type[8].title}: </p>
              </div>
              <div className='ml-2'>
                <p>{questionCount.Reading}</p>
                <p>{questionCount.FillBlank}</p>
                <p>{questionCount.Sort}</p>
              </div>
            </div>
          </div>
        </div>
        <ScrollArea style={{ height: '60vh', width: '95%' }}>
          {isOpenPreview ? (
            <div className='px-2'>
              <div
                className='flex items-center bg-ct-secondary w-fit rounded-md text-white cursor-pointer p-2 mb-4'
                onClick={() => setIsOpenPreview(false)}
              >
                <ArrowLeft size='25' color='currentColor' />
                <p className='px-2 '>Quay lại</p>
              </div>
              <div>
                <PreviewQuestion
                  quiz_type={questionPreviewRedux?.quiz_type}
                  data={questionPreviewRedux}
                />
              </div>
            </div>
          ) : (
            <Table
              isDragable
              handleResultDrag={onDragEnd}
              dataSource={{
                columns: [
                  {
                    title: 'Hành động',
                    centered: true,
                  },
                  {
                    title: 'Điểm',
                    size: 100,
                  },
                  {
                    title: 'Mã câu hỏi',
                    centered: true,
                    size: 100,
                  },
                  {
                    title: 'Nội dung',
                    centered: true,
                    size: 500,
                  },
                  {
                    title: 'Môn học',
                  },
                  {
                    title: 'Kiểu câu hỏi',
                  },
                  {
                    title: 'Đơn vị kiến thức',
                  },
                  {
                    title: 'Số câu trả lời con',
                  },
                  {
                    title: 'Độ khó',
                  },
                  {
                    title: 'Số lượt đã làm',
                  },
                  {
                    title: 'Tỉ lệ làm đúng',
                  },
                ],
                data: listQuestionSelected.map((item: any, index: number) => {
                  return {
                    action: (
                      <div className='flex'>
                        <Trash
                          size='20'
                          color='red'
                          variant='Outline'
                          onClick={() => {
                            setListQuestionSelected(
                              listQuestionSelected.filter(
                                (item2: any) => item2.idQuestion !== item.idQuestion
                              )
                            );
                            //lưu ds câu hỏi sau khi xóa
                            localStorage.setItem(
                              'selectedQuestion',
                              JSON.stringify(
                                listQuestionSelected.filter(
                                  (item2: any) => item2.idQuestion !== item.idQuestion
                                )
                              )
                            );
                          }}
                        />
                        <Eye
                          size='20'
                          color='currentColor'
                          className='ml-4 text-ct-green-300'
                          onClick={() => {
                            handlePreviewQuestion(item.idQuestion);
                          }}
                        />
                      </div>
                    ),
                    score: (
                      <>
                        <NumberInput
                          required
                          hideControls
                          min={0}
                          precision={2}
                          value={item?.point}
                          onChange={(value: number) =>
                            handleChangePointQuestion(item.idQuestion, value)
                          }
                        />
                      </>
                    ),
                    idQuestion: item.idQuestion,
                    content: item.text ? (
                      <p className='line-clamp-3 whitespace-pre-wrap'>
                        <MathJaxRender math={`${item.text}`} />
                      </p>
                    ) : (
                      ''
                    ),
                    subject: item.subject,
                    quiz_type: constantForm?.question?.quiz_type[item.quiz_type]?.title,
                    unit_knowledge: item?.unit_knowledge,
                    number_answer: item?.number_answer,
                    level: constantForm?.question?.level[item.level]?.title,
                    countDone: item?.countDone,
                    percent: item?.percent,
                  };
                }),
              }}
            />
          )}
        </ScrollArea>
      </div>
      <Modal
        size='80%'
        radius={16}
        opened={openStaticPopup}
        onClose={() => setOpenStaticPopup(false)}
      >
        {constantForm?.question ? (
          <div className='w-full'>
            <div
              className='flex w-full flex-wrap'
              // onSubmit={questionForm.onSubmit((values) =>
              // handleCreateQuestion(values)
              // )}
            >
              <MultiSelect
                {...questionForm.getInputProps('idClass')}
                // required
                className='w-1/3 px-7 py-3'
                radius={15}
                label='Chọn lớp học'
                placeholder='Chọn lớp học'
                data={classListForm}
                onChange={(value: any) => {
                  questionForm.setFieldValue('idClass', value);
                  handleChangeClass(value);
                }}
                clearable={true}
                rightSection={
                  questionForm.values.idClass.length > 0 ? (
                    <Add
                      size={20}
                      className='rotate-45 pointer-events-auto'
                      color='currentColor'
                      variant='Outline'
                      onClick={() => {
                        questionForm.setFieldValue('idClass', []);
                      }}
                    />
                  ) : (
                    <ArrowDown2 size={15} color='currentColor' variant='Bold' />
                  )
                }
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <Select
                {...questionForm.getInputProps('idSubject')}
                // required
                className='w-1/3 px-7 py-3'
                radius={15}
                label='Chọn môn học'
                placeholder='Chọn môn học'
                data={subjectListForm}
                clearable={true}
                rightSection={
                  questionForm.values.idSubject ? (
                    <Add
                      size={20}
                      className='rotate-45 pointer-events-auto'
                      color='currentColor'
                      variant='Outline'
                      onClick={() => {
                        questionForm.setFieldValue('idSubject', '');
                      }}
                    />
                  ) : (
                    <ArrowDown2 size={15} color='currentColor' variant='Bold' />
                  )
                }
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <Select
                {...questionForm.getInputProps('format')}
                className='w-1/3 px-7 py-3'
                radius={15}
                label='Loại câu hỏi'
                placeholder='Loại câu hỏi'
                data={constantForm?.question?.type?.map((item: any) => {
                  item['label'] = item.title;
                  item['value'] = '' + item.value;
                  item['key'] = item.value;
                  return item;
                })}
                clearable={true}
                rightSection={
                  questionForm.values.format ? (
                    <Add
                      size={20}
                      className='rotate-45 pointer-events-auto'
                      color='currentColor'
                      variant='Outline'
                      onClick={() => {
                        questionForm.setFieldValue('format', '');
                      }}
                    />
                  ) : (
                    <ArrowDown2 size={15} color='currentColor' variant='Bold' />
                  )
                }
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <Select
                {...questionForm.getInputProps('awareness_level')}
                className='w-1/3 px-7 py-3'
                radius={15}
                label='Cấp độ nhận biêt câu hỏi'
                placeholder='Cấp độ nhận biêt câu hỏi'
                data={constantForm.question.awarenessLevel?.map((item: any) => {
                  item['label'] = item.title;
                  item['value'] = '' + item.value;
                  item['key'] = item.value;
                  return item;
                })}
                clearable={true}
                rightSection={
                  questionForm.values.awareness_level ? (
                    <Add
                      size={20}
                      className='rotate-45 pointer-events-auto'
                      color='currentColor'
                      variant='Outline'
                      onClick={() => {
                        questionForm.setFieldValue('awareness_level', '');
                      }}
                    />
                  ) : (
                    <ArrowDown2 size={15} color='currentColor' variant='Bold' />
                  )
                }
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <Select
                {...questionForm.getInputProps('level')}
                className='w-1/3 px-7 py-3'
                radius={15}
                label='Độ khó câu hỏi'
                placeholder='Độ khó câu hỏi'
                data={constantForm?.question?.level?.map((item: any) => {
                  item['label'] = item.title;
                  item['value'] = '' + item.value;
                  item['key'] = item.value;
                  return item;
                })}
                clearable={true}
                rightSection={
                  questionForm.values.level ? (
                    <Add
                      size={20}
                      className='rotate-45 pointer-events-auto'
                      color='currentColor'
                      variant='Outline'
                      onClick={() => {
                        questionForm.setFieldValue('level', '');
                      }}
                    />
                  ) : (
                    <ArrowDown2 size={15} color='currentColor' variant='Bold' />
                  )
                }
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <Select
                {...questionForm.getInputProps('quiz_type')}
                className='w-1/3 px-7 py-3'
                radius={15}
                label='Kiểu câu hỏi'
                placeholder='Kiểu câu hỏi'
                data={constantForm?.question?.quiz_type?.map((item: any) => {
                  item['label'] = item.title;
                  item['value'] = '' + item.value;
                  item['key'] = item.value;
                  return item;
                })}
                clearable={true}
                rightSection={
                  questionForm.values.quiz_type !== '' ? (
                    <Add
                      size={20}
                      className='rotate-45 pointer-events-auto'
                      color='currentColor'
                      variant='Outline'
                      onClick={() => {
                        questionForm.setFieldValue('quiz_type', '');
                      }}
                    />
                  ) : (
                    <ArrowDown2 size={15} color='currentColor' variant='Bold' />
                  )
                }
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <MultiSelect
                {...questionForm.getInputProps('idTag')}
                className='w-2/3 px-7 py-3 grow'
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                radius={15}
                label='Nhập Tags'
                placeholder='Nhập Tags'
                data={tagList?.map((item: any) => {
                  const tag = {
                    label: item.name,
                    value: item.idTag,
                  };
                  return tag;
                })}
                searchable
                styles={{ rightSection: { pointerEvents: 'none' } }}
                // creatable
                // getCreateLabel={(query) => `+ Tạo tag ${query}`}
                // onCreate={(query) => setTags((current: any) => [...current, query])}
              />
            </div>
            <div className='w-full mx-7'>
              <Button className='text-sm px-3 py-3' type='submit' onClick={handleGetQuestion}>
                Lấy danh sách câu hỏi
              </Button>
            </div>
            <div className='flex justify-between items-end mx-5 mt-12'>
              <div className='w-40'>
                <NumberInput
                  radius='md'
                  label='Số hàng mỗi trang'
                  value={pagination.pageSize}
                  onChange={(value: number) => {
                    setPagiantion((pre) => {
                      return {
                        ...pre,
                        pageSize: value,
                      };
                    });
                  }}
                  classNames={{
                    controlUp: 'border-none text-ct-secondary',
                    controlDown: 'border-none text-ct-secondary',
                  }}
                  step={10}
                  max={100}
                  min={10}
                />
              </div>
              <p className='font-bold'>Số câu đã chọn: {listQuestionTemp.length}</p>
            </div>
            <div className='mx-5 w-full mt-4'>
              <div className='mx-5 w-full mt-4'>
                <ScrollArea style={{ height: '300px', width: '96%' }}>
                  {isOpenPreview ? (
                    <div className='px-2'>
                      <div
                        className='flex items-center bg-ct-secondary w-fit rounded-md text-white cursor-pointer p-2 mb-4'
                        onClick={() => setIsOpenPreview(false)}
                      >
                        <ArrowLeft size='25' color='currentColor' />
                        <p className='px-2'>Quay lại</p>
                      </div>
                      <div>
                        <PreviewQuestion
                          quiz_type={questionPreviewRedux?.quiz_type}
                          data={questionPreviewRedux}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {isLoading ? <LoadingOverlay visible={true} /> : ''}
                      <Table
                        dataSource={{
                          columns: [
                            {
                              title: (
                                <Checkbox
                                  checked={isCheckAllQuestion}
                                  onChange={(e) => {
                                    handleSelectQuestionTempral(e, 'all');
                                    setIsCheckAllQuestion(!isCheckAllQuestion);
                                  }}
                                />
                              ),
                              centered: true,
                            },
                            {
                              title: 'Hành động',
                              centered: true,
                            },
                            {
                              title: 'Mã câu hỏi',
                            },
                            {
                              title: 'Nội dung',
                              size: 200,
                            },
                            {
                              title: 'Môn học',
                            },
                            {
                              title: 'Kiểu câu hỏi',
                            },
                            {
                              title: 'Đơn vị kiến thức',
                            },
                            {
                              title: 'Số câu trả lời con',
                            },
                            {
                              title: 'Độ khó',
                            },
                            {
                              title: 'Số lượt đã làm',
                            },
                            {
                              title: 'Tỉ lệ làm đúng',
                            },
                          ],
                          data: listQuestion.map((item: any, index: number) => {
                            return {
                              action: (
                                <Checkbox
                                  checked={item.checked}
                                  onChange={(e) => {
                                    handleSelectQuestionTempral(e, item);
                                  }}
                                />
                              ),
                              preview: (
                                <>
                                  <Eye
                                    size='20'
                                    color='currentColor'
                                    className='text-ct-green-300'
                                    onClick={() => {
                                      handlePreviewQuestion(item.idQuestion);
                                    }}
                                  />
                                </>
                              ),
                              idQuestion: item.idQuestion,
                              content: item.text ? (
                                <p className='line-clamp-3 whitespace-pre-wrap'>
                                  <MathJaxRender math={`${item.text}`} />
                                </p>
                              ) : (
                                ''
                              ),
                              subject: item.subject,
                              quiz_type: constantForm?.question?.quiz_type[item.quiz_type]?.title,
                              unit_knowledge: item?.unit_knowledge,
                              number_answer: item?.number_answer,
                              level: constantForm?.question?.level[item.level]?.title,
                              countDone: item?.countDone,
                              percent: item?.percent,
                            };
                          }),
                        }}
                      />
                    </>
                  )}
                </ScrollArea>
                {listQuestion.length > 0 ? (
                  ''
                ) : (
                  <p className='p-10 w-fit mx-auto'>Không có dữ liệu</p>
                )}
              </div>
            </div>
            <div className='w-full flex justify-end mt-4'>
              <Pagination handlePaging={handlePaging} total={pagination.total} />
            </div>
            <div className='flex justify-center items-center w-full mt-10'>
              <Button className='m-4' variant='outline' onClick={() => setOpenStaticPopup(false)}>
                Hủy
              </Button>
              <Button className='m-4' onClick={handleAddQuestionSelected}>
                Thêm câu hỏi
              </Button>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </Modal>
    </>
  );
};

export default CreateStaticTest;
