import { Input, Modal } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import Table from 'components/Table';
import { Add, Edit2, Graph } from 'iconsax-react';
import { useEffect, useState } from 'react';
interface subject {
  idSchoolLevel: number;
  name: string;
}

const ManageQuestionGradeContainer = () => {
  const [listSubject, setListSubject] = useState<subject[]>([]);
  const [datalistSubject, setDataListSubject] = useState<subject[]>([]);
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [id, setID] = useState(0);
  const [opened, setOpened] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handlePaging = async (page: number) => {};
  useEffect(() => {
    const getData = async () => {
      // lấy môn học
      RequestAPI({
        url: PathAPI.grade,
        method: 'GET',
      }).then((res: any) => {
        let d = getDataTable(res.data);
        setListSubject(d);
        setDataListSubject(res.data);
      });
    };
    getData();
  }, []);
  const submitData = async () => {
    let data = {
      idSchoolLevel: id,
      name: name,
    };
    if (isEdit) {
      await RequestAPI({
        url: PathAPI.grade + '/update',
        method: 'POST',
        payload: data,
      });
    } else {
      await RequestAPI({
        url: PathAPI.grade + '/create',
        method: 'POST',
        payload: data,
      });
    }
    await RequestAPI({
      url: PathAPI.grade,
      method: 'GET',
    }).then((res: any) => {
      let d = getDataTable(res.data);
      setListSubject(d);
    });
    setOpened(false);
    setName('');
    setIsEdit(false);
  };
  const DeleteData = async () => {
    let data = {
      idSchoolLevel: id,
    };
    await RequestAPI({
      url: PathAPI.grade + '/delete',
      method: 'POST',
      payload: data,
      notify: {
        type: 'success',
        message: 'Đã xóa thành công',
      },
    });
    await RequestAPI({
      url: PathAPI.grade,
      method: 'GET',
    }).then((res: any) => {
      let d = getDataTable(res.data);
      setListSubject(d);
    });
    setDeleted(false);
    setName('');
  };
  const getDataEdit = async (id: number) => {
    await RequestAPI({
      url: PathAPI.grade + '/' + id,
      method: 'GET',
    }).then((res: any) => {
      setName(res.data.name);
      setID(res.data.idSchoolLevel);
    });
    setOpened(true);
    setIsEdit(true);
  };
  const ExitFunc = () => {
    setOpened(false);
    setName('');
    setIsEdit(false);
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
  const filterData = (val: string) => {
    const filter = datalistSubject.filter(
      (item: subject) => item.name.toLowerCase().search(val.toLowerCase()) !== -1
    );
    setListSubject(filter);
  };
  const getDataTable = (data: any) => {
    const arr: any[] = [];
    data.map((key: any) => {
      let item = {
        action: (
          <div className='flex' style={{ paddingLeft: 15 }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
              width={16}
              fill='#fa3f3f'
              onClick={() => DeleteFunc(key.idSchoolLevel)}
            >
              <path d='M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z' />
            </svg>
            <Edit2
              size='20'
              color='#017EFA'
              variant='Bold'
              className='ml-2'
              onClick={() => getDataEdit(key.idSchoolLevel)}
            />
          </div>
        ),
        id: key.idSchoolLevel,
        name: key.name,
      };
      arr.push(item);
    });
    return arr;
  };
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

      <div className='overflow-x-auto w-full mt-6'>
        <Table
          dataSource={{
            columns: [
              {
                title: 'Hành động',
              },
              {
                title: 'ID cấp học',
              },
              {
                title: 'Tên cấp học',
              },
            ],
            data: listSubject,
          }}
          loading={false}
        />
      </div>

      <Modal opened={opened} onClose={() => ExitFunc()} hideCloseButton={true} radius={12}>
        <div className='container mx-auto px-4'>
          <div className='flex flex-1'>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='ml-3' style={{ fontSize: 17, fontWeight: '700' }}>
              Thông tin cấp học
            </p>
          </div>
          <div className='mt-3 mb-3'>
            <label htmlFor='' style={{ fontSize: 15, fontWeight: '700' }}>
              ID cấp học
            </label>
            <Input
              type={'number'}
              defaultValue={id === 0 ? '' : id}
              placeholder={'Nhập ID cấp học'}
              onChange={(val: any) => setID(parseInt(val.target.value))}
              radius={15}
            />
          </div>
          <label htmlFor='' style={{ fontSize: 15, fontWeight: '700' }}>
            Tên cấp học
          </label>
          <Input
            defaultValue={name}
            placeholder={'Nhập tên cấp học'}
            onChange={(val: any) => setName(val.target.value)}
            radius={15}
          />
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
              {' '}
              {isEdit ? 'Cập nhật' : 'Thêm mới'}{' '}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal opened={deleted} onClose={() => ExitFunc()} hideCloseButton={true} radius={15}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Xác nhận xóa cấp học
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          Bạn có chắc muốn xóa cấp học này ?
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

export default ManageQuestionGradeContainer;
