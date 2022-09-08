import { Modal, NumberInput, PasswordInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Button from 'components/Button';
import Pagination from 'components/Pagination';
import Table from 'components/Table';

import { Add, Edit, Edit2, Graph, SearchNormal1, ShieldSecurity, Trash, User } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { notify } from 'utils/notify';

const ManageAccountContainer = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagiantion] = useState<any>({
    active: 1,
    pageSize: 10,
    total: 1,
  });
  const [account, setAccount] = useState<any>([]);
  const [role, setRole] = useState<any>([]);
  const [idrole, setIdrole] = useState<Number>(0);
  const [iduser, setIduser] = useState<Number>(1);
  const [nameuser, setNameuser] = useState<String>();

  const addForm = useForm({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      username: (values: string) => values !== '',
      password: (values: string) => values !== '',
      confirmPassword: (value: string, values: any) =>
        value.trim().length > 0 && value === values.password,
    },
    errorMessages: {
      username: 'Bạn chưa nhập tên tài khoản',
      password: 'Bạn chưa nhập mật khẩu',
      confirmPassword: 'Mật khẩu không khớp',
    },
  });

  const editForm = useForm({
    initialValues: {
      username: '',
      role: '1',
    },
    validationRules: {
      username: (value: string) => value.trim().length > 0,
    },
    errorMessages: {
      username: 'Bạn chưa nhập tên tài khoản',
    },
  });

  const handleCreateAccount = async (values: any) => {
    if (idrole === 0) {
      notify({
        type: 'error',
        message: 'Bạn chưa chọn quyền !',
      });
    } else {
      const data = {
        email: values.username,
        password: values.confirmPassword,
        idRole: idrole,
      };

      await RequestAPI({
        url: PathAPI.company + 'employee',
        method: 'POST',
        payload: data,
      });

      reload();
      setOpenAddModal(false);
    }
  };

  const handleEditAccount = async (values: any) => {
    const data = {
      email: values.username,
      idRole: idrole,
    };
    await RequestAPI({
      url: PathAPI.company + 'employee' + '/' + iduser,
      method: 'PATCH',
      payload: data,
    });
    reload();
    setOpenEditModal(false);
  };

  const DeleteUser = async () => {
    await RequestAPI({
      url: PathAPI.company + 'employee' + '/' + iduser,
      method: 'DELETE',
    });
    reload();
    setDeleted(false);
    notify({ type: 'success', message: 'Xoá tài khoản thành công' });
  };

  const reload = () => {
    RequestAPI({
      url: PathAPI.company + 'role',
      method: 'GET',
      params: {
        page: 1,
        limit: 100,
      },
    }).then((res: any) => {
      setRole(res.data);
    });

    RequestAPI({
      url: PathAPI.company + 'employee',
      method: 'GET',
    }).then((res: any) => {
      setAccount(res.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <>
      <div>
        <div className='flex'>
          <Breadcrumb />
          <Button
            className='m-4 flex justify-center items-center px-4 py-1 text-sm'
            onClick={() => {
              reload();
              setIdrole(0);
              addForm.setFieldValue('username', '');
              addForm.setFieldValue('password', '');
              addForm.setFieldValue('confirmPassword', '');
              setOpenAddModal(true);
            }}
          >
            <Add size='32' color='#FFF' variant='Outline' />
            <p className='text-white'>Thêm mới</p>
          </Button>
        </div>
        {/* <div className='flex justify-between items-center mt-8'>
                    <NumberInput
                        radius='md'
                        label='Số hàng mỗi trang'
                        value={pagination.pageSize}
                        onChange={(value: number) => {
                            setPagiantion({ ...pagination, pageSize: value });
                        }}
                        classNames={{
                            controlUp: 'border-none text-ct-secondary',
                            controlDown: 'border-none text-ct-secondary',
                        }}
                        step={10}
                        max={100}
                        min={10}
                    />
                    <TextInput
                        label=' '
                        radius='md'
                        icon={<SearchNormal1 size='20' color='currentColor' />}
                        placeholder='Search ...'
                    />
                </div> */}
        <div className='mt-8'>
          <Table
            loading={isLoading}
            dataSource={{
              columns: [
                {
                  title: 'Nhân viên',
                },
                {
                  title: 'Vai trò',
                },
                {
                  title: 'Hành động',
                },
              ],
              data: account?.map((item: any) => {
                const nameRole = role.find((element: any) => {
                  return element.idRole === item.idRole;
                });
                if (nameRole != undefined) {
                  item.role = nameRole;
                } else {
                  item.role = {};
                }

                return {
                  email: item.email,
                  role: (
                    <button className='bg-[#017EFA] p-2 rounded-lg text-white font-medium'>
                      {item?.role.name}
                    </button>
                  ),
                  edit: (
                    <div className='flex'>
                      <div
                        onClick={() => {
                          setIduser(item.idUser);
                          editForm.setFieldValue('username', item.email);
                          editForm.setFieldValue('role', '' + item.role.idRole);
                          setOpenEditModal(true);
                        }}
                        className='text-ct-secondary'
                      >
                        <Edit2 size='20' color='currentColor' variant='Bold' />
                      </div>
                      <div style={{ marginLeft: '10px' }} className='mr-2 text-ct-red-300'>
                        <Trash
                          size='20'
                          color='currentColor'
                          variant='Bold'
                          onClick={() => {
                            setNameuser(item.email);
                            setIduser(item.idUser);
                            setDeleted(true);
                          }}
                        />
                      </div>
                    </div>
                  ),
                };
              }),
            }}
          />
          {/* <div className='flex justify-end mt-4'>
                        <Pagination
                            handlePaging={handlePaging}
                            total={
                                pagination.total / pagination.pageSize > 0
                                    ? Math.ceil(pagination.total / pagination.pageSize)
                                    : 1
                            }
                        />
                    </div> */}
        </div>
      </div>
      <Modal
        hideCloseButton
        centered
        opened={openAddModal}
        onClose={() => setOpenAddModal(!openAddModal)}
        radius={20}
        size={700}
      >
        <div className='w-full flex items-center mt-4 ml-4'>
          <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
            <Graph size={20} color='white' />
          </h6>{' '}
          <p className='font-bold text-xl ml-4 mb-2'>Thêm tài khoản mới</p>
        </div>
        <form onSubmit={addForm.onSubmit((values) => handleCreateAccount(values))}>
          <div className='flex w-full flex-wrap px-12'>
            <div className='w-1/2'>
              <TextInput
                {...addForm.getInputProps('username')}
                className='mt-4 mx-2'
                type='text'
                placeholder='Email'
                radius={10}
                size='md'
                icon={<User size='20' color='currentColor' variant='Bold' />}
              />
            </div>
            <div className='w-1/2'>
              <PasswordInput
                {...addForm.getInputProps('password')}
                className='mt-4 mx-2'
                placeholder='Mật khẩu'
                radius={10}
                size='md'
                icon={<ShieldSecurity size='20' color='currentColor' variant='Bold' />}
              />
            </div>
            <div className='w-1/2'>
              <Select
                className='mt-4 mx-2'
                placeholder='Chọn quyền'
                radius={10}
                size='md'
                icon={<Edit size='20' color='currentColor' variant='Outline' />}
                data={role?.map((item: any) => {
                  item['label'] = item.name;
                  item['value'] = '' + item.idRole;
                  item['key'] = item.name;
                  return item;
                })}
                onChange={(e: any) => {
                  setIdrole(Number(e));
                }}
              />
            </div>
            <div className='w-1/2'>
              <PasswordInput
                {...addForm.getInputProps('confirmPassword')}
                className='mt-4 mx-2'
                placeholder='Xác nhận mật khẩu'
                radius={10}
                size='md'
                icon={<ShieldSecurity size='20' color='currentColor' variant='Bold' />}
              />
            </div>
          </div>
          <div className='mx-auto w-fit mt-8'>
            <Button className='m-4' variant='outline' onClick={() => setOpenAddModal(false)}>
              Hủy
            </Button>
            <Button className='m-4' type='submit'>
              Tạo mới
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        hideCloseButton
        centered
        opened={openEditModal}
        onClose={() => setOpenEditModal(!openEditModal)}
        radius={20}
        size={700}
      >
        <div className='w-full flex items-center mt-4 ml-4'>
          <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
            <Graph size={20} color='white' />
          </h6>{' '}
          <p className='font-bold text-xl ml-4 mb-2'>Sửa tài khoản</p>
        </div>
        <form onSubmit={editForm.onSubmit((values) => handleEditAccount(values))}>
          <div className='flex w-full px-12 mt-6'>
            <div className='flex w-full'>
              <div className='w-1/2'>
                <TextInput
                  disabled
                  {...editForm.getInputProps('username')}
                  value={editForm.values.username}
                  className='mx-2'
                  type='text'
                  placeholder='Tên đăng nhập'
                  radius={10}
                  size='md'
                  icon={<User size='20' color='currentColor' variant='Bold' />}
                />
              </div>
              <div className='w-1/2'>
                <Select
                  className=' mx-2'
                  placeholder='Chọn quyền'
                  radius={10}
                  size='md'
                  icon={<Edit size='20' color='currentColor' variant='Outline' />}
                  data={role?.map((item: any) => {
                    const roleItem = {
                      label: '',
                      value: '',
                    };
                    roleItem.label = item.name;
                    roleItem.value = '' + item.idRole;
                    return roleItem;
                  })}
                  defaultValue={editForm.values.role}
                  onChange={(e: any) => {
                    setIdrole(Number(e));
                  }}
                />
              </div>
            </div>
          </div>
          <div className='mx-auto w-fit mt-8'>
            <Button className='m-4' variant='outline' onClick={() => setOpenEditModal(false)}>
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
          Xác nhận xóa tài khoản
        </div>
        <div className='mt-2 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          <p>
            Bạn có chắc muốn xoá tài khoản nhân viên <span className='font-bold'>{nameuser}</span>
          </p>
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
              onClick={() => DeleteUser()}
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

export default ManageAccountContainer;
