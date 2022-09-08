import { Divider, RingProgress } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Icon from 'assets/icondetail.svg';
import MathJaxRender from 'components/MathJax';
import MuitichoiceMultiRight from 'container/Test/Result/components/MultiChoiceMultiRight';
import MuitichoiceOneRight from 'container/Test/Result/components/MutiChoiceOneRight';
import Reading from 'container/Test/Result/components/Reading';
import ReadingResult from 'container/Test/Result/DisplayResult/ReadingResult';
import FillBankResult from 'container/Test/Result/FillBankResult';
import { Book, Timer1 } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { alphabet, formatTimeString } from 'utils/utils';
import WrittingResult from './../../../container/Test/Result/WritingResult';

const index = () => {
  let i = 1;
  const [Exam, setExam] = useState<any>([]);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [dataTest, setDataTest] = useState<any>([]);
  const [timeStart, setTimeStart] = useState<any>();
  const [totalQuestionTrue, setTotalQuestionTrue] = useState(0);
  const [totalQuestionFalse, setTotalQuestionFalse] = useState(0);
  const [idTest, setIdTest] = useState(null);
  const [timer, setTimer] = useState('');
  const params = useParams();
  const alphabe = alphabet();
  const [infoTest, setInfoTest] = useState<any>();

  const navigate = useNavigate();
  const renderAnswer = (
    quiz_type: number,
    listAnswer: any,
    dataTest: any,
    key: any,
    answerTrue: any,
    idx?: any,
    resultReturnType?: any
  ) => {
    if (quiz_type == 1) {
      return (
        <MuitichoiceOneRight
          listAnswer={listAnswer}
          dataTest={dataTest}
          key={key}
          idQuestion={key.idQuestion}
          answerTrue={answerTrue}
          typeTestReturn={resultReturnType}
        />
      );
    }
    if (quiz_type == 3) {
      return (
        <MuitichoiceOneRight
          listAnswer={listAnswer}
          dataTest={dataTest}
          key={key}
          idQuestion={key.idQuestion}
          answerTrue={answerTrue}
          typeTestReturn={resultReturnType}
        />
      );
    }
    if (quiz_type == 6) {
      let index = indexQS;
      indexQS = key.listQuestionChildren.length + index;
      return (
        <Reading
          listQuestionChildren={key.listQuestionChildren}
          listAnswer={listAnswer}
          dataTest={dataTest}
          key={key}
          idQuestion={key.idQuestion}
          answerTrue={answerTrue}
          index={index}
          typeTestReturn={resultReturnType}
        />
      );
    }
    if (quiz_type == 2) {
      return (
        <MuitichoiceMultiRight
          listAnswer={listAnswer}
          dataTest={dataTest}
          key={key}
          idQuestion={key.idQuestion}
          answerTrue={answerTrue}
          typeTestReturn={resultReturnType}
        />
      );
    }
    if (quiz_type == 0 || quiz_type == 4) {
      let isTrue = false;
      let content = '';
      const data = dataTest?.listQuestionGraded.filter((i: any) => i.idQuestion == key.idQuestion);
      if (data.length > 0) {
        isTrue = data[0].isTrue;
        content = data[0].userAnswer;
      }
      return <WrittingResult isTrue={isTrue} content={content} />;
    }
    if (quiz_type == 7) {
      let content: any[] = [];
      const data = dataTest?.listQuestionGraded.filter((i: any) => i.idQuestion == key.idQuestion);

      if (data.length > 0) {
        key?.listQuestionChildren.map((k: any) => {
          let chk = false;
          let item = null;
          data[0].userAnswer.map((i: any) => {
            if (k.idChildQuestion == i.idChildQuestion) {
              chk = true;
              item = i;
            }
          });
          if (chk) {
            content.push(item);
          } else {
            content.push('');
          }
        });
      }

      return <FillBankResult data={key} result={content} />;
    }
  };
  useEffect(() => {
    RequestAPI({
      url: PathAPI.baikiemtra + '/' + params.idTest,
      method: 'GET',
    }).then((res: any) => {
      setIdTest(res.data.listTest[0]);
      setInfoTest(res.data);
      console.log(res.data);
    });
    if (typeof window !== 'undefined') {
      let data: any = localStorage.getItem('testData');
      let question: any = localStorage.getItem('dataQuestion');
      if (typeof question !== 'string' || question !== null) {
        setExam(JSON.parse(question));
      }
      if (typeof data !== 'string' || data !== null) {
        setDataTest(JSON.parse(data));
        let d = JSON.parse(data);
        let convert = formatTimeString(d.timeStart);
        let convert1 = formatTimeString(d.timeFinish);
        const today: any = new Date(d.timeStart);
        const endDate: any = new Date(d.timeFinish);
        const days = (endDate - today) / (1000 * 60 * 60 * 24);
        const hour = parseInt(((Math.abs(endDate - today) / (1000 * 60 * 60)) % 24) + '');
        const minute = parseInt(
          ((Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60) + ''
        );
        const second = parseInt(Math.abs(((endDate.getTime() - today.getTime()) / 1000) % 60) + '');
        let str =
          hour > 0
            ? hour + ' giờ ' + minute + ' phút ' + (second < 0 ? second * -1 : second) + ' giây'
            : minute + ' phút ' + (second < 0 ? second * -1 : second) + ' giây';
        setTimer(str);
        setTimeStart(convert);
      }
    }
  }, []);
  useEffect(() => {
    if (Exam.length > 0) {
      let QuestionChildNumber = 0;
      const childQuestion = Exam?.filter(
        (i: any) => i.listQuestionChildren.length > 0 && i.quiz_type == 6
      );
      if (childQuestion.length > 0) {
        childQuestion.map((key: any) => {
          QuestionChildNumber = QuestionChildNumber + key.listQuestionChildren.length;
        });
      }

      setTotalQuestion(Exam?.length + QuestionChildNumber - childQuestion.length);
      Exam?.map((k: any) => {
        if (k.quiz_type != 6) {
          const filterQuestion = dataTest?.listQuestionGraded.filter(
            (it: any) => it.idQuestion == k.idQuestion
          );

          const filterQuestionFalse = dataTest?.listQuestionGraded.filter(
            (it: any) => it.idQuestion == k.idQuestion
          );

          if (filterQuestion.length > 0) {
            if (filterQuestion[0].isTrue) {
              setTotalQuestionTrue((pre: any) => pre + filterQuestion.length);
            } else {
              setTotalQuestionFalse((pre: any) => pre + filterQuestionFalse.length);
            }
          }
        } else {
          const filterQuestion = dataTest?.listQuestionGraded?.filter(
            (it: any) => it.idQuestion == k.idQuestion
          );

          if (filterQuestion.length > 0) {
            if (filterQuestion[0].userAnswer.length > 0) {
              const numQuestionAnswerTrue = filterQuestion[0].userAnswer.filter(
                (it: any) => it.isTrue == true
              );
              const numQuestionAnswerFalse = filterQuestion[0].userAnswer.filter(
                (it: any) => it.isTrue == false
              );
              console.log(numQuestionAnswerFalse.length);

              setTotalQuestionTrue((pre: number) => pre + numQuestionAnswerTrue.length);
              setTotalQuestionFalse((pre: number) => pre + numQuestionAnswerFalse.length);
            }
          }
        }
      });
    }
  }, [Exam]);

  let ind = 0;
  let indexQS = 1;

  return (
    <>
      <div className='flex mx-[120px] px-6 mt-[105px]'>
        <div className='w-3/4'>
          <div
            className='bg-[white] rounded-3xl'
            style={{ boxShadow: '0px 2px 10px rgba(0, 82, 166, 0.23)' }}
          >
            <div className='px-10 pb-5'>
              <div className='flex items-center text-center'>
                <img src={Icon} alt='' style={{ width: 94, height: 114 }} />
                <div className='pl-3 text-[25px] font-bold uppercase text-black w-full'>
                  <div className='text-center font-bold text-4xl'>KẾT QUẢ</div>
                  <div className='text-center font-bold text-3xl pt-2'>{infoTest?.name}</div>
                </div>
              </div>

              <div className='pt-3 px-4 flex justify-between'>
                <div className='w-[305px]'>
                  <div className='text-[16px] text-black'>
                    Bắt đầu làm bài:{' '}
                    <span className='font-bold'>
                      {new Date(dataTest.timeStart).getHours() +
                        ':' +
                        timeStart?.minutes +
                        ' ' +
                        timeStart?.date +
                        '/' +
                        timeStart?.month +
                        '/' +
                        timeStart?.year +
                        ' '}
                    </span>
                  </div>
                  <div className='flex items-center pt-3'>
                    <Timer1 size='23' color='#000' />
                    <div className='text-black text-[16px]'>
                      Thời gian làm: <span className='font-bold pl-1'>{timer}</span>
                    </div>
                  </div>
                  <div className='flex items-center pt-3'>
                    <Book size='23' color='#000' />
                    <div className='text-black text-[16px] pl-1'>
                      Số câu đúng:{' '}
                      <span className='font-bold'>
                        {totalQuestionTrue}/{totalQuestion} câu
                      </span>
                    </div>
                  </div>
                  <div className='pt-5'>
                    <a href={`/bai-thi/${params.slug}/${params.idTest}`}>
                      <div className='flex justify-center items-center px-8 py-2 text-sm rounded-3xl bg-ct-secondary text-white  w-full'>
                        {' '}
                        Luyện tập lại{' '}
                      </div>
                    </a>
                  </div>
                  <div className='pt-3'>
                    <a href={``}>
                      <div
                        className='flex justify-center items-center text-ct-secondary text-sm rounded-3xl px-8 py-2 w-full'
                        style={{ border: '1px solid #2691FF' }}
                      >
                        {' '}
                        Xem thống kê{' '}
                      </div>
                    </a>
                  </div>
                </div>
                <div>
                  <RingProgress
                    label={
                      <>
                        <div className='text-center text-bold text-ct-secondary text-3xl'>
                          {Math.round(dataTest?.score * 100) / 100}
                        </div>
                        <div className='text-center text-3xl uppercase '>điểm</div>
                      </>
                    }
                    size={230}
                    thickness={23}
                    sections={[
                      {
                        value: dataTest?.score * 10,
                        color: 'blue',
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* danh sách câu hỏi */}
          <div
            className='bg-[white] rounded-3xl container mx-auto mt-2 py-8 px-14'
            style={{ boxShadow: '0px 2px 10px rgba(0, 82, 166, 0.23)' }}
          >
            {/* Câu hoie */}
            {Exam
              ? Exam?.map((key: any, item: any) => {
                  const listAnswer = key.listSelectOptions;
                  const text = key.text;
                  //   dataTest.listQuestionGraded.map((it2: any, i: any) => {
                  //   console.log(it2.idQuestion);
                  let chk = false;
                  let aswerTrue: any = 0;
                  let userAswer: any[] = [];
                  let answer = listAnswer?.filter((i: any) => i.is_true === true);

                  aswerTrue = answer[0]?.answer_id;
                  return (
                    <div key={item}>
                      <div className='flex text-black'>
                        {key.quiz_type != 6 ? (
                          <div className='font-bold whitespace-nowrap'>Câu {indexQS++}: </div>
                        ) : (
                          ''
                        )}
                        <div className='pl-1 '>
                          {key.quiz_type == 7 ? (
                            <span>Điền vào chỗ trống</span>
                          ) : (
                            <>
                              {' '}
                              <MathJaxRender math={`${text}`} />
                              {key.image ? (
                                <img className='border-2 p-2 rounded-lg' src={key?.image} alt='' />
                              ) : (
                                ''
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className='text-black'>
                        {renderAnswer(
                          key.quiz_type,
                          listAnswer,
                          dataTest,
                          key,
                          aswerTrue,
                          indexQS,
                          infoTest?.resultReturnType
                        )}
                      </div>
                      <Divider my='sm' />
                    </div>
                  );
                  //   });
                })
              : null}
          </div>
        </div>
        <div className='w-1/4 pl-5 sticky top-0 h-screen'>
          <div
            className='bg-[#DFDFDF] rounded-3xl fixed w-[285px]'
            style={{ boxShadow: '0px 2px 10px rgba(0, 82, 166, 0.23)' }}
          >
            {/* list câu hoi */}
            <div className='bg-[white] py-5 text-black'>
              <div className='px-6'>
                <div
                  className={`grid grid-cols-5 gap-2 ${
                    totalQuestion >= 40 ? 'h-[300px]' : ''
                  } overflow-y-auto`}
                >
                  {Exam
                    ? Exam?.map((key: any, index: any) => {
                        let chk = false; // check đáp án đúng của câu hỏi với đáp án user lựa chọn
                        let check = false; // check user có làm câu hỏi này không, mặc định là k
                        let answer = null;

                        ind++;
                        // lọc dữ liệu data kết quả trả về theo id Question
                        const filter = dataTest?.listQuestionGraded.filter(
                          (it: any) => it.idQuestion == key.idQuestion
                        );
                        if (filter.length > 0) {
                          // nếu filter [] là mảng có độ dài lớn hơn không thì câu này user đã làm
                          check = true;
                          if (filter[0].isTrue) {
                            chk = true;
                          }
                          answer = filter[0].userAnswer;
                        }

                        if (key.quiz_type == 6) {
                          let i = ind;
                          ind = key.listQuestionChildren.length + ind - 1;
                          return (
                            <ReadingResult
                              listQuestionChildren={key.listQuestionChildren}
                              userAnswer={answer}
                              index={i}
                            />
                          );
                        }

                        if (!check) {
                          return (
                            <div
                              className='rounded-full flex justify-center items-center w-8 h-8 border border-[#ddd] text-[12px] target p-1'
                              id={'question' + key.idQuestion}
                            >
                              {ind}
                            </div>
                          );
                        } else {
                          if (chk) {
                            return (
                              <div
                                className='rounded-full flex justify-center items-center w-8 h-8 text-white bg-ct-green-300 text-[12px] target p-1'
                                id={'question' + key.idQuestion}
                              >
                                {ind}
                              </div>
                            );
                          } else {
                            return (
                              <div
                                className='rounded-full flex justify-center items-center w-8 h-8 text-white bg-ct-red-300 text-[12px] target p-1'
                                id={'question' + key.idQuestion}
                              >
                                {ind}
                              </div>
                            );
                          }
                        }
                      })
                    : null}
                </div>
              </div>
            </div>
            <div className='px-8 py-3 w-full text-black'>
              <div className='flex flex-col'>
                <div className='flex items-center'>
                  <div className='rounded-full flex justify-center items-center w-6 max-h-6 border bg-[white] border-[#ddd]  target p-1 text-[10px]'>
                    {totalQuestion - totalQuestionFalse - totalQuestionTrue}
                  </div>
                  <div className='pl-2 text-[15px]'>Số câu chưa làm</div>
                </div>
                <div className='flex items-center mt-2'>
                  <div className='rounded-full flex justify-center items-center w-6 max-h-6 text-white bg-ct-green-300  target p-1 text-[10px]'>
                    {totalQuestionTrue}
                  </div>
                  <div className='pl-2 text-[15px]'>Số câu đúng</div>
                </div>
                <div className='flex items-center mt-2'>
                  <div className='rounded-full flex justify-center items-center w-6 max-h-6 text-white bg-ct-red-300 border-ct-secondary target p-1 text-[10px]'>
                    {totalQuestionFalse}
                  </div>
                  <div className='pl-2 text-[15px]'>Số câu sai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default React.memo(index);
