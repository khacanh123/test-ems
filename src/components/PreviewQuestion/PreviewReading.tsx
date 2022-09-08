import MathJaxRender from 'components/MathJax';
import { questionEnumType } from 'enum';
import PreviewMultiChoice from './PreviewMultiChoice';
import PreviewPair from './PreviewPair';
import PreviewShort from './PreviewShort';
import PreviewYesNo from './PreviewYesNo';
import { memo } from 'react';

const PreviewReading = ({ data }: any) => {
  return (
    <div>
      <p className='font-bold'>Chi tiết câu hỏi</p>
      <MathJaxRender math={`${data?.text || 'Chưa cập nhật'}`} />
      {data?.image ? <img className='h-[200px] my-4 rounded-2xl' src={data?.image} alt='' /> : ''}

      {data?.listQuestionChildren?.map((item: any, index: number) => {
        switch (Number(item.quiz_type)) {
          case questionEnumType.ONE_RIGHT:
            return <PreviewMultiChoice key={index} data={item} isReadingQuestion index={index} />;
          case questionEnumType.MULTIPLE_RIGHT:
            return <PreviewMultiChoice key={index} data={item} isReadingQuestion index={index} />;
          case questionEnumType.YES_NO:
            return <PreviewYesNo key={index} data={item} isReadingQuestion index={index} />;
          case questionEnumType.SHORT:
            return <PreviewShort key={index} data={item} isReadingQuestion index={index} />;
          case questionEnumType.PAIR:
            return <PreviewPair key={index} data={item} isReadingQuestion index={index} />;
          default:
            break;
        }
      })}
      <p className='font-bold mt-4'>Giải thích</p>
      <MathJaxRender math={`${data?.solution || 'Chưa cập nhật'}`} />
      {data.solution_image ? (
        <img className='mt-4 max-w-[512px] max-h-[512px]' src={data?.solution_image} alt='' />
      ) : (
        ''
      )}
    </div>
  );
};

export default memo(PreviewReading);
