import {
  Checkbox,
  MultiSelect,
  NumberInput,
  Select,
  Stepper,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import CK5Editor from 'components/CK5Editor';
import DateTimePicker from 'components/DateTimePicker';
import Loading from 'components/Loading';
import dayjs from 'dayjs';
import { TagType, TestType } from 'enum';
import DialogBox from 'hook/BeforeUnload';
import { useCallbackPrompt } from 'hook/BeforeUnload/useCallbackPrompr';
import { Add, ArrowDown2, ArrowUp2, InfoCircle } from 'iconsax-react';
import { subjectType } from 'pages/ManageQuestion/Question/type';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Constant, TestEdit } from 'store/selector';
import { clear, updateTestEdit } from 'store/slice/test';
import { notify } from 'utils/notify';
import { ConditionFormType, CountPoint, QuestionFormType } from './type';

const CreateStaticTest = lazy(() => import('./CreateStaticTest'));
const CreateDynamicTest = lazy(() => import('./CreateDynamicTest'));

let featureDay = dayjs().add(200, 'year').toISOString();

const CreateTestContainer = () => {
  const testRedux = useSelector(TestEdit);
  const dispatch = useDispatch();
  const constantFormRedux = useSelector(Constant);
  const navigate = useNavigate();
  const constantForm = JSON.parse(JSON.stringify(constantFormRedux));

  const [classListForm, setClassListForm] = useState<any>([]);
  const [classAndSubjectForm, setClassAndSubjectForm] = useState<any>([]);
  const [subjectListForm, setSubjectListForm] = useState<any>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [knowLedgeListForm, setKnowledgeListForm] = useState<subjectType[]>([]);
  const [openStaticPopup, setOpenStaticPopup] = useState(false);
  const [openDynamicPopup, setOpenDynamicPopup] = useState(false);
  const [tempTime, setTempTime] = useState<any>({
    timeStart: '',
    timeEnd: '',
  });
  const now = new Date();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showAdvanceConfig, setShowAdvanceConfig] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(true);
  const [dropUp, setDropup] = useState<boolean>(true);
  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);

  const [listQuestionStatic, setListQuestionStatic] = useState<any>([]);
  const [listQuestionDynamic, setListQuestionDynamic] = useState<any>([]);
  const [step, setStep] = useState(0);
  const [questionCount, setQuestionCount] = useState<CountPoint>({
    totalQuestion: 0,
    totalPointSelected: 0,
  });

  const [error, setError] = useState(false);
  const [guideTest, setGuideTest] = useState<string>('');
  const [choice, setChoice] = useState<any>([]);

  const questionForm = useForm<QuestionFormType>({
    initialValues: {
      listClass: [],
      listSubject: [],
      listTag: [],
      name: '',
      testFormat: 2,
      testType: TestType.STATIC,
      listQuestion: [],
      listConditions: [],
      maxMark: 10,
      awarenessLevel: '0',
    },
    validationRules: {
      listClass: (value: string[]) => value.length > 0,
      listSubject: (value: string[]) => value.length > 0,
      // listTag: (value: string[]) => value.length > 0,
      name: (value: string) => value.trim() !== '',
      maxMark: (value: number) => value > 0,
    },
    errorMessages: {
      listClass: 'Bạn chưa chọn lớp',
      listSubject: 'Bạn chưa chọn môn học',
      // listTag: 'Bạn chưa chọn tags',
      name: 'Bạn chưa nhập tên bài kiểm tra',
      maxMark: 'Bạn chưa chọn tổng điểm cho đề thi',
    },
  });
  const conditionForm = useForm<ConditionFormType>({
    initialValues: {
      timeStart: '',
      timeEnd: '',
      timeAllow: 45,
      maxNumAttempt: 1,
      sort: 0,
      // guide: '',
      isPauseAllow: false,
      minusWhenWrong: false,
      minQuestionSubmit: 0,
      isQuickTest: false,
      resultReturnType: 0,
      gradingSingleQuestionType: 0,
      active: true,
      isChangeScore: false,
    },
    validationRules: {
      timeStart: (value: string) => value !== '',
      timeEnd: (value: string) => value !== '',
      timeAllow: (value: number) => value >= 0,
      maxNumAttempt: (value: number) => value >= 0,
      // sort: (value: number) => value > 0,
      // guide: (value: string) => value !== '',
    },
    errorMessages: {
      timeStart: 'Bạn chưa chọn thời gian bắt đầu',
      timeEnd: 'Bạn cần chọn lại thời gian kết thúc',
      timeAllow: 'Bạn chưa chọn thời gian làm bài',
      maxNumAttempt: 'Bạn chưa chọn số lần làm bài',
      sort: 'Bạn chưa chọn sắp xếp',
      // guide: 'Bạn chưa nhập mô tả',
    },
  });
  const [checked, setChecked] = useState(true);
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

  const handleCompleteStep = () => {
    const isPassQuestionForm = questionForm.validate();
    questionForm.onSubmit((values) => {
      questionForm.setValues({
        ...values,
      });
    });
    if (isPassQuestionForm && step === 0) {
      let isPass = true;
      let reform = [];
      //chuyển sang dạng đúng vs backend
      if (questionForm.values.testType == TestType.STATIC) {
        //tính trọng số của các câu hỏi
        const minPoint = Math.min(...listQuestionStatic.map((ques: any) => ques.point));
        if (minPoint > 0 && minPoint !== Infinity) {
          reform = listQuestionStatic.map((item: any) => {
            return {
              idQuestion: item.idQuestion,
              weight: item.point / minPoint,
            };
          });
        }
      }

      if (questionForm.values.testType == TestType.STATIC) {
        //check từng câu có điểm hay chưa
        const check = listQuestionStatic.some((item: any) => {
          return item.point <= 0 || item.point === undefined;
        });
        if (check) {
          notify({
            type: 'error',
            message: 'Có câu hỏi chưa có điểm',
          });
          isPass = false;
        }
      }
      if (questionForm.values.testType == TestType.STATIC && reform.length <= 0) {
        // check chưa thêm câu hỏi
        notify({
          type: 'error',
          message: 'Bạn chưa chọn câu hỏi nào',
        });
        isPass = false;
      } else if (
        questionForm.values.testType == TestType.DYNAMIC &&
        listQuestionDynamic.length <= 0
      ) {
        //check chưa tạo điều kiện
        notify({
          type: 'error',
          message: 'Bạn chưa chọn điều kiện nào',
        });
        isPass = false;
      } else if (
        Number(questionCount.totalPointSelected.toFixed(2)) !== questionForm.values.maxMark
      ) {
        //check match điểm
        notify({
          type: 'error',
          message: 'Số điểm bạn chọn chưa khớp với tổng điểm',
        });
        isPass = false;
      }
      isPass && setStep(1);
    }
    if (isPassQuestionForm && step === 1) {
      const isPassConditionForm = conditionForm.validate();
      if (guideTest === '' || guideTest === '<p></p>') {
        setError(true);
      }

      var d1 = new Date(conditionForm.values.timeStart);
      var d2 = new Date(conditionForm.values.timeEnd);
      var same = d2.getTime() > d1.getTime();
      if (same == false) {
        notify({
          type: 'error',
          message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
        });
        return false;
      }

      if (isPassConditionForm && !error && same) {
        const listClass = questionForm.values.listClass.map((item: any) => Number(item));
        const listSubject = questionForm.values.listSubject.map((item: any) => Number(item));

        const payload = {
          baikiemtra: {
            ...conditionForm.values,
            guide: guideTest,
            name: questionForm.values.name,
            maxMark: questionForm.values.maxMark,
            listClass,
            listSubject,
            timeAllow: conditionForm.values.timeAllow * 60,
            gradingSingleQuestionType: Number(conditionForm.values.gradingSingleQuestionType),
          },
          test: {
            name: questionForm.values.name,
            testType: questionForm.values.testType,
            awarenessLevel: questionForm.values.awarenessLevel,
            listClass,
            listSubject,
            listTag: questionForm.values.listTag,
            listQuestion: [],
            listConditions: [],
          },
        };

        if (questionForm.values.testType == TestType.STATIC) {
          let reform = [];
          //tính trọng số của các câu hỏi
          const minPoint = Math.min(...listQuestionStatic.map((ques: any) => ques.point));
          if (minPoint > 0 && minPoint !== Infinity) {
            reform = listQuestionStatic.map((item: any) => {
              return {
                idQuestion: item.idQuestion,
                weight: item.point / minPoint,
              };
            });
          }
          payload.test.listQuestion = reform;
          payload.test.listConditions = [];
        } else {
          payload.test.listConditions = listQuestionDynamic;
          payload.test.listQuestion = [];
        }
        setStep((current) => (current < 3 ? current + 1 : current));

        if (isEditing) {
          RequestAPI({
            url: PathAPI.baikiemtra + `/${testRedux.idBaikiemtra}`,
            method: 'PATCH',
            payload: payload.baikiemtra,
          })
            .then((res: any) => {
              if (res.status) {
                console.log('update thành công');
                // notify({
                //     type: 'success',
                //     message: 'Tạo bài kiểm tra thành công',
                // });
              }
            })
            .catch((err: any) => {
              console.log('err', err);
            });
          RequestAPI({
            url: PathAPI.test + `/${testRedux.idTest}`,
            method: 'PATCH',
            payload: {
              name: payload.baikiemtra.name,
              listClass: payload.test.listClass,
              listSubject: payload.test.listSubject,
              listTag: payload.test.listTag,
              testType: payload.test.testType,
              listQuestion: payload.test.listQuestion,
            },
          })
            .then((res: any) => {
              if (res.status) {
                console.log('update thành công');
                notify({
                  type: 'success',
                  message: 'Cập nhật bài kiểm tra thành công',
                });
                // khi gửi API tạo mới xong thì xoá data trong redux
                dispatch(clear());
                setIsEditing(false);
                setShowDialog(false);
              }
            })
            .catch((err: any) => {
              console.log('err', err);
            });
        } else {
          RequestAPI({
            url: PathAPI.baikiemtra + '/combine',
            method: 'POST',
            payload,
          })
            .then((res: any) => {
              if (res.status) {
                notify({
                  type: 'success',
                  message: 'Tạo bài kiểm tra thành công',
                });
                AddToCourse(res.data.newBaikiemtra.idBaikiemtra);
              }
            })
            .catch((err: any) => {
              console.log('err', err);
            });
          setShowDialog(false);
        }
      } else {
        notify({
          type: 'error',
          message: 'Bạn chưa nhập đủ thông tin',
        });
      }
    }
    if (step === 2) {
      navigate('/manage-topic');
    }
  };

  const AddToCourse = (id: any) => {
    const data = localStorage.getItem('addTest');
    const idCourse = localStorage.getItem('idCourse');
    const idBaiKiemtra = localStorage.getItem('idBaikiemtra');
    if (data !== null) {
      const parseData = JSON.parse(data);
      parseData.idBaikiemtra = id;
      RequestAPI({
        url: PathAPI.baikiemtra + `/attach`,
        method: 'POST',
        payload: parseData,
      }).then((res: any) => {
        if (res.status) {
          localStorage.removeItem('addTest');
          localStorage.removeItem('idBaikiemtra');
          localStorage.removeItem('idCourse');
          navigate('/manage-course/' + idCourse);
        }
      });
    }
  };

  const handleCountQuestion = (questionCount: CountPoint) => {
    setQuestionCount(questionCount);
  };

  const handleChangeListQuestionStatic = useCallback((listQue: any) => {
    setListQuestionStatic(listQue);
  }, []);
  const handleChangeListQuestionDynamic = useCallback((listQue: any) => {
    setListQuestionDynamic(listQue);
  }, []);

  const createTag = (tag: any) => {
    RequestAPI({
      url: PathAPI.tag + 'create',
      method: 'POST',
      payload: {
        name: tag,
        type: TagType.TOPIC,
      },
    }).then((res: any) => {
      setTagList((current: any) => [...current, res.data]);
      setChoice((current: any) => [...current, res.data.name]);
    });
  };
  const handleChangeScore = (data: any, e?: boolean) => {
    const readingQues = data.filter((i: any) => i.quiz_type === 6);
    let numQuesChildren: any = 0;
    readingQues.map((key: any) => {
      numQuesChildren = numQuesChildren + key.listQuestionChildren.length;
    });
    const totalQues = data.length + numQuesChildren - readingQues.length;
    const score = questionForm.values.maxMark / totalQues;
    const clone = JSON.parse(JSON.stringify(data));
    clone.forEach((i: any) => {
      if (i.quiz_type === 6) {
        i['point'] = score * i.listQuestionChildren.length;
      } else {
        i['point'] = score;
      }
    });
    dispatch(updateTestEdit({ ...testRedux, listQuestion: clone }));
  };
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
    RequestAPI({
      url: PathAPI.tag,
      method: 'GET',
      params: {
        type: TagType.TOPIC,
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
    if (testRedux?.idTest) {
      RequestAPI({
        url: PathAPI.baikiemtra + `/${testRedux.idBaikiemtra}`,
        method: 'GET',
      }).then((res: any) => {
        if (res.status) {
          const { data } = res;

          conditionForm.setValues({
            timeStart: data.timeStart,
            timeEnd: data.timeEnd,
            timeAllow: data.timeAllow / 60,
            maxNumAttempt: data.maxNumAttempt,
            sort: 0,
            // guide: data.guide,
            isPauseAllow: data.isPauseAllow,
            minusWhenWrong: data.minusWhenWrong,
            minQuestionSubmit: data.minQuestionSubmit,
            isQuickTest: data.isQuickTest,
            resultReturnType: data.resultReturnType,
            gradingSingleQuestionType: data.gradingSingleQuestionType,
            active: true,
            isChangeScore: false,
          });

          questionForm.setFieldValue('testFormat', data.testFormat);
          questionForm.setFieldValue('maxMark', data.maxMark);
          setGuideTest(data.guide);

          //caculate point question
          const listQuestion = JSON.parse(JSON.stringify(testRedux.listQuestion));
          const totalWeight = listQuestion.reduce((acc: number, item: any) => acc + item.weight, 0);
          //map point question
          const listPoint = listQuestion.map((item: any) => {
            return {
              ...item,
              point: (data.maxMark / totalWeight) * item.weight,
            };
          });
          dispatch(updateTestEdit({ ...testRedux, listQuestion: listPoint }));
        }
      });
      setIsEditing(true);
      questionForm.setFieldValue('testType', Number(testRedux.testType));
      questionForm.setFieldValue('name', testRedux.name);
    }

    if (testRedux?.listQuestion?.length > 0) {
      const reformatClassList = testRedux.listClass.map((item: any) => item.idClass.toString());
      const reformatSubjectList = testRedux.listSubject.map((item: any) =>
        item.idSubject.toString()
      );
      const reformatTagList = testRedux.listTag.map((item: any) => item.name);
      questionForm.setFieldValue('listClass', reformatClassList);
      questionForm.setFieldValue('listSubject', reformatSubjectList);
      setSubjectListForm(reformatSubjectList);
      // questionForm.setFieldValue('idTag', reformatTagList);
    }
  }, []);
  useEffect(() => {
    //handleChangeClass
    if (classAndSubjectForm?.length > 0) {
      const listSubject: any[] = [];
      questionForm.values.listClass.map((item: any) => {
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
        return (
          questionForm.values.listSubject.findIndex((item2: any) => item2 == item.value) !== -1
        );
      });
      const reformSubjectList: string[] = temp.map((item: subjectType) => item.value.toString());
      questionForm.setFieldValue('listSubject', reformSubjectList);
      setSubjectListForm(subjectMatchAllClass);
    }
  }, [questionForm.values.listClass, classAndSubjectForm]);
  useEffect(() => {
    const tagArr: { label: any; value: string }[] = [];
    tagList?.map((item: any) => {
      tagArr.push(item.name);
    });
    setChoice(tagArr);
  }, [tagList]);
  return (
    <div className='w-full'>
      <DialogBox
        // @ts-ignore
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
        sideEffectLeave={() => {
          dispatch(clear());
        }}
      />
      <Breadcrumb />
      <div className='w-full'>
        <Stepper
          className='my-8 mx-8'
          active={step}
          onStepClick={setStep}
          breakpoint='sm'
          size='lg'
        >
          <Stepper.Step allowStepSelect={false} label='Bước 1' description='Cài đặt câu hỏi'>
            {/* Step 1 content: Create an account */}
          </Stepper.Step>
          <Stepper.Step allowStepSelect={false} label='Bước 2' description='Thiết lập điều kiện'>
            {/* Step 2 content: Verify email */}
          </Stepper.Step>
          <Stepper.Step allowStepSelect={false} label='Bước 3' description='Hoàn thành'>
            {/* Step 3 content: Get full access */}
          </Stepper.Step>
          <Stepper.Completed>
            {/* Completed, click back button to get to previous step */}
          </Stepper.Completed>
        </Stepper>

        {step == 0 && constantForm.question && (
          <form
            className='flex w-full flex-wrap'
            // onSubmit={questionForm.onSubmit((values) => handleCreateQuestion(values))}
          >
            <TextInput
              {...questionForm.getInputProps('name')}
              required
              className='w-full px-7 py-3 grow'
              label='Tên bộ đề'
              radius={15}
              placeholder='Nhập tên bộ đề'
              value={questionForm.values.name}
            />
            <MultiSelect
              {...questionForm.getInputProps('listClass')}
              required
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='Chọn lớp học'
              placeholder='Chọn lớp học'
              data={classListForm}
              onChange={(value: any) => {
                handleChangeClass(value);
                questionForm.setFieldValue('listClass', value);
              }}
              value={questionForm.values.listClass}
            />
            <MultiSelect
              {...questionForm.getInputProps('listSubject')}
              required
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='Chọn môn học'
              placeholder='Chọn môn học'
              data={subjectListForm}
              value={questionForm.values.listSubject}
            />
            <Select
              {...questionForm.getInputProps('testFormat')}
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='Chọn định dạng'
              data={constantForm?.baikiemtra?.testFormat?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
              value={'' + questionForm.values.testFormat}
              onChange={(value: any) => {
                questionForm.setFieldValue('testFormat', Number(value));
              }}
            />
            <MultiSelect
              {...questionForm.getInputProps('awarenessLevel')}
              className='w-1/3 px-7 py-3 grow'
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              radius={15}
              label='Cấp độ nhận biết'
              placeholder='Cấp độ nhận biết'
              data={constantForm?.question?.awarenessLevel?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
            />
            <MultiSelect
              {...questionForm.getInputProps('listTag')}
              className='w-1/3 px-7 py-3 grow'
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              required
              radius={15}
              label='Nhập Tags'
              placeholder='Nhập Tags'
              data={choice}
              searchable
              creatable
              getCreateLabel={(query) => `+ Tạo tag ${query}`}
              onCreate={(query) => createTag(query)}
            />
            <NumberInput
              {...questionForm.getInputProps('maxMark')}
              className='w-1/3 px-7 py-3 grow'
              required
              radius={15}
              label='Tổng điểm '
              placeholder='Nhập tổng điểm '
              value={questionForm.values.maxMark}
              min={1}
            />
            <Select
              {...questionForm.getInputProps('testType')}
              className='w-1/3 px-7 py-3'
              radius={15}
              rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
              styles={{ rightSection: { pointerEvents: 'none' } }}
              label='Chọn kiểu đề'
              placeholder='Chọn kiều đề'
              data={constantForm?.test?.testType?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = item.value.toString();
                item['key'] = item.value;
                return item;
              })}
              value={questionForm.values.testType.toString()}
              onChange={(value: any) => {
                questionForm.setFieldValue('testType', Number(value));
                setListQuestionStatic([]);
                setListQuestionDynamic([]);
                setQuestionCount({
                  totalQuestion: 0,
                  totalPointSelected: 0,
                });
              }}
            />

            <div className='w-full flex mx-7'>
              <Button
                className='flex items-center justify-center w-fit px-0 pr-3 text-sm'
                onClick={() => {
                  {
                    questionForm.values.testType === 0
                      ? setOpenStaticPopup(true)
                      : setOpenDynamicPopup(true);
                  }
                }}
              >
                <Add className='mx-2' size={30} variant='Outline' color='white' />
                {questionForm.values.testType === 0 ? 'Thêm câu hỏi' : 'Thêm điều kiện'}
              </Button>
              {questionCount.totalQuestion > 0 ? (
                <Button
                  className='flex items-center pl-2 ml-4 justify-center w-fit px-0 pr-3 text-sm'
                  onClick={() => {
                    const data = localStorage.getItem('selectedQuestion');
                    if (data !== null) handleChangeScore(JSON.parse(data));
                  }}
                >
                  Tự động chia điểm
                </Button>
              ) : null}
            </div>
            <div className='w-full px-6'>
              <div className='flex justify-end font-bold'>
                <p>Tổng số câu hỏi: {questionCount.totalQuestion}</p>
                <p className='ml-8'>
                  Tổng số điểm đã chọn:
                  <span className='text-ct-red-500'>
                    {' ' + questionCount.totalPointSelected.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
            <p className='w-full text-ct-red-500 text-right mb-4 px-6'>
              {Number(questionCount.totalPointSelected.toFixed(2)) !== questionForm.values.maxMark
                ? 'Tổng điểm đã chọn khác tổng điểm của đề'
                : ''}
            </p>
            <Suspense fallback={<Loading />}>
              {questionForm.values.testType === TestType.STATIC ? (
                <CreateStaticTest
                  openStaticPopup={openStaticPopup}
                  setOpenStaticPopup={setOpenStaticPopup}
                  handleChangeListQuestion={handleChangeListQuestionStatic}
                  handleCountQuestion={handleCountQuestion}
                  handleChangeScore={handleChangeScore}
                />
              ) : (
                <CreateDynamicTest
                  openDynamicPopup={openDynamicPopup}
                  setOpenDynamicPopup={setOpenDynamicPopup}
                  handleChangeListQuestion={handleChangeListQuestionDynamic}
                  handleCountQuestion={handleCountQuestion}
                />
              )}
            </Suspense>
          </form>
        )}
        {step == 1 && (
          <>
            <div className='flex flex-wrap'>
              <div className='w-1/2'>
                <div className='flex relative w-fit'>
                  <p className='py-2 font-bold'>Chọn thời gian mở</p>
                  <Tooltip
                    wrapLines
                    width={220}
                    color='white'
                    transition='fade'
                    transitionDuration={200}
                    label='Thời gian để học sinh bắt đầu làm bài'
                  >
                    <InfoCircle
                      size='20'
                      color='currentColor'
                      className='text-ct-secondary absolute -right-[24px] top-0'
                      variant='Bold'
                    />
                  </Tooltip>
                </div>
                <div className='flex items-center'>
                  <DateTimePicker
                    inputFormat={'hh:mm a MMM-DD-YYYY'}
                    {...conditionForm.getInputProps('timeStart')}
                    required
                    disabled={conditionForm.values.timeStart === now.toDateString()}
                    onChange={(value: any) => {
                      conditionForm.setFieldValue('timeStart', value.toISOString());
                      setTempTime((prev: any) => {
                        return {
                          ...prev,
                          timeStart: value.toISOString(),
                        };
                      });
                    }}
                    value={
                      conditionForm.values.timeStart !== ''
                        ? new Date(conditionForm.values.timeStart)
                        : null
                    }
                  />
                  <Checkbox
                    className='mx-4'
                    label='Không quy định'
                    classNames={{
                      label: 'font-bold text-inherit',
                    }}
                    onChange={(e: any) => {
                      const noLimit = e.target.checked;

                      if (noLimit) {
                        conditionForm.setFieldValue('timeStart', now.toDateString());
                      } else {
                        conditionForm.setFieldValue('timeStart', tempTime.timeStart);
                      }
                    }}
                  />
                </div>
              </div>
              <div className='w-1/2'>
                <div className='flex relative w-fit'>
                  <p className='py-2 font-bold'>Chọn thời gian đóng</p>
                  <Tooltip
                    wrapLines
                    width={220}
                    color='white'
                    transition='fade'
                    transitionDuration={200}
                    label='Thời gian để học sinh kết thúc làm bài'
                  >
                    <InfoCircle
                      size='20'
                      color='currentColor'
                      className='text-ct-secondary absolute -right-[24px] top-0'
                      variant='Bold'
                    />
                  </Tooltip>
                </div>
                <div className='flex items-center'>
                  <DateTimePicker
                    inputFormat={'hh:mm a MMM-DD-YYYY '}
                    {...conditionForm.getInputProps('timeEnd')}
                    required
                    disabled={conditionForm.values.timeEnd === featureDay}
                    onChange={(value: any) => {
                      conditionForm.setFieldValue('timeEnd', value.toISOString());
                      setTempTime((prev: any) => {
                        return {
                          ...prev,
                          timeEnd: value.toISOString(),
                        };
                      });
                    }}
                    value={
                      conditionForm.values.timeEnd !== ''
                        ? new Date(conditionForm.values.timeEnd)
                        : null
                    }
                  />
                  <Checkbox
                    className='mx-4'
                    label='Không quy định'
                    classNames={{
                      label: 'font-bold text-inherit',
                    }}
                    onChange={(e: any) => {
                      const noLimit = e.target.checked;
                      if (noLimit) {
                        conditionForm.setFieldValue('timeEnd', featureDay);
                      } else {
                        conditionForm.setFieldValue('timeEnd', tempTime.timeEnd);
                      }
                    }}
                  />
                </div>
              </div>
              <div className='w-1/2'>
                <p className='py-2 font-bold'>Chọn thời làm bài (Phút)</p>
                <div className='flex items-center'>
                  <NumberInput
                    {...conditionForm.getInputProps('timeAllow')}
                    hideControls
                    radius={8}
                    min={1}
                    classNames={{
                      input: 'w-[200px]',
                      label: 'font-bold text-inherit',
                    }}
                    disabled={conditionForm.values.timeAllow === 0 ? true : false}
                  />
                  <Checkbox
                    className='mx-4'
                    label='Không giới hạn'
                    classNames={{
                      label: 'font-bold text-inherit',
                    }}
                    defaultChecked={conditionForm.values.timeAllow === 0 ? true : false}
                    onChange={(e: any) => {
                      const noLimit = e.target.checked;
                      if (noLimit) {
                        conditionForm.setFieldValue('timeAllow', 0);
                      } else {
                        conditionForm.setFieldValue('timeAllow', 45);
                      }
                    }}
                  />
                </div>
              </div>
              <div className='w-1/2'>
                <p className='py-2 font-bold'>Số lần làm tối đa</p>
                <div className='flex items-center'>
                  <NumberInput
                    {...conditionForm.getInputProps('maxNumAttempt')}
                    hideControls
                    min={1}
                    radius={8}
                    classNames={{
                      input: 'w-[200px]',
                    }}
                    disabled={conditionForm.values.maxNumAttempt === 0 ? true : false}
                  />
                  <Checkbox
                    className='mx-4'
                    label='Không giới hạn'
                    classNames={{
                      label: 'font-bold text-inherit',
                    }}
                    defaultChecked={conditionForm.values.timeAllow === 0 ? true : false}
                    onChange={(e: any) => {
                      const noLimit = e.target.checked;
                      if (noLimit) {
                        conditionForm.setFieldValue('maxNumAttempt', 0);
                      } else {
                        conditionForm.setFieldValue('maxNumAttempt', 1);
                      }
                    }}
                  />
                </div>
              </div>
              <div className='w-[200px]'>
                <p className='py-2 font-bold'>Thứ tự trả về</p>
                <Select
                  {...conditionForm.getInputProps('sort')}
                  disabled
                  radius={8}
                  defaultValue={'' + conditionForm.values.sort}
                  data={[
                    {
                      label: 'Thứ tự ngẫu nhiên',
                      value: '0',
                    },
                    {
                      label: 'Theo thứ tự',
                      value: '1',
                    },
                  ]}
                />
              </div>
            </div>
            <p className='py-2 font-bold'>Mô tả thông tin đề thi</p>
            <CK5Editor
              handleContent={(value) => {
                setGuideTest(value);
                error && setError(false);
              }}
              className='mb-4'
              // radius={8}
              placeholder='Hướng dẫn làm bài thi'
              contentQuestion={guideTest}
              error={error}
            />
            <div className=' mt-4'>
              <p
                className='flex items-center font-bold'
                onClick={() => {
                  setShowAdvanceConfig(!showAdvanceConfig);
                  setDropup(!dropUp);
                }}
              >
                Nâng cao{' '}
                <ArrowDown2
                  className={`ml-2  ${dropUp === true ? 'block' : ' hidden'}`}
                  size={15}
                  color='currentColor'
                  variant='Bold'
                />
                <ArrowUp2
                  className={`ml-2  ${dropUp === true ? ' hidden' : 'block'}`}
                  size={15}
                  color='currentColor'
                  variant='Bold'
                />
              </p>
              {showAdvanceConfig && (
                <>
                  <div className='flex justify-start items-end w-2/3 mb-4'>
                    <Checkbox
                      {...conditionForm.getInputProps('minusWhenWrong')}
                      label={
                        <>
                          <Tooltip
                            wrapLines
                            width={220}
                            color='white'
                            transition='fade'
                            transitionDuration={200}
                            label='Thời gian để học sinh bắt đầu làm bài'
                          >
                            Sai bị trừ điểm
                            <InfoCircle
                              size='20'
                              color='currentColor'
                              className='text-ct-secondary absolute -right-[24px] top-0'
                              variant='Bold'
                            />
                          </Tooltip>
                        </>
                      }
                      className='w-1/4'
                      classNames={{
                        label: 'font-bold text-inherit',
                      }}
                      defaultChecked={conditionForm.values.minusWhenWrong}
                      onChange={(e: any) => {
                        const minusWhenWrong = e.target.checked;
                        conditionForm.setFieldValue('minusWhenWrong', minusWhenWrong);
                      }}
                    />
                    <NumberInput
                      className={`pl-8 ${
                        conditionForm.values.minusWhenWrong ? 'visible' : 'invisible '
                      }`}
                      hideControls
                      min={1}
                      radius={8}
                      placeholder='Nhập số điểm bị trừ'
                      classNames={{
                        input: 'w-[150px]',
                      }}
                    />
                    <Select
                      className={`pl-4 ${
                        conditionForm.values.minusWhenWrong ? 'visible' : 'invisible '
                      }`}
                      radius={10}
                      rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                      label='Điểm số tối thiếu'
                      placeholder='Điểm số tối thiếu'
                      data={[
                        {
                          label: '0 điểm',
                          value: '0',
                        },
                        {
                          label: 'Trừ về âm',
                          value: '1',
                        },
                      ]}
                    />
                  </div>
                  <div className='flex items-center'>
                    <Checkbox
                      // {...conditionForm.getInputProps('minQuestionSubmit')}
                      defaultChecked={conditionForm.values.minQuestionSubmit > 0}
                      className='mb-4'
                      label='Số câu tối thiểu cần để nộp bài'
                      classNames={{
                        label: 'font-bold text-inherit',
                      }}
                    />
                    <NumberInput
                      {...conditionForm.getInputProps('minQuestionSubmit')}
                      className={`pl-8 `}
                      value={conditionForm.values.minQuestionSubmit}
                      hideControls
                      min={1}
                      radius={8}
                      placeholder='Nhập số câu tối thiểu'
                      classNames={{
                        input: 'w-[200px]',
                      }}
                    />
                  </div>
                  <Checkbox
                    {...conditionForm.getInputProps('isPauseAllow')}
                    className='w-1/3 mb-4'
                    label='Cho phép dừng khi làm bài'
                    classNames={{
                      label: 'font-bold text-inherit',
                    }}
                    defaultChecked={conditionForm.values.isPauseAllow}
                  />
                </>
              )}
              <div className='flex'>
                <div className='w-1/2'>
                  <Select
                    className='w-2/3'
                    {...conditionForm.getInputProps('gradingSingleQuestionType')}
                    radius={10}
                    label='Cách tính điểm câu nhiềU đáp án và câu ghép cặp'
                    data={constantFormRedux.baikiemtra.gradingSingleQuestionType.map(
                      (item: any) => ({
                        label: item.title,
                        value: '' + item.value,
                      })
                    )}
                    defaultValue={'' + conditionForm.values.gradingSingleQuestionType}
                  />
                </div>

                <Select
                  className='w-1/3'
                  {...conditionForm.getInputProps('resultReturnType')}
                  radius={10}
                  label='Hiển thị kết quả'
                  data={constantFormRedux.baikiemtra.resultReturnType.map((item: any) => ({
                    label: item.title,
                    value: '' + item.value,
                  }))}
                  defaultValue={'' + conditionForm.values.resultReturnType}
                />
              </div>

              <Checkbox
                {...conditionForm.getInputProps('active')}
                className='w-full'
                label='Active bộ đề'
                classNames={{
                  label: 'font-bold text-inherit',
                  root: 'my-6',
                }}
                defaultChecked={conditionForm.values.active}
              />
            </div>
          </>
        )}
        {step === 2 && (
          <div>
            <p className='text-center text-ct-secondary font-bold text-2xl my-12'>
              Tạo đề thành công!
            </p>
          </div>
        )}
        <div className='flex justify-end items-center w-full mt-10'>
          {step >= 1 && (
            <Button
              className='m-4'
              variant='outline'
              onClick={() => {
                if (step === 2) {
                  setStep(step - 2);
                } else {
                  setStep(step - 1);
                }
              }}
            >
              {step == 0 ? ' Quay lại' : step == 1 ? ' Quay lại' : 'Tạo đề mới'}
            </Button>
          )}
          <Button className='m-4' onClick={handleCompleteStep}>
            {step == 0 ? 'Thiết lập điều kiện' : step == 1 ? 'Hoàn thành' : 'Về trang chủ'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTestContainer;
