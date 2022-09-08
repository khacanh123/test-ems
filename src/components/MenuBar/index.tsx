import { Avatar, Input, Menu } from '@mantine/core';
import { ArrowDown2, LogoutCurve, Notification, SearchNormal1 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Menubar = () => {
  const routerCurrent = useLocation();
  const [routeActive, setRouteActive] = useState<string>('Dashboard');

  useEffect(() => {
    if (routerCurrent.pathname.includes('/manage-account')) {
      setRouteActive('Quản lý tài khoản');
    } else if (routerCurrent.pathname.includes('/manage-question')) {
      setRouteActive('Quản lý câu hỏi');
    } else {
      switch (routerCurrent.pathname) {
        case '/dashboard':
          setRouteActive('Dashboard');
          break;
        case '/report-test':
          setRouteActive('Báo cáo kiểm tra');
          break;
        case '/history':
          setRouteActive('Lịch sử làm bài');
          break;
        // case '/manage-account':
        //     setRouteActive('Quản lý tài khoản');
        //     break;
        case '/manage-banner':
          setRouteActive('Quản lý banner');
          break;
        case '/manage-topic':
          setRouteActive('Quản lý đề bài');
          break;
        case '/manage-course':
          setRouteActive('Quản lý khóa học');
          break;
        case '/manage-hsa':
          setRouteActive('Quản lý cuộc thi');
          break;
        default:
          setRouteActive('Dashboard');
          break;
      }
    }
  }, [routerCurrent.pathname]);
  return (
    <>
      {/* Navbar */}
      <nav className='w-full bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center'>
        <div className='w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 h-[90px] px-24 py-6 bg-white'>
          {/* Brand */}
          <div
            className={`text-black font-['Be Vietnam Pro'] font-bold text-2xl uppercase hidden lg:inline-block`}
            style={{ fontWeight: '900' }}
          >
            {routeActive}
          </div>
          <div className='md:flex flex flex-nowrap flex-row items-center lg:ml-auto mr-3'>
            <div className='relative flex w-full flex-wrap items-stretch'>
              <Input
                className='mx-2'
                styles={{
                  input: {
                    border: '2px solid #E3E8F1',
                    backgroundColor: '#F5F7FB',
                    height: '40px',
                  },
                }}
                radius={8}
                icon={<SearchNormal1 size='20' color='currentColor' />}
                placeholder='Search ...'
              />
            </div>
            <div className='w-[2px] h-10 bg-ct-gray-200 mx-2'></div>
            {/* User */}
            <ul className='flex-col md:flex-row list-none items-center hidden md:flex'>
              <div className='rounded-full p-[10px] mx-2 bg-[#EAECF2] relative'>
                <div className='bg-ct-red-500 w-2 h-2 rounded-full absolute right-2'></div>
                <Notification size='20' color='currentColor' />
              </div>

              <Menu
                radius={10}
                control={
                  <div className='user flex w-max items-center'>
                    <Avatar
                      src='https://picsum.photos/200'
                      size={40}
                      radius='xl'
                      className='mx-2'
                    />
                    <p className='font-bold'>Super Admin</p>
                    <ArrowDown2 size='25' color='currentColor' className='pl-3' />
                  </div>
                }
              >
                <Menu.Item
                  onClick={() => {
                    localStorage.removeItem('tk');
                    window.location.href = '/';
                  }}
                  icon={<LogoutCurve size='25' color='currentColor' className='pl-3' />}
                  className='hover:bg-ct-blue-300 hover:text-white'
                >
                  Đăng xuất
                </Menu.Item>
              </Menu>

              {/* <UserDropdown /> */}
            </ul>
          </div>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
};

export default Menubar;
