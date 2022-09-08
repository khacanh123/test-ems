// import icon from './Group7741.svg';
// import icon1 from './Group7742.svg';
import { Input, Popover, Select, Switch, Table } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Breadcrumb from 'components/Breadcrumbs';
import Pagination from 'components/Pagination';
import TimeRange from 'components/TimeRange';
import { Book, ExportCurve, Filter, MessageAdd1, RowHorizontal } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatTimeString } from '../../../utils/utils';
import CustomTable from 'components/Table';

import './styles.css';
interface studentInfo {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}
interface histories {
  count: number;
  bestMark: number;
  lastAttemptAt: string;
  idStudent: number;
  studentInfo: studentInfo;
}
interface Choice {
  stt: boolean;
  themluot: boolean;
  show: boolean;
  id: boolean;
  ten: boolean;
  sdt: boolean;
  email: boolean;
  diem: boolean;
  thoigian: boolean;
  lanthi: boolean;
}
let choice: Choice = {
  stt: true,
  themluot: true,
  show: true,
  id: true,
  ten: true,
  sdt: true,
  email: true,
  diem: true,
  thoigian: true,
  lanthi: true,
};

const DetailCourseStudent = () => {
  const [histories, setHistories] = useState<histories[]>([]);
  const [filter, setFilter] = useState<histories[]>([]);
  const [listChoice, setListChoice] = useState<Choice>(choice);
  const [choice1, setChoice] = useState('');
  const [value, setValue] = useState('');
  const [column, setColumn] = useState('');
  const [opened, setOpened] = useState(false);
  const [opened1, setOpened1] = useState(false);
  const [opened2, setOpened2] = useState(false);
  const [arrLength, setArrLength] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const param = useParams();
  const handlePaging = (page: number) => {
    requestData(param.id, page, (res: any) => {
      let total = res.total;
      setArrLength(Math.ceil(total / 10));
      setHistories(res.data.histories);
      setCurrentPage(page);
      setFilter(res.data.histories);
    });
  };
  const Show = (type: number, title: string) => {
    type = type;
    const typeE = document.getElementById(title + '-s');
    const showS = document.getElementById(title);

    if (type === 1) {
      setOpened(true);
    } else if (type === 2) {
      setOpened1(true);
    } else {
      setOpened2(true);
    }
    if (typeE !== null && showS !== null) {
      typeE.style.display = 'block';
      showS.style.display = 'none';
    }
  };
  const ClosePopover = (type: number, title: string) => {
    const typeE = document.getElementById(title + '-s');
    const showS = document.getElementById(title);
    if (type === 1) {
      setOpened(false);
    } else if (type === 2) {
      setOpened1(false);
    } else {
      setOpened2(false);
    }
    if (typeE !== null && showS !== null) {
      typeE.style.display = 'none';
      showS.style.display = 'block';
    }
  };

  async function requestData(idBaikiemtra: any, page: number, callback: Function) {
    RequestAPI({
      url: `${PathAPI.report}`,
      method: 'GET',
      params: {
        idBaikiemtra: idBaikiemtra,
        sortLastAttempt: 1,
        page: page,
        limit: 10,
      },
    }).then((res: any) => {
      callback(res);
    });
  }
  useEffect(() => {
    requestData(param.id, currentPage, (res: any) => {
      setHistories(res.data.histories);
      setFilter(res.data.histories);
      let total = res.total;
      setArrLength(Math.ceil(total / 10));
    });
  }, []);
  const handleTimeRange = (start: Date, end: Date) => {
    RequestAPI({
      url: PathAPI.report,
      method: 'GET',
      params: {
        sortLastAttempt: 1,
        idBaikiemtra: param.id,
        timeStart: new Date(start).toISOString(),
        timeEnd: new Date(end).toISOString(),
      },
    }).then((res: any) => {
      setFilter(res.data);
    });
  };
  let id = 1;
  let i = 1;
  const exportData = () => {
    console.log('param', param.id);
    RequestAPI({
      url: `${PathAPI.report}/export/csv`,
      method: 'GET',
      params: {
        idBaikiemtra: param.id,
      },
    }).then((res: any) => {
      window.location.href = res.data.files[0].uri;
    });
  };
  return (
    <div className=' mx-auto px-4 grow' id='report'>
      <Breadcrumb />
      <div className='grid grid-cols-2 gap-2 mt-2 mb-2'>
        <div>
          {/* <label className='text-lg font-bold mt-1 text-black' style={{ fontSize: 16 }}>
            Từ ngày - Đến ngày
          </label>
          <TimeRange handleTimeRange={handleTimeRange} /> */}
        </div>
        <div className='mr-6'>
          <div className='float-right grid grid-cols-3 gap-3' style={{ marginTop: 25 }}>
            <Popover
              opened={opened}
              onClose={() => ClosePopover(1, 'column')}
              target={
                <div
                  className='flex text-lg font-bold mt-1 text-black'
                  id='col-s'
                  // onClick={() => Show('column', 1)}
                  onClick={() => Show(1, 'column')}
                  style={{ fontSize: 16, alignItems: 'center' }}
                >
                  <RowHorizontal size='32' color='#017EFA' className='mr-2' id='column' />
                  <RowHorizontal
                    size='32'
                    color='#017EFA'
                    className='mr-2'
                    variant='Bold'
                    id='column-s'
                  />
                  Cột
                </div>
              }
              width={344}
              position='bottom'
              withArrow
            >
              <div className='column-option' id='show-column'>
                <div style={{ padding: '0px 15px 0px 15px' }}>
                  <div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.stt}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            stt: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>STT</p>
                    </div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.themluot}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            themluot: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>Thêm lượt</p>
                    </div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.show}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            show: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>Show</p>
                    </div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.id}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            id: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>ID Học sinh</p>
                    </div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.ten}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            ten: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>Tên</p>
                    </div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.sdt}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            sdt: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>Số điện thoại</p>
                    </div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.email}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            email: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>Email</p>
                    </div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.lanthi}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            lanthi: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>Số lần thi</p>
                    </div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.diem}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            diem: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>Điểm cao nhất</p>
                    </div>
                    <div className='flex-bg' style={{ marginTop: 5 }}>
                      <Switch
                        checked={listChoice.thoigian}
                        onChange={(event: any) =>
                          setListChoice({
                            ...listChoice,
                            thoigian: event.currentTarget.checked,
                          })
                        }
                      />
                      <p style={{ marginLeft: 15 }}>Thời gian thi</p>
                    </div>
                  </div>
                  <div className='flex-bg ft-bg pt-5'>
                    <div
                      className='title-bg2'
                      style={{ width: '50%' }}
                      onClick={() =>
                        setListChoice({
                          ...listChoice,
                          stt: false,
                          themluot: false,
                          show: false,
                          id: false,
                          ten: false,
                          email: false,
                          sdt: false,
                          thoigian: false,
                          diem: false,
                          lanthi: false,
                        })
                      }
                    >
                      Ẩn tất cả
                    </div>
                    <div
                      className='title-bg2 show-bg'
                      onClick={() =>
                        setListChoice({
                          ...listChoice,
                          stt: true,
                          themluot: true,
                          show: true,
                          id: true,
                          ten: true,
                          email: true,
                          sdt: true,
                          thoigian: true,
                          diem: true,
                          lanthi: true,
                        })
                      }
                    >
                      Hiện tất cả
                    </div>
                  </div>
                </div>
              </div>
            </Popover>
            <Popover
              opened={opened1}
              onClose={() => ClosePopover(2, 'filter')}
              target={
                <div
                  className='flex text-lg font-bold mt-1 text-black'
                  // onClick={() => Show('filter', 1)}
                  onClick={() => Show(2, 'filter')}
                  style={{ marginLeft: 10, fontSize: 16, alignItems: 'center' }}
                >
                  <Filter size='32' color='#017EFA' className='mr-2' id='filter' />
                  <Filter size='32' color='#017EFA' className='mr-2' id='filter-s' variant='Bold' />
                  Lọc
                </div>
              }
              width={324}
              position='bottom'
              withArrow
            >
              {/* <div>
                <div className='filter-content'>
                  <div>
                    <label style={{ color: '#000' }}>Chọn cột</label>
                    <Select
                      placeholder='Chọn'
                      defaultValue={'STT'}
                      data={[
                        { value: 'STT', label: 'STT' },
                        { value: 'Thêm lượt', label: 'Thêm lượt' },
                        { value: 'Show', label: 'Show' },
                        { value: 'idStudent', label: 'ID Học sinh' },
                        { value: 'name', label: 'Tên' },
                        { value: 'phone', label: 'Phone' },
                        { value: 'email', label: 'Email' },
                        { value: 'count', label: 'Số lần thi' },
                        { value: 'bestMark', label: 'Điểm cao nhất' },
                        { value: 'lastAttemptAt', label: 'Thời gian thi' },
                      ]}
                      onChange={(e: string) => setColumn(e)}
                    />
                  </div>
                  <div style={{ marginTop: 25 }}>
                    <label style={{ color: '#000' }}>Toán tử</label>
                    <Select
                      placeholder='Chọn'
                      defaultValue={'='}
                      data={[{ value: '=', label: '=' }]}
                      onChange={(e: string) => setChoice(e)}
                    />
                  </div>
                  <div style={{ marginTop: 25 }}>
                    <label style={{ color: '#000' }}>Giá trị</label>
                    <Input onChange={(e: any) => filterData(e.target.value)} />
                  </div>
                </div>
              </div> */}
            </Popover>
            <Popover
              opened={opened2}
              onClose={() => ClosePopover(3, 'export')}
              target={
                <div
                  className='flex text-lg font-bold mt-1 text-black'
                  // onClick={() => Show('export', 1)}
                  onClick={() => Show(3, 'export')}
                  style={{ fontSize: 16, alignItems: 'center' }}
                >
                  <ExportCurve size='32' color='#017EEA' className='mr-2' id='export' />
                  <ExportCurve
                    size='32'
                    color='#017EEA'
                    className='mr-2'
                    id='export-s'
                    variant='Bold'
                  />
                  Xuất dữ liệu
                </div>
              }
              width={185}
              position='bottom'
              withArrow
            >
              <div className='export-option'>
                <div onClick={() => exportData()}>Download as EXCEL</div>
              </div>
            </Popover>
          </div>
        </div>
      </div>
      <div className=''>
        <div className='overflow-x-auto w-full mt-4'>
          <CustomTable
            dataSource={{
              columns: [
                {
                  title: 'STT',
                  centered: true,
                },
                {
                  title: 'Thêm lượt',
                  centered: true,
                },
                {
                  title: 'Show',
                  centered: true,
                },
                {
                  title: 'Họ tên',
                },
                {
                  title: 'Số điện thoại',
                },
                {
                  title: 'Email',
                },
                {
                  title: 'Số lần thi',
                  centered: true,
                },
                {
                  title: 'Điểm cao',
                  centered: true,
                },
                {
                  title: 'Thời gian thi',
                },
              ],
              data: filter.map((key, index) => {
                const Info = key.studentInfo;
                let { date, month, year, hours, minutes, ampm } = formatTimeString(
                  key.lastAttemptAt
                );
                return {
                  STT: index + 1,
                  add: <MessageAdd1 size='32' color='#017EFA' />,
                  show: <Book size='32' color='#017EFA' />,
                  fullName: Info.firstName + ' ' + Info.lastName,
                  phone: Info.phone,
                  email: Info.email,
                  count: key.count,
                  bestMark: key.bestMark,
                  time: `${date}/${month}/${year} ${hours}:${minutes} ${ampm}`,
                };
              }),
            }}
            // loading={loading}
          />
        </div>
        <div className='flex justify-end mr-10 mt-3'>
          <Pagination handlePaging={handlePaging} total={arrLength} />
        </div>
      </div>
    </div>
  );
};

export default DetailCourseStudent;
