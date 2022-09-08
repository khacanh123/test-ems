import Loading from 'components/Loading';
import { questionEnumType } from 'enum';
import { lazy, Suspense } from 'react';
import MathJaxRender from 'components/MathJax';
import PreviewMultiChoice from './PreviewMultiChoice';
import Table from 'components/Table';

const PreviewShort = lazy(() => import('./PreviewShort'));
const PreviewYesNo = lazy(() => import('./PreviewYesNo'));
const PreviewPair = lazy(() => import('./PreviewPair'));
const PreviewReading = lazy(() => import('./PreviewReading'));
const PreviewFillblank = lazy(() => import('./PreviewFillblank'));
const PreviewSort = lazy(() => import('./PreviewSort'));

interface Props {
  quiz_type: questionEnumType;
  data: any;
}

const PreviewQuestion = ({ quiz_type, data }: Props) => {
  const switchQuestionType = (quiz_type: questionEnumType) => {
    const textTable = 'table';
    switch (Number(quiz_type)) {
      case questionEnumType.ESSAY: {
        return (
          <>
            <p className='font-bold'>Chi tiết câu hỏi</p>
            {data.text.search(textTable) >= 2 ? (
              <div className='w-full'>
                <MathJaxRender math={data.text || 'Chưa cập nhật'} styletext={'customtable'} />
              </div>
            ) : (
              <div>
                <MathJaxRender math={data.text || 'Chưa cập nhật'} />
              </div>
            )}
            {data.image ? (
              <img className='w-[150px] border-2 p-2 rounded-lg' src={data?.image} alt='' />
            ) : (
              ''
            )}
            <p className='font-bold mt-4'>Giải thích</p>
            <MathJaxRender math={`${data?.solution || 'Chưa cập nhật'}`} />
            {data.solution_image ? (
              <img
                className='w-[150px] border-2 p-2 rounded-lg'
                src={data?.solution_image}
                alt=''
              />
            ) : (
              ''
            )}
          </>
        );
      }
      case questionEnumType.ONE_RIGHT: {
        return <PreviewMultiChoice data={data} />;
      }
      case questionEnumType.MULTIPLE_RIGHT: {
        return <PreviewMultiChoice data={data} />;
      }
      case questionEnumType.YES_NO: {
        return <PreviewYesNo data={data} />;
      }
      case questionEnumType.SHORT: {
        return <PreviewShort data={data} />;
      }
      case questionEnumType.PAIR: {
        return <PreviewPair data={data} />;
      }
      case questionEnumType.READING: {
        return <PreviewReading data={data} />;
      }
      case questionEnumType.FILL_BLANK: {
        return <PreviewFillblank data={data} />;
      }
      case questionEnumType.SORT: {
        return <PreviewSort data={data} />;
      }
      default:
        return <></>;
    }
  };
  return <Suspense fallback={<Loading />}>{switchQuestionType(quiz_type)}</Suspense>;
};

export default PreviewQuestion;
