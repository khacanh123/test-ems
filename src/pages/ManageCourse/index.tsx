import { Checkbox, Input, Modal, ScrollArea, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import Pagination from 'components/Pagination';
import Table from 'components/Table';
import { Add, Eye, FilterSearch, Graph, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notify } from 'utils/notify';
import './styles.css';

const ManageCourseContainer = () => {
  const [pagination, setPagiantion] = useState({
    active: 1,
    total: 1,
    pageSize: 10,
  });
  const [listCourse, setListCourse] = useState<any[]>([]);
  const [listCoursePreview, setListCoursepreview] = useState<any[]>([]);
  const [datalistCourse, setDataListCourse] = useState<any[]>([]);
  const [datalistCourseHM, setDataListCourseHM] = useState<any[]>([]);
  const [arrLength, setArrLength] = useState(0);
  const [previewLength, setPreviewLength] = useState(0);
  const [count, setCount] = useState<number>(1);
  const [display, setDisplay] = useState(10);
  const [displayPreview, setDisplayPreview] = useState(10);
  const [page, setPage] = useState(1);
  const [pagePreview, setPagePreview] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [openedPreview, setOpenedPreview] = useState(false);
  const [opened, setOpened] = useState(false);
  const [idPreview, setIdPreview] = useState<number>();
  const [idCourse, setIdCourse] = useState<number>();
  const [idDetail, setIdDetail] = useState<number>();

  // Khoá học của EMS
  const form = useForm({
    initialValues: {
      id: '',
      courseName: '',
      teacher: '',
    },
  });

  let i = 1;
  let next = 1 * 10 - 1; // 9
  let pre = 1 * 10 - next - 1; //0

  useEffect(() => {
    RequestAPI({
      url: PathAPI.course,
      method: 'GET',
    }).then((res: any) => {
      const arr = [];
      for (let i = pre; i <= next; i++) {
        arr.push(res.data[i]);
      }
      setListCourse(arr);
      setDataListCourse(res.data);
    });
  }, [count]);

  const handlePaging = (page: number) => {
    setLoading(true);
    setPage(page);
    let next = page * display - 1; // 9 19
    let pre = next - display > 0 ? next - display + 1 : 0; // 0 9

    const arr = [];
    for (let i = pre; i <= next; i++) {
      arr.push(datalistCourse[i]);
    }
    setListCourse(arr);
    setLoading(false);
  };

  useEffect(() => {
    setArrLength(Math.ceil(datalistCourse.length / display));
  }, [datalistCourse]);

  useEffect(() => {
    if (form.values.id !== '') {
      const data = datalistCourse.filter((item: any) => {
        const id = '' + item.id;
        return id.search(form.values.id.trim()) !== -1;
      });

      if (data.length > display) {
        let next = page * display - 1; // 9 19
        let pre = next - display > 0 ? next - display + 1 : 0; // 0 9
        const arr = [];
        for (let i = pre; i <= next; i++) {
          arr.push(data[i]);
        }
        setListCourse(arr);
        setArrLength(Math.ceil(data.length / display));
      } else {
        setListCourse(data);
        setArrLength(1);
      }
    } else {
      changeDisplay(10);
    }

    if (form.values.courseName !== '') {
      const data = datalistCourse.filter((item: any) => {
        const title = item.title.trim().toLowerCase().replace();
        const checkTitle = title
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^\w\s]/gi, '');
        const checkValue = form.values.courseName
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^\w\s]/gi, '');

        return checkTitle.search(checkValue) !== -1;
      });

      if (data.length > display) {
        let next = page * display - 1; // 9 19
        let pre = next - display > 0 ? next - display + 1 : 0; // 0 9
        const arr = [];
        for (let i = pre; i <= next; i++) {
          arr.push(data[i]);
        }
        setListCourse(arr);
        setArrLength(Math.ceil(data.length / display));
      } else {
        setListCourse(data);
        setArrLength(1);
      }
    }

    if (form.values.teacher !== '') {
      const data = datalistCourse.filter((item: any) => {
        const teacher = item?.listTeacher.join(', ');
        const checkteacher = teacher
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^\w\s]/gi, '');
        const checkValueTeacher = form.values.teacher
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^\w\s]/gi, '');

        return checkteacher.search(checkValueTeacher) !== -1;
      });

      if (data.length > display) {
        let next = page * display - 1; // 9 19
        let pre = next - display > 0 ? next - display + 1 : 0; // 0 9
        const arr = [];
        for (let i = pre; i <= next; i++) {
          arr.push(data[i]);
        }
        setListCourse(arr);
        setArrLength(Math.ceil(data.length / display));
      } else {
        setListCourse(data);
        setArrLength(1);
      }
    }
  }, [form.values]);

  const changeDisplay = (num: number) => {
    setDisplay(num);
    let next = page * num - 1; // 9 19
    let pre = next - num > 0 ? next - num + 1 : 0; // 0 9
    const arr = [];
    for (let i = pre; i <= next; i++) {
      if (i <= datalistCourse.length) {
        arr.push(datalistCourse[i]);
      }
    }
    setListCourse(arr);
    setArrLength(Math.ceil(datalistCourse.length / num));
  };

  // Khoá học của HOCMAI

  const course = useForm({
    initialValues: {
      class: '',
      id: '',
      courseName: '',
    },
  });

  const handlePagingPreview = (page: number) => {
    setLoading(true);
    setPagePreview(page);
    let next = page * displayPreview - 1; // 9 19
    let pre = next - displayPreview > 0 ? next - displayPreview + 1 : 0; // 0 9

    listCoursePreview.map((itemlist: any) => {
      const checkboxfalse = document.getElementById(itemlist.id) as HTMLInputElement;
      checkboxfalse.checked = false;
    });

    const arr = [];
    for (let i = pre; i <= next; i++) {
      arr.push(datalistCourseHM[i]);
    }
    setListCoursepreview(arr);
    setLoading(false);
  };

  const changeItem = (num: number) => {
    setDisplayPreview(num);
    let next = page * num - 1; // 9 19
    let pre = next - num > 0 ? next - num + 1 : 0; // 0 9
    const arr = [];
    for (let i = pre; i <= next; i++) {
      arr.push(datalistCourseHM[i]);
    }

    setListCoursepreview(arr);
    setPreviewLength(Math.ceil(datalistCourseHM.length / num));
  };

  useEffect(() => {
    setPreviewLength(Math.ceil(datalistCourseHM.length / displayPreview));
  }, [datalistCourseHM]);

  useEffect(() => {
    RequestAPI({
      url: PathAPI.course + '/hm',
      method: 'GET',
    }).then((res: any) => {
      const arr = [];
      for (let i = pre; i <= next; i++) {
        arr.push(res.data.data[i]);
      }
      setListCoursepreview(arr);
      setDataListCourseHM(res.data.data);
    });
  }, []);

  const handleGetCourse = () => {
    if (course.values.id !== '') {
      const data = datalistCourseHM.filter((item: any) => {
        return item.id === course.values.id.trim();
      });

      if (data.length > display) {
        let next = page * display - 1; // 9 19
        let pre = next - display > 0 ? next - display + 1 : 0; // 0 9
        const arr = [];
        for (let i = pre; i <= next; i++) {
          arr.push(data[i]);
        }
        setListCoursepreview(arr);
        setPreviewLength(Math.ceil(data.length / display));
      } else {
        setListCoursepreview(data);
        setPreviewLength(1);
      }
    } else {
      changeItem(10);
    }

    if (course.values.courseName !== '') {
      const data = datalistCourseHM.filter((item: any) => {
        const checkitem = item.fullname
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^\w\s]/gi, '');

        const checkvalue = course.values.courseName
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^\w\s]/gi, '');

        return checkitem.search(checkvalue) !== -1;
      });

      if (data.length > display) {
        let next = page * display - 1; // 9 19
        let pre = next - display > 0 ? next - display + 1 : 0; // 0 9
        const arr = [];
        for (let i = pre; i <= next; i++) {
          arr.push(data[i]);
        }
        setListCoursepreview(arr);
        setPreviewLength(Math.ceil(data.length / display));
      } else {
        setListCoursepreview(data);
        setPreviewLength(1);
      }
    }
  };

  const handleSelectCourse = (e: any, item: any, index: number) => {
    listCoursePreview.map((itemlist: any) => {
      const checkboxfalse = document.getElementById(itemlist.id) as HTMLInputElement;
      checkboxfalse.checked = false;
    });
    const checkboxtrue = document.getElementById(item.id) as HTMLInputElement;
    checkboxtrue.checked = true;
    setIdCourse(item.id);
  };

  const handleAddCourse = () => {
    console.log(idCourse);

    if (idCourse) {
      RequestAPI({
        url: PathAPI.course + '/create',
        method: 'POST',
        payload: { idCourse },
      }).then((res: any) => {
        if (res.status) {
          notify({ type: 'success', message: 'Thêm mới thành công' });
          setOpened(false);
          setCount(count + 1);
        }
      });
    } else {
      notify({ type: 'error', message: 'Vui lòng chọn lại khoá học phù hợp' });
    }
  };

  const handlePreviewCourse = (id: number) => {
    setIdPreview(id);
    RequestAPI({
      url: PathAPI.courseHM + '/' + id,
      method: 'GET',
    }).then((res: any) => {
      if (res.data.status == 200) {
        localStorage.setItem('listCourseHM', JSON.stringify(res.data.data));
        const toNewtab = document.getElementById('toNewtab');
        toNewtab?.click();
      } else {
        notify({
          type: 'error',
          message: 'Khoá học chưa có đề cương khoá học',
        });
      }
    });
  };

  const checkDetail = async (id: number) => {
    await RequestAPI({
      url: PathAPI.course + '/detail/' + id,
      method: 'GET',
    }).then((res: any) => {
      const checkdata = res.data.courseTree;
      if (Object.keys(checkdata).length < 2) {
        notify({
          type: 'error',
          message: 'Khoá học chưa có bài kiểm tra khoá học',
        });
      } else {
        setIdDetail(id);
        const toDetail = document.getElementById('toDetail');
        toDetail?.click();
      }
    });
  };

  return (
    <>
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
            <Button
              className='m-4 flex justify-center items-center px-4 py-1 text-sm'
              onClick={() => {
                setOpened(true);
                course.setFieldValue('id', '');
                course.setFieldValue('courseName', '');
              }}
            >
              <Add size='30' color='#FFF' variant='Outline' />
              Thêm mới
            </Button>
          </div>
        </div>
        {filter ? (
          <div className='grid grid-cols-4 gap-4'>
            <div>
              <label
                htmlFor=''
                style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
                className='mb-2'
              >
                ID
              </label>
              <Input radius={8} placeholder='Tìm kiếm ...' {...form.getInputProps('id')} />
            </div>
            <div>
              <label
                htmlFor=''
                style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
                className='mb-2'
              >
                Tên khóa học
              </label>
              <Input
                radius={8}
                placeholder='Tìm kiếm ...'
                rightSection
                {...form.getInputProps('courseName')}
              />
            </div>
            <div>
              <label
                htmlFor=''
                style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
                className='mb-2'
              >
                Giảng viên
              </label>
              <Input
                radius={8}
                placeholder='Tìm kiếm ...'
                rightSection
                {...form.getInputProps('teacher')}
              />
            </div>
          </div>
        ) : (
          ''
        )}
        <div className='grid grid-cols-2 gap-2' style={{ marginTop: 5 }}>
          <div>
            <div className='float-left mt-3 mb-2'>
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
                onChange={(e: string) => changeDisplay(parseInt(e))}
              />
            </div>
          </div>
        </div>
        <div className='relative overflow-x-auto mt-3'>
          <Table
            dataSource={{
              columns: [
                {
                  title: 'Hành động',
                  size: 30,
                },
                {
                  title: 'ID',
                },
                {
                  title: 'Tên khóa học',
                },
                {
                  title: 'Tên giáo viên',
                  size: 200,
                },
              ],
              data: listCourse.map((key: any) => {
                let item = {
                  action: (
                    <div className='flex'>
                      <Eye
                        size='20'
                        color='currentColor'
                        className='ml-2 text-ct-green-300'
                        onClick={() => checkDetail(key?.id)}
                      />
                      <Trash
                        size='20'
                        className='mr-2 ml-4 text-ct-red-300'
                        color='currentColor'
                        variant='Bold'
                      />
                    </div>
                  ),
                  id: key?.id,
                  title: (
                    <div>
                      <Link
                        to={'/manage-course/' + idDetail}
                        className='hover-link text-ct-secondary'
                        id='toDetail'
                      ></Link>
                      <div
                        onClick={() => checkDetail(key?.id)}
                        className=' text-ct-secondary cursor-pointer'
                      >
                        {key?.title}
                      </div>
                    </div>
                  ),
                  teacher: key?.listTeacher.map((item: any) => item).join(', '),
                };
                return item;
              }),
            }}
            loading={loading}
          />
        </div>
        <div className='flex justify-end mt-3'>
          <Pagination handlePaging={handlePaging} total={arrLength} />
        </div>
      </div>

      <Modal
        hideCloseButton
        centered
        opened={opened}
        onClose={() => setOpened(!opened)}
        radius={20}
        size='70%'
        classNames={{
          root: '',
        }}
      >
        <div className='px-12 '>
          <div className='w-full flex items-center mt-4 '>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='font-bold text-xl ml-4 mb-2'>Chọn khoác học từ HOCMAI</p>
          </div>
          <div className='flex'>
            <div className='w-1/2 py-4  mr-4'>
              <TextInput
                label='ID khoá học'
                placeholder='Nhập ID khoá học'
                radius={10}
                classNames={{
                  input: 'h-[48px]',
                }}
                {...course.getInputProps('id')}
              />
            </div>
            <div className='w-1/2 py-4  mr-4'>
              <TextInput
                label='Tên khoá học'
                placeholder='Tên khoá học'
                radius={10}
                classNames={{
                  input: 'h-[48px]',
                }}
                {...course.getInputProps('courseName')}
              />
            </div>
          </div>
          <div className='w-full my-3'>
            <Button className='text-sm px-3 py-3' type='submit' onClick={handleGetCourse}>
              Lấy danh sách Khoá học
            </Button>
          </div>
          <div className='w-40'>
            <div className='float-left mt-3 mb-2'>
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
                onChange={(e: string) => changeItem(parseInt(e))}
              />
            </div>
          </div>
          <div className='mt-10 mr-4'>
            <ScrollArea style={{ height: '46vh', width: '100%' }}>
              <Table
                dataSource={{
                  columns: [
                    {
                      title: '',
                      centered: true,
                    },
                    {
                      title: 'ID',
                    },
                    {
                      title: 'Tên khoá học',
                    },
                    {
                      title: 'Đề cương khoá học',
                      // size: 150,
                      centered: true,
                    },
                  ],
                  data: listCoursePreview.map((item: any, index: number) => {
                    return {
                      action: (
                        <Checkbox
                          // checked={checkedState}
                          onChange={(e) => {
                            handleSelectCourse(e, item, index);
                            // setCheckedState(e.target.checked)
                          }}
                          id={item.id}
                        />
                      ),
                      id: item?.id,
                      courseName: item?.fullname,
                      outline: (
                        <div>
                          <Link
                            to={'/manage-courseHM/' + idPreview}
                            target='_blank'
                            id='toNewtab'
                          ></Link>

                          <>
                            <Eye
                              size='20'
                              color='currentColor'
                              className='text-ct-green-300 cursor-pointer'
                              onClick={() => {
                                handlePreviewCourse(item.id);
                              }}
                            />
                          </>
                        </div>
                      ),
                    };
                  }),
                }}
                loading={loading}
              />
            </ScrollArea>
          </div>
          <div className='flex justify-end mt-2'>
            <Pagination handlePaging={handlePagingPreview} total={previewLength} />
          </div>
          <div className='mx-auto w-fit mt-2'>
            <Button className='m-4' variant='outline' onClick={() => setOpened(!opened)}>
              Hủy
            </Button>
            <Button className='m-4' onClick={handleAddCourse}>
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ManageCourseContainer;
