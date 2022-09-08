import Menubar from 'components/MenuBar';
import Sidebar from 'components/SideBar';
import { FunctionComponent } from 'react';

const BaseLayout: FunctionComponent = ({ children }: any) => {
  return (
    <div className='flex w-[calc(100vw-14px)] relative z-0'>
      <Sidebar />
      <div className='bg-[#F7F8FE] grow  w-full overflow-auto'>
        <Menubar />
        <div
          className='bg-white rounded-lg m-9 px-8 py-5'
          style={{ boxShadow: '0px 5px 10px 0px #F1F2FA' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
