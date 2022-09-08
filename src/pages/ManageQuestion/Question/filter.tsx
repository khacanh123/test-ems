import { Select } from '@mantine/core';
import { useEffect, useState } from 'react';
interface dataselect {
  label: string;
  value: string;
  disabled: boolean;
}

const FilterComponent = (props: any) => {
  const [searchDefault, setSearchDefault] = useState<any>({
    idSubject: null,
    idClass: null,
    quiz_type: null,
    type: null,
    level: null,
    awareness_level: null,
    limit: 10,
    page: 1,
  });
  useEffect(() => {
    const abc = {
      idSubject: null,
      idClass: null,
      quiz_type: null,
      type: null,
      level: null,
      awareness_level: null,
    };
    if (searchDefault != abc) {
      props.filter(searchDefault);
    }
  }, [searchDefault]);
  return (
    <>
      {props.show ? (
        <div className='grid grid-cols-6 gap-6' style={{ marginTop: 35 }}>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Lớp học
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={props.listClass.map((item: any) => {
                item['label'] = item.name;
                item['value'] = '' + item.id;
                item['key'] = item.value;
                return item;
              })}
              radius={6}
              clearable
              onChange={(e: string) => setSearchDefault({ ...searchDefault, idClass: parseInt(e) })}
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Môn học
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={props.listSubject.map((item: any) => {
                item['label'] = item.name;
                item['value'] = '' + item.id;
                item['key'] = item.value;
                return item;
              })}
              radius={6}
              clearable
              onChange={(e: string) =>
                setSearchDefault({ ...searchDefault, idSubject: parseInt(e) })
              }
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Kiểu câu hỏi
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={props.dataContaint?.question?.quiz_type?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                item['disabled'] = false;
                return item;
              })}
              radius={6}
              clearable
              onChange={(e: string) =>
                setSearchDefault({ ...searchDefault, quiz_type: parseInt(e) })
              }
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Loại câu hỏi
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={props.dataContaint?.question?.type?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
              radius={6}
              clearable
              onChange={(e: string) => setSearchDefault({ ...searchDefault, type: parseInt(e) })}
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Độ khó
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={props.dataContaint?.question?.level?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
              radius={6}
              clearable
              onChange={(e: string) => setSearchDefault({ ...searchDefault, level: parseInt(e) })}
            />
          </div>
          <div>
            <label
              htmlFor=''
              style={{ fontWeight: '600', fontSize: 15, color: '#000' }}
              className='mb-2'
            >
              Cấp độ nhận biết
            </label>
            <Select
              placeholder='Chọn'
              defaultValue={'STT'}
              data={props.dataContaint?.question?.awarenessLevel?.map((item: any) => {
                item['label'] = item.title;
                item['value'] = '' + item.value;
                item['key'] = item.value;
                return item;
              })}
              radius={6}
              clearable
              onChange={(e: string) =>
                setSearchDefault({ ...searchDefault, awareness_level: parseInt(e) })
              }
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};
export default FilterComponent;
