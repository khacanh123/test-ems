const ReadingResult = (props: any) => {
  const { listQuestionChildren, userAnswer, index } = props;
  let ind = index;

  return (
    <>
      {listQuestionChildren
        ? listQuestionChildren.map((key: any, i: any) => {
            let chk = false;
            let check = false;
            userAnswer?.map((key1: any) => {
              if (key1.idChildQuestion == key.idChildQuestion) {
                if (key1.isTrue) {
                  chk = true;
                }
                check = true;
              }
            });
            if (!check) {
              return (
                <div
                  className='rounded-full flex justify-center items-center w-8 h-8 border border-[#ddd] text-[12px] target p-1'
                  id={'question' + key.idQuestion}
                >
                  {ind++}
                </div>
              );
            } else {
              if (chk) {
                return (
                  <div
                    className='rounded-full flex justify-center items-center w-8 h-8 text-white bg-ct-green-300 text-[12px] target p-1'
                    id={'question' + key.idQuestion}
                  >
                    {ind++}
                  </div>
                );
              } else {
                return (
                  <div
                    className='rounded-full flex justify-center items-center w-8 h-8 text-white bg-ct-red-300 text-[12px] target p-1'
                    id={'question' + key.idQuestion}
                  >
                    {ind++}
                  </div>
                );
              }
            }
          })
        : ''}
    </>
  );
};
export default ReadingResult;
