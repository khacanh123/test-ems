import MathJaxRender from 'components/MathJax';
import { useState } from 'react';
import { alphabet } from 'utils/utils';
const MultichoiceMultiRight = (props: any) => {
  const [errorType, setErrorType] = useState(1);
  let chk = false;
  const { listAnswer, dataTest } = props;
  const alphabe = alphabet();
  let answerTrue = props.answerTrue;
  let userAnswer: any = [];

  return (
    <>
      {errorType === 3 ? (
        <span className='text-ct-red-300 font-bold'>Phương án lựa chọn không chính xác!</span>
      ) : (
        ''
      )}
      <div className='grid grid-cols-2 gap-2 mt-2 mb-2'>
        {props.typeTestReturn === 1
          ? listAnswer &&
            listAnswer?.map((item: any, index: number) => {
              let chk = false;
              let check = 1; // không chọn
              answerTrue = listAnswer?.filter((i: any) => i.is_true == true);
              if (props.type == 6) {
                const filter = dataTest?.listQuestionGraded?.filter(
                  (it: any) => it.idQuestion == props.idQuestion
                );

                if (filter.length > 0) {
                  const filterChildQuestion = filter[0]?.userAnswer.filter(
                    (i: any) => i.idChildQuestion == props.idChildQuestion
                  );
                  if (filterChildQuestion.length > 0) {
                    chk = true;
                    userAnswer = filterChildQuestion[0].answer;
                    if (
                      answerTrue[0].answer_id == item.answer_id &&
                      userAnswer[0] == item.answer_id
                    ) {
                      check = 2; // chọn đúng
                    } else if (
                      answerTrue[0].answer_id != item.answer_id &&
                      userAnswer[0] == item.answer_id
                    ) {
                      check = 3; // chọn nhưng sai
                    }
                  }
                }
              } else {
                const filter = dataTest?.listQuestionGraded?.filter(
                  (it: any) => it.idQuestion == props.idQuestion
                );
                if (filter.length > 0) {
                  userAnswer = filter[0].userAnswer;
                  chk = true;

                  if (
                    answerTrue[0].answer_id == item.answer_id &&
                    userAnswer[0] == item.answer_id
                  ) {
                    check = 2; // chọn đúng
                  } else if (
                    answerTrue[0].answer_id != item.answer_id &&
                    userAnswer[0] == item.answer_id
                  ) {
                    check = 3; // chọn nhưng sai
                  }
                }
              }

              if (item.answer_content) {
                if (!chk) {
                  return (
                    <div
                      key={index}
                      className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black'
                      style={{
                        border: '1px solid #dfdfdf',
                      }}
                    >
                      <p className='font-bold pr-2'>{alphabe[index]}:</p>

                      <MathJaxRender math={`${item.answer_content}`} />
                    </div>
                  );
                } else {
                  if (check == 2) {
                    return (
                      <div
                        key={index}
                        className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border-2 border-ct-green-300'
                      >
                        <p className='font-bold pr-2'>{alphabe[index]}:</p>

                        <MathJaxRender math={`${item.answer_content}`} />
                      </div>
                    );
                  } else if (check == 3) {
                    return (
                      <div
                        key={index}
                        className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border-2 border-ct-red-300'
                      >
                        <p className='font-bold pr-2'>{alphabe[index]}:</p>

                        <MathJaxRender math={`${item.answer_content}`} />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border'
                      >
                        <p className='font-bold pr-2'>{alphabe[index]}:</p>

                        <MathJaxRender math={`${item.answer_content}`} />
                      </div>
                    );
                  }
                }
              } else if (item.answer_url_image) {
                if (!chk) {
                  return (
                    <div
                      key={index}
                      className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black'
                      style={{
                        border: '1px solid #dfdfdf',
                      }}
                    >
                      <p className='font-bold pr-2'>{alphabe[index]}:</p>

                      <img
                        key={index}
                        className={`w-[150px] p-2 rounded-lg`}
                        src={item.answer_url_image}
                        alt=''
                      />
                    </div>
                  );
                } else {
                  if (check == 2) {
                    return (
                      <div
                        key={index}
                        className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border-2 border-ct-green-300'
                      >
                        <p className='font-bold pr-2'>{alphabe[index]}:</p>
                        <img
                          key={index}
                          className={`w-[150px] p-2 rounded-lg`}
                          src={item.answer_url_image}
                          alt=''
                        />
                      </div>
                    );
                  } else if (check == 3) {
                    return (
                      <div
                        key={index}
                        className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border-2 border-ct-red-300'
                      >
                        <p className='font-bold pr-2'>{alphabe[index]}:</p>
                        <img
                          key={index}
                          className={`w-[150px] p-2 rounded-lg`}
                          src={item.answer_url_image}
                          alt=''
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border'
                      >
                        <p className='font-bold pr-2'>{alphabe[index]}:</p>

                        <img
                          key={index}
                          className={`w-[150px] p-2 rounded-lg`}
                          src={item.answer_url_image}
                          alt=''
                        />
                      </div>
                    );
                  }
                }
              }
            })
          : listAnswer?.map((item: any, index: number) => {
              let is_choice = false;
              if (props.type == 6) {
                const filter = dataTest?.listQuestionGraded?.filter(
                  (it: any) => it.idQuestion == props.idQuestion
                );
                if (filter.length > 0) {
                  const filterChildQuestion = filter[0]?.userAnswer?.filter(
                    (i: any) => i?.idChildQuestion == props.idChildQuestion
                  );
                  // neu user chon dap an cau hoi con
                  if (filterChildQuestion.length > 0) is_choice = true;
                  userAnswer = filterChildQuestion[0]?.answer;
                }
              } else {
                const filter = dataTest?.listQuestionGraded?.filter(
                  (it: any) => it.idQuestion == props.idQuestion
                );
                if (filter.length > 0) {
                  if (filter[0].isTrue) {
                    chk = true;
                  }
                  is_choice = true;
                  userAnswer = filter[0].userAnswer;
                }
              }
              answerTrue = listAnswer?.filter((i: any) => i.is_true == true);

              if (item.answer_content) {
                let check = true;
                userAnswer?.map((k: any) => {
                  if (item.answer_id == k) {
                    check = false;
                  }
                });

                if (is_choice) {
                  if (check) {
                    if (item.is_true) {
                      return (
                        <div
                          key={index}
                          className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border-2 border-ct-red-300'
                        >
                          <p className='font-bold pr-2'>{alphabe[index]}:</p>

                          <MathJaxRender math={`${item.answer_content}`} />
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer'
                          style={{
                            border: '1px solid #dfdfdf',
                          }}
                        >
                          <p className='font-bold pr-2'>{alphabe[index]}:</p>

                          <MathJaxRender math={`${item.answer_content}`} />
                        </div>
                      );
                    }
                  } else {
                    return (
                      <div
                        key={index}
                        className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border-2 border-ct-green-300'
                      >
                        <p className='font-bold pr-2'>{alphabe[index]}:</p>

                        <MathJaxRender math={`${item.answer_content}`} />
                      </div>
                    );
                  }
                } else {
                  return (
                    <div
                      key={index}
                      className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer'
                      style={{
                        border: '1px solid #dfdfdf',
                      }}
                    >
                      <p className='font-bold pr-2'>{alphabe[index]}:</p>

                      <MathJaxRender math={`${item.answer_content}`} />
                    </div>
                  );
                }
              } else if (item.answer_url_image) {
                let check = true;
                userAnswer?.map((k: any) => {
                  if (item.answer_id == k) {
                    check = false;
                  }
                });

                if (is_choice) {
                  if (check) {
                    if (item.is_true) {
                      return (
                        <div
                          key={index}
                          className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border-2 border-ct-green-300'
                        >
                          <p className='font-bold pr-2'>{alphabe[index]}:</p>
                          <img
                            key={index}
                            className={`w-[150px] p-2 rounded-lg`}
                            src={item.answer_url_image}
                            alt=''
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer'
                          style={{
                            border: '1px solid #dfdfdf',
                          }}
                        >
                          <p className='font-bold pr-2'>{alphabe[index]}:</p>

                          <img
                            key={index}
                            className={`w-[150px] p-2 rounded-lg`}
                            src={item.answer_url_image}
                            alt=''
                          />
                        </div>
                      );
                    }
                  } else {
                    if (item.is_true) {
                      return (
                        <div
                          key={index}
                          className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border-2 border-ct-green-300'
                        >
                          <p className='font-bold pr-2'>{alphabe[index]}:</p>
                          <img
                            key={index}
                            className={`w-[150px] p-2 rounded-lg`}
                            src={item.answer_url_image}
                            alt=''
                          />
                        </div>
                      );
                    }
                    return (
                      <div
                        key={index}
                        className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer text-black border-2 border-ct-red-300'
                      >
                        <p className='font-bold pr-2'>{alphabe[index]}:</p>

                        <img
                          key={index}
                          className={`w-[150px] p-2 rounded-lg`}
                          src={item.answer_url_image}
                          alt=''
                        />
                      </div>
                    );
                  }
                } else {
                  return (
                    <div
                      key={index}
                      className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer'
                      style={{
                        border: '1px solid #dfdfdf',
                      }}
                    >
                      <p className='font-bold pr-2'>{alphabe[index]}:</p>

                      <img
                        key={index}
                        className={`w-[150px] p-2 rounded-lg`}
                        src={item.answer_url_image}
                        alt=''
                      />
                    </div>
                  );
                }
              }
            })}
      </div>
    </>
  );
};
export default MultichoiceMultiRight;
