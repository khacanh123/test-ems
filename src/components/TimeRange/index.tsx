import { DateRangePicker } from '@mantine/dates';
import { Calendar } from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';

type TimeRangeProps = {
  handleTimeRange: (start: Date, end: Date) => void;
  label?: string;
};
let count = 1;

const TimeRange = ({ handleTimeRange, label }: TimeRangeProps) => {
  const now = new Date();
  const dateRef = useRef<any>(null);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [value, setValue] = useState<[Date | null, Date | null]>([now, nextWeek]);

  const addBtnToCalendar = () => {
    let dateDropdown = document.querySelector('.mantine-DateRangePicker-dropdown');
    if (dateDropdown && isOpenDropdown && count === 1) {
      count++;
      const child = `
            <div style="display: flex; background: white; width: 100%; padding-top: 10px; height: fit-content">
                <p id="cancelDate" style="background:#F5F7FB; color:#017EFA; cursor: pointer; padding:8px 10px 8px 10px; width: 100%; text-align:center; border-radius: 8px; margin: 5px;">Bỏ qua
                </p>
                <button id="searchDate" style="background:#017EFA; color:white; cursor: pointer; padding:8px 10px 8px 10px; width: 100%; text-align:center; border-radius: 8px; margin: 5px;">Tìm kiếm
                </button>
            </div>`;
      dateDropdown.insertAdjacentHTML('beforeend', child);
    }
    let searchDate = document.getElementById('searchDate');
    let cancelDate = document.getElementById('cancelDate');
    if (searchDate) {
      const search = () => {
        if (value[0] && value[1]) {
          handleTimeRange(value[0]!, value[1]!);
          dateDropdown?.setAttribute('style', 'display: none');
        }
        searchDate?.removeEventListener('click', search);
      };
      searchDate.addEventListener('click', search);
    }
    if (cancelDate && dateDropdown) {
      const cancel = () => {
        setIsOpenDropdown(false);
        dateDropdown?.setAttribute('style', 'display: none');
        cancelDate?.removeEventListener('click', cancel);
      };
      cancelDate.addEventListener('click', cancel);
    }
  };

  useEffect(() => {
    handleTimeRange(value[0]!, value[1]!);
  }, []);

  return (
    <div>
      <DateRangePicker
        ref={dateRef}
        label={label}
        radius={8}
        className='w-fit'
        locale='vi'
        clearable={false}
        rightSection={<Calendar size={16} color='#017EFA' variant='Bold' />}
        inputFormat='MM/DD/YYYY'
        dayStyle={(datex) => {
          let nowF = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
          let datexF = `${datex.getFullYear()}-${datex.getMonth() + 1}-${datex.getDate()}`;
          let isSelected = now >= value[0]! && now <= value[1]!;
          return datexF == nowF && !isSelected
            ? { color: '#017EFA', background: '#E6F2FE', borderRadius: '100px' }
            : {};
        }}
        sx={(theme) => {
          addBtnToCalendar();
          return {
            '.mante-DateRangePicker-dropdownWrapper': {
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E6F2FE',
              zIndex: '1',
              '&:hover': {
                border: '1px solid #017EFA',
              },
            },
          };
        }}
        closeCalendarOnChange={false}
        onDropdownOpen={() => setIsOpenDropdown(() => true)}
        onDropdownClose={() => {
          count = 1;
        }}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export default TimeRange;
