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
          <p className='px-2 '>Quay l???i</p>
        </div>
        <p className='text-center text-xl my-4'>Vui l??ng nh???p c??u h???i v?? th??? l???i sau!</p>
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
      listClass: 'B???n ch??a ch???n l???p',
      listSubject: 'B???n ch??a ch???n m??n h???c',
      // listTag: 'B???n ch??a ch???n tags',
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
    //x??? l?? ch??? l???y m??n th???a m??n t???t c??? c?? l???p ???????c ch???n
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

    //x??a nh???ng m??n kh??ng c?? trong c??c l???p ???? ch???n
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
      //check c?? c??u n??o ch??a c?? ????p an ????ng hay kh??ng
      const haveQuestionNoAnswerRight = checkAllAnswerQuestion(clone);
      setHaveQuestionNoAnswerRight(haveQuestionNoAnswerRight);
      // quiz_type == 4 l???y c??u c?? keyword nhi???u nh???t
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

      //set m???c ?????nh level v?? c???p ????? nh???n bi???t
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
          <Stepper.Step allowStepSelect={false} label='B?????c 1' description='Nh???p danh s??ch c??u h???i'>
            {/* Step 1 content: Create an account */}
          </Stepper.Step>
          <Stepper.Step
            allowStepSelect={false}
            label='B?????c 2'
            description='Nh???p thu???c t??nh c??u h???i'
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
                label='Ki???u c??u h???i'
                placeholder='Ki???u c??u h???i'
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
                label='Ch???n l???p h???c'
                placeholder='Ch???n l???p h???c'
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
                label='Ch???n m??n h???c'
                placeholder='Ch???n m??n h???c'
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
                placeholder='Nh???p Tags'
                searchable
                label='Nh???p Tags'
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
                // getCreateLabel={(query) => `+ T???o tag ${query}`}
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
                                  C??u h???i ch??a c??{' '}
                                  {item.quiz_type === 4 ? 't??? kh??a ????ng' : '????p ??n ????ng'}
                                </span>
                              </div>
                            )}
                            <div className='flex items-center'>
                              <p className='text-md font-bold pr-4'>C??u h???i {index + 1}</p>
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
                  <p>Th??m c??u h???i m???i</p>
                </Button>
              </div>

              <div className='flex justify-end items-center w-full mt-10'>
                <Button className='m-4' variant='outline' onClick={() => exitUpload()}>
                  H???y
                </Button>
                <Button
                  className='m-4 mr-0'
                  onClick={questionForm.onSubmit((values) => {
                    setStep(2);
                  })}
                  disabled={haveQuestionNoAnswerRight}
                >
                  Ti???p t???c b?????c 2
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
                            ??o???n v??n
                          </th>
                          <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                            C??u h???i
                          </th>
                          {Array.from({
                            length: 4,
                          }).map((item: any, index: number) => (
                            <th
                              key={index}
                              className='whitespace-nowrap border py-4 px-2 min-w-[200px]'
                            >
                              {'????p ??n '}
                              {index + 1}
                            </th>
                          ))}
                          <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                            Lo???i c??u h???i
                          </th>
                          <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                            C???p ????? nh???n bi???t
                          </th>
                          <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                            ????? kh??
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
                                          placeholder='Lo???i c??u h???i'
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
                                          placeholder='C???p ????? nh???n bi???t'
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
                                          placeholder='????? kh??'
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
                                        placeholder='Lo???i c??u h???i'
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
                                        placeholder='C???p ????? nh???n bi???t'
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
                                        placeholder='????? kh??'
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
                            <th className='whitespace-nowrap border py-4 px-2'>C??u</th>
                            <th className='whitespace-nowrap border py-4 px-2'>????? b??i</th>
                            {Array.from({
                              length: maxLengthAnswer,
                            }).map((item: any, index: number) => (
                              <th key={index} className='whitespace-nowrap border py-4 px-2'>
                                {questionForm.values.quiz_type === 4 ? 'Keyword' : '????p ??n'}{' '}
                                {index + 1}
                              </th>
                            ))}
                            <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                              T??n c??u h???i
                            </th>
                            <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                              Ki???u c??u h???i
                            </th>
                            <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                              C???p ????? nh???n bi???t
                            </th>
                            <th className='whitespace-nowrap border py-4 px-2 min-w-[200px]'>
                              ????? kh??
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
                                  placeholder='T??n c??u h???i'
                                  onChange={(e) => {
                                    handleChangeNameQuestion(item._id, e.target.value);
                                  }}
                                />
                              </td>
                              <td className='border text-gray-600'>
                                {' '}
                                <Select
                                  placeholder='Lo???i c??u h???i'
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
                                  placeholder='C???p ????? nh???n bi???t'
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
                                  placeholder='????? kh??'
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
                  Quay l???i b?????c 1
                </Button>
                <Button className='m-4 mr-0' onClick={handleUpload}>
                  T???i l??n {questionImportData.length} c??u
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
                <span className='text-lg font-bold pl-4'>B???n c?? ch???c mu???n x??a c??u h???i n??y ?</span>
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
                          'N???i dung c??u h???i ch??a c???p nh???t'
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
                label='N???i dung c??u h???i'
                required
                placeholder='N???i dung c??u h???i'
                contentQuestion={isEditOpen?.content?.text}
              />
              <CK5Editor
                handleContent={(solution: any) => {
                  setIsAddOpen((pre: any) => ({
                    ...pre,
                    content: { ...pre.content, solution },
                  }));
                }}
                label='N???i dung gi???i th??ch'
                placeholder='N???i dung gi???i th??ch'
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
                  H???y
                </Button>
                <Button className='m-4' onClick={handleAddQuestion}>
                  Th??m
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
                label='Nh???p Tags'
                className='w-full py-3 grow'
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                radius={15}
                placeholder='Nh???p Tags'
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
                label='N???i dung c??u h???i'
                required
                placeholder='N???i dung c??u h???i'
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
                label='N???i dung gi???i th??ch'
                placeholder='N???i dung gi???i th??ch'
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
                  H???y
                </Button>
                <Button className='m-4' onClick={handleEditQuestion}>
                  C???p nh???t
                </Button>
              </div>
            </ScrollArea>
          </Modal>
        </div>
      </div>
      <CountDownModal
        open={isDirectModal}
        text='T???o ????? b??i th??nh c??ng!'
        closeBtnText='Danh s??ch'
        nextBtnText='T???o ????? kh??c'
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
