const AuthLayout = ({ children }: any) => {
  return (
    <>
      <main className='h-screen'>
        <section className='w-full h-full min-h-screen'>
          <div className='w-full h-full flex items-center justify-center'>{children}</div>
        </section>
      </main>
    </>
  );
};

export default AuthLayout;
