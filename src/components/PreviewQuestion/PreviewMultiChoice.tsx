import MathJaxRender from 'components/MathJax';
import { memo } from 'react';
import { AnswerType } from 'enum';
import { alphabet } from 'utils/utils';

interface Props {
  data: any;
  isReadingQuestion?: boolean;
  index?: number;
}
const PreviewMultiChoice = ({ data, isReadingQuestion, index }: Props) => {
  const alphabe = alphabet();
  const checkOptionTrue = data?.listSelectOptions?.filter((item: any) => item.is_true === true);
  return (
    <>
      {isReadingQuestion ? (
        <>
          <MathJaxRender math={`${Number(index) + 1}. ${data?.text}`} />
          {data?.image ? (
            <img className='h-[200px] my-4 rounded-2xl' src={data?.image} alt='' />
          ) : (
            ''
          )}
        </>
      ) : (
        <>
          <p className='font-bold'>Chi tiết câu hỏi</p>
          <MathJaxRender math={`${data?.text || 'Chưa cập nhật'}`} />
          {data?.image ? (
            <img className='h-[200px] my-4 rounded-2xl' src={data?.image} alt='' />
          ) : (
            ''
          )}
        </>
      )}
      {checkOptionTrue.length == 0 ? (
        <span className='text-[red] font-bold'>Thiếu đáp án đúng</span>
      ) : (
        ''
      )}
      <div className='flex flex-wrap'>
        {data?.listSelectOptions?.map((item: any, index: number) => {
          if (data.answer_type == AnswerType.TEXT || data.answer_type == 0) {
            return (
              <div
                key={index}
                className={`flex overflow-x-auto ${
                  item.is_true ? 'bg-ct-secondary text-white ' : 'border '
                }p-4 w-[calc(50%-32px)] m-4 odd:ml-0 even:mr-0 rounded-lg`}
              >
                {alphabe[index]}:&ensp;
                <MathJaxRender math={`${item.answer_content}`} />
              </div>
            );
          } else if (item.answer_url_image || data.answer_type == AnswerType.IMAGE) {
            return (
              <img
                key={index}
                className={`${
                  item.is_true ? 'border-cyan-600 border-2' : 'border '
                } w-[calc(25%-25px)] p-2 rounded-lg m-2`}
                src={item.answer_url_image}
                alt=''
              />
            );
          }
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

export default memo(PreviewMultiChoice);
