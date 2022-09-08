import { toast } from 'react-toastify';
import { Notify } from 'types';
toast.configure();

export const notify = ({ type, message }: Notify) => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default toast;
