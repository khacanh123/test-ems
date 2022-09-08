import {
  Modal,
  MultiSelect,
  ScrollArea,
  Select,
  Stepper,
  Table as TableMantine,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import CK5Editor from 'components/CK5Editor';
import CountDownModal from 'components/CountDownModal';
import Idle from 'components/Idle';
import MathJaxRender from 'components/MathJax';
import DeleteModal from 'components/Modal/Delete';
import PreviewQuestion from 'components/PreviewQuestion';
import UploadAsset from 'components/UploadAsset';
import { FieldType, TagType } from 'enum';
import { Add, AddCircle, ArrowDown2, ArrowLeft, Edit, Trash } from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Constant, QuestionImport } from 'store/selector';
import { updateQuestion } from 'store/slice/question';
import { AlertTriangle } from 'tabler-icons-react';
import { v4 as uuidv4 } from 'uuid';
import {
  checkAllAnswerQuestion,
  getLengthListKeyWordMax,
  haveAnswerRight,
} from '../../../../helper/index';
import { alphabet } from '../../../../utils/utils';
import QuestionCreateType from '../CreateQuestion/components';
import { subjectType } from '../type';
interface FormType {
  listClass: string[];
  listSubject: string[];
  listTag: [];
  quiz_type: number;
}
const ImportQuestionContainer = () => {
  const questionImportDataRedux = useSelector(QuestionImport);
  const constantFormRedux = useSelector(Constant);
  const constantForm = JSON.parse(JSON.stringify(constantFormRedux));
  const [questionImportData, setQuestionImportData] = useState(questionImportDataRedux);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (questionImportData.length === 0) {
    return (
      <>
        <div
          className='flex items-center bg-ct-secondary w-fit rounded-md text-white cursor-pointer p-2'
          onClick={() => navigate('/manage-question/question')}
        >
          <ArrowLeft size='25' color='currentColor' />
          <p className='px-2 '>Quay lại</p>
        </div>
        <p className='text-center text-xl my-4'>Vui lòng nhập câu hỏi và thử lại sau!</p>
        <Idle />
      </>
    );
  }

  let maxLengthAnswer = 0;
  questionImportData.map((item: any) => {
    if (questionImportData[0].quiz_type === 4) {
      if (item.listShortAnswer.listKeyword.length > maxLengthAnswer) {
        maxLengthAnswer = item.listShortAnswer.listKeyword.length;
      }
    } else if (questionImportData[0].quiz_type === 6) {
      if (item.quiz_type === 1 || 2 || 3) {
        if (item.listSelectOptions.length > maxLengthAnswer) {
          maxLengthAnswer = item.listSelectOptions.length;
        }
      } else {
        if (item.listShortAnswer.listKeyword.length > maxLengthAnswer) {
          maxLengthAnswer = item.listShortAnswer.listKeyword.length;
        }
      }
    } else {
      if (item.listSelectOptions.length > maxLengthAnswer) {
        maxLengthAnswer = item.listSelectOptions.length;
      }
    }
  });
  const alphabe = alphabet();

  const [isDirectModal, setIsDirectModal] = useState(false);
  const [classAndSubjectForm, setClassAndSubjectForm] = useState<any>([]);
  const [classListForm, setClassListForm] = useState<any>([]);
  const [subjectListForm, setSubjectListForm] = useState<any>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [step, setStep] = useState<number>(1);
  const [haveQuestionNoAnswerRight, setHaveQuestionNoAnswerRight] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<any>({
    isOpen: false,
    id: '',
  });
  const [isAddOpen, setIsAddOpen] = useState<any>({
    isOpen: false,
    content: null,
  });
  const [isEditOpen, setIsEditOpen] = useState<any>({
    isOpen: false,
    content: null,
  });

  const questionForm = useForm<FormType>({
    initialValues: {
      listClass: [],
      listSubject: [],
      listTag: [],
      quiz_type: 0,
    },
    validationRules: {
      listClass: (value: string[]) => value.length > 0,
      listSubject: (value: string[]) => value.length > 0,
      // listTag: (value: string[]) => value.length > 0,
    },
    errorMessages: {
      listClass: 'Bạn chưa chọn lớp',
      listSubject: 'Bạn chưa chọn môn học',
      // listTag: 'Bạn chưa chọn tags',
    },
  });

  const handleTempQuestionData = (data: any) => {
    if (isAddOpen.isOpen) {
      if (questionForm.values.quiz_type === 4) {
        setIsAddOpen((pre: any) => {
          return {
            ...pre,
            content: {
              ...pre.content,
              listShortAnswer: {
                listKeyword: data.listKeyword,
                isCapital: data.isCapital,
                isExact: data.isExact,
              },
            },
          };
        });
      } else if (questionForm.values.quiz_type === 6) {
        setIsAddOpen((pre: any) => {
          return {
            ...pre,
            content: {
              ...pre.content,
              listQuestionChildren: data,
            },
          };
        });
      } else {
        setIsAddOpen((pre: any) => {
          return {
            ...pre,
            content: {
              ...pre.content,
              listSelectOptions: data,
            },
          };
        });
      }
    }
    if (isEditOpen.isOpen) {
      if (questionForm.values.quiz_type === 4) {
        setIsEditOpen((pre: any) => {
          return {
            ...pre,
            content: {
              ...pre.content,
              listShortAnswer: {
                listKeyword: data.listKeyword,
                isCapital: data.isCapital,
                isExact: data.isExact,
              },
            },
          };
        });
      } else if (questionForm.values.quiz_type === 6) {
        setIsEditOpen((pre: any) => {
          return {
            ...pre,
            content: {
              ...pre.content,
              listQuestionChildren: data,
            },
          };
        });
      } else {
        setIsEditOpen((pre: any) => {
          return {
            ...pre,
            content: {
              ...pre.content,
              listSelectOptions: data,
            },
          };
        });
      }
    }
  };

  const handleEditQuestion = () => {
    const index = questionImportData?.findIndex((item: any) => item._id === isEditOpen.content._id);
    if (index !== -1) {
      let temp = JSON.parse(JSON.stringify(questionImportData));
      temp[index] = isEditOpen.content;

      dispatch(updateQuestion(temp));
      setIsEditOpen({
        isOpen: false,
        // content: '',
      });
    }
  };
  const handleChangeNameQuestion = (id: string, name: string) => {
    //save temparute to local Storage for performance
    const data = JSON.parse(localStorage.getItem('nameQuestionList') as string) || [];
    const index = data.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data[index] = {
        id,
        name,
      };
    } else {
      data.push({ id, name });
    }
    localStorage.setItem('nameQuestionList', JSON.stringify(data));
  };

  const handleDeleteQuestion = (id: string) => {
    const index = questionImportData?.findIndex((item: any) => item._id === id);
    if (index !== -1) {
      let temp = JSON.parse(JSON.stringify(questionImportData));
      temp.splice(index, 1);
      dispatch(updateQuestion(temp));
      setIsDeleteOpen({
        isOpen: false,
        id: '',
      });
    }
  };

  const handleAddQuestion = () => {
    const newQues = {
      ...isAddOpen.content,
      _id: uuidv4(),
      quiz_type: questionImportData[0].quiz_type,
      listClass: questionImportData[0].listClass,
      listSubject: questionImportData[0].listSubject,
      listKnowledgeUnit: questionImportData[0].listKnowledgeUnit,
      listTag: questionImportData[0].listTag,
    };

    dispatch(updateQuestion([...questionImportData, newQues]));
    setIsAddOpen({
      isOpen: false,
      // content: null,
    });
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
    const arrListSubjectWithClass: any[][] = questionForm.values.listClass.map((item: any) => {
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

    //xóa những môn không có trong các lớp đã chọn
    const temp = subjectMatchAllClass.filter((item: subjectType) => {
      return questionForm.values.listSubject.findIndex((item2: any) => item2 == item.value) !== -1;
    });
    const reformSubjectList: string[] = temp.map((item: subjectType) => item.value.toString());
    questionForm.setFieldValue('listSubject', reformSubjectList);
    setSubjectListForm(subjectMatchAllClass);
  };

  const handleChangeQuizType = (_id: string, quizType: string) => {
    let clone = JSON.parse(JSON.stringify(questionImportData));
    const index = questionImportData.findIndex((item: any) => item._id === _id);
    if (index !== -1) {
      clone[index].quiz_type = Number(quizType);
      dispatch(updateQuestion(clone));
    }
  };
  const handleChangeAwarenessLevel = (_id: string, awareness: string) => {
    let clone = JSON.parse(JSON.stringify(questionImportData));
    const index = questionImportData.findIndex((item: any) => item._id === _id);
    if (index !== -1) {
      clone[index].awareness_level = Number(awareness);
      dispatch(updateQuestion(clone));
    }
  };
  const handleChangeLevel = (_id: string, level: string) => {
    let clone = JSON.parse(JSON.stringify(questionImportData));
    const index = questionImportData.findIndex((item: any) => item._id === _id);
    if (index !== -1) {
      clone[index].level = Number(level);
      dispatch(updateQuestion(clone));
    }
  };
  const handleUrlAssetQuestion = ({ url, field }: { url: string; field: FieldType }) => {
    switch (field) {
      case FieldType.IMAGE: {
        setIsEditOpen((prevState: any) => {
          return {
            ...prevState,
            content: {
              ...prevState.content,
              image: url,
            },
          };
        });
        break;
      }
      case FieldType.AUDIO: {
        setIsEditOpen((prevState: any) => {
          return {
            ...prevState,
            content: {
              ...prevState.content,
              audio: url,
            },
          };
        });
        break;
      }
      case FieldType.VIDEO: {
        setIsEditOpen((prevState: any) => {
          return {
            ...prevState,
            content: {
              ...prevState.content,
              video: url,
            },
          };
        });
        break;
      }
      case FieldType.SOLUTION_IMAGE: {
        setIsEditOpen((prevState: any) => {
          return {
            ...prevState,
            content: {
              ...prevState.content,
              solution_image: url,
            },
          };
        });
        break;
      }
      default:
        break;
    }
  };

  const handleUpload = useCallback(() => {
    const cloneQuestionImportData = JSON.parse(JSON.stringify(questionImportData));
    //map name question to id question
    const nameQuestionList = JSON.parse(localStorage.getItem('nameQuestionList') as string) || [];
    nameQuestionList.map((item: any) => {
      const index = cloneQuestionImportData.findIndex((item2: any) => item2._id === item.id);
      if (index !== -1) {
        cloneQuestionImportData[index].name = item.name;
      }
    });
    RequestAPI({
      url: PathAPI.question + '/upload',
      method: 'POST',
      payload: {
        listQuestion: cloneQuestionImportData,
      },
    }).then((res: any) => {
      if (res.status) {
        setIsDirectModal(true);
        localStorage.removeItem('nameQuestionList');
        localStorage.removeItem('typeQuestion');
        localStorage.removeItem('typeUpload');
      }
    });
  }, [questionForm]);

  const exitUpload = () => {
    localStorage.setItem('typeQuestion', questionForm.values.quiz_type + '');
    navigate('/manage-question/question');
  };
  let ind = 0;
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
  }, [Number(questionForm.values.quiz_type)]);

  useEffect(() => {
    questionForm.setFieldValue('quiz_type', questionImportData[0].quiz_type);
    questionForm.setFieldValue(
      'listClass',
      questionImportData[0].listClass.map((item: any) => item.idClass.toString())
    );
    questionForm.setFieldValue(
      'listSubject',
      questionImportData[0].listSubject.map((item: any) => item.idSubject.toString())
    );
    questionForm.setFieldValue('listTag', questionImportData[0].listTag);
  }, []);

  useEffect(() => {
    let clone = JSON.parse(JSON.stringify(questionImportDataRedux));
    if (clone.length > 0) {
      //check có câu nào chưa có đáp an đúng hay không
      const haveQuestionNoAnswerRight = checkAllAnswerQuestion(clone);
      setHaveQuestionNoAnswerRight(haveQuestionNoAnswerRight);
      // quiz_type == 4 lấy câu có keyword nhiều nhất
      if (questionForm.values.quiz_type === 4) {
        maxLengthAnswer = getLengthListKeyWordMax(clone);
      }
      if (questionForm.values.quiz_type === 6) {
        clone.map((item: any) => {
          if (item.quiz_type === 1 || 2 || 3) {
            if (item.listSelectOptions.length > maxLengthAnswer) {
              maxLengthAnswer = item.listSelectOptions.length;
            }
          } else {
            if (item.listShortAnswer.listKeyword.length > maxLengthAnswer) {
              maxLengthAnswer = item.listShortAnswer.listKeyword.length;
            }
          }
        });
      }

      //set mặc định level và cấp độ nhận biết
      clone = clone?.map((item: any) => {
        if (item.level == undefined || item.level == null || item.level == '') {
          item.level = 0;
        }
        if (
          item.awareness_level == undefined ||
          item.awareness_level == null ||
          item.awareness_level == ''
        ) {
          item.awareness_level = 0;
        }
        return item;
      });
    }
    console.log(clone);

    setQuestionImportData([...clone]);
  }, [questionImportDataRedux]);

  return (
    <div>
      <Breadcrumb />
      <div className='px-14'>
        <Stepper className='my-8' active={step - 1} onStepClick={setStep} breakpoint='sm' size='lg'>
          <Stepper.Step allowStepSelect={false} label='Bước 1' description='Nhập danh sách câu hỏi'>
            {/* Step 1 content: Create an account */}
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={false}
            label='Bước 2'
            description='Nhập thuộc tính câu hỏi'
          >
            {/* Step 2 content: Verify email */}
          </Stepper.Step>
          <Stepper.Completed>
            {/* Completed, click back button to get to previous step */}
          </Stepper.Completed>
        </Stepper>
        <div className='w-full mt-4'>
          {step === 1 && (
            <form className='flex w-full flex-wrap'>
              <Select
                {...questionForm.getInputProps('quiz_type')}
                required
                className='w-1/3 py-3'
                radius={15}
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                label='Kiểu câu hỏi'
                placeholder='Kiểu câu hỏi'
                disabled
                data={
                  constantForm?.question?.quiz_type?.map((item: any) => {
                    item['label'] = item.title;
                    item['value'] = item.value.toString();
                    item['key'] = item.value;
                    return item;
                  }) || []
                }
                value={questionForm.values.quiz_type.toString()}
                onChange={(value: any) => {
                  questionForm.setFieldValue('quiz_type', value);
                }}
              />
              <MultiSelect
                {...questionForm.getInputProps('listClass')}
                required
                className='w-1/3 px-4 py-3'
                radius={15}
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                label='Chọn lớp học'
                placeholder='Chọn lớp học'
                data={classListForm}
                onChange={(value: any) => {
                  handleChangeClass(value);
                  questionForm.setFieldValue('listClass', value);
                  const clone = JSON.parse(JSON.stringify(questionImportData));
                  let updateListClass = clone.map((item: any) => {
                    item.listClass = value.map((item: any) => Number(item));
                    return item;
                  });
                  dispatch(updateQuestion(updateListClass));
                }}
              />
              <MultiSelect
                {...questionForm.getInputProps('listSubject')}
                required
                className='w-1/3 py-3'
                radius={15}
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                label='Chọn môn học'
                placeholder='Chọn môn học'
                data={subjectListForm}
                onChange={(value: any) => {
                  questionForm.setFieldValue('listSubject', value);
                  const clone = JSON.parse(JSON.stringify(questionImportData));
                  const updateListSubject = clone.map((item: any) => {
                    item.listSubject = value.map((item: any) => Number(item));
                    return item;
                  });
                  dispatch(updateQuestion(updateListSubject));
                }}
              />

              <MultiSelect
                {...questionForm.getInputProps('listTag')}
                className='w-full py-3 grow'
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                radius={15}
                placeholder='Nhập Tags'
                searchable
                label='Nhập Tags'
                data={tagList?.map((item: any) => {
                  const tag = {
                    label: item.name,
                    value: item.idTag,
                  };
                  return tag;
                })}
                onChange={(value: any) => {
                  questionForm.setFieldValue('listTag', value);
                  const clone = JSON.parse(JSON.stringify(questionImportData));
                  const updateListTags = clone.map((item: any) => {
                    item.listTag = value.map((item: any) => Number(item));
                    return item;
                  });
                  dispatch(updateQuestion(updateListTags));
                }}
                // creatable
                // getCreateLabel={(query) => `+ Tạo tag ${query}`}
                // onCreate={(query) => setTags((current: any) => [...current, query])}
              />
              <div className='list-question mt-4 text-black w-full'>
                {questionImportData
                  ? questionImportData.map((item: any, index: number) => {
                      // console.log(item);

                      const data = item;
                      const isHaveAnswerRight = haveAnswerRight(item.quiz_type, data);
                      return (
                        <div key={index} className={`ques1 mb-8`}>
                          <div>
                            {!isHaveAnswerRight && (
                              <div
                                className={`flex mb-4  ${
                                  !isHaveAnswerRight
                                    ? 'bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4'
                                    : ''
                                } `}
                              >
                                <AlertTriangle size={25} strokeWidth={2} color={'currentColor'} />
                                <span className='pl-2'>
                                  Câu hỏi chưa có{' '}
                                  {item.quiz_type === 4 ? 'từ khóa đúng' : 'đáp án đúng'}
                                </span>
                              </div>
                            )}
                            <div className='flex items-center'>
                              <p className='text-md font-bold pr-4'>Câu hỏi {index + 1}</p>
                              <div
                                className='bg-ct-secondary p-2 rounded-md mx-2'
                                onClick={() => {
                                  setIsEditOpen({
                                    isOpen: true,
                                    content: item,
                                  });
                                }}
                              >
                                <Edit color='white' variant='Outline' size='15' />
                              </div>
                              <div
                                className='bg-ct-red-500 p-2 rounded-md mx-2'
                                onClick={() => {
                                  setIsDeleteOpen({
                                    isOpen: true,
                                    id: item._id,
                                  });
                                }}
                              >
                                <Trash color='white' variant='Outline' size='15' />
                              </div>
                            </div>
                          </div>
                          <div>
                            <PreviewQuestion quiz_type={item?.quiz_type} data={item} />
                          </div>
                        </div>
                      );
                    })
                  : ''}
              </div>
              <div className='w-full mt-8'>
                <Button
                  className='flex items-center px-0 pr-3 text-sm'
                  onClick={() =>
                    setIsAddOpen((pre: any) => ({
                      content: {},
                      isOpen: true,
                    }))
                  }
                >
                  <Add className='mx-2' size={30} variant='Outline' color='white' />
                  <p>Thêm câu hỏi mới</p>
                </Button>
              </div>

              <div className='flex justify-end items-center w-full mt-10'>
                <Button className='m-4' variant='outline' onClick={() => exitUpload()}>
                  Hủy
                </Button>
                <Button
                  className='m-4 mr-0'
                  onClick={questionForm.onSubmit((values) => {
                    setStep(2);
                  })}
                  disabled={haveQuestionNoAnswerRight}
                >
                  Tiếp tục bước 2
                </Button>
              </div>
            </form>
          )}
          {step === 2 && (
            <>
              <div className='step2 w-full h-full overflow-x-scroll'>
                <form>
                  <TableMantine highlightOnHover className=''>
                    {questionForm.values.quiz_type === 6 ? (
                      <>
                        <thead>
                          <th className='whitespace-nowrap border py-4 px-2'>STT</th>
                          <th className='whitespace-nowrap border py-4 px-2 min-w-[400px]'>
                            Đoạn văn
                          </th>
                          <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                            Câu hỏi
                          </th>
                          {Array.from({
                            length: 4,
                          }).map((item: any, index: number) => (
                            <th
                              key={index}
                              className='whitespace-nowrap border py-4 px-2 min-w-[200px]'
                            >
                              {'Đáp án '}
                              {index + 1}
                            </th>
                          ))}
                          <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                            Loại câu hỏi
                          </th>
                          <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                            Cấp độ nhận biết
                          </th>
                          <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                            Độ khó
                          </th>
                        </thead>
                        <tbody>
                          {questionImportData.map((key: any) => {
                            return key.listQuestionChildren.map((key1: any, i1: number) => {
                              const data =
                                key1.quiz_type === 1
                                  ? key1.listSelectOptions
                                  : key1?.listShortAnswer?.listKeyword;
                              if (i1 == 0)
                                return (
                                  <>
                                    <tr>
                                      <td
                                        rowSpan={key.listQuestionChildren.length}
                                        className='border text-center'
                                      >
                                        {ind++}
                                      </td>
                                      <td
                                        rowSpan={key.listQuestionChildren.length}
                                        className='border'
                                      >
                                        <MathJaxRender math={`${key.text}`} />
                                      </td>
                                      <td className='border'>
                                        <MathJaxRender math={`${key1.text}`} />
                                      </td>
                                      {data &&
                                        data.map((ky2: any) => (
                                          <td className='border'>
                                            {key1.quiz_type === 1 ? (
                                              <MathJaxRender math={`${ky2.answer_content}`} />
                                            ) : (
                                              <MathJaxRender math={`${ky2}`} />
                                            )}
                                          </td>
                                        ))}
                                      {Array.from({
                                        length: 4,
                                      }).map((item2, index2) => {
                                        if (index2 < 4 - data.length) {
                                          return <td className='border text-center'></td>;
                                        }
                                      })}
                                      <td>
                                        <Select
                                          placeholder='Loại câu hỏi'
                                          classNames={{
                                            input: 'border-0',
                                            item: 'hover:text-white hover:bg-ct-secondary rounded-none',
                                            dropdown:
                                              'rounded-xl px-0 py-2 border-0 drop-shadow-lg',
                                          }}
                                          rightSection={
                                            <ArrowDown2
                                              size='20'
                                              color='currentColor'
                                              variant='Bold'
                                            />
                                          }
                                          defaultValue={key.type.toString()}
                                          data={constantForm?.question?.type?.map((item: any) => {
                                            item['label'] = item.title;
                                            item['value'] = '' + item.value;
                                            item['key'] = item.value;
                                            return item;
                                          })}
                                          onChange={(value) =>
                                            value && handleChangeQuizType(key._id, value)
                                          }
                                        />
                                      </td>
                                      <td className='border text-gray-600'>
                                        {' '}
                                        <Select
                                          placeholder='Cấp độ nhận biết'
                                          rightSection={
                                            <ArrowDown2
                                              size='20'
                                              color='currentColor'
                                              variant='Bold'
                                            />
                                          }
                                          classNames={{
                                            input: 'border-0',
                                            item: 'hover:text-white hover:bg-ct-secondary rounded-none',
                                            dropdown:
                                              'rounded-xl px-0 py-2 border-0 drop-shadow-lg',
                                          }}
                                          defaultValue={key.awareness_level?.toString() || ''}
                                          data={constantForm.question.awarenessLevel?.map(
                                            (item: any) => {
                                              item['label'] = item.title;
                                              item['value'] = '' + item.value;
                                              item['key'] = item.value;
                                              return item;
                                            }
                                          )}
                                          onChange={(value) =>
                                            value && handleChangeAwarenessLevel(key._id, value)
                                          }
                                        />
                                      </td>
                                      <td className='border text-gray-600'>
                                        {' '}
                                        <Select
                                          placeholder='Độ khó'
                                          classNames={{
                                            input: 'border-0',
                                            item: 'hover:text-white hover:bg-ct-secondary rounded-none',
                                            dropdown:
                                              'rounded-xl px-0 py-2 border-0 drop-shadow-lg',
                                          }}
                                          rightSection={
                                            <ArrowDown2
                                              size='20'
                                              color='currentColor'
                                              variant='Bold'
                                            />
                                          }
                                          defaultValue={key.level?.toString() || ''}
                                          data={constantForm?.question?.level?.map((item: any) => {
                                            item['label'] = item.title;
                                            item['value'] = '' + item.value;
                                            item['key'] = item.value;
                                            return item;
                                          })}
                                          onChange={(value) =>
                                            value && handleChangeLevel(key._id, value)
                                          }
                                        />
                                      </td>
                                    </tr>
                                  </>
                                );
                              else
                                return (
                                  <tr>
                                    <td>
                                      <MathJaxRender math={`${key1.text}`} />
                                    </td>
                                    {data &&
                                      data.map((ky2: any) => (
                                        <td className='border'>
                                          {key1.quiz_type === 1 ? (
                                            <MathJaxRender math={`${ky2.answer_content}`} />
                                          ) : (
                                            <MathJaxRender math={`${ky2}`} />
                                          )}
                                        </td>
                                      ))}
                                    {Array.from({
                                      length: 4,
                                    }).map((item2, index2) => {
                                      if (index2 < 4 - data.length) {
                                        return <td className='border text-center'></td>;
                                      }
                                    })}
                                    <td>
                                      <Select
                                        placeholder='Loại câu hỏi'
                                        classNames={{
                                          input: 'border-0',
                                          item: 'hover:text-white hover:bg-ct-secondary rounded-none',
                                          dropdown: 'rounded-xl px-0 py-2 border-0 drop-shadow-lg',
                                        }}
                                        rightSection={
                                          <ArrowDown2
                                            size='20'
                                            color='currentColor'
                                            variant='Bold'
                                          />
                                        }
                                        defaultValue={key.type.toString()}
                                        data={constantForm?.question?.type?.map((item: any) => {
                                          item['label'] = item.title;
                                          item['value'] = '' + item.value;
                                          item['key'] = item.value;
                                          return item;
                                        })}
                                        onChange={(value) =>
                                          value && handleChangeQuizType(key._id, value)
                                        }
                                      />
                                    </td>
                                    <td className='border text-gray-600'>
                                      {' '}
                                      <Select
                                        placeholder='Cấp độ nhận biết'
                                        rightSection={
                                          <ArrowDown2
                                            size='20'
                                            color='currentColor'
                                            variant='Bold'
                                          />
                                        }
                                        classNames={{
                                          input: 'border-0',
                                          item: 'hover:text-white hover:bg-ct-secondary rounded-none',
                                          dropdown: 'rounded-xl px-0 py-2 border-0 drop-shadow-lg',
                                        }}
                                        defaultValue={key.awareness_level?.toString() || ''}
                                        data={constantForm.question.awarenessLevel?.map(
                                          (item: any) => {
                                            item['label'] = item.title;
                                            item['value'] = '' + item.value;
                                            item['key'] = item.value;
                                            return item;
                                          }
                                        )}
                                        onChange={(value) =>
                                          value && handleChangeAwarenessLevel(key._id, value)
                                        }
                                      />
                                    </td>
                                    <td className='border text-gray-600'>
                                      {' '}
                                      <Select
                                        placeholder='Độ khó'
                                        classNames={{
                                          input: 'border-0',
                                          item: 'hover:text-white hover:bg-ct-secondary rounded-none',
                                          dropdown: 'rounded-xl px-0 py-2 border-0 drop-shadow-lg',
                                        }}
                                        rightSection={
                                          <ArrowDown2
                                            size='20'
                                            color='currentColor'
                                            variant='Bold'
                                          />
                                        }
                                        defaultValue={key.level?.toString() || ''}
                                        data={constantForm?.question?.level?.map((item: any) => {
                                          item['label'] = item.title;
                                          item['value'] = '' + item.value;
                                          item['key'] = item.value;
                                          return item;
                                        })}
                                        onChange={(value) =>
                                          value && handleChangeLevel(key._id, value)
                                        }
                                      />
                                    </td>
                                  </tr>
                                );
                            });
                          })}
                        </tbody>
                      </>
                    ) : (
                      <>
                        <thead className='font-bold font-[Gilroy]'>
                          <tr>
                            <th className='whitespace-nowrap border py-4 px-2'>Câu</th>
                            <th className='whitespace-nowrap border py-4 px-2'>Đề bài</th>
                            {Array.from({
                              length: maxLengthAnswer,
                            }).map((item: any, index: number) => (
                              <th key={index} className='whitespace-nowrap border py-4 px-2'>
                                {questionForm.values.quiz_type === 4 ? 'Keyword' : 'Đáp án'}{' '}
                                {index + 1}
                              </th>
                            ))}
                            <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                              Tên câu hỏi
                            </th>
                            <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                              Kiểu câu hỏi
                            </th>
                            <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                              Cấp độ nhận biết
                            </th>
                            <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                              Độ khó
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {questionImportData.map((item: any, index: number) => (
                            <tr key={item._id}>
                              <td className='border text-center'>{index + 1}</td>
                              <td className='border'>
                                <Tooltip
                                  width={350}
                                  withArrow
                                  transition='fade'
                                  transitionDuration={200}
                                  wrapLines
                                  label={<MathJaxRender math={`${item.text}`} />}
                                >
                                  <p className='line-clamp-4 max-w-[250px]'>
                                    <MathJaxRender math={`${item.text}`} />
                                  </p>
                                </Tooltip>
                              </td>
                              {Array.from({
                                length: maxLengthAnswer,
                              }).map((item2: any, index2: number) => {
                                const text =
                                  item.quiz_type === 4
                                    ? item.listShortAnswer.listKeyword[index2] || ''
                                    : item.listSelectOptions[index2]?.answer_content || '';
                                return (
                                  <td key={index2} className='border text-left'>
                                    <Tooltip
                                      width={350}
                                      withArrow
                                      transition='fade'
                                      transitionDuration={200}
                                      wrapLines
                                      label={<MathJaxRender math={`${text}`} />}
                                    >
                                      <p className='line-clamp-4 max-w-[200px]'>
                                        <MathJaxRender math={`${text}`} />
                                      </p>
                                    </Tooltip>
                                  </td>
                                );
                              })}
                              <td className='border text-center'>
                                <TextInput
                                  defaultValue={item.name}
                                  placeholder='Tên câu hỏi'
                                  onChange={(e) => {
                                    handleChangeNameQuestion(item._id, e.target.value);
                                  }}
                                />
                              </td>
                              <td className='border text-gray-600'>
                                {' '}
                                <Select
                                  placeholder='Loại câu hỏi'
                                  classNames={{
                                    input: 'border-0',
                                    item: 'hover:text-white hover:bg-ct-secondary rounded-none',
                                    dropdown: 'rounded-xl px-0 py-2 border-0 drop-shadow-lg',
                                  }}
                                  rightSection={
                                    <ArrowDown2 size='20' color='currentColor' variant='Bold' />
                                  }
                                  defaultValue={item.type.toString()}
                                  data={constantForm?.question?.type?.map((item: any) => {
                                    item['label'] = item.title;
                                    item['value'] = '' + item.value;
                                    item['key'] = item.value;
                                    return item;
                                  })}
                                  onChange={(value) =>
                                    value && handleChangeQuizType(item._id, value)
                                  }
                                />
                              </td>
                              <td className='border text-gray-600'>
                                {' '}
                                <Select
                                  placeholder='Cấp độ nhận biết'
                                  rightSection={
                                    <ArrowDown2 size='20' color='currentColor' variant='Bold' />
                                  }
                                  classNames={{
                                    input: 'border-0',
                                    item: 'hover:text-white hover:bg-ct-secondary rounded-none',
                                    dropdown: 'rounded-xl px-0 py-2 border-0 drop-shadow-lg',
                                  }}
                                  defaultValue={item.awareness_level?.toString() || ''}
                                  data={constantForm.question.awarenessLevel?.map((item: any) => {
                                    item['label'] = item.title;
                                    item['value'] = '' + item.value;
                                    item['key'] = item.value;
                                    return item;
                                  })}
                                  onChange={(value) =>
                                    value && handleChangeAwarenessLevel(item._id, value)
                                  }
                                />
                              </td>
                              <td className='border text-gray-600'>
                                {' '}
                                <Select
                                  placeholder='Độ khó'
                                  classNames={{
                                    input: 'border-0',
                                    item: 'hover:text-white hover:bg-ct-secondary rounded-none',
                                    dropdown: 'rounded-xl px-0 py-2 border-0 drop-shadow-lg',
                                  }}
                                  rightSection={
                                    <ArrowDown2 size='20' color='currentColor' variant='Bold' />
                                  }
                                  defaultValue={item.level?.toString() || ''}
                                  data={constantForm?.question?.level?.map((item: any) => {
                                    item['label'] = item.title;
                                    item['value'] = '' + item.value;
                                    item['key'] = item.value;
                                    return item;
                                  })}
                                  onChange={(value) => value && handleChangeLevel(item._id, value)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </>
                    )}
                  </TableMantine>
                </form>
              </div>
              <div className='flex justify-end items-center w-full mt-10'>
                <Button className='m-4' variant='outline' onClick={() => setStep(1)}>
                  Quay lại bước 1
                </Button>
                <Button className='m-4 mr-0' onClick={handleUpload}>
                  Tải lên {questionImportData.length} câu
                </Button>
              </div>
            </>
          )}

          {/* delete modal */}
          <DeleteModal
            size={'50%'}
            deleted={isDeleteOpen.isOpen}
            title={
              <div className='flex items-center text-ct-red-500'>
                <span>
                  <AddCircle
                    className='rotate-[45deg]'
                    size='50'
                    color='currentColor'
                    variant='Bold'
                  />
                </span>
                <span className='text-lg font-bold pl-4'>Bạn có chắc muốn xóa câu hỏi này ?</span>
              </div>
            }
            handleExit={() => setIsDeleteOpen(false)}
            handleDelete={() => handleDeleteQuestion(isDeleteOpen.id)}
            description={
              <p className='line-clamp-4'>
                {questionImportData.map((item: any, index: number) => {
                  if (item._id === isDeleteOpen.id) {
                    return (
                      <>
                        {item.text.length === 0 ? (
                          'Nội dung câu hỏi chưa cập nhật'
                        ) : (
                          <MathJaxRender key={item._id} math={`${item.text}`} />
                        )}
                      </>
                    );
                  }
                })}
              </p>
            }
          />

          {/* add question modal */}
          <Modal
            opened={isAddOpen.isOpen}
            onClose={() => setIsAddOpen((pre: any) => ({ ...pre, isOpen: false }))}
            hideCloseButton={true}
            radius={15}
            centered
            size={'90vw'}
            closeOnClickOutside={false}
          >
            <ScrollArea style={{ height: '90vh', width: '100%' }} offsetScrollbars>
              <CK5Editor
                handleContent={(content: any) => {
                  setIsAddOpen((pre: any) => ({
                    ...pre,
                    content: { ...pre.content, text: content },
                  }));
                }}
                label='Nội dung câu hỏi'
                required
                placeholder='Nội dung câu hỏi'
                contentQuestion={isEditOpen?.content?.text}
              />
              <CK5Editor
                handleContent={(solution: any) => {
                  setIsAddOpen((pre: any) => ({
                    ...pre,
                    content: { ...pre.content, solution },
                  }));
                }}
                label='Nội dung giải thích'
                placeholder='Nội dung giải thích'
                className='mt-4'
              />
              <QuestionCreateType
                quiz_type={questionForm.values.quiz_type}
                handleQuestionData={handleTempQuestionData}
                data={isAddOpen.content}
              />
              <div className='flex justify-end items-center w-full mt-10'>
                <Button
                  className='m-4'
                  variant='outline'
                  onClick={() =>
                    setIsAddOpen((pre: any) => ({
                      isOpen: false,
                      // content: '',
                    }))
                  }
                >
                  Hủy
                </Button>
                <Button className='m-4' onClick={handleAddQuestion}>
                  Thêm
                </Button>
              </div>
            </ScrollArea>
          </Modal>
          {/* edit question modal */}
          <Modal
            opened={isEditOpen.isOpen}
            onClose={() => setIsEditOpen((pre: any) => ({ ...pre, isOpen: false }))}
            hideCloseButton={true}
            radius={15}
            centered
            size={'90vw'}
            closeOnClickOutside={false}
          >
            <ScrollArea style={{ height: '90vh', width: '100%' }} offsetScrollbars>
              <MultiSelect
                label='Nhập Tags'
                className='w-full py-3 grow'
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                radius={15}
                placeholder='Nhập Tags'
                searchable
                data={tagList?.map((item: any) => {
                  const tag = {
                    label: item.name,
                    value: item.idTag,
                  };
                  return tag;
                })}
                defaultValue={isEditOpen?.content?.listTag}
                onChange={(value: any) => {
                  setIsEditOpen((pre: any) => ({
                    ...pre,
                    content: { ...pre.content, listTag: value },
                  }));
                }}
              />
              <CK5Editor
                handleContent={(content: any) => {
                  setIsEditOpen((pre: any) => ({
                    ...pre,
                    content: { ...pre.content, text: content },
                  }));
                }}
                label='Nội dung câu hỏi'
                required
                placeholder='Nội dung câu hỏi'
                contentQuestion={isEditOpen?.content?.text}
              />
              <UploadAsset
                handleUrlAsset={handleUrlAssetQuestion}
                fieldType={FieldType.IMAGE}
                data={isEditOpen?.content?.image}
              />
              <CK5Editor
                handleContent={(solution: any) => {
                  setIsEditOpen((pre: any) => ({
                    ...pre,
                    content: { ...pre.content, solution },
                  }));
                }}
                label='Nội dung giải thích'
                placeholder='Nội dung giải thích'
                className='mt-4'
                contentQuestion={isEditOpen?.content?.solution}
              />
              <UploadAsset
                handleUrlAsset={handleUrlAssetQuestion}
                fieldType={FieldType.SOLUTION_IMAGE}
                data={isEditOpen?.content?.solution_image}
              />
              <QuestionCreateType
                quiz_type={questionForm.values.quiz_type}
                handleQuestionData={handleTempQuestionData}
                data={isEditOpen.content}
              />
              <div className='flex justify-end items-center w-full mt-10'>
                <Button
                  className='m-4'
                  variant='outline'
                  onClick={() =>
                    setIsEditOpen((pre: any) => ({
                      isOpen: false,
                      // content: null,
                    }))
                  }
                >
                  Hủy
                </Button>
                <Button className='m-4' onClick={handleEditQuestion}>
                  Cập nhật
                </Button>
              </div>
            </ScrollArea>
          </Modal>
        </div>
      </div>
      <CountDownModal
        open={isDirectModal}
        text='Tạo đề bài thành công!'
        closeBtnText='Danh sách'
        nextBtnText='Tạo đề khác'
        onClose={() => {
          navigate('/manage-question/question/');
        }}
        onNext={() => {
          // dispatch(updateQuestion([]));
          setStep(1);
          setIsDirectModal(false);
        }}
        timeAnimate={4}
        onAnimatedEnd={() => {
          navigate('/manage-question/question/');
          setIsDirectModal(false);
        }}
      />
    </div>
  );
};

export default ImportQuestionContainer;
