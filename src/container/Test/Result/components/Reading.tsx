import MathJaxRender from 'components/MathJax';
import MuitichoiceMultiRight from './MultiChoiceMultiRight';
import MuitichoiceOneRight from './MutiChoiceOneRight';
const Reading = (props: any) => {
  const { listQuestionChildren, listAnswer, dataTest, key, answerTrue, idQuestion } = props;
  let index = props.index;
  return (
    <>
      {listQuestionChildren?.map((item: any, i: number) => {
        const answer = item.listSelectOptions;
        switch (Number(item.quiz_type)) {
          case 1:
            return (
              <div key={i}>
                <div className='flex'>
                  <div className='font-bold whitespace-nowrap'>Câu {`${index++}`}</div>
                  <div className='pl-1'>
                    {<MathJaxRender math={`${item.text}`} />}
                    {item.image ? (
                      <img className=' border-2 p-2 rounded-lg' src={item?.image} alt='' />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <MuitichoiceOneRight
                  type={6}
                  listAnswer={answer}
                  dataTest={dataTest}
                  key={key}
                  idQuestion={idQuestion}
                  idChildQuestion={item.idChildQuestion}
                  answerTrue={answerTrue}
                  typeTestReturn={props.typeTestReturn}
                />
              </div>
            );
          case 3:
            return (
              <div key={i}>
                <div className='flex'>
                  <div className='font-bold whitespace-nowrap'>Câu {`${index++}`}</div>
                  <div className='pl-1'>
                    {<MathJaxRender math={`${item.text}`} />}
                    {item.image ? (
                      <img className='w-[150px] border-2 p-2 rounded-lg' src={item?.image} alt='' />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <MuitichoiceOneRight
                  type={6}
                  listAnswer={answer}
                  dataTest={dataTest}
                  key={key}
                  idQuestion={idQuestion}
                  idChildQuestion={item.idChildQuestion}
                  answerTrue={answerTrue}
                  typeTestReturn={props.typeTestReturn}
                />
              </div>
            );
          case 2:
            return (
              <div key={i}>
                <div className='flex'>
                  <div className='font-bold whitespace-nowrap'>Câu {`${index++}`}</div>
                  <div className='pl-1'>
                    {<MathJaxRender math={`${item.text}`} />}
                    {item.image ? (
                      <img className='w-[150px] border-2 p-2 rounded-lg' src={item?.image} alt='' />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <MuitichoiceMultiRight
                  type={6}
                  listAnswer={answer}
                  dataTest={dataTest}
                  key={key}
                  idQuestion={idQuestion}
                  idChildQuestion={item.idChildQuestion}
                  answerTrue={answerTrue}
                  typeTestReturn={props.typeTestReturn}
                />
              </div>
            );
          case 4:
            return (
              <div key={i}>
                <div className='flex'>
                  <div className='font-bold whitespace-nowrap'>Câu {`${index++}`}</div>
                  <div className='pl-1'>
                    {<MathJaxRender math={`${item.text}`} />}
                    {item.image ? (
                      <img className='w-[150px] border-2 p-2 rounded-lg' src={item?.image} alt='' />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                {/* <MuitichoiceOneRight
                                            type={6}
                                            listAnswer={answer}
                                            dataTest={dataTest}
                                            key={key}
                                            idQuestion={idQuestion}
                                            idChildQuestion={item.idChildQuestion}
                                            answerTrue={answerTrue}
                                        /> */}
              </div>
            );
          default:
            break;
        }
      })}
    </>
  );
};
export default Reading;
