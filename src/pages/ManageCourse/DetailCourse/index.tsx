import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Collapse from 'components/Collapse';
import { ArrowRotateLeft, Graph, Edit, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './style.css';
import Vector from 'assets/img/Vector.png';
import Ellipse from 'assets/img/Ellipse.png';
import DropdownCustom from './Dropdown';
import { notify } from 'utils/notify';
import { useDispatch } from 'react-redux';
import { updateTestEdit } from 'store/slice/test';
import CourseTree from '../CourseTree';

interface clip {
  id: number;
  title: string;
  listQuiz: listQuiz[];
}
interface lesson {
  id: number;
  title: string;
  clip: clip[];
  listQuiz: listQuiz[];
}
interface section {
  id: number;
  threads: string;
  listLesson: lesson[];
  listQuiz: listQuiz[];
}
interface unit {
  id: number;
  name: string;
  section: section[];
  listQuiz: listQuiz[];
}
interface listQuiz {
  name: string;
  idBaikiemtra: number;
}

const DetailCourse = () => {
  const [listLearning, setListLearning] = useState<unit>();
  const [section, setSection] = useState<never[]>([]);
  const [title, setTitle] = useState<string>();
  const [opened, setOpened] = useState(false);
  const param = useParams();
  useEffect(() => {
    const getData = async () => {
      await RequestAPI({
        url: PathAPI.course + '/detail/' + param.idCourse,
        method: 'GET',
      }).then((res: any) => {
        const data = res.data.courseTree;
        let section: any = [];

        for (const key in data) {
          section = section.concat(data[key]);
        }
        const arrsection = section.filter((item: any) => item.name !== 'Unit');

        setSection(arrsection);
        setTitle(res.data.title);

        setListLearning(data[Object.keys(data)[0]]);
      });
    };
    getData();
  }, []);

  const DeleteTest = async (id: number) => {
    if (confirm('Bạn có chắc chắn xóa Bài kiểm tra không')) {
      await RequestAPI({
        url: PathAPI.baikiemtra + '/' + id,
        method: 'GET',
      }).then((res: any) => {
        let data = res.data;
        data.product.idLesson = null;
        data.product.idSection = null;
        RequestAPI({
          url: PathAPI.baikiemtra + '/' + id,
          method: 'PATCH',
          payload: data,
        }).then((res: any) => {
          RequestAPI({
            url: PathAPI.course + '/detail/' + param.idCourse,
            method: 'GET',
          }).then((res: any) => {
            const data = res.data.courseTree;
            let section: any = [];

            for (const key in data) {
              section = section.concat(data[key]);
            }
            const arrsection = section.filter((item: any) => item.name !== 'Unit');

            setSection(arrsection);
            notify({
              type: 'success',
              message: 'Xóa bài kiểm tra thành công!',
            });
          });
        });
      });
    }
  };
  const navigate = useNavigate();
  const changeTest = (props: any) => {
    const data = {
      idCourse: null,
      idUnit: null,
      idSection: props.idSection,
      idLesson: props.idLesson,
      idClip: null,
    };
    localStorage.setItem(
      'idCourse',
      JSON.stringify(parseInt(param.idCourse !== undefined ? param.idCourse : ''))
    );
    localStorage.setItem('addTest', JSON.stringify(data));
    navigate('/manage-course/add-test/' + props.idBaikiemtra);
  };
  const dispatch = useDispatch();
  const getDataEdit = (idTest: number, idBaikiemtra: number) => {
    RequestAPI({
      url: PathAPI.test + '/' + idTest,
      method: 'GET',
    }).then((res: any) => {
      if (res.status) {
        res.data.idBaikiemtra = idBaikiemtra;
        dispatch(updateTestEdit(res.data));
        navigate('/manage-topic/create');
      }
    });
  };
  let id = 1;
  return (
    <div className='mx-auto px-4'>
      <div className='relative w-full max-w-full flex flex-grow items-center flex-1'>
        <h6 className='uppercase bg-ct-secondary w-min rounded-full p-2 mb-1 text-xs font-semibold mr-2'>
          <Graph size={20} color='white' />
        </h6>{' '}
        <h6 className='font-bold text-xl'>
          <span className='text-ct-gray-400 '>Bài kiểm tra khoá học/</span> {title}
        </h6>
      </div>
      <div className=''>
        {section && (
          <CourseTree
            Section={section}
            onEdit={(listQuiz: any) => {
              getDataEdit(listQuiz.listTestInfo[0].idTest, listQuiz.idBaikiemtra);
            }}
            onReset={(listQuiz: any, listLesson: any) => {
              changeTest({
                idLesson: listLesson.id,
                idSection: listLesson.idSection,
                idBaikiemtra: listQuiz.idBaikiemtra,
              });
            }}
            onDelete={(listQuiz: any) => {
              DeleteTest(listQuiz.idBaikiemtra);
            }}
            dropdownCustom={(listLesson: any) => (
              <DropdownCustom
                idLesson={listLesson.id}
                idSection={listLesson.idSection}
                idCourse={param.idCourse}
                click={() => setOpened(true)}
                close={() => setOpened(false)}
                open={opened}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default DetailCourse;
