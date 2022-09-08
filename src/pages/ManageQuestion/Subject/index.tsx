import { Input, Modal, MultiSelect, Select } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import Pagination from 'components/Pagination';
import Table from 'components/Table';
import { Add, Edit2, Graph } from 'iconsax-react';
import { useEffect, useState } from 'react';

interface subject {
  idSubject: number;
  name: string;
  listClass: [];
}
interface listclass {
  idClass: number;
  name: string;
}
interface choice {
  label: string;
  value: string;
}

interface subject {
  idSubject: number;
  name: string;
  listClass: [];
}
interface listclass {
  idClass: number;
  name: string;
}
interface choice {
  label: string;
  value: string;
}
const data = [
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
];
const ManageQuestionSubjectContainer = () => {
  const [listSubject, setListSubject] = useState<any[]>([]);
  const [datalistSubject, setDataListSubject] = useState<subject[]>([]);
  const [listClass, setListClass] = useState<listclass[]>([]);
  const [choice, setChoice] = useState<choice[]>([]);
  const [arrLength, setArrLength] = useState(0);
  const [prev, setPrev] = useState(0);
  const [nextP, setNextP] = useState(9);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setID] = useState(0);
  const [name, setName] = useState('');
  const [item, setItem] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [display, setDisplay] = useState(10);
  const [value, setValue] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const handlePaging = (page: number) => {
    setPage(page);
    setLoading(true);
    RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
      params: {
        page: page,
        limit: display,
      },
    }).then((res: any) => {
      setDataListSubject(res.data);
      setLoading(false);
    });
  };
  useEffect(() => {
    const getData = () => {
      // lấy môn học
      RequestAPI({
        url: PathAPI.subject,
        method: 'GET',
        params: {
          page: 1,
          limit: 10,
        },
      }).then((res: any) => {
        let d = getDataTable(res.data);
        setListSubject(d);
        setDataListSubject(res.data);
        setTotalPage(Math.ceil(res.total / display));
      });
      const it: choice[] = [];
      listClass.map((key) => {
        it.push({
          label: key.name,
          value: key.idClass + '',
        });
      });
      setChoice(it);
    };
    getData();
  }, [listClass]);

  useEffect(() => {
    // lấy lớp học
    RequestAPI({
      url: PathAPI.class,
      method: 'GET',
    }).then((res: any) => {
      setListClass(res.data);
    });
  }, []);

  const submitData = async () => {
    const it: number[] = [];
    item.map((key) => {
      it.push(parseInt(key));
    });
    let data = {
      idSubject: isEdit ? id : listSubject.length + 1,
      name: name,
      listClass: it,
    };
    console.log(data);

    if (isEdit) {
      await RequestAPI({
        url: PathAPI.subject + '/update',
        method: 'POST',
        payload: data,
        notify: {
          type: 'success',
          message: 'Sửa thông tin môn học thành công',
        },
      });
    } else {
      await RequestAPI({
        url: PathAPI.subject + '/create',
        method: 'POST',
        payload: data,
        notify: {
          type: 'success',
          message: 'Thêm thông tin môn học thành công',
        },
      });
    }
    await RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
      params: {
        limit: display,
        page: page,
      },
    }).then((res: any) => {
      let d = getDataTable(res.data);
      setListSubject(d);
      setDataListSubject(res.data);
    });
    setOpened(false);
    setName('');
    setItem([]);
  };
  const DeleteData = async () => {
    let data = {
      idSubject: id,
    };
    await RequestAPI({
      url: PathAPI.subject + '/delete',
      method: 'POST',
      payload: data,
      notify: {
        type: 'success',
        message: 'Xóa môn học thành công',
      },
    });
    await RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
      params: {
        limit: display,
        page: page,
      },
    }).then((res: any) => {
      let d = getDataTable(res.data);
      setListSubject(d);
      setDataListSubject(res.data);
    });
    setDeleted(false);
    setName('');
  };
  const getDataEdit = async (id: number) => {
    console.log(id);

    await RequestAPI({
      url: PathAPI.subject + '/' + id,
      method: 'GET',
    }).then((res: any) => {
      const it: string[] = [];
      const resdt: any = res.data[0].listClass;
      resdt.map((key: any) => {
        it.push(key + '');
      });
      setName(res.data[0].name);
      setItem(it);
      setID(res.data[0].idSchoolLevel);
    });
    setOpened(true);
    setIsEdit(true);
    setID(id);
  };
  const ExitFunc = () => {
    setOpened(false);
    setName('');
    setItem([]);
    setIsEdit(false);
    setDeleted(false);
  };
  const AddFunc = () => {
    setOpened(true);
  };
  const DeleteFunc = (id: number) => {
    setDeleted(true);
    setID(id);
  };
  const changeDisplay = (val: string) => {
    let num = val !== '' ? parseInt(val) : 10;
    setDisplay(num);
    RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
      params: {
        page: 1,
        limit: num,
      },
    }).then((res: any) => {
      setDataListSubject(res.data);
      let d = getDataTable(res.data);
      setListSubject(d);
      let total = res.total;
      setTotalPage(Math.ceil(total / num));
    });
  };
  const searchBySubject = (val: string) => {
    setValue(val);
    const filter = datalistSubject.filter((item: subject) =>
      item.name.toLowerCase().includes(val.toLowerCase().trim())
    );
    setListSubject(filter);
    setTotalPage(Math.ceil(filter.length / display));
  };
  useEffect(() => {
    const filter = datalistSubject.filter((item: subject) =>
      item.name.toLowerCase().includes(value.toLowerCase().trim())
    );
    setTotalPage(Math.ceil(filter.length / display));

    let d = getDataTable(filter);
    setListSubject(d);
  }, [value, datalistSubject]);
  const getDataTable = (obj: any) => {
    const arr: any[] = [];
    obj.map((key: any) => {
      let name = getNameClass(key.listClass);
      let item = {
        action: (
          <div className='flex' style={{ paddingLeft: 15 }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
              width={16}
              fill='#fa3f3f'
              onClick={() => DeleteFunc(key.idSubject)}
            >
              <path d='M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z' />
            </svg>
            <Edit2
              size='20'
              color='#017EFA'
              variant='Bold'
              className='ml-2'
              onClick={() => getDataEdit(key.idSubject)}
            />
          </div>
        ),
        idmonhoc: key.idSubject,
        tenmomhoc: key.name,
        danhsachlop: name.join(''),
      };
      arr.push(item);
    });
    return arr;
  };
  const getNameClass = (arr: any) => {
    return arr.map((key1: any, index: any) => 'Lớp ' + key1 + (arr.length > index + 1 ? ', ' : ''));
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
      <div className='flex justify-between'>
        <div>
          <div className='mt-3 mb-2'>
            <label htmlFor='' style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
              Số kết quả hiển thị
            </label>
            <Select
              data={data}
              onChange={(e: string) => changeDisplay(e)}
              defaultValue={display + ''}
              radius={8}
            />
          </div>
        </div>
        <div>
          <div className='' style={{ marginTop: 35 }}>
            <Input
              radius={8}
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                  width={18}
                  fill='#017EFA'
                >
                  <path d='M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z' />
                </svg>
              }
              placeholder='Tìm kiếm ...'
              onChange={(e: any) => searchBySubject(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='overflow-x-auto w-full mt-4'>
        <Table
          dataSource={{
            columns: [
              {
                title: 'Hành động',
              },
              {
                title: 'ID môn học',
              },
              {
                title: 'Tên môn học',
              },
              {
                title: 'Danh sách lớp',
              },
            ],
            data: listSubject,
          }}
          loading={loading}
        />
      </div>{' '}
      <div className='flex justify-end mt-4'>
        <Pagination handlePaging={handlePaging} total={totalPage} />
      </div>
      <Modal opened={opened} onClose={() => ExitFunc()} hideCloseButton={true} radius={15}>
        <div className='container mx-auto px-4'>
          <div className='flex flex-1'>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='ml-3' style={{ fontSize: 17, fontWeight: '700' }}>
              Thông tin môn học
            </p>
          </div>
          <label htmlFor='' style={{ fontSize: 15, fontWeight: '700' }}>
            Tên môn học
          </label>
          <Input onChange={(e: any) => setName(e.target.value)} defaultValue={name} radius={15} />
          <div className='mt-2'>
            <label htmlFor='' className='mt-6' style={{ fontSize: 15, fontWeight: '700' }}>
              Lớp học
            </label>

            <MultiSelect
              defaultValue={item}
              data={choice}
              placeholder='Chọn lớp'
              radius={15}
              onChange={(value: string[]) => {
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
              {isEdit ? 'Cập nhật' : 'Thêm mới'}{' '}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal opened={deleted} onClose={() => setDeleted(false)} hideCloseButton={true} radius={15}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Xác nhận xóa môn học
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          Bạn có chắc muốn xóa tag này ?
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

export default ManageQuestionSubjectContainer;
