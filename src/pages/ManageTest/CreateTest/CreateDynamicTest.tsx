import { Modal, MultiSelect, NumberInput, Select } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Loading from 'components/Loading';
import DeleteModal from 'components/Modal/Delete';
import { questionEnumType, TagType } from 'enum';
import { ArrowDown2, Edit, Trash } from 'iconsax-react';
import { subjectType } from 'pages/ManageQuestion/Question/type';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Constant } from 'store/selector';
import { notify } from 'utils/notify';
import { v4 as uuid } from 'uuid';
import { CountPoint, CreateDynamicTestProps } from './type';

type FormType = {
  numQuestion: number;
  listClass: string[];
  listSubject: string[];
  type: string;
  awareness_level: string;
  level: string;
  listTag: [];
  subQuestion: number;
  score: number;
};
const CreateDynamicTest = ({
  openDynamicPopup,
  setOpenDynamicPopup,
  handleChangeListQuestion,
  handleCountQuestion,
  className,
}: CreateDynamicTestProps) => {
  const constantFormRedux = useSelector(Constant);
  const constantForm = JSON.parse(JSON.stringify(constantFormRedux));

  const [questionType, setQuestionType] = useState<number>();
  const [classAndSubjectForm, setClassAndSubjectForm] = useState<any>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [classListForm, setClassListForm] = useState<any>([]);
  const [subjectListForm, setSubjectListForm] = useState<any>([]);
  const [idEdit, setIdEdit] = useState<string>('');
  const [deleted, setDeleted] = useState<any>({
    isOpen: false,
    id: '',
  });

  const [listCondition, setListCondition] = useState<any>([]);

  const questionForm = useForm<FormType>({
    initialValues: {
      numQuestion: 1,
      listClass: [],
      listSubject: [],
      type: '',
      awareness_level: '',
      level: '',
      listTag: [],
      subQuestion: 1,
      score: 0,
    },
    validationRules: {
      numQuestion: (value: number) => value > 0,
      listClass: (value: string[]) => value.length > 0,
      listSubject: (value: string[]) => value.length > 0,
    },
    errorMessages: {
      numQuestion: 'S??? l?????ng c??u h???i ph???i l???n h??n 0',
      listClass: 'B???n ch??a ch???n l???p',
      listSubject: 'B???n ch??a ch???n m??n h???c',
    },
  });

  const handleCreatCondition = (values: any) => {
    RequestAPI({
      url: PathAPI.question,
      method: 'GET',
      params: {
        ...values,
      },
      pagination: {
        pageSize: 1,
        pageIndex: 1,
      },
    }).then((res: any) => {
      if (res.data?.length < values.quantity) {
        notify({
          type: 'error',
          message: 'S??? l?????ng c??u h???i kh??ng trong kho kh??ng ????? ????? t???o ????? thi',
        });
      } else {
        if (idEdit != '') {
          const index = listCondition.findIndex((item: any) => item.id === idEdit);
          const cloneListCondition = [...listCondition];
          cloneListCondition[index] = {
            ...values,
            quiz_type: questionType,
          };
          setListCondition(cloneListCondition);
        } else {
          const condition = {
            ...values,
            quiz_type: questionType,
            id: uuid(),
          };
          setListCondition((pre: any) => {
            handleChangeListQuestion([...pre, condition]);
            return [...pre, condition];
          });
        }
        setIdEdit('');
        setOpenDynamicPopup(false);
      }
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

  const handleChangePointQuestion = (id: number, point: number) => {
    const clone = JSON.parse(JSON.stringify(listCondition));
    const index = clone.findIndex((i: any) => i.id === id);
    if (index !== -1) {
      clone[index]['point'] = point;
      setListCondition(clone);
    }
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
    const tempCount: CountPoint = {
      totalQuestion: 0,
      totalPointSelected: 0,
    };
    listCondition.map((item: any) => {
      tempCount.totalQuestion += item.numQuestion;
      tempCount.totalQuestion += item.subQuestion;
      tempCount.totalPointSelected += Number(item.point) * item.numQuestion;
    });
    handleCountQuestion(tempCount);
  }, [listCondition]);

  return (
    <>
      {listCondition?.map((item: any, index: number) => (
        <div key={item.id} className={`w-full px-6 mt-4 ${className}`}>
          <p className='text-md font-bold pr-4'>??i???u ki???n {index + 1}</p>
          <div className='flex items-center'>
            <div className='flex items-start w-full mt-4 border p-4 mb-4'>
              <div className='w-1/2 flex'>
                <div className='w-1/2'>
                  <p className='pr-4 pb-3'>S??? l?????ng c??u h???i:</p>
                  {questionType === questionEnumType.READING ? (
                    <p className='pr-4 pb-3'>S??? c??u h???i con:</p>
                  ) : (
                    ''
                  )}
                  <p className='pr-4 pb-3'>M??n h???c:</p>
                  <p className='pr-4 pb-3'>C???p ????? nh???n bi???t:</p>
                  <p className='pr-4 pb-3'>Ki???u c??u h???i:</p>
                </div>
                <div className='w-1/2'>
                  <p className='pr-4 pb-3'>{item?.numQuestion} </p>
                  {questionType === questionEnumType.READING ? (
                    <p className='pr-4 pb-3'>{item?.subQuestion} </p>
                  ) : (
                    ''
                  )}
                  <p className='pr-4 pb-3 truncate'>
                    {item?.listSubject
                      .map((item: any) => {
                        return subjectListForm.filter((item2: any) => +item2.value === +item)[0]
                          .label;
                      })
                      .join(', ') || 'T???t c???'}{' '}
                  </p>
                  <p className='pr-4 pb-3'>
                    {item?.level
                      ? constantForm.question.level[Number(item?.level)]?.title
                      : 'T???t c???'}
                  </p>
                  <p className='pr-4 pb-3'>
                    {item?.quiz_type
                      ? constantForm.question.quiz_type[Number(item?.quiz_type)]?.title
                      : 'T???t c???'}
                  </p>
                </div>
              </div>
              <div className='w-1/2 flex'>
                <div className='w-1/2'>
                  <p className='pr-4 pb-3'>L???p:</p>
                  <p className='pr-4 pb-3'>Tag:</p>
                  <p className='pr-4 pb-3'>????? kh?? c??u h???i:</p>
                  <p className='pr-4 pb-3'>Lo???i c??u h???i</p>
                </div>
                <div className='w-1/2'>
                  <p className='pr-4 pb-3 truncate'>
                    {item?.listClass
                      .map((item: any) => {
                        return classAndSubjectForm.filter(
                          (item2: any) => item2.idClass === +item
                        )[0].name;
                      })
                      .join(', ') || 'T???t c???'}
                  </p>
                  <p className='pr-4 pb-3'>
                    {item?.listTag
                      .map((item: any) => {
                        return constantForm.tag.type.filter(
                          (item2: any) => +item2?.value === +item
                        )[0]?.title;
                      })
                      .join(', ') || 'T???t c???'}
                  </p>
                  <p className='pr-4 pb-3'>
                    {item?.awareness_level
                      ? constantForm.question.awarenessLevel[Number(item?.awareness_level)]?.title
                      : 'T???t c???'}
                  </p>
                  <p className='pr-4 pb-3'>
                    {item?.type ? constantForm.question.type[Number(item?.type)]?.title : 'T???t c???'}
                  </p>
                </div>
              </div>
              <div className='flex self-end'>
                <div
                  className='bg-ct-secondary p-2 rounded-md mx-2'
                  onClick={() => {
                    questionForm.setValues({
                      ...item,
                    });
                    setQuestionType(item.quiz_type);
                    setIdEdit(item.id);
                    setOpenDynamicPopup(true);
                  }}
                >
                  <Edit color='white' variant='Outline' size='15' />
                </div>
                <div
                  className='bg-ct-red-500 p-2 rounded-md mx-2'
                  onClick={() => {
                    setDeleted({
                      isOpen: true,
                      id: item.id,
                    });
                  }}
                >
                  <Trash color='white' variant='Outline' size='15' />
                </div>
              </div>
            </div>
            <div className='pl-8'>
              <div>
                <p className='my-2'>??i???m m???i c??u</p>
                <NumberInput
                  required
                  hideControls
                  min={0}
                  precision={2}
                  onChange={(value: any) => {
                    handleChangePointQuestion(item.id, value);
                  }}
                />
              </div>
              <p className='mt-4'>T???ng ??i???m ??i???u ki???n</p>
              <p>{item.point * item.numQuestion || 0}</p>
            </div>
          </div>
        </div>
      ))}
      <DeleteModal
        deleted={deleted.isOpen}
        title={'X??c nh???n xo?? ??i???u ki???n'}
        description={'B???n c?? ch???c mu???n xo?? ??i???u ki???n n??y kh??ng?'}
        handleExit={() => {
          setDeleted({
            isOpen: false,
            id: '',
          });
        }}
        handleDelete={() => {
          setListCondition((pre: any) => pre.filter((item2: any) => item2.id != deleted.id));
          setDeleted({
            isOpen: false,
            id: '',
          });
        }}
      />
      <Modal
        size='80%'
        radius={16}
        opened={openDynamicPopup}
        onClose={() => setOpenDynamicPopup(false)}
      >
        {constantForm?.question ? (
          <div className='w-full'>
            <div className='flex w-full flex-wrap'>
              <Select
                // {...questionForm.getInputProps('quiz')}
                className='w-1/3 px-7 py-3'
                radius={15}
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                label='Ki???u c??u h???i'
                placeholder='Ki???u c??u h???i'
                data={constantForm?.question?.quiz_type?.map((item: any) => {
                  item['label'] = item.title;
                  item['value'] = '' + item.value;
                  item['key'] = item.value;
                  return item;
                })}
                onChange={(value: string) => setQuestionType(+value)}
                value={'' + questionType}
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <NumberInput
                {...questionForm.getInputProps('numQuestion')}
                required
                label='S??? l?????ng c??u h???i'
                className='w-1/3 px-7 py-3'
                radius={15}
              />
              <NumberInput
                {...questionForm.getInputProps('subQuestion')}
                className='w-1/3 px-7 py-3'
                radius={15}
                label='S??? l?????ng c??u h???i con'
                min={1}
                disabled={questionType !== questionEnumType.READING}
              />
              <MultiSelect
                {...questionForm.getInputProps('listClass')}
                required
                className='w-1/3 px-7 py-3'
                radius={15}
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                label='Ch???n l???p h???c'
                placeholder='Ch???n l???p h???c'
                data={classListForm}
                onChange={(value: any) => {
                  questionForm.setFieldValue('listClass', value);
                  handleChangeClass(value);
                }}
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <MultiSelect
                {...questionForm.getInputProps('listSubject')}
                required
                className='w-1/3 px-7 py-3'
                radius={15}
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                label='Ch???n m??n h???c'
                placeholder='Ch???n m??n h???c'
                data={subjectListForm}
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <Select
                {...questionForm.getInputProps('type')}
                className='w-1/3 px-7 py-3'
                radius={15}
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                label='Lo???i c??u h???i'
                placeholder='Lo???i c??u h???i'
                data={constantForm?.question?.type?.map((item: any) => {
                  item['label'] = item.title;
                  item['value'] = '' + item.value;
                  item['key'] = item.value;
                  return item;
                })}
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <Select
                {...questionForm.getInputProps('awareness_level')}
                className='w-1/3 px-7 py-3'
                radius={15}
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                label='C???p ????? nh???n bi??t c??u h???i'
                placeholder='C???p ????? nh???n bi??t c??u h???i'
                data={constantForm.question.awarenessLevel?.map((item: any) => {
                  item['label'] = item.title;
                  item['value'] = '' + item.value;
                  item['key'] = item.value;
                  return item;
                })}
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <Select
                {...questionForm.getInputProps('level')}
                className='w-1/3 px-7 py-3'
                radius={15}
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                label='????? kh?? c??u h???i'
                placeholder='????? kh?? c??u h???i'
                data={constantForm?.question?.level?.map((item: any) => {
                  item['label'] = item.title;
                  item['value'] = '' + item.value;
                  item['key'] = item.value;
                  return item;
                })}
                styles={{ rightSection: { pointerEvents: 'none' } }}
              />
              <MultiSelect
                {...questionForm.getInputProps('listTag')}
                className='w-1/3 px-7 py-3 grow'
                rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
                radius={15}
                label='Nh???p Tags'
                placeholder='Nh???p Tags'
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
                // getCreateLabel={(query) => `+ T???o tag ${query}`}
                // onCreate={(query) => setTags((current: any) => [...current, query])}
              />
              <div className='flex justify-center items-center w-full mt-10'>
                <button
                  type='button'
                  onClick={() => setOpenDynamicPopup(false)}
                  className='m-4 px-8 py-2 rounded-lg border border-ct-secondary text-ct-secondary text-xl'
                >
                  H???y
                </button>
                <button
                  className='m-4 px-8 py-2 rounded-lg bg-ct-secondary text-white text-xl'
                  style={{ wordSpacing: '1px', letterSpacing: '1px' }}
                  type='button'
                  onClick={questionForm.onSubmit((values) => {
                    handleCreatCondition(values);
                  })}
                >
                  C???p nh???t ??i???u ki???n
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </Modal>
    </>
  );
};

export default CreateDynamicTest;
