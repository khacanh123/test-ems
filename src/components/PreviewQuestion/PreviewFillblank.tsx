import { memo } from 'react';
import MathJaxRender from 'components/MathJax';
interface Props {
  data: any;
}
const PreviewFillblank = ({ data }: Props) => {
  return (
    <>
      <p className='font-bold'>Chi tiết câu hỏi</p>
      <MathJaxRender math={`${data?.text}`} />
      {data?.image ? <img className='h-[200px] my-4 rounded-2xl' src={data?.image} alt='' /> : ''}
      <p className='font-bold mt-4'>Từ khóa</p>
      {data?.listQuestionChildren?.map((item: any) => {
        return (
          <MathJaxRender
            math={`${item?.listShortAnswer?.listKeyword?.join(', ') || 'Chưa cập nhật'}`}
          />
        );
      })}

      <p className='font-bold mt-4'>Giải thích</p>
      <MathJaxRender math={`${data?.solution || 'Chưa cập nhật'}`} />
      {data.solution_image ? (
        <img className='mt-4 max-w-[512px] max-h-[512px]' src={data?.solution_image} alt='' />
      ) : (
        ''
      )}
    </>
  );
};

export default memo(PreviewFillblank);
