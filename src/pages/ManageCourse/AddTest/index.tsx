import { Checkbox, Input, Modal, MultiSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api/requestAPI';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import Pagination from 'components/Pagination';
import Table from 'components/Table';
import DialogBox from 'hook/BeforeUnload';
import { useCallbackPrompt } from 'hook/BeforeUnload/useCallbackPrompr';
import { Eye, FilterSearch, Graph } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DateTimePicker from '../../../components/DateTimePicker';
import './styles.css';
interface InfoClass {
  idClass: number;
  idSchoolLevel: number;
  name: string;
}
interface grade {
  idSchoolLevel: number;
  name: string;
}
interface subject {
  idSubject: number;
  name: string;
}
interface submitdata {
  name: string;
  listClass: number[];
  listSubject: number[];
  timeAllow: number;
  maxMark: number;
  maxNumAttempt: number;
  guide: string;
  isPauseAllow: boolean;
  timeStart: string;
  timeEnd: string;
  listTest: number[];
  minQuestionSubmit: number;
  isQuickTest: boolean;
  product: product;
}
interface product {
  idCourse: null | any;
  idUnit: null | number;
  idSection: null | any;
  idLesson: null | any;
  idClip: null | any;
  isFree: boolean;
  listPkgname: [];
  testLevel: number;
}
let data: submitdata = {
  name: '',
  listClass: [],
  listSubject: [],
  timeAllow: 0,
  maxMark: 10,
  maxNumAttempt: 0,
  guide: '',
  isPauseAllow: true,
  timeStart: '',
  timeEnd: '',
  listTest: [],
  minQuestionSubmit: 10,
  isQuickTest: false,
  product: {
    idCourse: null,
    idUnit: null,
    idSection: null,
    idClip: null,
    idLesson: null,
    isFree: false,
    listPkgname: [],
    testLevel: 1,
  },
};
let choiceTest: any[] = [];
interface listTest {
  idBaikiemtra: number;
  listClass: number[];
  listSubject: number[];
  name: string;
}
interface dataselect {
  label: string;
  value: string;
  disabled: boolean;
}
const AddTest = () => {
  const [dataSub, setDataSub] = useState<submitdata>(data);
  const [isEdit, setIsEdit] = useState(false);
  const [exit, setExit] = useState(false);
  const [filter, setFilter] = useState(false);
  const [listClass, setListClass] = useState<InfoClass[]>([]);
  const [listGrade, setListGrade] = useState<grade[]>([]);
  const [listSubject, setListSubject] = useState<subject[]>([]);
  const [test, setTest] = useState<any[]>([]);
  const [choiceClass, setChoiceClass] = useState<dataselect[]>([]);
  const [choiceGrade, setChoiceGrade] = useState<dataselect[]>([]);
  const [choiceSubject, setChoiceSubject] = useState<dataselect[]>([]);
  const [arrLength, setArrLength] = useState(0);
  const [item, setItem] = useState<string[]>([]);
  const [item2, setItem2] = useState<string[]>([]);
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(true);
  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showDialog);
  const params = useParams();
  const { type } = useParams();
  const navigate = useNavigate();
  const dataTest = useForm({
    initialValues: {
      name: '',
      start: '',
      finnish: '',
      mark: '10',
      guide: '',
      idTest: '',
    },
    validationRules: {
      name: (value: string) => value !== '',
      start: (value: string) => value !== '',
      finnish: (value: string) => value !== '',
      guide: (value: string) => value !== '',
      idTest: (value: string) => value !== '',
      mark: (value: string) => parseInt(value) > 0 && parseInt(value) <= 10,
    },
    errorMessages: {
      name: 'Bạn chưa nhập tên bài kiểm tra',
      start: 'Bạn chưa nhập thời gian bắt đầu',
      finnish: 'Bạn chưa nhập thời gian kết thúc',
      mark: 'Điểm nhập vào có giá trị từ 1 đến 10',
      guide: 'Bạn chưa nhập hướng dẫn làm bài',
      idTest: 'Bạn chưa chọn bộ đề',
    },
  });
  const handlePaging = (page: number) => {
    setLoading(true);
    RequestAPI({
      url: PathAPI.baikiemtra,
      method: 'GET',
      params: {
        page: page,
        limit: 10,
      },
    }).then((res) => {
      const dt = getDataTable(res.data);
      setTest(dt);
      setLoading(false);
    });
  };
  useEffect(() => {
    const getData = async () => {
      const it: dataselect[] = [];

      const cl: dataselect[] = [];
      listClass.map((key) => {
        cl.push({
          label: key.name,
          value: key.idClass + '',
          disabled: false,
        });
      });
      setChoiceClass(cl);
      if (typeof type !== undefined && type === 1 + '') {
        setDataSub((pre: any) => {
          return {
            ...pre,
            product: {
              ...pre.product,
              idUnit: null,
              idCourse: params.idCourse ? parseInt(params.idCourse) : null,
              idLesson: null,
              idClip: null,
              idSection: params.id ? parseInt(params.id) : null,
            },
          };
        });
      }
      if (typeof type !== undefined && type === 2 + '') {
        setDataSub((pre: any) => {
          return {
            ...pre,
            product: {
              ...pre.product,
              idUnit: null,
              idCourse: params.idCourse ? parseInt(params.idCourse) : null,
              idSection: null,
              idClip: null,
              idLesson: params.id ? parseInt(params.id) : null,
            },
          };
        });
      }
      if (typeof type !== undefined && type === 3 + '') {
        setDataSub((pre: any) => {
          return {
            ...pre,
            product: {
              ...pre.product,
              idUnit: null,
              idCourse: params.idCourse ? parseInt(params.idCourse) : null,
              idSection: null,
              idLesson: null,
              idClip: params.id ? parseInt(params.id) : null,
            },
          };
        });
      }
    };
    const gr: dataselect[] = [];
    listGrade.map((key) => {
      gr.push({
        label: key.name,
        value: key.idSchoolLevel + '',
        disabled: false,
      });
    });
    setChoiceGrade(gr);
    const sub: dataselect[] = [];
    listSubject.map((key) => {
      sub.push({
        label: key.name,
        value: key.idSubject + '',
        disabled: false,
      });
    });
    setChoiceSubject(sub);

    getData();
  }, [listClass, listGrade, listSubject]);
  useEffect(() => {
    setLoading(true);
    RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
    }).then((res) => {
      setListSubject(res.data);
    });
    RequestAPI({
      url: PathAPI.grade,
      method: 'GET',
    }).then((res) => {
      setListGrade(res.data);
    });
    RequestAPI({
      url: PathAPI.class,
      method: 'GET',
    }).then((res) => {
      setListClass(res.data);
    });
    RequestAPI({
      url: PathAPI.baikiemtra,
      method: 'GET',
    }).then((res: any) => {
      const dt = getDataTable(res.data);
      setTest(dt);
      let total = res.total;
      setArrLength(Math.ceil(total / 10));
      setLoading(false);
    });
    //
    if (params.idBaikiemtra) {
      setIsEdit(true);
    }
  }, []);
  useEffect(() => {
    // nếu có params idBaikiemtra
    if (params.idBaikiemtra) {
      console.log('edit');

      RequestAPI({
        url: PathAPI.baikiemtra + '/' + params.idBaikiemtra,
        method: 'GET',
      }).then((res) => {
        setDataSub(res.data);
        dataTest.values.name = res.data.name;
        dataTest.values.start = res.data.timeStart;
        dataTest.values.finnish = res.data.timeEnd;
        dataTest.values.mark = res.data.maxMark;
        dataTest.values.guide = res.data.guide;
        dataTest.values.idTest = res.data.listTest.join(', ');
        choiceTest = res.data.listTest;
      });
      setIsEdit(true);
    }
  }, [isEdit]);
  const getGrade = (id: number) => {
    let name = 'Test';
    let i = 0;

    listClass.map((key) => {
      if (key.idClass == id) {
        i = key.idSchoolLevel;
      }
    });
    listGrade.map((key) => {
      if (key.idSchoolLevel == i) {
        name = key.name;
      }
    });
    return name;
  };
  const getSubject = (id: number) => {
    let name = '';
    listSubject.map((key) => {
      if (key.idSubject === id) {
        name = key.name;
      }
    });

    return name;
  };
  const selectTest = (id: number, isCheck: boolean) => {
    let chk = true;
    if (isCheck) {
      choiceTest.map((key) => {
        if (key === id) {
          chk = true;
        }
      });
      if (chk) choiceTest.push(id);
    } else {
      let filter = choiceTest.filter((c) => c != id);
      choiceTest = filter;
    }

    setDataSub({ ...dataSub, listTest: choiceTest });
    dataTest.values.idTest = choiceTest.join(', ');
  };
  const submitForm = async (val: any) => {
    // validate
    let data = dataSub;
    data.name = val.name;
    data.guide = val.guide;
    data.maxMark = val.mark;
    data.timeStart = new Date(val.start).toISOString();
    data.timeEnd = new Date(val.finnish).toISOString();
    if (params.idBaikiemtra) {
      setCheck(false);
      await RequestAPI({
        url: PathAPI.baikiemtra + '/' + params.idBaikiemtra,
        method: 'PATCH',
        payload: data,
        notify: {
          type: 'success',
          message: 'Sửa bài kiểm tra thành công',
        },
      });
      return true;
    }
    if (type === '1') {
      data.product.idSection = params.id;
    } else if (type === '2') {
      data.product.idLesson = params.id;
    } else {
      data.product.idClip = params.id;
    }
    await RequestAPI({
      url: PathAPI.baikiemtra,
      method: 'POST',
      payload: data,
      notify: {
        type: 'success',
        message: 'Thêm bài kiểm tra thành công',
      },
    });
    setCheck(false);
    // setShowDialog(false);

    return navigate('/manage-course/' + params.idCourse);
  };
  const ExitFunc = () => {
    setCheck(false);
    return navigate('/manage-course/' + params.idCourse);
  };
  const setChecked = (id: number) => {
    let chk = false;
    choiceTest.map((key) => {
      if (key === id) {
        chk = true;
      }
    });
    return chk;
  };
  const filterData = () => {
    setFilter(false);
    setLoading(true);
    if (item.length > 0) {
      let str = '';
      item.map((key, index) => {
        str = item.length > index + 1 ? str + key + ',' : str + key;
      });
      RequestAPI({
        url: PathAPI.baikiemtra,
        method: 'GET',
        params: {
          limit: 10,
          idClass: str,
        },
      }).then((res: any) => {
        const dt = getDataTable(res.data);
        setTest(dt);
        let total = res.total;
        setArrLength(Math.ceil(total / 10));
      });
    }
    if (item2.length > 0) {
      let str = '';
      item2.map((key, index) => {
        str = item.length > index + 1 ? str + key + ',' : str + key;
      });
      RequestAPI({
        url: PathAPI.baikiemtra,
        method: 'GET',
        params: {
          limit: 10,
          idSubject: str,
        },
      }).then((res: any) => {
        const dt = getDataTable(res.data);
        setTest(dt);
        let total = res.total;
        setArrLength(Math.ceil(total / 10));
      });
    }
    if (item.length > 0 && item2.length > 0) {
      let str = '';
      let str2 = '';
      item.map((key, index) => {
        str = item.length > index + 1 ? str + key + ',' : str + key;
      });
      item2.map((key, index) => {
        str2 = item.length > index + 1 ? str + key + ',' : str + key;
      });
      RequestAPI({
        url: PathAPI.baikiemtra,
        method: 'GET',
        params: {
          limit: 10,
          idClass: str,
          idSubject: str2,
        },
      }).then((res: any) => {
        const dt = getDataTable(res.data);
        setTest(dt);
        let total = res.total;
        setArrLength(Math.ceil(total / 10));
      });
    }
    setLoading(false);
  };
  const checkExit = () => {
    if (
      (dataTest.values.name !== '' ||
        dataTest.values.guide !== '' ||
        dataTest.values.start !== '' ||
        dataTest.values.finnish !== '' ||
        dataSub.listTest.length > 0) &&
      check
    ) {
      setExit(true);
    } else {
      ExitFunc();
    }
  };
  // khi người dùng nhập thông tin và chọn đề thì thay đổi state check ---> show popup khi người dùng
  useEffect(() => {
    if (
      dataTest.values.name !== '' ||
      dataTest.values.guide !== '' ||
      dataTest.values.start !== '' ||
      dataTest.values.finnish !== '' ||
      dataSub.listTest.length > 0
    ) {
      setCheck(true);
      // setShowDialog(true);
    } else {
      setCheck(false);
      // setShowDialog(false);
    }
  }, [dataTest.values, dataSub.listTest]);

  const getDataTable = (data: any) => {
    const arr: any[] = [];
    data.map((key: any) => {
      let dt = {
        checkbox: (
          <Checkbox
            // checked={setChecked(key.idBaikiemtra)}
            onChange={(e: any) => selectTest(key.idBaikiemtra, e.target.checked)}
          />
        ),
        action: <Eye size='20' color='currentColor' variant='Bold' className='text-ct-green-400' />,
        id: key.idBaikiemtra,
        class: key.listClass.map((c: any) => 'Lớp ' + c),
        subject: key.listSubject.map((k: any) => getSubject(k)),
        content: key.name,
      };
      arr.push(dt);
    });
    console.log(arr);

    return arr;
  };
  return (
    <div className='mx-auto px-4'>
      <Breadcrumb />
      {/* {<BeforeUnload condition={check} />} */}
      {
        <DialogBox
          // @ts-ignore
          showDialog={showPrompt}
          confirmNavigation={confirmNavigation}
          cancelNavigation={cancelNavigation}
        />
      }
      <form onSubmit={dataTest.onSubmit((val) => submitForm(val))}>
        <div className='mt-2 grid grid-cols-3 gap-3'>
          <div>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Tên bài kiểm tra{' '}
            </label>
            <TextInput
              className=' grow'
              {...dataTest.getInputProps('name')}
              type={'text'}
              placeholder='Nhập tên bài kiểm tra'
              radius={15}
              value={dataTest.values.name}
            />
          </div>
          <div>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Thời gian bắt đầu
            </label>
            <DateTimePicker
              {...dataTest.getInputProps('start')}
              required
              placeholder='Thời gian bắt đầu'
              inputFormat={'DD-MMM-YYYY hh:mm a'}
              value={dataTest.values.start !== '' ? new Date(dataTest.values.start) : null}
              // value={isEdit ? new Date(dataSub.timeStart) : null}
              // onChange={(value: any) => {
              //     // setDataSub({
              //     //     ...dataSub,
              //     //     timeStart: new Date(value).toISOString(),
              //     // });
              // }}
            />
          </div>
          <div>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Thời gian kết thúc
            </label>
            <DateTimePicker
              {...dataTest.getInputProps('finnish')}
              required
              placeholder='Thời gian kết thúc'
              inputFormat={'DD-MMM-YYYY hh:mm a'}
              value={dataTest.values.finnish !== '' ? new Date(dataTest.values.finnish) : null}
            />
          </div>
          <div className='mt-2'>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Thời gian làm bài (phút)
            </label>
            <Input
              type={'number'}
              value={dataSub.timeAllow}
              radius={15}
              onChange={(e: any) =>
                setDataSub({
                  ...dataSub,
                  timeAllow: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className='mt-2'>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Tổng lượt làm
            </label>
            <Input
              type={'number'}
              value={dataSub.maxNumAttempt}
              radius={15}
              onChange={(e: any) =>
                setDataSub({
                  ...dataSub,
                  maxNumAttempt: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className='mt-2'>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Điểm tối đa đạt được
            </label>
            <TextInput
              {...dataTest.getInputProps('mark')}
              required
              type={'number'}
              value={dataTest.values.mark}
              radius={15}
              onChange={(e: any) =>
                setDataSub({
                  ...dataSub,
                  maxMark: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className='mt-2'>
          <div className='grid grid-cols-1 gap-1'>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Hướng dẫn làm bài
            </label>
            <TextInput {...dataTest.getInputProps('guide')} type={'text'} radius={15} />
          </div>
        </div>
        <div className='mt-2'>
          <div className='grid grid-cols-1 gap-1'>
            <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
              Bộ đề đã chọn
            </label>
            <TextInput
              {...dataTest.getInputProps('idTest')}
              type={'text'}
              radius={15}
              value={dataSub.listTest.join(', ')}
              disabled
            />
          </div>
        </div>
        <div className='grid grid-cols-5 gap-5 mt-3'>
          <div className='flex items-center'>
            <Checkbox
              onChange={(e: any) => setDataSub({ ...dataSub, isPauseAllow: e.target.checked })}
              checked={dataSub.isPauseAllow}
              className='mr-2'
            />{' '}
            Cho phép dừng khi làm bài
          </div>

          <div className='flex items-center'>
            <Checkbox
              onChange={(e: any) =>
                setDataSub((pre: any) => {
                  return {
                    ...pre,
                    product: {
                      ...pre.product,
                      isFree: e.target.checked,
                    },
                  };
                })
              }
              checked={dataSub.product.isFree}
              className='mr-2'
            />{' '}
            Bài kiểm tra miễn phí
          </div>

          <div className='flex items-center'>
            <Checkbox
              onChange={(e: any) => setDataSub({ ...dataSub, isQuickTest: e.target.checked })}
              checked={dataSub.isQuickTest}
              className='mr-2'
            />{' '}
            Dạng bài QuickTest
          </div>
        </div>
        <div className='mt-3'>
          <label htmlFor='' style={{ fontSize: 17, fontWeight: '700' }}>
            Chọn bộ đề{' '}
          </label>
        </div>
        <Button
          className={`bg-white border border-ct-secondary text-ct-secondary rounded-[8px] mt-2 m-4 flex justify-center items-center px-4 py-1 text-sm hover:bg-ct-secondary hover:text-white transition-all ${
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
        <div className='overflow-x-auto w-full mt-4'>
          <Table
            dataSource={{
              columns: [
                {
                  title: (
                    <Checkbox
                      onChange={(e) => {
                        // console.log(e.target.checked);
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
                  title: 'ID',
                },
                {
                  title: 'Lớp học',
                },
                {
                  title: 'Môn học',
                },
                {
                  title: 'Nội dung',
                },
              ],
              data: test,
            }}
            loading={loading}
          />
        </div>
        <div className='flex justify-end  mt-3'>
          <Pagination handlePaging={handlePaging} total={arrLength} />
        </div>
        <div className='text-center'>
          <div className='mt-3 flex justify-center'>
            <div className='flex  mr-6'>
              <Button
                variant='outline'
                color='#017EFA'
                className='m-4 flex justify-center items-center px-7 py-2 text-sm'
                onClick={() => checkExit()}
              >
                Hủy{' '}
              </Button>
            </div>
            <div className='flex justify-start '>
              <Button
                color='#017EFA'
                className='m-4 flex justify-center items-center px-7 py-2 text-sm'
                // onClick={}
                type='submit'
              >
                {isEdit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </div>
        </div>
      </form>
      <Modal opened={exit} onClose={() => setExit(false)} hideCloseButton={true} radius={15}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Hủy bỏ
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          Bạn có chắc muốn hủy bỏ ?
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button
              variant='outline'
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => setExit(false)}
            >
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => {
                setCheck(false);
                ExitFunc();
              }}
            >
              {' '}
              Đồng ý{' '}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal opened={filter} onClose={() => setFilter(false)} hideCloseButton={true} radius={15}>
        <div className='container mx-auto px-4'>
          <div className='flex flex-1'>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='ml-3' style={{ fontSize: 17, fontWeight: '700' }}>
              Bộ lọc
            </p>
          </div>
          <div className='mt-2'>
            <label htmlFor='' className='mt-6' style={{ fontSize: 15, fontWeight: '700' }}>
              Lớp học
            </label>

            <MultiSelect
              defaultValue={item}
              data={choiceClass}
              placeholder='Chọn lớp'
              radius={15}
              onChange={(value: string[]) => {
                setItem(value);
              }}
            />
          </div>
          <div className='mt-2'>
            <label htmlFor='' className='mt-6' style={{ fontSize: 15, fontWeight: '700' }}>
              Môn học
            </label>

            <MultiSelect
              defaultValue={item2}
              data={choiceSubject}
              placeholder='Chọn môn'
              radius={15}
              onChange={(value: string[]) => {
                setItem2(value);
              }}
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button
              variant='outline'
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => setFilter(false)}
            >
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => filterData()}
            >
              Lưu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default AddTest;
