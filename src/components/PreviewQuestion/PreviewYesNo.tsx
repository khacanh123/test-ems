import { Checkbox } from '@mantine/core';
import { memo } from 'react';
import MathJaxRender from 'components/MathJax';
interface Props {
  data: any;
  isReadingQuestion?: boolean;
  index?: number;
}
const PreviewYesNo = ({ data, isReadingQuestion, index }: Props) => {
  return (
    <>
      {isReadingQuestion ? (
        <>
          <MathJaxRender math={`${Number(index) + 1}. ${data?.text}`} />
        </>
      ) : (
        <>
          <p className='font-bold'>Chi tiết câu hỏi</p>
          <MathJaxRender math={`${data?.text}`} />
          {data?.image ? (
            <img className='h-[200px] my-4 rounded-2xl' src={data?.image} alt='' />
          ) : (
            ''
          )}
        </>
      )}
      <div className='flex'>
        {data?.listSelectOptions.map((item: any, index: number) => {
          return (
            <div className='p-10'>
              <Checkbox
                radius={100}
                classNames={{
                  root: `w-fit p-[2px] h-fit border-2 rounded-full ${
                    item.is_true ? 'border-[#017EFA]' : ' border-transparent'
                  }`,
                }}
                size='xs'
                icon={() => {
                  return <></>;
                }}
                checked={item.is_true}
              />
              <p>{item.answer_content}</p>
            </div>
          );
        })}
      </div>
      {isReadingQuestion ? (
        <></>
      ) : (
        <>
          <p className='font-bold mt-4'>Giải thích</p>
          <MathJaxRender math={`${data?.solution || 'Chưa cập nhật'}`} />
          {data.solution_image ? (
            <img className='mt-4 max-w-[512px] max-h-[512px]' src={data?.solution_image} alt='' />
          ) : (
            ''
          )}
        </>
      )}
    </>
  );
};

export default memo(PreviewYesNo);
