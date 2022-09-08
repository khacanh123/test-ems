import MathJaxRender from 'components/MathJax';

const WrittingResult = (props: any) => {
  return (
    <>
      {props.isTrue ? (
        <>
          <div className='w-full h-10 border-green-500 text-green-500 rounded-3xl border mt-3 line-clamp-1 flex items-center px-4 py-2'>
            {props.content !== '' ? <MathJaxRender math={`${props.content}`} /> : ''}
          </div>
        </>
      ) : (
        <>
          <div className='w-full h-10 border-red-500 text-red-500 rounded-3xl border mt-3 line-clamp-1 flex items-center px-4 py-2'>
            {props.content !== '' ? <MathJaxRender math={`${props.content}`} /> : ''}
          </div>
        </>
      )}
    </>
  );
};
export default WrittingResult;
