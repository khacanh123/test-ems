import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import './style.css';
interface course {
  id: number;
  title: string;
}
const ReportTestContainer = () => {
  const [listCourse, setListCourse] = useState<course[]>([]);
  const [arrLength, setArrLength] = useState(0);
  const [prev, setPrev] = useState(0);
  const [nextP, setNextP] = useState(9);
  const handlePaging = (page: number) => {
    console.log(prev);

    let next = page * 10 - 1; // 9 19
    let pre = next - 10 > 0 ? next - 10 + 1 : 0; // 0 9
    console.log('prev ' + pre + ' next ' + next);

    setPrev(pre);
    setNextP(next);
  };

  // const action = getCourse();
  useEffect(() => {
    setArrLength(Math.ceil(listCourse.length / 10));
  }, [listCourse]);
  useEffect(() => {
    RequestAPI({
      url: PathAPI.course,
      method: 'GET',
    }).then((res: any) => {
      setListCourse(res.data);
    });
  }, []);

  let i = 1;
  let next = 1 * 10 - 1; // 9
  let pre = 1 * 10 - next - 1; //0
  return (
    <div className=' mx-auto px-4'>
      <Breadcrumb />
      <div className='relative overflow-x-auto sm:rounded-lg mt-3'>
        <table className='w-full text-sm text-left text-gray-500 table'>
          <thead className='text-xs text-gray-700 bg-gray-50 '>
            <tr>
              <th scope='col' className='px-6 py-3 w-8'>
                ID
              </th>
              <th scope='col' className='px-6 py-3'>
                Tên khóa học
              </th>
            </tr>
          </thead>
          <tbody>
            {listCourse
              ? listCourse.map((key, index) => {
                  if (index >= prev && index <= nextP)
                    return (
                      <tr key={index} className='bg-white border-b'>
                        <td className='px-6 py-4 w-8'>{key.id}</td>
                        <td className='px-6 py-4'>
                          <Link to={'/report-test/' + key.id} className='hover-link'>
                            {key.title}
                          </Link>
                        </td>
                      </tr>
                    );
                })
              : null}
          </tbody>
        </table>
        <div className='float-right mt-3'>
          <Pagination handlePaging={handlePaging} total={arrLength} />
        </div>
      </div>
    </div>
  );
};

export default ReportTestContainer;
