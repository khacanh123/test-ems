import './styles.css';
import { useNavigate } from 'react-router-dom';
const DropdownCustom = (props: any) => {
  const AddNewTest = () => {
    const data = {
      idCourse: null,
      idUnit: null,
      idSection: null,
      idLesson: props.idLesson,
      idClip: null,
    };
    localStorage.setItem('addTest', JSON.stringify(data));
    localStorage.setItem('idCourse', JSON.stringify(parseInt(props.idCourse)));
    navigate('/manage-topic/create');
  };
  const AddNewTest2 = () => {
    const data = {
      idCourse: null,
      idUnit: null,
      idSection: props.idSection,
      idLesson: props.idLesson,
      idClip: null,
    };
    localStorage.setItem('addTest', JSON.stringify(data));
    localStorage.setItem('idCourse', JSON.stringify(parseInt(props.idCourse)));
    navigate('/manage-course/add-test');
  };
  const AddNewTest3 = () => {
    const data = {
      idCourse: null,
      idUnit: null,
      idSection: props.idSection,
      idLesson: props.idLesson,
      idClip: null,
    };
    localStorage.setItem('addTest', JSON.stringify(data));
    localStorage.setItem('idCourse', JSON.stringify(parseInt(props.idCourse)));
    navigate('/manage-course/add-HSA');
  };
  const navigate = useNavigate();
  return (
    <div className='dropdown'>
      <button className='dropbtn'>Thêm bài kiểm tra</button>
      <div className='dropdown-content'>
        <div>
          <p
            className='hover:bg-ct-secondary cursor-pointer hover:text-white p-1 pl-8'
            onClick={() => AddNewTest()}
          >
            Thêm mới bài kiểm tra
          </p>
        </div>
        <div>
          <p
            className='hover:bg-ct-secondary cursor-pointer hover:text-white p-1 pl-8'
            onClick={() => AddNewTest2()}
          >
            Bài kiểm tra thường
          </p>
        </div>
        <div>
          <p
            className='hover:bg-ct-secondary cursor-pointer hover:text-white p-1 pl-8'
            onClick={() => AddNewTest3()}
          >
            Luyện tập HSA
          </p>
        </div>
      </div>
    </div>
  );
};
export default DropdownCustom;
