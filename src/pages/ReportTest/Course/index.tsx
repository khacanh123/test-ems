import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import { ArrowDown3, Send } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CourseTree from '../../ManageCourse/CourseTree';
import './style.css';
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
interface detailCourse {
  _id: string;
  id: number;
  name: string;
  listQuiz: listQuiz[];
}
const CourseContainer = () => {
  const [listSection, setListSection] = useState<never[]>([]);
  const navigate = useNavigate();
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
          section = section.concat(data[key].listSection);
        }

        setListSection(section);
      });
    };
    getData();
  }, []);

  const showData = (id: number, type: number) => {
    const element = document.getElementById('icon-' + type + '' + id);
    const el2 = document.getElementById('showmore' + id);
    const el3 = document.getElementById('level' + type + '' + id);
    let chk = null;
    if (element !== null) {
      chk = element.getAttribute('data-show');
    }
    if (chk == 'false') {
      if (type === 2) {
        if (el2 !== null && element !== null) {
          el2.style.display = 'block';
          element.setAttribute('data-show', 'true');
          element.style.display = 'block';
        }
      } else {
        if (el3 !== null && element !== null) {
          el3.style.display = 'block';
          element.setAttribute('data-show', 'true');
          element.style.display = 'block';
        }
      }
    } else {
      if (type === 2) {
        if (el2 !== null && element !== null) {
          el2.style.display = 'none';
          element.setAttribute('data-show', 'false');
          element.style.display = 'none';
        }
      } else {
        if (el3 !== null && element !== null) {
          el3.style.display = 'none';
          element.setAttribute('data-show', 'false');
          element.style.display = 'none';
        }
      }
    }
  };
  return (
    <div className=' mx-auto px-4'>
      <Breadcrumb />
      <div className='relative overflow-x-auto '>
        <CourseTree
          disableDelete={true}
          disableReset={true}
          disableEdit={true}
          disableViewReport={false}
          Section={listSection}
          onViewReport={(listQuiz: any) =>
            navigate(`/report-test/${param.idCourse}/${listQuiz.idBaikiemtra}`)
          }
        />
      </div>
    </div>
  );
};

export default CourseContainer;
