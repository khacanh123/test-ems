import { Modal, MultiSelect, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import CK5Editor from 'components/CK5Editor';
import CountDownModal from 'components/CountDownModal';
import Loading from 'components/Loading';
import PreviewQuestion from 'components/PreviewQuestion';
import UploadAsset from 'components/UploadAsset';
import { FieldType, questionEnumType, TagType } from 'enum';
import DialogBox from 'hook/BeforeUnload';
import { useCallbackPrompt } from 'hook/BeforeUnload/useCallbackPrompr';
import { ArrowDown2, Eye } from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Constant, QuestionEdit } from 'store/selector';
import { updateQuestion, updateQuestionEdit } from 'store/slice/question';
import { notify } from '../../../../utils/notify';
import { subjectType } from '../type';
import QuestionCreateType from './components/index';
interface classList {
  label: string;
  value: string;
}
export interface assetQuestion {
  solution_image: string;
  audio: string;
  video: string;
  image: string;
}
interface classAndSubjectType {
  createAt: string;
  idClass: number;
  idSchoolLevel: number;
  name: string;
  listSubject: { name: string; idSubject: number }[];
}
interface FormType {
  name: string;
  class: string[];
  subject: string[];
  format: string;
  awarenessLevel: string;
  levelDifficult: string;
  tags: string[];
  text: string;
  solution: string;
  quiz_type: number;
  knowledgeUnit: number[];
}
interface dataReturn {
  status: boolean;
  data: {
    idTag: string;
    name: string;
  };
}
const CreateQuestionContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const editQuestionRedux = useSelector(QuestionEdit);
  const constantFormRedux = useSelector(Constant);
  const constantForm = JSON.parse(JSON.stringify(constantFormRedux));

  const [isDirectModal, setIsDirectModal] = useState(false);
  const [classAndSubjectForm, setClassAndSubjectForm] = useState<classAndSubjectType[]>([]);
  const [classListForm, setClassListForm] = useState<classList[]>([]);
  const [subjectListForm, setSubjectListForm] = useState<subjectType[]>([]);
  const [knowLedgeListForm, setKnowledgeListForm] = useState<subjectType[]>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [urlAsset, setUrlAsset] = useState<assetQuestion>({
    solution_image: '',
    video: '',
    audio: '',
    image: '',
  });
  const [knowledgeUnit, setKnowLedge] = useState<any>([]);
  const [choice, setChoice] = useState<any>([]);
  const [isValid, setIsValid] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [answerListWithType, setAnswerListWithType] = useState<any>();
  const [answerType, setAnswerType] = useState<any>();
  const [showDialog, setShowDialog] = useState<boolean>(true);
  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [preview, setPreview] = useState<any>({});
  const questionForm = useForm<FormType>({
    initialValues: {
      name: '',
      class: [],
      subject: [],
      format: '1',
      awarenessLevel: '0',
      levelDifficult: '0',
      tags: [],
      text: '',
      solution: '',
      quiz_type: 0,
      knowledgeUnit: [],
    },
    validationRules: {
      // name: (value: string) => value !== '',
      class: (value: string[]) => value.length > 0,
      subject: (value: string[]) => value.length > 0,
      format: (value: string) => value !== '',
      awarenessLevel: (value: string) => value !== '',
      levelDifficult: (value: string) => value !== '',
    },
    errorMessages: {
      // name: 'B???n ch??a nh???p t??n c??u h???i',
      class: 'B???n ch??a ch???n l???p',
      subject: 'B???n ch??a ch???n m??n h???c',
      format: 'B???n ch??a ch???n ki???u c??u h???i',
      awarenessLevel: 'B???n ch??a ch???n m???c ????? hi???u bi???t',
      levelDifficult: 'B???n ch??a ch???n m???c ????? kh??',
    },
  });

  const handleQuestionData = useCallback((data: any) => {
    setAnswerListWithType(data);
  }, []);
  const handleAnswer = useCallback((answer_type: any) => {
    setAnswerType(answer_type);
  }, []);

  const handlePreviewQuestion = () => {
    const tag: number[] = [];
    questionForm.values?.tags.map((item1: any) => {
      tagList?.map((item2: any) => {
        if (item1 == item2.name) {
          tag.push(Number(item2.idTag));
        }
      });
    });

    let sendRequest = true;
    let payload: any = {
      name: questionForm.values.name,
      listClass: questionForm.values.class.map((item: any) => Number(item)),
      listSubject: questionForm.values.subject.map((item: any) => Number(item)),
      listTag: tag,
      listKnowledgeUnit: questionForm.values.knowledgeUnit.map((item: any) => Number(item)),
      type: Number(questionForm.values.format),
      awareness_level: Number(questionForm.values.awarenessLevel),
      level: Number(questionForm.values.levelDifficult),
      quiz_type: Number(questionForm.values.quiz_type),
      text: questionForm.values.text,
      solution: questionForm.values.solution,
      ...urlAsset,
    };
    // x??? l?? payload tr?????c khi t???o c??u h???i
    switch (Number(questionForm.values.quiz_type)) {
      case questionEnumType.ESSAY: {
        break;
      }
      case questionEnumType.ONE_RIGHT: {
        const listAnswerDeletedId = answerListWithType.map((item: any) => {
          return item;
        });
        payload['answer_type'] = answerType;
        payload['listSelectOptions'] = listAnswerDeletedId;
        break;
      }
      case questionEnumType.MULTIPLE_RIGHT: {
        let listAnswerDeletedId = answerListWithType.map((item: any) => {
          return item;
        });
        payload['answer_type'] = answerType;
        payload['listSelectOptions'] = listAnswerDeletedId;
        break;
      }
      case questionEnumType.YES_NO: {
        payload['listSelectOptions'] = answerListWithType;
        break;
      }
      case questionEnumType.SHORT: {
        const listKeyword = answerListWithType.listKeyword.map((item: any) => {
          return item.trim();
        });

        payload['listShortAnswer'] = {
          listKeyword,
          isCapital: answerListWithType.isCapital,
          isExact: answerListWithType.isExact,
        };
        break;
      }
      case questionEnumType.PAIR: {
        const answer = localStorage.getItem('answerType');
        payload['answer_type'] = Number(answer);
        payload['listPairOptions'] = answerListWithType;
        break;
      }
      case questionEnumType.READING: {
        let listAnswerDeletedId = answerListWithType?.map((item: any) => {
          return item;
        });
        payload['listQuestionChildren'] = listAnswerDeletedId;
        break;
      }
      case questionEnumType.FILL_BLANK: {
        let cloneAnswerList = JSON.parse(JSON.stringify(answerListWithType));
        cloneAnswerList = cloneAnswerList.map((answer: any) => {
          return answer;
        });
        payload['listQuestionChildren'] = cloneAnswerList;
        payload['answer_type'] = 0;
        break;
      }
      case questionEnumType.SORT: {
        answerListWithType.options.map((word: string) => {
          return word;
        });
        answerListWithType.solution.map((word: string) => {
          return word;
        });
        payload['listSortOptions'] = answerListWithType;
        break;
      }
      default:
        break;
    }
    // console.log('chien', payload);

    setPreview(payload);
    setIsOpenPreview(true);
  };

  const handleCreateQuestion = (formValues: any) => {
    const tag: number[] = [];
    formValues?.tags.map((item1: any) => {
      tagList?.map((item2: any) => {
        if (item1 == item2.name) {
          tag.push(Number(item2.idTag));
        }
      });
    });

    let sendRequest = true;
    let payload: any = {
      name: formValues.name,
      listClass: formValues.class.map((item: any) => Number(item)),
      listSubject: formValues.subject.map((item: any) => Number(item)),
      listTag: tag,
      listKnowledgeUnit: formValues.knowledgeUnit?.map((item: any) => Number(item)),
      type: Number(formValues.format),
      awareness_level: Number(formValues.awarenessLevel),
      level: Number(formValues.levelDifficult),
      quiz_type: Number(formValues.quiz_type),
      text: formValues.text,
      solution: formValues.solution,
      ...urlAsset,
    };
    // x??? l?? payload tr?????c khi t???o c??u h???i
    switch (Number(formValues.quiz_type)) {
      case questionEnumType.ESSAY: {
        break;
      }
      case questionEnumType.ONE_RIGHT: {
        let count = 0;
        const listAnswerDeletedId = answerListWithType.map((item: any) => {
          if (!item.answer_content.trim() && !item.answer_url_image) {
            notify({
              type: 'error',
              message: 'C??u tr??? l???i kh??ng ???????c ????? tr???ng',
            });
            sendRequest = false;
          }
          if (item.is_true) {
            count++;
          }
          return item;
        });
        if (count < 1) {
          notify({
            type: 'error',
            message: 'C??u tr??? l???i ch??a ch???n ????p ??n ????ng',
          });
          sendRequest = false;
        }
        if (listAnswerDeletedId.length <= 0) {
          notify({
            type: 'error',
            message: 'B???n ch??a nh???p c??u tr??? l???i',
          });
          sendRequest = false;
        }

        payload['listSelectOptions'] = listAnswerDeletedId;
        payload['answer_type'] = answerType;
        break;
      }
      case questionEnumType.MULTIPLE_RIGHT: {
        let count = 0;
        let listAnswerDeletedId = answerListWithType.map((item: any) => {
          if (!item.answer_content.trim() && !item.answer_url_image) {
            notify({
              type: 'error',
              message: 'C??u tr??? l???i kh??ng ???????c ????? tr???ng',
            });
            sendRequest = false;
          }
          if (item.is_true) {
            count++;
          }
          return item;
        });
        if (count < 1) {
          notify({
            type: 'error',
            message: 'C??u tr??? l???i ch??a ch???n ????p ??n ????ng',
          });
          sendRequest = false;
        }
        payload['listSelectOptions'] = listAnswerDeletedId;
        payload['answer_type'] = answerType;
        break;
      }
      case questionEnumType.YES_NO: {
        payload['listSelectOptions'] = answerListWithType;
        break;
      }
      case questionEnumType.SHORT: {
        const listKeyword = answerListWithType.listKeyword.map((item: any) => {
          let trimkeyword = item.trim();
          if (trimkeyword === '') {
            notify({
              type: 'error',
              message: 'C??u tr??? l???i kh??ng ???????c ????? tr???ng',
            });
            sendRequest = false;
          }
          return trimkeyword;
        });

        payload['listShortAnswer'] = {
          listKeyword,
          isCapital: answerListWithType.isCapital,
          isExact: answerListWithType.isExact,
        };
        break;
      }
      case questionEnumType.PAIR: {
        const clone = JSON.parse(JSON.stringify(answerListWithType));
        Array.from({
          length: answerListWithType.keys.length,
        }).map((_, index) => {
          let count = 0;
          clone.keys[index].text = clone.keys[index].text.trim();
          clone.values[index].text = clone.values[index].text.trim();

          !clone.keys[index].text && count++;
          !clone.values[index].text && count++;
          !clone.keys[index].image && count++;
          !clone.values[index].image && count++;

          if (count >= 3) {
            notify({
              type: 'error',
              message: 'C??u tr??? l???i kh??ng ???????c ????? tr???ng',
            });
            sendRequest = false;
          }
        });
        const answer = localStorage.getItem('answerType');
        payload['answer_type'] = Number(answer);
        payload['listPairOptions'] = answerListWithType;
        break;
      }
      case questionEnumType.READING: {
        const answerType = localStorage.getItem('answerType');
        let listAnswerDeletedId = answerListWithType?.map((item: any) => {
          if (!item.text) {
            notify({
              type: 'error',
              message: 'C??u h???i kh??ng ???????c ????? tr???ng',
            });
            sendRequest = false;
          }
          if (item.listSelectOptions?.length > 0) {
            item.listSelectOptions.map((item2: any) => {
              item2.answer_content = item2.answer_content.trim();
              if (!item2.answer_content && !item2.answer_url_image) {
                notify({
                  type: 'error',
                  message: 'C??u tr??? l???i kh??ng ???????c ????? tr???ng',
                });
                sendRequest = false;
              }
            });
          }
          if (item.quiz_type == 1 || item.quiz_type == 2) {
            let count = 0;
            let listAnswerDeletedId = item.listSelectOptions.map((item2: any) => {
              if (item2.is_true) {
                count++;
              }
            });

            if (count < 1) {
              notify({
                type: 'error',
                message: 'C??u tr??? l???i ch??a ch???n ????p ??n ????ng',
              });
              sendRequest = false;
            }
          }

          if (item.listShortAnswer?.answerList?.length > 0) {
            item.listShortAnswer.answerList = item.listShortAnswer.answerList.map((item2: any) => {
              item2.keyword = item2.keyword.trim();
              if (!item2.keyword.trim()) {
                notify({
                  type: 'error',
                  message: 'C??u tr??? l???i kh??ng ???????c ????? tr???ng',
                });
                sendRequest = false;
              }
            });
          }
          return item;
        });
        payload['listQuestionChildren'] = listAnswerDeletedId;
        break;
      }
      case questionEnumType.FILL_BLANK: {
        let cloneAnswerList = JSON.parse(JSON.stringify(answerListWithType));
        cloneAnswerList = cloneAnswerList.map((answer: any) => {
          if (answer?.listShortAnswer?.listKeyword?.length > 0) {
            let formatAnswer = answer.listShortAnswer.listKeyword.map((keyword: any) => {
              if (!keyword.trim()) {
                notify({
                  type: 'error',
                  message: 'C??u tr??? l???i kh??ng ???????c ????? tr???ng',
                });
                sendRequest = false;
                return '';
              } else {
                return keyword.trim();
              }
            });
            answer.listShortAnswer.listKeyword = formatAnswer;
            return answer;
          } else {
            return answer;
          }
        });
        payload['listQuestionChildren'] = cloneAnswerList;
        payload['answer_type'] = 0;
        break;
      }
      case questionEnumType.SORT: {
        let count = 0;
        answerListWithType.options.map((word: string) => {
          if (!word.trim()) {
            count++;
          }
          return word;
        });
        answerListWithType.solution.map((word: string) => {
          if (!word.trim()) {
            count++;
          }
          return word;
        });
        if (count >= 1) {
          notify({
            type: 'error',
            message: 'C??u tr??? l???i kh??ng ???????c ????? tr???ng',
          });
          sendRequest = false;
        }
        payload['listSortOptions'] = answerListWithType;
        break;
      }
      default:
        break;
    }

    if (!payload.text) {
      notify({
        type: 'error',
        message: 'B???n ch??a nh???p n???i dung c??u h???i',
      });
      sendRequest = false;
      setIsValid(true);
    }

    // console.log('chien', payload);

    !isEditing &&
      sendRequest &&
      RequestAPI({
        url: PathAPI.question,
        method: 'POST',
        payload,
      }).then((res: any) => {
        if (res.status) {
          setIsDirectModal(true);
          dispatch(updateQuestion([]));
          setShowDialog(false);
        }
      });

    isEditing &&
      sendRequest &&
      RequestAPI({
        url: PathAPI.question + '/' + editQuestionRedux.idQuestion,
        method: 'PATCH',
        payload,
      }).then((res: any) => {
        if (res.status) {
          // setIsEditing(false);
          setIsDirectModal(true);
          dispatch(updateQuestionEdit({}));
          setShowDialog(false);
        }
      });
  };

  const handleUrlAssetQuestion = ({ url, field }: { url: string; field: FieldType }) => {
    switch (field) {
      case FieldType.IMAGE: {
        setUrlAsset((prevState: assetQuestion) => {
          return {
            ...prevState,
            image: url,
          };
        });
        break;
      }
      case FieldType.AUDIO: {
        setUrlAsset((prevState: assetQuestion) => {
          return {
            ...prevState,
            audio: url,
          };
        });
        break;
      }
      case FieldType.VIDEO: {
        setUrlAsset((prevState: assetQuestion) => {
          return {
            ...prevState,
            video: url,
          };
        });
        break;
      }
      case FieldType.SOLUTION_IMAGE: {
        setUrlAsset((prevState: assetQuestion) => {
          return {
            ...prevState,
            solution_image: url,
          };
        });
        break;
      }
      default:
        break;
    }
  };
  const createTag = (tag: any) => {
    RequestAPI({
      url: PathAPI.tag + 'create',
      method: 'POST',
      payload: {
        name: tag,
        listClass: questionForm.values.class,
        type: 0,
        listSubject: questionForm.values.subject,
      },
    }).then((res: any) => {
      setTagList((current: any) => [...current, res.data]);
      setChoice((current: any) => [...current, res.data.name]);
    });
  };
  useEffect(() => {
    const id = localStorage.getItem('idQuestion');
    if (id) {
      const res = RequestAPI({
        url: PathAPI.question + '/' + id,
        method: 'GET',
      }).then((res: any) => {
        console.log(res.data);

        dispatch(updateQuestionEdit(res.data));
        localStorage.removeItem('idQuestion');
      });
    }
  });

  useEffect(() => {
    const tagArr: { label: any; value: string }[] = [];
    tagList?.map((item: any) => {
      tagArr.push(item.name);
    });
    setChoice(tagArr);
  }, [tagList]);
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
    RequestAPI({
      url: PathAPI.knowledgeUnit,
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
        const arr: any[] = [];
        res.data?.map((key: any) => {
          let item: subjectType = {
            label: key.name,
            value: key.idKnowledgeUnit,
          };
          arr.push(item);
        });
        setKnowledgeListForm(arr);
        setKnowLedge(res.data);
      }
    });
  }, []);
  useEffect(() => {
    RequestAPI({
      url: PathAPI.class,
      method: 'GET',
    }).then((res: any) => {
      if (res.status) {
        setClassAndSubjectForm(res.data);
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
    if (editQuestionRedux.hasOwnProperty('text') && editQuestionRedux.text !== '') {
      const reformatClassList = editQuestionRedux.listClass.map((item: any) =>
        item.idClass.toString()
      );
      const reformatSubjectList = editQuestionRedux.listSubject.map((item: any) =>
        item.idSubject.toString()
      );
      const reformatTagList = editQuestionRedux.listTag?.map((item: any) => item.name);
      const reformatKnowledgeUnit = editQuestionRedux.listKnowledgeUnit?.map((item: any) => item);

      questionForm.setValues({
        name: editQuestionRedux.name,
        class: reformatClassList,
        subject: reformatSubjectList,
        format: editQuestionRedux.type?.toString(),
        awarenessLevel: editQuestionRedux.awareness_level?.toString(),
        levelDifficult: editQuestionRedux.level?.toString(),
        tags: reformatTagList,
        text: editQuestionRedux.text,
        solution: editQuestionRedux.solution,
        quiz_type: editQuestionRedux.quiz_type,
        knowledgeUnit: reformatKnowledgeUnit,
      });
      setIsEditing(true);
    }
  }, [editQuestionRedux]);

  useEffect(() => {
    //handleChangeClass
    if (classAndSubjectForm.length > 0) {
      const listSubject: any[] = [];
      questionForm.values.class.map((item: any) => {
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
      const arrListSubjectWithClass: any[][] = questionForm.values.class.map((item: any) => {
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
        return questionForm.values.subject.findIndex((item2: any) => item2 == item.value) !== -1;
      });
      const reformSubjectList: string[] = temp.map((item: subjectType) => item.value.toString());
      questionForm.setFieldValue('subject', reformSubjectList);
      setSubjectListForm(subjectMatchAllClass);
    }
  }, [questionForm.values.class, classAndSubjectForm]);

  return (
    <div className='w-full'>
      <Breadcrumb />
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
        sideEffectLeave={() => {
          dispatch(updateQuestionEdit({}));
        }}
      />
      <CountDownModal
        open={isDirectModal}
        text={isEditing ? 'C???p nh???t c??u h???i th??nh c??ng!' : 'T???o c??u h???i b??i th??nh c??ng!'}
        closeBtnText='Danh s??ch'
        nextBtnText='T???o c??u kh??c'
        onClose={() => {
          localStorage.removeItem('redirectPreview');
          navigate('/manage-question/question');
        }}
        onNext={() => {
          setAnswerListWithType([]);
          questionForm.setFieldValue('quiz_type', 0);
          // questionForm.setFieldValue('text', '');
          // questionForm.setFieldValue('solution', '');
          localStorage.removeItem('redirectPreview');
          setIsDirectModal(false);
        }}
        timeAnimate={5}
        onAnimatedEnd={() => {
          const isRedirect = localStorage.getItem('redirectPreview');
          // navigate(isRedirect !== null ? `${isRedirect}` : '/manage-question/question');
          setIsDirectModal(false);
          localStorage.removeItem('redirectPreview');
          if (isRedirect !== null) close();
        }}
      />
      {constantForm.question ? (
        <div className='w-full'>
          <form
            className='flex w-full flex-wrap'
            onSubmit={questionForm.onSubmit((values) => handleCreateQuestion(values))}
          >
            <TextInput
              {...questionForm.getInputProps('name')}
              className='w-1/3 px-7 py-3'
              radius={15}
              label='T??n c??u h???i'
              placeholder='Nh???p t??n c??u h???i'
            />
            <MultiSelect
              {...questionForm.getInputProps('class')}
              required
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='Ch???n l???p h???c'
              placeholder='Ch???n l???p h???c'
              data={classListForm}
            />
            <MultiSelect
              {...questionForm.getInputProps('subject')}
              required
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='Ch???n m??n h???c'
              placeholder='Ch???n m??n h???c'
              data={subjectListForm}
            />
            <Select
              {...questionForm.getInputProps('format')}
              required
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='Lo???i c??u h???i'
              placeholder='Lo???i c??u h???i'
              data={constantForm?.question?.type?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
            />
            <Select
              {...questionForm.getInputProps('awarenessLevel')}
              required
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='C???p ????? nh???n bi??t c??u h???i'
              placeholder='C???p ????? nh???n bi??t c??u h???i'
              data={constantForm.question.awarenessLevel?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
            />
            <Select
              {...questionForm.getInputProps('levelDifficult')}
              required
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='????? kh?? c??u h???i'
              placeholder='????? kh?? c??u h???i'
              data={constantForm?.question?.level?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
            />
            <Select
              {...questionForm.getInputProps('quiz_type')}
              required
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='Ki???u c??u h???i'
              placeholder='Ki???u c??u h???i'
              data={constantForm?.question?.quiz_type?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
              value={'' + questionForm.values.quiz_type}
              onChange={(value) => {
                questionForm.setFieldValue('quiz_type', Number(value));
              }}
            />
            <MultiSelect
              {...questionForm.getInputProps('knowledgeUnit')}
              className='w-2/3 px-7 py-3 grow'
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              radius={15}
              label='Nh???p ????n v??? ki???n th???c'
              placeholder='Nh???p ????n v??? ki???n th???c'
              data={knowLedgeListForm}
            />
            <MultiSelect
              {...questionForm.getInputProps('tags')}
              className='w-full px-7 py-3 grow'
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              radius={15}
              label='Nh???p Tags'
              placeholder='Nh???p Tags'
              data={choice}
              searchable
              creatable={questionForm.values.subject.length > 0 ? true : false}
              getCreateLabel={(query) => `+ T???o tag ${query}`}
              onCreate={(query) => createTag(query)}
            />
            <div className='text-black px-4 w-full'>
              <CK5Editor
                handleContent={(value) => {
                  questionForm.setFieldValue('text', value);
                  isValid && setIsValid(false);
                }}
                label='N???i dung c??u h???i'
                placeholder='Nh???p n???i dung c??u h???i'
                error={isValid}
                required
                contentQuestion={editQuestionRedux.text}
              />
              <UploadAsset
                handleUrlAsset={handleUrlAssetQuestion}
                fieldType={FieldType.IMAGE}
                data={editQuestionRedux.image}
              />
              <div className='mt-8 w-full'>
                <CK5Editor
                  handleContent={(value) => {
                    questionForm.setFieldValue('solution', value);
                  }}
                  label='N???i dung gi???i th??ch'
                  placeholder='Nh???p n???i dung gi???i th??ch'
                  contentQuestion={editQuestionRedux.solution}
                />
                <UploadAsset
                  handleUrlAsset={handleUrlAssetQuestion}
                  fieldType={FieldType.SOLUTION_IMAGE}
                  data={editQuestionRedux.solution_image}
                />
              </div>
            </div>
            <div className='w-full'>
              <QuestionCreateType
                quiz_type={questionForm.values.quiz_type}
                handleQuestionData={handleQuestionData}
                data={editQuestionRedux}
                handleAnswer={handleAnswer}
                inputAnswer={Number(editQuestionRedux.answer_type)}
              />
            </div>
            <div className='text-black px-4 w-full' style={{ marginTop: '10px' }}>
              <button
                className='flex'
                type='button'
                onClick={() => handlePreviewQuestion()}
                style={{ alignItems: 'center' }}
              >
                <div>
                  <Eye size='20' color='currentColor' className='ml-2 text-ct-green-300' />
                </div>
                <div color='currentColor' className='ml-2 text-ct-green-300'>
                  Preview
                </div>
              </button>
            </div>
            <div className='flex justify-center items-center w-full mt-10'>
              <Button
                onClick={() => {
                  localStorage.removeItem('redirectPreview');
                  dispatch(updateQuestionEdit({}));
                  navigate('/manage-question/question');
                }}
                variant='outline'
                className='m-4'
              >
                H???y
              </Button>
              <Button className='m-4' type='submit'>
                {isEditing ? 'C???p nh???t' : 'T???o m???i'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Loading />
      )}
      <Modal opened={isOpenPreview} onClose={() => setIsOpenPreview(false)} radius={15} size='60vw'>
        <div className='px-10 pb-8'>
          <PreviewQuestion quiz_type={questionForm.values.quiz_type} data={preview} />
        </div>
      </Modal>
    </div>
  );
};

export default CreateQuestionContainer;
