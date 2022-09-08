import { FunctionComponent } from 'react';
import Footer from './Footer';
import Header from './Header';

const TestLayout: FunctionComponent = ({ children }: any) => {
  return (
    <>
      <main className='h-screen'>
        <section className='w-full h-full min-h-screen'>
          <div className='w-full h-full '>
            <Header />
            <div className=' mt-[85px] w-full'>{children}</div>

            <Footer />
          </div>
        </section>
      </main>
    </>
  );
};
export default TestLayout;
