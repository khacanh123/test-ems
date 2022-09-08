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
  idSubject: number;
  name: string;
}

interface tags {
  idTag: number;
  name: string;
  listSubject: [];
}
interface datatags {
  idTag: number;
  name: string;
  subjectName: string;
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
const ManageQuestionTagTestContainer = () => {
  const [subject, setSubject] = useState<subject[]>([]);
  const [tags, setTags] = useState<tags[]>([]);
  const [dataTags, setDataTags] = useState<datatags[]>([]);
  const [datafilter, setDatafilter] = useState<datatags[]>([]);
  const [choice, setChoice] = useState<choice[]>([]);
  const [prev, setPrev] = useState(0);
  const [nextP, setNextP] = useState(9);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setID] = useState(0);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [item, setItem] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [display, setDisplay] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const handlePaging = (page: number) => {
    setLoading(true);
    setPage(page);
    RequestAPI({
      url: PathAPI.tag,
      method: 'GET',
      params: {
        type: 1,
        page: page,
        limit: display,
      },
    }).then((res: any) => {
      setTags(res.data);
      setDataTags(res.data);
      setLoading(false);
      let total = res.total;
      setTotalPage(Math.ceil(total / display));
    });
  };

  const submitData = async () => {
    const it: number[] = [];
    item.map((key) => {
      it.push(parseInt(key));
    });
    let data = {
      idTag: isEdit ? id : tags.length + 1,
      name: name,

      type: 1,
    };

    if (isEdit) {
      await RequestAPI({
        url: PathAPI.tag + '/update',
        method: 'POST',
        payload: data,
        notify: {
          type: 'success',
          message: 'Sửa Tag thành công',
        },
      });
    } else {
      await RequestAPI({
        url: PathAPI.tag + '/create',
        method: 'POST',
        payload: data,
        notify: {
          type: 'success',
          message: 'Thêm Tag thành công',
        },
      });
    }
    await RequestAPI({
      url: PathAPI.tag,
      method: 'GET',
      params: {
        type: 1,
        page: page,
      },
    }).then((res: any) => {
      setTags(res.data);
    });
    setOpened(false);
    setIsEdit(false);
    setName('');
  };
  const DeleteData = async () => {
    let data = {
      idTag: id,
    };
    await RequestAPI({
      url: PathAPI.tag + '/delete',
      method: 'POST',
      payload: data,
      notify: {
        type: 'success',
        message: 'Xóa Tag thành công',
      },
    });
    await RequestAPI({
      url: PathAPI.tag,
      method: 'GET',
      params: {
        type: 1,
        page: page,
      },
    }).then((res: any) => {
      setTags(res.data);
    });
    setDeleted(false);
    setIsEdit(false);
    setName('');
  };
  const getDataEdit = (id: number) => {
    RequestAPI({
      url: PathAPI.tag + '/' + id,
      method: 'GET',
    }).then((res: any) => {
      const it: string[] = [];
      const resdt = res.data.listSubject;
      resdt.map((key: any) => {
        it.push(key + '');
      });
      setName(res.data.name);
      setItem(it);
      setID(res.data.idTag);
    });
    setOpened(true);
    setIsEdit(true);
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
  const changeDisplay = async (val: string) => {
    let num = val !== '' ? parseInt(val) : 10;
    await setDisplay(num);
    await handlePaging(1);
  };
  const searchBySubject = (val: string) => {
    RequestAPI({
      url: PathAPI.tag,
      method: 'GET',
      params: {
        name: val,
        type: 1,
        page: page,
      },
    }).then((res: any) => {
      setTags(res.data);
    });
  };
  useEffect(() => {
    handlePaging(1);
  }, [display]);
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
          <div className='float-left mt-3 mb-2'>
            <label htmlFor='' style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
              Số kết quả hiển thị
            </label>
            <Select
              data={data}
              onChange={(e: string) => setDisplay(Number(e))}
              defaultValue={display + ''}
              radius={8}
            />
          </div>
        </div>
        <div>
          <div className='float-right' style={{ marginTop: 35 }}>
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
                title: 'ID Tag',
              },
              {
                title: 'Tên Tag',
              },
            ],
            data: tags.map((key) => {
              return {
                action: (
                  <div className='flex'>
                    <Trash
                      size='20'
                      className='mr-2 text-ct-red-300'
                      color='currentColor'
                      variant='Bold'
                      onClick={() => {
                        DeleteFunc(key.idTag);
                      }}
                    />
                    <Edit2
                      size='20'
                      color='currentColor'
                      variant='Bold'
                      className='mx-2 text-ct-secondary'
                      onClick={() => {
                        getDataEdit(key.idTag);
                      }}
                    />
                  </div>
                ),
                id: key.idTag,
                name: key.name,
              };
            }),
          }}
          loading={loading}
        />
      </div>{' '}
      <div className='flex justify-end mt-4'>
        <Pagination handlePaging={handlePaging} total={totalPage} />
      </div>
      <Modal opened={opened} onClose={() => setOpened(false)} hideCloseButton={true} radius={12}>
        <div className='container mx-auto px-4'>
          <div className='flex flex-1'>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='ml-3' style={{ fontSize: 17, fontWeight: '700' }}>
              Thông tin Tag
            </p>
          </div>
          <label htmlFor='' style={{ fontSize: 15, fontWeight: '700' }}>
            Tên tag
          </label>
          <Input onChange={(e: any) => setName(e.target.value)} defaultValue={name} radius={15} />
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
          Xác nhận xóa tag
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

export default ManageQuestionTagTestContainer;
