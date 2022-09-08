import MathJaxRender from 'components/MathJax';
interface Props {
  data: any;
}
const PreviewSort = ({ data }: Props) => {
  return (
    <>
      <p className='font-bold'>Chi tiết câu hỏi</p>
      <MathJaxRender math={`${data?.text || 'Chưa cập nhật'}`} />
      {data?.image ? <img className='h-[200px] my-4 rounded-2xl' src={data?.image} alt='' /> : ''}
      <div className='flex flex-wrap'>
        {data?.listSortOptions?.options?.map((item: any, index: number) => {
          return (
            <div key={index} className={`border p-2 rounded-lg w-fit mr-4 my-2`}>
              {item}
            </div>
          );
        })}
      </div>
      <p className='mt-4 font-bold'>Trả lời</p>
      <div className='flex flex-wrap'>
        {data?.listSortOptions?.solution?.map((item: any, index: number) => {
          return (
            <div key={index} className={`border p-2 rounded-lg w-fit mr-4 my-2`}>
              {item}
            </div>
          );
        })}
      </div>
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

export default PreviewSort;
