import {
  Accordion,
  Checkbox,
  Modal,
  MultiSelect,
  ScrollArea,
  Select,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import Pagination from 'components/Pagination';
import Table from 'components/Table';
import { Add, ArrowDown2, Edit, Edit2, Graph, Trash, User } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Constant, Userinfo } from 'store/selector';
import { notify } from 'utils/notify';
import Loading from 'components/Loading';

const Missions = [
  { id: 1, name: 'Xem', key: 'read' },
  { id: 2, name: 'Thêm', key: 'write' },
  { id: 3, name: 'Sửa', key: 'update' },
  { id: 4, name: 'Xoá', key: 'delete' },
];

interface role {
  rank: number;
  name: string;
  parent: string;
  permissionsName: any;
  idRole: number;
}

const ManageTask = () => {
  const [page, SetPage] = useState<Number>(1);
  const [arrLength, setArrLength] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [idTask, setTask] = useState(0);
  const constantFormRedux = useSelector(Constant);
  const userDataFormRedux = useSelector(Userinfo);
  const [role, setRole] = useState<role[]>([]);
  const [allRole, setAllrole] = useState<any>([]);
  const [listPermissionsName, setlistPermissionsName] = useState<any>({});
  const [isCheckAllTask, setIsCheckAllTask] = useState<boolean>(true);
  const [namerole, SetNamerole] = useState<any>({});
  const [createIdRole, setCreateidrole] = useState<Number>();
  const [IdRole, setIdrole] = useState<Number>(1);
  const [createPermission, setcreatePermission] = useState<any>({});
  const [choice, setChoice] = useState<any>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [idupdate, setIdupdate] = useState<Number>(1);
  const [count, setCount] = useState<number>(1);
  const limit = 10;

  const addForm = useForm({
    initialValues: {
      name: '',
      role: '',
    },
    validationRules: {
      name: (value: string) => value.trim().length > 0,
    },
    errorMessages: {
      name: 'Bạn chưa nhập tên vai trò',
    },
  });

  const editForm = useForm({
    initialValues: {
      name: '',
      role: '',
    },
    validationRules: {
      name: (value: string) => value.trim().length > 0,
      role: (value: string) => value.trim().length > 0,
    },
    errorMessages: {
      name: 'Bạn chưa nhập tên vai trò',
      role: 'Bạn chọn vai trò cha',
    },
  });

  const createData = async (values: any) => {
    const data = {
      name: values.name,
      idRole: createIdRole,
      permissions: createPermission,
    };
    console.log(data);

    if (createIdRole && createIdRole != undefined && createIdRole != -1) {
      const res = await RequestAPI({
        url: PathAPI.company + 'role',
        method: 'POST',
        payload: data,
      });
      ExitFunc();
      let number = 1;
      setCount(count + number);
    } else {
      notify({
        type: 'error',
        message: 'Bạn chưa chọn vai trò cha!',
      });
    }
  };

  const editData = async (values: any) => {
    const data = {
      name: values.name,
      idRole: createIdRole,
      permissions: createPermission,
    };

    await RequestAPI({
      url: PathAPI.company + 'role' + '/' + idupdate,
      method: 'PATCH',
      payload: data,
    });
    setOpenEditModal(!openEditModal);
    reload();
  };

  const DeleteTask = async () => {
    await RequestAPI({
      url: PathAPI.company + 'role' + '/' + idTask,
      method: 'DELETE',
      notify: {
        type: 'success',
        message: 'Xóa nhiệm vụ thành công',
      },
    });
    setDeleted(false);
    RequestAPI({
      url: PathAPI.company + 'role',
      method: 'GET',
      params: {
        page: page,
        limit: limit,
      },
    }).then((res: any) => {
      if (res.data.length == 0) {
        const total = res.total;
        handlePaging(Math.ceil(total / limit));
        console.log(Math.ceil(total / limit));

        setIsLoading(false);
      } else {
        setRole(res.data);
        const total = res.total;
        setArrLength(Math.ceil(total / limit));
        setIsLoading(false);
      }
    });
    let number = 1;
    setCount(count + number);
  };

  const getDataEdit = async (id: Number) => {
    setOpenEditModal(true);

    const res = await RequestAPI({
      url: PathAPI.company + 'role' + '/' + id,
      method: 'GET',
    });

    let data = allRole.find((value: any) => {
      return value.idRole == res.data.parent;
    });

    if (data != undefined) {
      setCreateidrole(res.data.parent);
      setlistPermissionsName(data);
      setcreatePermission(data.permissions);
    } else if (data == null) {
      // notify({
      //     type: 'error',
      //     message: 'Bạn đang là vai trò lớn nhất',
      // });
    } else {
      notify({
        type: 'error',
        message: 'Vai trò cha bạn đang chọn đang không có nhiệm vụ',
      });
    }
  };

  const checkMissions = (e: Number) => {
    let data = allRole.find((value: any) => {
      return value.idRole == Number(e);
    });

    if (data != undefined) {
      setCreateidrole(Number(e));
      setlistPermissionsName(data);
      setcreatePermission(data.permissions);
    } else {
      notify({
        type: 'error',
        message: 'Vai trò cha bạn đang chọn đang không có nhiệm vụ',
      });
    }
  };

  const handlePaging = (page: number) => {
    SetPage(page);
    RequestAPI({
      url: PathAPI.company + 'role',
      method: 'GET',
      params: {
        page: page,
        limit: limit,
      },
    }).then((res: any) => {
      const total = res.total;
      setArrLength(Math.ceil(total / limit));
      setRole(res.data);
      setIsLoading(false);
    });
  };

  const ExitFunc = () => {
    setOpenAddModal(!openAddModal);
    addForm.setFieldValue('name', '');
    setCreateidrole(-1);
    setlistPermissionsName({});
    setcreatePermission({});
  };

  const ExitFuncedit = () => {
    setOpenEditModal(!openEditModal);
    addForm.setFieldValue('name', '');
    setCreateidrole(-1);
    setlistPermissionsName({});
    setcreatePermission({});
  };

  const reload = () => {
    RequestAPI({
      url: PathAPI.company + 'role',
      method: 'GET',
      params: {
        page: page,
        limit: 10,
      },
    }).then((res: any) => {
      setIdrole(userDataFormRedux.idRole);
      // lấy idRole đang đăng nhập

      const total = res.total;
      setArrLength(Math.ceil(total / limit));
      setRole(res.data);
      setIsLoading(false);
      SetNamerole(constantFormRedux.role?.permissionName);
    });
  };

  useEffect(() => {
    reload();
    RequestAPI({
      url: PathAPI.company + 'role',
      method: 'GET',
      params: {
        page: 1,
        limit: 300,
      },
    }).then((res: any) => {
      setAllrole(res.data);
      const Idchildren = res.data.find((element: any) => {
        return element.idRole === IdRole;
      });
      // lấy data đang đang đăng nhập

      const dataChildren = Idchildren.children.map((key: Number) => {
        const children = res.data.find((element: any) => {
          return element.idRole === key;
        });
        return children;
      });
      // lấy thằng con data đang đăng nhập

      setChoice(dataChildren);
    });
  }, [count]);

  return (
    <>
      <div>
        <div className='flex'>
          <Breadcrumb />
          <Button
            className='m-4 flex justify-center items-center px-4 py-1 text-sm'
            onClick={() => {
              return setOpenAddModal(true);
            }}
          >
            <Add size='32' className='text-white' variant='Outline' />
            <p className='text-white'>Thêm mới</p>
          </Button>
        </div>
        <div className='mt-8'>
          <Table
            loading={isLoading}
            dataSource={{
              columns: [
                {
                  title: 'Cấp',
                },
                {
                  title: 'Vai trò',
                },
                {
                  title: 'Vai trò cha',
                  // size: 100,
                },
                {
                  title: 'Nhiệm vụ',
                  // size: 500,
                },
                {
                  title: 'Hành động',
                },
              ],
              data: role.map((key, index) => {
                const permissionsName = key.permissionsName;
                const parent = allRole.find((roleItem: any) => roleItem.idRole === key.parent);

                let parentName = null;
                if (parent) parentName = parent.name;

                return {
                  rank: key.rank == 0 ? '0' : key.rank,
                  name: key.name,
                  parent: parentName,
                  permissionsName: permissionsName.length ? (
                    <MultiSelect
                      required
                      className=' '
                      radius={15}
                      defaultValue={permissionsName.slice(0, 4)}
                      rightSection={
                        <ArrowDown2
                          size={20}
                          color='currentColor'
                          variant='Bold'
                          style={{ color: '#017efa' }}
                          className={` ${permissionsName.length > 6 ? '' : 'hidden'}`}
                        />
                      }
                      classNames={{
                        wrapper: 'wrapper',
                        defaultValue:
                          'px-8 py-5 rounded-lg tracking-[1px] text-xl bg-ct-secondary text-white  px-4 py-1 text-sm ',
                        defaultValueRemove: 'hidden',
                        defaultVariant: 'border-none',
                        root: 'root',
                        input: 'bg-transparent',
                      }}
                      clearable={false}
                      data={permissionsName}
                      styles={{ rightSection: { pointerEvents: 'none' } }}
                    />
                  ) : (
                    ''
                  ),
                  edit:
                    key.rank == 0 ? (
                      ''
                    ) : (
                      <div className='flex'>
                        <div style={{ marginLeft: '10px' }} className='mr-2 text-ct-red-300'>
                          <Trash
                            size='20'
                            color='currentColor'
                            variant='Bold'
                            onClick={() => {
                              setTask(key.idRole);
                              setDeleted(true);
                            }}
                          />
                        </div>
                        <div className='text-ct-secondary'>
                          <Edit2
                            onClick={() => {
                              getDataEdit(key.idRole), setIdupdate(key.idRole);
                              editForm.setFieldValue('name', key.name);
                              editForm.setFieldValue('role', '' + key.parent);
                            }}
                            size='20'
                            color='currentColor'
                            variant='Bold'
                          />
                        </div>
                      </div>
                    ),
                };
              }),
            }}
          />
          <div className='flex justify-end mt-4'>
            <Pagination handlePaging={handlePaging} total={arrLength} />
          </div>
        </div>
      </div>
      <Modal
        hideCloseButton
        centered
        opened={openAddModal}
        onClose={() => ExitFunc()}
        radius={20}
        size={700}
        // classNames={{
        //   inner: 'py-20',
        // }}
      >
        <div className='w-full flex items-center mt-4 ml-4'>
          <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
            <Graph size={20} color='white' />
          </h6>{' '}
          <p className='font-bold text-xl ml-4 mb-2'>Thêm vai trò</p>
        </div>
        <form onSubmit={addForm.onSubmit((values) => createData(values))} className='h-full'>
          <div className='flex w-full flex-wrap px-12'>
            <div className='w-full'>
              <TextInput
                {...addForm.getInputProps('name')}
                className='mt-6 mx-2'
                type='text'
                placeholder='Nhập tên vai trò'
                label='Nhập tên vai trò'
                radius={10}
                size='md'
                icon={<User size='20' color='currentColor' variant='Bold' />}
              />
            </div>
            <div className='w-full'>
              <Select
                className='mt-6 mx-2 select-none'
                placeholder='Chọn vai trò cha'
                label='Chọn vai trò cha'
                radius={10}
                size='md'
                icon={<Edit size='20' color='currentColor' variant='Outline' />}
                rightSection={<ArrowDown2 size={20} color='currentColor' variant='Bold' />}
                styles={{ rightSection: { pointerEvents: 'none' } }}
                data={choice?.map((item: any) => {
                  item['label'] = item.name;
                  item['value'] = '' + item.idRole;
                  return item;
                })}
                onChange={(e: any) => {
                  checkMissions(e);
                }}
              />
            </div>
            <div className='w-full m-2 mt-6'>
              <div className='font-semibold mb-1.5 text-base'>Chọn nhiệm vụ</div>
              <div
                className={`text-rose-600 ${
                  listPermissionsName.permissionsName?.length > 0 ? 'hidden' : ' '
                }`}
              >
                * Vui lòng chọn vai trò cha để chọn nhiệm vụ
              </div>
              <div
                className={`w-full h-auto border rounded-xl mb-1.5 ${
                  listPermissionsName.permissionsName?.length > 0 ? '' : 'hidden'
                }`}
              >
                {listPermissionsName.permissionsName ? (
                  <div>
                    <Checkbox
                      label='Tất cả'
                      checked={isCheckAllTask}
                      classNames={{
                        root: 'mx-2 py-4 border-b flex justify-between',
                        inner: 'order-2',
                        label: 'text-base font-medium w-full',
                      }}
                    />
                    <div className=' mx-2 '>
                      <ScrollArea style={{ height: 300 }}>
                        <div className='w=full'>
                          {listPermissionsName.permissionsName?.map((item: any) => {
                            let matchedName: string;

                            for (const key in namerole) {
                              if (namerole[key] == item) {
                                matchedName = key;
                              }
                            }

                            return (
                              <div className=' p-2'>
                                <Accordion>
                                  <Accordion.Item
                                    icon={
                                      <ArrowDown2 size={20} color='currentColor' variant='Bold' />
                                    }
                                    label={item}
                                    classNames={{
                                      label: 'font-normal',
                                      icon: 'order-2 ',
                                    }}
                                  >
                                    <div className='border-t w-full'>
                                      {Missions.map((missionItem: any) => {
                                        return (
                                          <Checkbox
                                            label={missionItem.name}
                                            classNames={{
                                              root: ' py-4 flex justify-between',
                                              inner: 'order-2',
                                              label: 'w-full',
                                            }}
                                            defaultChecked={
                                              listPermissionsName.permissions[matchedName][
                                                missionItem.key
                                              ]
                                            }
                                            disabled={
                                              listPermissionsName.permissions[matchedName][
                                                missionItem.key
                                              ] === false
                                            }
                                            checked={missionItem.checked}
                                            onChange={(e: any) => {
                                              listPermissionsName.permissions[matchedName][
                                                missionItem.key
                                              ] = e.currentTarget.checked;
                                            }}
                                          />
                                        );
                                      })}
                                    </div>
                                  </Accordion.Item>
                                </Accordion>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                ) : (
                  <Loading />
                )}
              </div>
            </div>
          </div>
          <div className='mx-auto w-fit mt-8 '>
            <Button
              // className='m-4'
              variant='outline'
              onClick={() => ExitFunc()}
            >
              Hủy
            </Button>
            <Button className='ml-4' type='submit'>
              Tạo mới
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        hideCloseButton
        centered
        opened={openEditModal}
        onClose={() => ExitFuncedit()}
        radius={20}
        size={700}
        classNames={
          {
            // modal: 'h-full',
          }
        }
      >
        <div className='w-full flex items-center mt-4 ml-4'>
          <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
            <Graph size={20} color='white' />
          </h6>{' '}
          <p className='font-bold text-xl ml-4 mb-2'>Thêm vai trò</p>
        </div>
        <form onSubmit={editForm.onSubmit((values) => editData(values))}>
          <div className='flex w-full flex-wrap px-12'>
            <div className='w-full'>
              <TextInput
                {...editForm.getInputProps('name')}
                className='mt-4 mx-2'
                type='text'
                placeholder='Nhập tên vai trò'
                label='Nhập tên vai trò'
                radius={10}
                size='md'
                icon={<User size='20' color='currentColor' variant='Bold' />}
              />
            </div>
            <div className='w-full'>
              <Select
                // {...editForm.getInputProps('role')}
                className='mt-4 mx-2 select-none'
                placeholder='Chọn vai trò cha'
                label='Chọn vai trò cha'
                radius={10}
                size='md'
                icon={<Edit size='20' color='currentColor' variant='Outline' />}
                rightSection={<ArrowDown2 size={20} color='currentColor' variant='Bold' />}
                styles={{ rightSection: { pointerEvents: 'none' } }}
                data={choice?.map((item: any) => {
                  const roleItem = {
                    label: '',
                    value: '',
                  };
                  roleItem.label = item.name;
                  roleItem.value = '' + item.idRole;
                  return roleItem;
                })}
                disabled
                defaultValue={editForm.values.role}
                onChange={(e: any) => {
                  checkMissions(e);
                }}
              />
            </div>
            <div className='w-full m-2'>
              <div className='font-semibold mb-1.5 text-base'>Chọn nhiệm vụ</div>
              <div
                className={`text-rose-600 ${
                  listPermissionsName.permissionsName?.length > 0 ? 'hidden' : ' '
                }`}
              >
                * Vui lòng chọn vai trò cha để chọn nhiệm vụ
              </div>
              <div
                className={`w-full h-auto border rounded-xl mb-1.5 ${
                  listPermissionsName.permissionsName?.length > 0 ? '' : 'hidden'
                }`}
              >
                <Checkbox
                  label='Tất cả'
                  checked={isCheckAllTask}
                  classNames={{
                    root: 'mx-2 py-4 border-b flex justify-between',
                    inner: 'order-2',
                    label: 'text-base font-medium w-full',
                  }}
                />
                <div className=' mx-2 '>
                  <ScrollArea style={{ height: 300 }}>
                    <div className='w=full'>
                      {listPermissionsName.permissionsName?.map((item: any) => {
                        let matchedName: string;

                        for (const key in namerole) {
                          if (namerole[key] == item) {
                            matchedName = key;
                          }
                        }

                        return (
                          <div className=' p-2'>
                            <Accordion>
                              <Accordion.Item
                                icon={<ArrowDown2 size={20} color='currentColor' variant='Bold' />}
                                label={item}
                                classNames={{
                                  label: 'font-normal',
                                  icon: 'order-2 ',
                                }}
                              >
                                <div className='border-t w-full'>
                                  {Missions.map((missionItem: any) => {
                                    return (
                                      <Checkbox
                                        label={missionItem.name}
                                        classNames={{
                                          root: ' py-4 flex justify-between',
                                          inner: 'order-2',
                                          label: 'w-full',
                                        }}
                                        defaultChecked={
                                          listPermissionsName.permissions[matchedName][
                                            missionItem.key
                                          ]
                                        }
                                        disabled={
                                          listPermissionsName.permissions[matchedName][
                                            missionItem.key
                                          ] === false
                                        }
                                        checked={missionItem.checked}
                                        onChange={(e: any) => {
                                          listPermissionsName.permissions[matchedName][
                                            missionItem.key
                                          ] = e.currentTarget.checked;
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
          <div className='mx-auto w-fit mt-8'>
            <Button className='m-4' variant='outline' onClick={() => ExitFuncedit()}>
              Hủy
            </Button>
            <Button className='m-4' type='submit'>
              Cập nhật
            </Button>
          </div>
        </form>
      </Modal>

      <Modal opened={deleted} onClose={() => setDeleted(false)} hideCloseButton={true} radius={15}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Xác nhận xóa vai trò
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          <p>Bạn có chắc muốn xoá vai trò này?</p>
          <p> Tất cả các vai trò nằm dưới quyền của vai trò này cũng sẽ bị xóa</p>
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button variant='outline' color='#017EFA' onClick={() => setDeleted(false)}>
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              style={{ backgroundColor: '#017EFA' }}
              onClick={() => DeleteTask()}
            >
              {' '}
              Đồng ý{' '}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ManageTask;
