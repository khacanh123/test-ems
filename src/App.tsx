import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { ToastContainer } from 'react-toastify';
import Router from 'router';

dayjs.locale('vi'); // use locale globally
dayjs().locale('vi').format();

const App = () => {
  return (
    <div className='App'>
      <ToastContainer />
      <Router />
    </div>
  );
};

export default App;
