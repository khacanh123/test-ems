import { Input, Modal, Select } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import Pagination from 'components/Pagination';
import Table from 'components/Table';
import { Add, Edit2, Graph, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
interface subject {
  idClass: number;
  name: string;
}
interface choice {
  label: string;
  value: string;
}

interface grade {
  idSchoolLevel: number;
  name: string;
}
const ManageQuestionClassContainer = () => {
  const [listSubject, setListSubject] = useState<subject[]>([]);
  const [grade, setGrade] = useState<grade[]>([]);
  const [choice, setChoice] = useState<choice[]>([]);
  const [arrLength, setArrLength] = useState(0);
  const [prev, setPrev] = useState(1);
  const [nextP, setNextP] = useState(9);
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [id, setID] = useState(0);
  const [deleted, setDeleted] = useState(false);
  const [item, setItem] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handlePaging = (page: number) => {
    setPrev(page);
    setLoading(true);
    RequestAPI({
      url: PathAPI.class,
      method: 'GET',
      params: {
        page: page,
        limit: 10,
      },
    }).then((res: any) => {
      let total = res.total;
      setArrLength(Math.ceil(total / 10));
      setListSubject(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    const getData = () => {
      // lấy môn học
      RequestAPI({
        url: PathAPI.class,
        method: 'GET',
        params: {
          page: 1,
          limit: 10,
        },
      }).then((res: any) => {
        let total = res.total;
        setArrLength(Math.ceil(total / 10));
        setListSubject(res.data);
      });

      const it: choice[] = [];
      grade.map((key) => {
        it.push({
          label: key.name,
          value: key.idSchoolLevel + '',
        });
      });
      setChoice(it);
    };
    getData();
  }, [grade]);

  useEffect(() => {
    RequestAPI({
      url: PathAPI.grade,
      method: 'GET',
    }).then((res: any) => {
      setGrade(res.data);
    });
  }, []);
  const submitData = async () => {
    let data = {
      idClass: id,
      idSchoolLevel: parseInt(item),
      name: name,
    };
    console.log(data);
    if (isEdit) {
      await RequestAPI({
        url: PathAPI.class + '/update',
        method: 'POST',
        payload: data,
      });
    } else {
      await RequestAPI({
        url: PathAPI.class + '/create',
        method: 'POST',
        payload: data,
      });
    }
    await RequestAPI({
      url: PathAPI.class,
      method: 'GET',
    }).then((res: any) => {
      setListSubject(res.data);
    });
    setOpened(false);
    setName('');
    setItem('');
  };
  const DeleteData = async () => {
    let data = {
      idClass: id,
    };
    await RequestAPI({
      url: PathAPI.class + '/delete',
      method: 'POST',
      payload: data,
    });
    await RequestAPI({
      url: PathAPI.class,
      method: 'GET',
      params: {
        limit: 10,
      },
    }).then((res: any) => {
      setListSubject(res.data);
    });
    setDeleted(false);
    setName('');
    setItem('');
  };
  const getDataEdit = async (id: number) => {
    await RequestAPI({
      url: PathAPI.class + '/' + id,
      method: 'GET',
    }).then((res: any) => {
      setName(res.data.name);
      setID(res.data.idClass);
      setItem(res.data.idSchoolLevel + '');
    });
    setOpened(true);
    setIsEdit(true);
  };
  const ExitFunc = () => {
    setOpened(false);
    setName('');
    setItem('');
    setDeleted(false);
    setID(0);
  };
  const AddFunc = () => {
    setOpened(true);
  };
  const DeleteFunc = (id: number) => {
    setDeleted(true);
    setID(id);
  };

  console.log(item);

  return (
    <div className=' mx-auto px-4'>
      <div className='flex'>
        <Breadcrumb />
        <div>
          <Button
            className='m-4 flex justify-center items-center px-4 py-1 text-sm'
            onClick={() => AddFunc()}
          >
            <Add size='30' color='#FFF' variant='Outline' />
            Thêm mới
          </Button>
        </div>
      </div>
      <div className='overflow-x-auto w-min mt-6' style={{ maxWidth: '1110px' }}>
        <Table
          dataSource={{
            columns: [
              {
                title: 'Hành động',
              },
              {
                title: 'Mã lớp',
              },
              {
                title: 'Tên lớp',
              },
            ],
            data: listSubject.map((key, index) => {
              return {
                action: (
                  <div className='flex'>
                    <Trash
                      size='20'
                      className='mr-2 text-ct-red-300'
                      color='currentColor'
                      variant='Bold'
                      onClick={() => {
                        DeleteFunc(key.idClass);
                      }}
                    />
                    <Edit2
                      size='20'
                      color='currentColor'
                      variant='Bold'
                      className='mx-2 text-ct-secondary'
                      onClick={() => {
                        getDataEdit(key.idClass);
                      }}
                    />
                  </div>
                ),
                id: key.idClass,
                name: key.name,
              };
            }),
          }}
          loading={loading}
        />
      </div>
      <div className='flex justify-end mr-10 mt-3'>
        <Pagination handlePaging={handlePaging} total={arrLength} />
      </div>
      <Modal opened={opened} onClose={() => ExitFunc()} hideCloseButton={true} radius={12}>
        <div className='container mx-auto px-4'>
          <div className='flex flex-1'>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='ml-3' style={{ fontSize: 17, fontWeight: '700' }}>
              Thông tin lớp học
            </p>
          </div>
          <label htmlFor='' style={{ fontSize: 15, fontWeight: '700' }}>
            ID lớp học
          </label>
          <Input
            defaultValue={id === 0 ? '' : id}
            placeholder={'Nhập ID lớp học'}
            onChange={(e: any) => setID(parseInt(e.target.value))}
            radius={15}
          />
          <div className='mt-2'>
            <label htmlFor='' style={{ fontSize: 15, fontWeight: '700' }}>
              Tên lớp học
            </label>
            <Input
              defaultValue={name}
              placeholder={'Nhập tên lớp học'}
              onChange={(e: any) => setName(e.target.value)}
              radius={15}
            />
          </div>
          <div className='mt-2'>
            <label htmlFor='' className='mt-6' style={{ fontSize: 15, fontWeight: '700' }}>
              Cấp học
            </label>

            <Select
              defaultValue={item}
              data={choice}
              placeholder='Chọn cấp học'
              radius={15}
              onChange={(value: string) => {
                setItem(value);
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
              onClick={() => ExitFunc()}
            >
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => submitData()}
            >
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal opened={deleted} onClose={() => ExitFunc()} hideCloseButton={true} radius={15}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Xác nhận xóa lớp học
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          Bạn có chắc muốn xóa lớp học này ?
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button
              variant='outline'
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => ExitFunc()}
            >
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm'
              onClick={() => DeleteData()}
            >
              {' '}
              Đồng ý{' '}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageQuestionClassContainer;
