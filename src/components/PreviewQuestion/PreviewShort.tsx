import MathJaxRender from 'components/MathJax';
import { memo } from 'react';

interface Props {
  data: any;
  isReadingQuestion?: boolean;
  index?: number;
}
const PreviewShort = ({ data, isReadingQuestion, index }: Props) => {
  console.log(data);

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
      <p className='font-bold mt-4'>Từ khóa</p>
      <div className='flex'>
        {data?.listShortAnswer?.listKeyword.length > 0 ? (
          data?.listShortAnswer?.listKeyword.map((key: any) => (
            <MathJaxRender
              math={`${key.length > 50 ? key.substring(0, 50) + '...' : key}`}
              className='border p-2 rounded-lg w-fit mr-4 my-2'
            />
          ))
        ) : (
          <span className='text-[red]'>Thiếu từ khóa đúng</span>
        )}
      </div>
      {isReadingQuestion ? (
        <></>
      ) : (
        <>
          <p className='font-bold mt-4'>Giải thích</p>
          <MathJaxRender math={`${data?.solution || 'Chưa cập nhật'}`} />
          {data?.solution_image ? (
            <img className='mt-4 max-w-[512px] max-h-[512px]' src={data?.solution_image} alt='' />
          ) : (
            ''
          )}
        </>
      )}
    </>
  );
};

export default memo(PreviewShort);
