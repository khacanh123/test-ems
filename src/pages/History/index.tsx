import { Input, Select, Table } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Pagination from 'components/Pagination';
import TimeRange from 'components/TimeRange';
import { useEffect, useState } from 'react';
import { formatTimeString } from 'utils/utils';
import './style.css';
interface Info {
  name: string;
  phone: string;
  email: string;
}
interface histories {
  idBaikiemtra: number;
  idTest: number;
  idStudent: number;
  timeStart: string;
  idHistory: number;
  timeSuccess: string;
  correctProportion: number;
  studentInfo: Info;
}

const HistoryContainer = () => {
  // const handlePaging = (page: number) => {
  //     console.log(page);
  // };
  const [historiesTest, setHistoriesTest] = useState<histories[]>([]);
  const [DatahistoriesTest, setDataHistoriesTest] = useState<histories[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [display, setDisplay] = useState(10);
  const handleTimeRange = (start: Date, end: Date) => {
    RequestAPI({
      url: PathAPI.history,
      method: 'GET',
      params: {
        timeStart: new Date(start).toISOString(),
        timeEnd: new Date(end).toISOString(),
      },
    }).then((res: any) => {
      setHistoriesTest(res.data);
      let total = res.total;
      setTotalPage(Math.ceil(total / display));
    });
  };
  const handlePaging = async (page: number) => {
    await RequestAPI({
      url: `${PathAPI.history}/?page=${page}&limit=${display}`,
      method: 'GET',
    }).then((res: any) => {
      setHistoriesTest(res.data);
      setDataHistoriesTest(res.data);
    });
  };

  useEffect(() => {
    const getData = () => {
      RequestAPI({
        url: `${PathAPI.history}`, //?page=${page}&limit=10
        method: 'GET',
        params: {
          page: page,
          limit: 10,
        },
      }).then((res: any) => {
        setHistoriesTest(res.data);
        setDataHistoriesTest(res.data);
        let total = res.total;
        setTotalPage(Math.ceil(total / display));
      });
    };
    getData();
  }, []);
  const filterData = (type: number, value: string) => {
    if (type === 1) {
      const filter = DatahistoriesTest.filter(
        (item: histories) => item.idStudent.toString().search(value) !== -1
      );
      setHistoriesTest(filter);
    }
    if (type === 2) {
      const filter = DatahistoriesTest.filter(
        (item: histories) => item.studentInfo.name.toLowerCase().search(value.toLowerCase()) !== -1
      );

      setHistoriesTest(filter);
    }
    if (type === 3) {
      const filter = DatahistoriesTest.filter(
        (item: histories) => item.studentInfo.email.toLowerCase().search(value.toLowerCase()) !== -1
      );

      setHistoriesTest(filter);
    }
  };
  let i = 1;
  const changeDisplay = (num: number) => {
    setDisplay(num);
    RequestAPI({
      url: `${PathAPI.history}`, //?page=${page}&limit=10
      method: 'GET',
      params: {
        page: page,
        limit: num,
      },
    }).then((res: any) => {
      setHistoriesTest(res.data);
      setDataHistoriesTest(res.data);
      let total = res.total;
      setTotalPage(Math.ceil(total / num));
    });
  };
  return (
    <div>
      <Breadcrumb />
      <div className='grid grid-cols-5 gap-5 mt-2 mb-4'>
        <div>
          <label htmlFor='' className='text-lg font-bold mt-1 text-black'>
            Số kết quả hiển thị
          </label>
          <Select
            data={[
              {
                label: '10',
                value: '10',
              },
              {
                label: '55',
                value: '55',
              },
              {
                label: '100',
                value: '100',
              },
            ]}
            defaultValue={display + ''}
            onChange={(e: string) => changeDisplay(parseInt(e))}
            radius={8}
          />
        </div>
        <div>
          <label className='text-lg font-bold mt-1 text-black'>Mã học sinh</label>
          <Input
            radius={8}
            type={'number'}
            onChange={(e: any) => filterData(1, e.target.value)}
            placeholder={'Nhập mã học sinh'}
          />
        </div>
        <div>
          <label className='text-lg font-bold mt-1 text-black'>Tên học sinh</label>
          <Input
            radius={8}
            onChange={(e: any) => filterData(2, e.target.value)}
            placeholder={'Nhập tên học sinh'}
          />
        </div>
        <div>
          <label className='text-lg font-bold mt-1 text-black'>Email</label>
          <Input
            radius={8}
            onChange={(e: any) => filterData(3, e.target.value)}
            placeholder={'Nhập email'}
          />
        </div>
        <div>
          <label className='text-lg font-bold mt-1 text-black'>Ngày thi</label>
          <TimeRange handleTimeRange={handleTimeRange} />
        </div>
      </div>
      <div className='overflow-x-auto w-min' style={{ maxWidth: '97%' }}>
        <Table className='table mx-auto' style={{ width: '100%' }}>
          <thead>
            <tr>
              <th scope='col' className=' w-8 sticky-col'>
                STT
              </th>
              <th
                scope='col'
                className=' col grow whitespace-nowrap sticky-col'
                style={{ left: 48.55 }}
              >
                Mã học sinh
              </th>
              <th
                scope='col'
                className='col grow whitespace-nowrap sticky-col'
                style={{ left: 159.3 }}
              >
                Tên học sinh
              </th>
              <th
                scope='col'
                className='col-hs grow whitespace-nowrap sticky-col'
                style={{ left: 273.2 }}
              >
                Số điện thoại
              </th>

              <th
                scope='col'
                className='col-name grow whitespace-nowrap sticky-col'
                style={{ left: 392.58 }}
              >
                Email
              </th>
              <th scope='col' className='col-sdt grow whitespace-nowrap'>
                Mã BKT
              </th>

              <th scope='col' className='col-sdt grow whitespace-nowrap'>
                Mã đề
              </th>
              <th scope='col' className=' grow whitespace-nowrap'>
                Thời gian bắt đầu thi
              </th>
              <th scope='col' className='whitespace-nowrap'>
                Thời gian làm bài
              </th>
              <th scope='col' className='whitespace-nowrap'>
                Số câu tự luận
              </th>
              <th scope='col' className='whitespace-nowrap'>
                Số câu trắc nghiệm
              </th>
              <th scope='col' className='whitespace-nowrap'>
                Số câu trả lời đúng
              </th>
              <th scope='col' className='whitespace-nowrap'>
                Điểm số
              </th>
            </tr>
          </thead>
          <tbody>
            {historiesTest
              ? historiesTest.map((key, index) => {
                  const Info = key.studentInfo;
                  let convert = formatTimeString(key.timeStart);
                  let convert1 = formatTimeString(key.timeSuccess);
                  let start = convert.hours * 60 + convert.seconds;

                  return (
                    <>
                      <tr key={index}>
                        <td className='sticky-col'>{i++}</td>
                        <td className='sticky-col' style={{ left: 48.55 }}>
                          {key.idStudent}
                        </td>
                        <td className='sticky-col' style={{ left: 159.3 }}>
                          {key.studentInfo.name}
                        </td>
                        <td className='sticky-col' style={{ left: 273.2 }}>
                          {key.studentInfo.phone}
                        </td>
                        <td className='sticky-col' style={{ left: 392.58 }}>
                          {key.studentInfo.email}
                        </td>
                        <td>{key.idBaikiemtra}</td>
                        <td>{key.idTest}</td>
                        <td>
                          {convert.hours +
                            ':' +
                            convert.minutes +
                            ':' +
                            convert.seconds +
                            ' ' +
                            convert.date +
                            '/' +
                            convert.month +
                            '/' +
                            convert.year}
                        </td>
                        <td>
                          {convert1.hours +
                            ':' +
                            convert1.minutes +
                            ':' +
                            convert1.seconds +
                            ' ' +
                            convert1.date +
                            '/' +
                            convert1.month +
                            '/' +
                            convert1.year}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </>
                  );
                })
              : null}
          </tbody>
        </Table>
      </div>
      <div className='flex justify-end mr-10 mt-3'>
        <Pagination handlePaging={handlePaging} total={totalPage} />
      </div>
    </div>
  );
};

export default HistoryContainer;
