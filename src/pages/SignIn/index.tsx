import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { loginRequest } from 'api';
import LogoHOCMAI from 'assets/emslogowhite.svg';
import { useDispatch } from 'react-redux';

const SignInContainer = () => {
  const dispatch = useDispatch();
  const loginForm = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: (value: string) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ),
      password: (value: string) => value.length >= 1,
    },
    errorMessages: {
      email: 'Vui lòng nhập email',
      password: 'Vui lòng nhập mật khẩu',
    },
  });
  const handleLogin = (formValues: any) => {
    dispatch(loginRequest(formValues));
  };
  return (
    <>
      <div className='h-full w-full flex bg-[#F8F9FF]'>
        <div className='w-2/5 bg-ct-primary'>
          <div className='h-full flex justify-center flex-col'>
            <img className='mx-auto w-60' src={LogoHOCMAI} alt='' />
          </div>
        </div>
        <div className='flex  w-full h-full justify-center items-center'>
          <form
            className='bg-white w-fit h-fit p-20'
            onSubmit={loginForm.onSubmit((values) => handleLogin(values))}
          >
            <p className='text-2xl uppercase font-bold mb-4'>Đăng Nhập</p>
            <div className='relative w-full mb-3'>
              <label
                className='block uppercase text-blueGray-600 text-xs font-bold mb-2'
                htmlFor='grid-password'
              >
                Tài khoản
              </label>
              <TextInput
                className='w-[400px]'
                type='email'
                placeholder='your@hocmai.com'
                {...loginForm.getInputProps('email')}
              />
            </div>

            <div className='relative w-full mb-3'>
              <label
                className='block uppercase text-blueGray-600 text-xs font-bold mb-2'
                htmlFor='grid-password'
              >
                Mật khẩu
              </label>
              <TextInput
                type='password'
                placeholder='Mật khẩu'
                {...loginForm.getInputProps('password')}
              />
            </div>
            <div className='text-center mt-6'>
              <button
                className='bg-ct-secondary text-white active:bg-blueGray-600 text-sm font-bold uppercase px-10 py-2 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-fit ease-linear transition-all duration-150'
                type='submit'
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignInContainer;
