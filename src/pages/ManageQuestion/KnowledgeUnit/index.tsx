import { Input, Modal, MultiSelect, Popover, Select } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import Pagination from 'components/Pagination';
import Table from 'components/Table';
import { Add, Edit2, Filter, Graph, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';

interface subject {
  idSubject: number;
  name: string;
}

interface classInfo {
  idClass: number;
  name: string;
}
interface tags {
  idKnowledgeUnit: number;
  name: string;
  listSubject: [];
  listClass: [];
}

interface choice {
  label: string;
  value: string;
}
interface searchValue {
  idClass: string;
  idSubject: string;
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
let defaultSearch: searchValue = {
  idClass: '',
  idSubject: '',
};
const ManageQuestionKnowledgeUnitContainer = () => {
  const [subject, setSubject] = useState<subject[]>([]);
  const [tags, setTags] = useState<tags[]>([]);
  const [dataTags, setDataTags] = useState<tags[]>([]);
  const [listClass, setListClass] = useState<classInfo[]>([]);
  const [choice, setChoice] = useState<choice[]>([]);
  const [choice1, setChoice1] = useState<choice[]>([]);
  const [search, setSearch] = useState<searchValue>(defaultSearch);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setID] = useState(0);
  const [name, setName] = useState('');
  const [item, setItem] = useState<string[]>([]);
  const [item1, setItem1] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);
  const [opened1, setOpened1] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [display, setDisplay] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const handlePaging = (page: number) => {
    setPage(page);
    setLoading(true);
    RequestAPI({
      url: PathAPI.knowledgeUnit,
      method: 'GET',
      params: {
        page: page,
        limit: display,
      },
    }).then((res: any) => {
      setDataTags(res.data);
      setTags(res.data);
      setLoading(false);
    });
  };
  useEffect(() => {
    const getData = () => {
      setLoading(true);
      RequestAPI({
        url: PathAPI.knowledgeUnit,
        method: 'GET',
        params: {
          page: page,
          limit: display,
        },
      }).then((res: any) => {
        setTags(res.data);
        let total = res.total;
        setTotalPage(Math.ceil(total / display));
        setDataTags(res.data);
        setLoading(false);
      });
      const it: choice[] = [];
      subject.map((key) => {
        it.push({
          label: key.name,
          value: key.idSubject + '',
        });
      });
      setChoice(it);
      const it2: choice[] = [];
      listClass.map((key) => {
        it2.push({
          label: key.name,
          value: key.idClass + '',
        });
      });
      setChoice1(it2);
    };
    getData();
  }, [subject]);
  useEffect(() => {
    RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
    }).then((res: any) => {
      setSubject(res.data);
    });
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
    const it1: number[] = [];
    item1.map((key) => {
      it1.push(parseInt(key));
    });
    let data = {
      idKnowledgeUnit: isEdit ? id : tags.length + 1,
      name: name,
      listSubject: it,
      listClass: it1,
    };
    console.log(data);

    if (isEdit) {
      await RequestAPI({
        url: PathAPI.knowledgeUnit + '/update',
        method: 'POST',
        payload: data,
      });
    } else {
      await RequestAPI({
        url: PathAPI.knowledgeUnit + '/create',
        method: 'POST',
        payload: data,
      });
    }
    await RequestAPI({
      url: PathAPI.knowledgeUnit,
      method: 'GET',
      params: {
        page: page,
      },
    }).then((res: any) => {
      setTags(res.data);
    });
    setOpened(false);
    setName('');
    setItem([]);
  };
  const DeleteData = async () => {
    let data = {
      idKnowledgeUnit: id,
    };
    await RequestAPI({
      url: PathAPI.knowledgeUnit + '/delete',
      method: 'POST',
      payload: data,
    });
    await RequestAPI({
      url: PathAPI.knowledgeUnit,
      method: 'GET',
      params: {
        page: page,
      },
    }).then((res: any) => {
      setTags(res.data);
    });
    setDeleted(false);
    setIsEdit(false);
    setName('');
  };
  const getDataEdit = async (id: number) => {
    // lấy đơn vị kiến thức
    await RequestAPI({
      url: PathAPI.knowledgeUnit + '/' + id,
      method: 'GET',
    }).then((res: any) => {
      const it: string[] = [];
      const it1: string[] = [];
      const resdt = res.data.listSubject;
      const resdt1 = res.data.listClass; // lấy class
      resdt.map((key: any) => {
        it.push(key + '');
      });

      //
      resdt1.map((key: any) => {
        it1.push(key + '');
      });
      setName(res.data.name);
      setItem(it);
      setItem1(it1);
      setID(res.data.idKnowledgeUnit);
    });
    setOpened(true);
    setIsEdit(true);
  };
  const ExitFunc = () => {
    setOpened(false);
    setName('');
    setItem([]);
    setItem1([]);
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
      url: PathAPI.knowledgeUnit,
      method: 'GET',
      params: {
        page: page,
        limit: num,
      },
    }).then((res: any) => {
      setTags(res.data);
      setDataTags(res.data);
      let total = res.total;
      setTotalPage(Math.ceil(total / num));
    });
  };
  const searchBySubject = (val: string) => {
    setValue(val);
  };
  useEffect(() => {
    const filter = dataTags?.filter(
      (item: tags) => item?.name?.toLowerCase().search(value.toLowerCase()) !== -1
    );
    setTags(filter);
  }, [value, dataTags]);
  useEffect(() => {
    if (search.idClass !== null) {
      RequestAPI({
        url: PathAPI.knowledgeUnit,
        method: 'GET',
        params: {
          page: page,
          limit: display,
          idClass: search.idClass,
        },
      }).then((res: any) => {
        setTags(res.data);
        setDataTags(res.data);
        let total = res.total;
        setTotalPage(Math.ceil(total / display));
      });
    }
    if (search.idSubject !== null) {
      RequestAPI({
        url: PathAPI.knowledgeUnit,
        method: 'GET',
        params: {
          page: page,
          limit: display,
          idSubject: search.idSubject,
        },
      }).then((res: any) => {
        setTags(res.data);
        setDataTags(res.data);
        let total = res.total;
        setTotalPage(Math.ceil(total / display));
      });
    }
  }, [search]);
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

      <div className='flex justify-between' style={{ marginTop: 11 }}>
        <div>
          <div className='float-left mt-3 mb-2'>
            <label htmlFor='' style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
              Số kết quả hiển thị
            </label>
            <Select
              data={data}
              defaultValue={display + ''}
              onChange={(e) => changeDisplay(e + '')}
            />
          </div>
        </div>
        <div>
          <div className='float-right flex' style={{ marginTop: 35 }}>
            <Popover
              opened={opened1}
              onClose={() => setOpened1(false)}
              target={
                <div
                  className='flex text-lg font-bold mt-1 mr-5 text-black'
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    alignItems: 'center',
                  }}
                  onClick={() => setOpened1(true)}
                >
                  <Filter
                    size='32'
                    color='#017EFA'
                    className='mr-1'
                    variant={opened1 ? 'Bold' : 'Outline'}
                  />
                  Lọc
                </div>
              }
              width={324}
              position='bottom'
              placement='end'
              withArrow
            >
              <div>
                <div className='filter-content'>
                  <div>
                    <label
                      style={{
                        color: '#000',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                    >
                      Lớp học
                    </label>
                    <Select
                      placeholder='Chọn'
                      defaultValue={'STT'}
                      radius={8}
                      data={listClass?.map((item: any) => {
                        const tag = {
                          label: item.name,
                          value: '' + item.idClass,
                        };
                        return tag;
                      })}
                      onChange={(e: string) => setSearch({ ...search, idClass: e })}
                      clearable
                    />
                  </div>
                  <div style={{ marginTop: 25 }}>
                    <label
                      style={{
                        color: '#000',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                    >
                      Môn học
                    </label>
                    <Select
                      placeholder='Chọn'
                      radius={8}
                      data={subject?.map((item: any) => {
                        const tag = {
                          label: item.name,
                          value: '' + item.idSubject,
                        };
                        return tag;
                      })}
                      onChange={(e: string) => setSearch({ ...search, idSubject: e })}
                    />
                  </div>
                </div>
              </div>
            </Popover>
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
                title: 'ID đơn vị kiến thức',
              },
              {
                title: 'Tên đơn vị kiến thức',
              },
              {
                title: 'Lớp học',
              },
              {
                title: 'Danh sách môn học',
              },
            ],

            data: tags.map((key, index) => {
              return {
                action: (
                  <div className='flex'>
                    <Trash
                      size='20'
                      className='mr-2 text-ct-red-300'
                      color='currentColor'
                      variant='Bold'
                      onClick={() => {
                        DeleteFunc(key.idKnowledgeUnit);
                      }}
                    />
                    <Edit2
                      size='20'
                      color='currentColor'
                      variant='Bold'
                      className='mx-2 text-ct-secondary'
                      onClick={() => {
                        getDataEdit(key.idKnowledgeUnit);
                      }}
                    />
                  </div>
                ),
                id: key.idKnowledgeUnit,
                name: key.name,
                class: key.listClass.map((key1, index) => {
                  return listClass.map((k, i) => {
                    if (key1 == k.idClass) {
                      return key.listSubject.length > index + 1 ? k.name + ', ' : k.name + '';
                    }
                  });
                }),
                subject: key.listSubject.map((key1, index) => {
                  return subject.map((k, i) => {
                    if (key1 == k.idSubject) {
                      return key.listSubject.length > index + 1 ? k.name + ', ' : k.name + '';
                    }
                  });
                }),
              };
            }),
          }}
          loading={loading}
        />
      </div>
      <div className='grid grid-cols-1 gap-1'>
        <div>
          <div className='float-right mt-4'>
            <Pagination handlePaging={handlePaging} total={totalPage} />
          </div>
        </div>
      </div>

      <Modal opened={opened} onClose={() => ExitFunc()} hideCloseButton={true} radius={15}>
        <div className='container mx-auto px-4'>
          <div className='flex flex-1'>
            <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
              <Graph size={20} color='white' />
            </h6>{' '}
            <p className='ml-3' style={{ fontSize: 17, fontWeight: '700' }}>
              Thông tin Đơn vị kiến thức
            </p>
          </div>
          <label htmlFor='' style={{ fontSize: 15, fontWeight: '700' }}>
            Tên Đơn vị kiến thức
          </label>
          <Input onChange={(e: any) => setName(e.target.value)} defaultValue={name} radius={15} />
          <div className='mt-2'>
            <label htmlFor='' style={{ fontSize: 15, fontWeight: '700' }}>
              Chọn môn học
            </label>
            <MultiSelect
              defaultValue={item}
              data={choice}
              placeholder='Chọn môn'
              radius={15}
              height={40}
              onChange={(value: string[]) => {
                setItem(value);
              }}
            />
          </div>
          <div className='mt-2'>
            <label htmlFor='' style={{ fontSize: 15, fontWeight: '700' }}>
              Lớp học
            </label>
            <MultiSelect
              defaultValue={item1 || ''}
              data={choice1}
              placeholder='Chọn lớp'
              radius={15}
              height={40}
              onChange={(value: string[]) => {
                setItem1(value);
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
      <Modal opened={deleted} onClose={() => setDeleted(false)} hideCloseButton={true} radius={34}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Xác nhận xóa Đơn vị kiến thức
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          Bạn có chắc muốn xóa Đơn vị kiến thức này ?
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

export default ManageQuestionKnowledgeUnitContainer;
