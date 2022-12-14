import { Disclosure } from '@headlessui/react';
import logo from 'assets/emslogowhite.svg';
import {
  ArrowDown2,
  ArrowLeft2,
  Chart,
  Chart1,
  DocumentText,
  FolderOpen,
  MessageEdit,
  MessageQuestion,
  MessageText,
  UserSquare,
} from 'iconsax-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { listRoute } from './route';

const Sidebar = () => {
  const routerCurrent = useLocation();
  const [routeActive, setRouteActive] = useState('/dashboard');
  const [hiddenSideBar, setHiddenSideBar] = useState(true);

  useEffect(() => {
    listRoute.map((item) => {
      if (routerCurrent.pathname.includes(item.path)) {
        setRouteActive(item.path);
      }
    });
  }, [routerCurrent.pathname]);

  return (
    <>
      <nav
        className={`font-['Be Vietnam Pro'] overflow-x-hidden shadow-xl bg-ct-primary flex flex-wrap items-center justify-between min-w-[260px] min-h-screen transition-all duration-200 ease-in-out`}
        style={hiddenSideBar ? { width: '260px' } : { minWidth: 0, width: '0', padding: '20px' }}
      >
        <div
          className='bg-white rounded-full border-2 w-10 h-10 max-w-10 max-h-10 flex justify-center items-center absolute top-10 z-10 transition-all duration-200 ease-in-out'
          style={hiddenSideBar ? { left: '240px' } : { left: '20px', transform: 'rotate(-180deg)' }}
          onClick={() => setHiddenSideBar(!hiddenSideBar)}
        >
          <ArrowLeft2 className='text-ct-blue-400' size='25' color='currentColor' />
        </div>
        <div className='flex-col items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap justify-between w-full mx-auto'>
          <Link to='/dashboard' className='flex justify-center mx-4 my-4'>
            <img className='w-[150px]' src={logo} alt='' />
          </Link>
          <div
            className={
              'md:flex md:flex-col md:items-stretch md:opacity-100 relative md:mt-4 md:shadow-none shadow left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded '
            }
          >
            <p className='md:min-w-full text-ct-blue-300 text-xs uppercase block pb-2 mx-[30px] no-underline'>
              main menu
            </p>

            <ul className='md:flex-col md:min-w-full flex flex-col list-none'>
              <li
                className={`items-center w-full hover:bg-[#1B2B65] ${
                  routeActive == '/dashboard' ? 'bg-[#1b2b65]' : ''
                }`}
              >
                <Link
                  to='/dashboard'
                  className={`text-xs text-white py-[6px] leading-5 flex items-center w-full`}
                >
                  {routeActive == '/dashboard' ? (
                    <Chart1
                      size='24'
                      className='m-[10px] ml-8'
                      color='currentColor'
                      variant={'Bold'}
                    />
                  ) : (
                    <Chart
                      size='24'
                      className='m-[10px] ml-8'
                      color='currentColor'
                      variant='Outline'
                    />
                  )}
                  Dashboard
                </Link>
              </li>
            </ul>

            {/* Heading */}
            <p className='md:min-w-full text-ct-blue-300 text-xs uppercase block py-2 mx-[30px] no-underline'>
              report
            </p>
            {/* Navigation */}
            <ul className='md:flex-col md:min-w-full flex flex-col list-none '>
              <li
                className={`items-center w-full hover:bg-[#1B2B65] ${
                  routeActive == '/report-test' ? 'bg-[#1b2b65]' : ''
                }`}
              >
                <Link
                  to='/report-test'
                  className={`text-xs text-white py-[6px] leading-5 flex items-center w-full`}
                >
                  <MessageText
                    size='24'
                    className='m-[10px] ml-8'
                    color='currentColor'
                    variant={routeActive == '/report-test' ? 'Bold' : 'Linear'}
                  />
                  B??o c??o ki???m tra
                </Link>
              </li>
              <li
                className={`items-center w-full hover:bg-[#1B2B65] ${
                  routeActive == '/history' ? 'bg-[#1b2b65]' : ''
                }`}
              >
                <Link
                  to='/history'
                  className={`text-xs text-white py-[6px] leading-5 flex items-center w-full`}
                >
                  <MessageEdit
                    size='24'
                    className='m-[10px] ml-8'
                    color='currentColor'
                    variant={routeActive == '/history' ? 'Bold' : 'Linear'}
                  />
                  L???ch s??? l??m b??i
                </Link>
              </li>
            </ul>
            {/* Heading */}
            <p className='md:min-w-full text-ct-blue-300 text-xs uppercase block py-2 mx-[30px] no-underline'>
              qu???n l??
            </p>
            {/* Navigation */}
            <ul className='md:flex-col md:min-w-full flex flex-col list-none '>
              <li className='items-center w-full'>
                <div className={'text-xs text-white py-[6px] leading-5 w-full'}>
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`flex justify-start items-center w-full py-2 text-left hover:bg-[#1B2B65] ${
                            routeActive.includes('/manage-account') ? 'bg-[#1b2b65]' : ''
                          }`}
                        >
                          <UserSquare
                            size='24'
                            className='m-[10px] ml-8'
                            color='currentColor'
                            variant={routeActive.includes('/manage-account') ? 'Bold' : 'Outline'}
                          />
                          <span>Qu???n l?? t??i kho???n</span>
                          <ArrowDown2
                            className={`${
                              open ? 'transform rotate-180' : ''
                            } w-5 h-5 ml-12 p-[2px]`}
                            color='currentColor'
                          />
                        </Disclosure.Button>
                        <Link to={'/manage-account/account'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive.includes('/manage-account/account') ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            Qu???n l?? t??i kho???n
                          </Disclosure.Panel>
                        </Link>
                        <Link to={'/manage-account/task'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              // routeActive.includes('/manage-account/task')
                              //     ? 'bg-[#1b2b65]'
                              //     : ''
                              routeActive == '/manage-account/task' ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            Qu???n l?? nhi???m v???
                          </Disclosure.Panel>
                        </Link>
                      </>
                    )}
                  </Disclosure>
                </div>
              </li>
              <li className='items-center w-full'>
                <div className={'text-xs text-white py-[6px] leading-5 w-full'}>
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`flex justify-start items-center w-full py-2 text-left hover:bg-[#1B2B65] ${
                            routeActive.includes('/manage-question') ? 'bg-[#1b2b65]' : ''
                          }`}
                        >
                          <MessageQuestion
                            size='24'
                            className='m-[10px] ml-8'
                            color='currentColor'
                            variant={routeActive.includes('/manage-question') ? 'Bold' : 'Outline'}
                          />
                          <span>Qu???n l?? c??u h???i</span>
                          <ArrowDown2
                            className={`${
                              open ? 'transform rotate-180' : ''
                            } w-5 h-5 ml-12 p-[2px]`}
                            color='currentColor'
                          />
                        </Disclosure.Button>
                        <Link to={'/manage-question/question'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive == '/manage-question/question' ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            C??u h???i
                          </Disclosure.Panel>
                        </Link>
                        <Link to={'/manage-question/grade'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive == '/manage-question/grade' ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            Kh???i tr?????ng
                          </Disclosure.Panel>
                        </Link>
                        <Link to={'/manage-question/subject'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive == '/manage-question/subject' ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            M??n h???c
                          </Disclosure.Panel>
                        </Link>
                        <Link to={'/manage-question/class'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive == '/manage-question/class' ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            L???p h???c
                          </Disclosure.Panel>
                        </Link>
                        <Link to={'/manage-question/tag'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive == '/manage-question/tag' ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            Tags
                          </Disclosure.Panel>
                        </Link>
                        <Link to={'/manage-question/knowlege-unit'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive == '/manage-question/knowlege-unit' ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            ????n v??? ki???n th???c
                          </Disclosure.Panel>
                        </Link>
                      </>
                    )}
                  </Disclosure>
                </div>
              </li>
              <li className='items-center w-full'>
                <div className={'text-xs text-white py-[6px] leading-5 w-full'}>
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`flex justify-start items-center w-full py-2 text-left hover:bg-[#1B2B65] ${
                            routeActive.includes('/manage-topic') ? 'bg-[#1b2b65]' : ''
                          }`}
                        >
                          <DocumentText
                            size='24'
                            className='m-[10px] ml-8'
                            color='currentColor'
                            variant={routeActive.includes('/manage-topic') ? 'Bold' : 'Outline'}
                          />
                          <span>Qu???n l?? ????? b??i</span>
                          <ArrowDown2
                            className={`${
                              open ? 'transform rotate-180' : ''
                            } w-5 h-5 ml-12 p-[2px]`}
                            color='currentColor'
                          />
                        </Disclosure.Button>
                        <Link to={'/manage-topic'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive.includes('/manage-topic') ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            T???o ?????
                          </Disclosure.Panel>
                        </Link>
                        <Link to={'/manage-tag-test'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive.includes('/manage-tag-test') ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            Tag c???a ?????
                          </Disclosure.Panel>
                        </Link>
                      </>
                    )}
                  </Disclosure>
                </div>
              </li>
              <li
                className={`items-center w-full hover:bg-[#1B2B65] ${
                  routeActive == '/manage-course' ? 'bg-[#1b2b65]' : ''
                }`}
              >
                <Link
                  to='/manage-course'
                  className={`text-xs text-white py-[6px] leading-5 flex items-center w-full`}
                >
                  <FolderOpen
                    size='24'
                    className='m-[10px] ml-8'
                    color='currentColor'
                    variant={routeActive == '/manage-course' ? 'Bold' : 'Linear'}
                  />
                  Qu???n l?? kh??a h???c
                </Link>
              </li>
              <li className='items-center w-full'>
                <div className={'text-xs text-white py-[6px] leading-5 w-full'}>
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`flex justify-start items-center w-full py-2 text-left hover:bg-[#1B2B65] ${
                            routeActive.includes('/manage-hsa') ? 'bg-[#1b2b65]' : ''
                          }`}
                        >
                          <DocumentText
                            size='24'
                            className='m-[10px] ml-8'
                            color='currentColor'
                            variant={routeActive.includes('/manage-hsa') ? 'Bold' : 'Outline'}
                          />
                          <span>Qu???n l?? cu???c thi</span>
                          <ArrowDown2
                            className={`${
                              open ? 'transform rotate-180' : ''
                            } w-5 h-5 ml-12 p-[2px]`}
                            color='currentColor'
                          />
                        </Disclosure.Button>
                        <Link to={'/manage-hsa'}>
                          <Disclosure.Panel
                            className={`py-4 pl-[64px] hover:bg-[#1B2B65] ${
                              routeActive.includes('/manage-hsa') ? 'bg-[#1b2b65]' : ''
                            }`}
                          >
                            HSA
                          </Disclosure.Panel>
                        </Link>
                      </>
                    )}
                  </Disclosure>
                </div>
              </li>
            </ul>
          </div>
          {/* just add block always follow bottom. designed layout!*/}
          <></>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
