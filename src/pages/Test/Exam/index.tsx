import { Divider, LoadingOverlay, Modal } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Icon from 'assets/icondetail.svg';
import Button from 'components/Button';
import MathJaxRender from 'components/MathJax';
import { Book, Edit2, Timer1 } from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';

import Timer from 'assets/timer.svg';
import FillBank from 'container/Test/Exam/components/FillBank';
import MultiChoiceMultiRight from 'container/Test/Exam/components/MultiChoiceMultiRight';
import MultiChoiceOneRight from 'container/Test/Exam/components/MultiChoiceOneRight';
import Reading from 'container/Test/Exam/components/Reading';
import Writing from 'container/Test/Exam/components/Writing';
import YesOrNo from 'container/Test/Exam/components/YesOrNo';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { updateQuestionEdit } from 'store/slice/question';
import { alphabet } from 'utils/utils';
import './style.css';
import { notify } from 'utils/notify';
const answerSelect: any[] = [];
const question: any[] = [];
const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};
const index = () => {
  const [Exam, setExam] = useState<any>([]);
  const [Question, setQuestion] = useState<any>([]);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [visible, setVisible] = useState(false);
  const [timeStart, setTimeStart] = useState('');
  const [idTest, setIdTest] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [opened, setOpened] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [number, setnumber] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [status, setStatus] = useState(STATUS.STOPPED);
  const [name, setName] = useState('');
  const [infoTest, setInfoTest] = useState<any>();
  const [numQuestionAnswer, setNumQuestionAnswer] = useState(0);
  const [realoadquest, setRealoadquest] = useState(false);

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleStart = () => {
    setStatus(STATUS.STARTED);
  };
  const handleStop = () => {
    setStatus(STATUS.STOPPED);
  };
  // const handleReset = () => {
  //   setStatus(STATUS.STOPPED);
  //   setSecondsRemaining(INITIAL_COUNT);
  // };
  const editQuestion = async (isOpenPreview: any) => {
    const id = isOpenPreview;
    // localStorage.removeItem('idQuestion');
    localStorage.setItem('redirectPreview', `/bai-thi/${params.slug}/${params.idTest}`);
    localStorage.setItem('idQuestion', '' + id);
    const toNewtab = document.getElementById('toNewtab');
    toNewtab?.click();
    console.log(id);
  };
  document.addEventListener('visibilitychange', function () {
    setRealoadquest(document.hidden);
  });
  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        // setStatus(STATUS.STOPPED);
        // setOpened(true);
      }
    },
    status === STATUS.STARTED ? 1000 : null
    // passing null stops the interval
  );
  const alphabe = alphabet();
  const params = useParams();
  function useInterval(callback: any, delay: any) {
    const savedCallback = useRef<any>(null);

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  const navigate = useNavigate();
  // chọn đáp án
  const SelectAnswer = (
    key: any,
    answerId: any,
    Q_Id: any,
    idChildQuestion: any,
    type: any,
    aw: any
  ) => {
    // dạng bài đọc
    if (type == 6) {
      // kiểu trả lời 1 đáp án đúng
      if (aw == 1) {
        let index = answerSelect.findIndex((i: any) => i.idQuestion == Q_Id);

        if (index == -1) {
          let item = {
            idQuestion: Q_Id,
            answer: [
              {
                idChildQuestion: idChildQuestion,
                answer: [answerId],
              },
            ],
          };
          answerSelect.push(item);
          setNumQuestionAnswer((prv: number) => prv + 1);

          return;
        } else {
          //tìm vị trí câu hỏi con
          let idx = answerSelect[index].answer.findIndex(
            (i: any) => i.idChildQuestion == idChildQuestion
          );
          if (idx == -1) {
            answerSelect[index].answer.push({
              idChildQuestion: idChildQuestion,
              answer: [answerId],
            });
            setNumQuestionAnswer((prv: number) => prv + 1);
          } else {
            answerSelect[index].answer[idx].answer = [answerId];
          }
        }

        return;
      }
      // kiểu câu hỏi nhiều đáp án
      if (aw == 2) {
        let index = answerSelect.findIndex((i: any) => i.idQuestion == Q_Id);
        if (index == -1) {
          let item = {
            idQuestion: Q_Id,
            answer: [
              {
                idChildQuestion: idChildQuestion,
                answer: [answerId],
              },
            ],
          };
          const element = document.getElementById('answer' + answerId);
          if (element !== null) {
            element.style.background = '#2691FF';
            element.style.border = 'none';
            element.style.color = '#fff';
          }
          answerSelect.push(item);
          setNumQuestionAnswer((prv: number) => prv + 1);
        } else {
          //tìm vị trí câu hỏi con
          let idx = answerSelect[index].answer.findIndex(
            (i: any) => i.idChildQuestion == idChildQuestion
          );
          if (idx == -1) {
            answerSelect[index].answer.push({
              idChildQuestion: idChildQuestion,
              answer: [answerId],
            });
            const element = document.getElementById('answer' + answerId);
            if (element !== null) {
              element.style.background = '#2691FF';
              element.style.border = 'none';
              element.style.color = '#fff';
            }
            setNumQuestionAnswer((prv: number) => prv + 1);
          } else {
            const element = document.getElementById('answer' + answerId);
            if (element != null) {
              element.style.background = '#fff';
              element.style.border = '1px solid #dfdfdf';
              element.style.color = '#000';
            }
            const filter = answerSelect[index].answer[idx].answer.filter((i: any) => i != answerId);
            answerSelect[index].answer[idx].answer = filter;
          }
        }

        return;
      }
      // kiểu câu hỏi trả lời ngắn
      if (aw == 4) {
        let index = answerSelect.findIndex((i: any) => i.idQuestion == Q_Id);
        // console.log(index);

        if (index == -1) {
          let item = {
            idQuestion: Q_Id,
            answer: [
              {
                idChildQuestion: idChildQuestion,
                answer: answerId,
              },
            ],
          };
          answerSelect.push(item);
          setNumQuestionAnswer((prv: number) => prv + 1);
        } else {
          //tìm vị trí câu hỏi con
          let idx = answerSelect[index].answer.findIndex(
            (i: any) => i.idChildQuestion == idChildQuestion
          );
          if (idx == -1) {
            answerSelect[index].answer.push({
              idChildQuestion: idChildQuestion,
              answer: answerId,
            });
            setNumQuestionAnswer((prv: number) => prv + 1);
          } else {
            answerSelect[index].answer[idx].answer = answerId;
          }
        }

        return;
      }
      //kiểu yes/no
      if (aw == 3) {
        let index = answerSelect.findIndex((i: any) => i.idQuestion == Q_Id);

        if (index == -1) {
          let item = {
            idQuestion: Q_Id,
            answer: [
              {
                idChildQuestion: idChildQuestion,
                answer: [answerId],
              },
            ],
          };
          answerSelect.push(item);
          setNumQuestionAnswer((prv: number) => prv + 1);

          return;
        } else {
          //tìm vị trí câu hỏi con
          let idx = answerSelect[index].answer.findIndex(
            (i: any) => i.idChildQuestion == idChildQuestion
          );
          if (idx == -1) {
            answerSelect[index].answer.push({
              idChildQuestion: idChildQuestion,
              answer: [answerId],
            });
            setNumQuestionAnswer((prv: number) => prv + 1);
          } else {
            answerSelect[index].answer[idx].answer = [answerId];
          }
        }
        return;
      }
    }

    // dạng nhiều đáp án
    if (type == 2) {
      let index = answerSelect.findIndex((i: any) => i.idQuestion == Q_Id);
      if (index == -1) {
        let item = {
          idQuestion: Q_Id,
          answer: [answerId],
        };
        const element = document.getElementById('answer' + answerId);
        if (element !== null) {
          element.style.border = '2px solid #2691FF';
        }
        answerSelect.push(item);
        setNumQuestionAnswer((prv: number) => prv + 1);
      } else {
        const isChoiceAnswer = answerSelect[index].answer.findIndex((i: any) => i == answerId);

        if (isChoiceAnswer !== -1) {
          const element = document.getElementById('answer' + answerId);
          if (element != null) {
            element.style.background = '#fff';
            element.style.border = '1px solid #dfdfdf';
            element.style.color = '#000';
          }

          const filterAnswer = answerSelect[index].answer.filter((i: any) => i != answerId);
          answerSelect[index].answer = filterAnswer;
        } else {
          const element = document.getElementById('answer' + answerId);
          if (element !== null) {
            element.style.border = '2px solid #2691FF';
          }
          answerSelect[index].answer.push(answerId);
        }
      }

      return;
    }
    if (type == 7 || type == 0 || type == 4) {
      if (answerSelect.length === 0) {
        let item = {
          answer: answerId,
          idQuestion: Q_Id,
        };
        answerSelect.push(item);
        setNumQuestionAnswer((prv: number) => prv + 1);
      } else {
        let chk = true;
        answerSelect.map((key: any, index: number) => {
          if (key.idQuestion === Q_Id) {
            answerSelect[index].answer = answerId;
            chk = false;
          }
        });
        if (chk) {
          let item = {
            answer: answerId,
            idQuestion: Q_Id,
          };
          answerSelect.push(item);
          setNumQuestionAnswer((prv: number) => prv + 1);
        }
      }
      console.log(answerSelect);
      return;
    }
    if (answerSelect.length === 0) {
      let item = {
        answer: [answerId],
        idQuestion: Q_Id,
      };
      answerSelect.push(item);
      setNumQuestionAnswer((prv: number) => prv + 1);
    } else {
      let chk = true;
      answerSelect.map((key: any, index: number) => {
        if (key.idQuestion === Q_Id) {
          answerSelect[index].answer = [answerId];
          chk = false;
        }
      });
      if (chk) {
        let item = {
          answer: [answerId],
          idQuestion: Q_Id,
        };
        answerSelect.push(item);
        setNumQuestionAnswer((prv: number) => prv + 1);
      }
    }
  };
  const dispatch = useDispatch();
  const handleEditQuestion = (id: number) => {
    RequestAPI({
      url: PathAPI.question + '/' + id,
      method: 'GET',
    }).then((res: any) => {
      localStorage.setItem('redirectPreview', `/bai-thi/${params.slug}/${params.idTest}`);
      dispatch(updateQuestionEdit(res.data));
      navigate('/manage-question/question/create');
    });
  };
  const submitData = () => {
    if (infoTest.minQuestionSubmit > 0 && Exam.listQuestion.length > infoTest.minQuestionSubmit) {
      if (answerSelect.length < infoTest.minQuestionSubmit) {
        return notify({
          type: 'error',
          message: `Số câu tối thiểu để nộp bài là ${infoTest.minQuestionSubmit} câu.`,
        });
      }
    }
    Exam?.listQuestion.map((key: any) => {
      let qs = {
        idQuestion: key.idQuestion,
        weight: key.weight,
      };
      question.push(qs);
    });
    let data = {
      timeStart: timeStart,
      listQuestion: question,
      listUserAnswer: answerSelect,
    };
    RequestAPI({
      url: PathAPI.submitTest + '?apikey=' + API_KEY,
      method: 'POST',
      payload: data,
    }).then((res: any) => {
      if (typeof window !== 'undefined') {
        if (res.status) {
          localStorage.setItem('testData', JSON.stringify(res.data));
          localStorage.setItem('dataQuestion', JSON.stringify(Question));
        }
      }
      navigate(`/ket-qua/${params.slug}/${params.idTest}`);
    });
  };

  const RenderAnswer = (type: any, data: any, key: any, idx?: any) => {
    if (type == 1) {
      return (
        <MultiChoiceOneRight
          handleQuestionData={SelectAnswer}
          data={data}
          key={key}
          idQuestion={key.idQuestion}
        />
      );
    }
    if (type == 6) {
      let index = indexQS;
      indexQS = key.listQuestionChildren.length + index;
      return (
        <Reading
          handleQuestionData={SelectAnswer}
          data={key.listQuestionChildren}
          key={key}
          idQuestion={key.idQuestion}
          index={index}
        />
      );
    }
    if (type == 0 || type == 4) {
      return (
        <Writing
          handleQuestionData={SelectAnswer}
          data={key.listQuestionChildren}
          key={key}
          type={key.quiz_type}
          idQuestion={key.idQuestion}
        />
      );
    }
    if (type == 2) {
      return (
        <MultiChoiceMultiRight
          handleQuestionData={SelectAnswer}
          data={data}
          key={key}
          type={key.quiz_type}
          idQuestion={key.idQuestion}
        />
      );
    }
    if (type == 3) {
      return (
        <YesOrNo
          handleQuestionData={SelectAnswer}
          data={data}
          key={key}
          type={key.quiz_type}
          idQuestion={key.idQuestion}
        />
      );
    }
    if (type == 7) {
      return <FillBank handleQuestionData={SelectAnswer} data={key} idQuestion={key.idQuestion} />;
    }
  };
  useEffect(() => {
    localStorage.removeItem('redirectPreview');

    RequestAPI({
      url: PathAPI.baikiemtra + '/' + params.idTest,
      method: 'GET',
    }).then((res: any) => {
      setInfoTest(res.data);

      setIdTest(res.data.listTest[0]);
      setSecondsRemaining(res.data.timeAllow);
      setTotalTime(res.data.timeAllow / 60);
    });
  }, []);

  useEffect(() => {
    const d = new Date();
    const getData = async () => {
      setVisible(true);
      if (idTest !== null) {
        await RequestAPI({
          url: PathAPI.test + '/' + idTest,
          method: 'GET',
        }).then((res: any) => {
          setExam(res.data);
          setQuestion(res.data.listQuestion);
          let QuestionChildNumber = 0;
          const childQuestion = res.data.listQuestion.filter(
            (i: any) => i.listQuestionChildren.length > 0 && i.quiz_type === 6
          );
          childQuestion.map((key: any) => {
            QuestionChildNumber = QuestionChildNumber + key.listQuestionChildren.length;
          });
          setTotalQuestion(
            res.data.listQuestion.length + QuestionChildNumber - childQuestion.length
          );
          setName(res.data.listSubject[0].name);

          setVisible(false);
          setTimeStart(new Date().toISOString());
          setStatus(STATUS.STARTED);
          console.log(document.getElementById('content-test')?.offsetHeight);
          console.log(document.getElementById('footer')?.offsetHeight);
          console.log(document.getElementById('header')?.offsetHeight);
          console.log(document.getElementById('list-qs')?.offsetHeight);
        });
      }
    };
    getData();
  }, [idTest]);
  useEffect(() => {
    if (idTest !== null) {
      RequestAPI({
        url: PathAPI.test + '/' + idTest,
        method: 'GET',
      }).then((res: any) => {
        setQuestion(res.data.listQuestion);
      });
    }
  }, [realoadquest]);
  let ind = 1;
  let indexQS = 1;

  return (
    <>
      <div className='py-4 mx-[120px] px-6 overflow-y-hidden'>
        <LoadingOverlay visible={visible} />
        <div className='flex mx-auto container'>
          <div className='w-3/4' id='content-test'>
            <div
              className='bg-[white] rounded-3xl'
              style={{ boxShadow: '0px 2px 10px rgba(0, 82, 166, 0.23)' }}
            >
              <div className='px-10 pb-5'>
                <div className='flex items-center text-center'>
                  <img src={Icon} alt='' />
                  <div className='pl-3 text-[23px] font-bold uppercase text-black w-3/5'>
                    {infoTest?.name}
                  </div>
                </div>
                <div className='pt-5 px-1 flex justify-between'>
                  <div className='pt-3'>
                    <div className='text-[17px] text-black'>
                      Bộ môn: <span className='font-bold'>{name}</span>
                    </div>
                    <div className='flex items-center justify-center mt-2'>
                      <div className='flex items-center'>
                        <Timer1 size='23' color='#000' />
                        <div className='text-black text-[16px]'>
                          Thời gian: <span className='font-bold pl-1'> {totalTime} phút</span>
                        </div>
                      </div>
                      <div className='flex items-center pl-5'>
                        <Book size='23' color='#000' />
                        <div className='text-black text-[16px] pl-1'>
                          <span className='font-bold'>{totalQuestion} câu</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <Button
                        color='#017EFA'
                        className=' flex justify-center items-left px-2 py-2 text-sm rounded-3xl w-56 text-[11px]'
                      >
                        {' '}
                        Tải đề{' '}
                      </Button>
                    </div>
                    <div className='pt-1'>
                      <Button
                        color='#017EFA'
                        className=' flex justify-center items-left px-2 py-2 text-sm rounded-3xl w-56 text-[11px]'
                      >
                        {' '}
                        Tải đề + Đáp án{' '}
                      </Button>
                    </div>
                    <div className='pt-1'>
                      <Button
                        color='#017EFA'
                        className=' flex justify-center items-left px-2 py-2 text-sm rounded-3xl w-56 text-[11px]'
                      >
                        {' '}
                        Tải đề + Đáp án + Hướng dẫn giải{' '}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* danh sách câu hỏi */}
            <div
              className='bg-[white] rounded-3xl mt-2 py-8 px-14 text-black'
              style={{ boxShadow: '0px 2px 10px rgba(0, 82, 166, 0.23)' }}
            >
              {/* Câu hoie */}
              {Question
                ? Question.map((key: any, item: any) => {
                    const listAnswer = key.listSelectOptions;
                    const text = key.text;
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
                                  <img
                                    className='border-2 p-2 rounded-lg'
                                    src={key?.image}
                                    alt=''
                                  />
                                ) : (
                                  ''
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <Link
                          to={'/manage-question/question/create'}
                          className=''
                          // onClick={() => {
                          //   editQuestion(key.idQuestion);
                          // }}
                          target='_blank'
                          id='toNewtab'
                        >
                          {' '}
                        </Link>
                        <div
                          className='flex items-center text-ct-secondary'
                          onClick={() => {
                            editQuestion(key.idQuestion);
                          }}
                        >
                          <Edit2 size='20' color='currentColor' className='text-ct-secondary' />
                          <p>Sửa câu hỏi</p>
                        </div>

                        <div className='text-black'>
                          {RenderAnswer(key.quiz_type, listAnswer, key, indexQS)}
                        </div>
                        <Divider my='sm' />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
          <div
            className={`w-1/4 pl-3 ${scroll ? `mt-[${number}px]` : 'sticky'} top-0 h-screen`}
            id='list-qs'
            style={{
              marginTop: `${scroll ? `${number}px` : 'unset'}`,
            }}
          >
            <div
              className={`bg-[#DFDFDF] rounded-3xl ${scroll ? 'absolute' : 'fixed'} w-[324px]`}
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
                    {Question
                      ? Question?.map((key: any, index: any) => {
                          // câu hỏi con
                          const questionChildren = key?.listQuestionChildren;
                          if (key.quiz_type == 6) {
                            ind = question.length + ind;
                          }
                          return (
                            <>
                              {key.quiz_type == 6 ? (
                                questionChildren.map((k: any, i: any) => {
                                  // console.log(idx);

                                  return (
                                    <div
                                      key={i}
                                      className='rounded-full flex justify-center items-center w-8 h-8 text-black text-[12px] target p-1'
                                      style={{
                                        border: '1px solid #dfdfdf',
                                      }}
                                      id={'question' + key.idQuestion + '' + k.idChildQuestion}
                                    >
                                      {ind++}
                                    </div>
                                  );
                                })
                              ) : (
                                <div
                                  className='rounded-full flex justify-center items-center w-8 h-8 text-black text-[12px] target p-1'
                                  style={{
                                    border: '1px solid #dfdfdf',
                                  }}
                                  id={'question' + key.idQuestion}
                                >
                                  {ind++}
                                </div>
                              )}
                            </>
                          );
                          //   } else {
                          //   return (
                          //       <div
                          //           className='rounded-full flex justify-center items-center w-8 h-8 text-black text-[12px] target p-1'
                          //           style={{
                          //               border: '1px solid #dfdfdf',
                          //           }}
                          //           id={'question' + key.idQuestion}
                          //       >
                          //           {index + 1}
                          //       </div>
                          //   );
                          //   }
                        })
                      : null}
                  </div>
                  <div className='pt-2 text-center'>
                    <div className='text-[14px]'>Thời gian còn lại:</div>
                    <div className='text-[16px] font-bold' id='timer'>
                      <span id='hours'>
                        <span id='h_s'>{hoursToDisplay}</span> giờ
                      </span>{' '}
                      <span id='minutes'>{minutesToDisplay}</span> phút{' '}
                      <span id='second'>{secondsToDisplay}</span> giây
                    </div>
                  </div>
                  <div className='text-center flex-col items-center flex'>
                    <div className='pt-3'>
                      <Button
                        color='#FF6B00'
                        className=' flex justify-center items-center w-48 text-sm rounded-3xl bg-[#FF6B00] font-bold text-[14px] cursor-pointer'
                        onClick={() => submitData()}
                      >
                        {' '}
                        Nộp bài{' '}
                      </Button>
                    </div>
                    <div className='pt-1'>
                      <Button
                        variant='outline'
                        color='#FF6B00'
                        className='flex justify-center items-center w-48 text-sm rounded-3xl text-[#FF6B00] font-bold text-[14px] px-0 py-2 cursor-pointer'
                        style={{ border: '1px solid #FF6B00' }}
                      >
                        {' '}
                        Tạm dừng{' '}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='px-8 py-3 w-full text-black'>
                <div className='flex flex-col'>
                  <div className='flex items-center'>
                    <div
                      className='rounded-full flex justify-center items-center w-4 max-h-4 bg-[white] target p-1 text-[10px]'
                      style={{
                        border: '1px solid #fff',
                        color: 'black',
                      }}
                    >
                      {totalQuestion - numQuestionAnswer}
                    </div>
                    <div className='pl-2 text-[15px]'>Câu hỏi chưa làm</div>
                  </div>
                  <div className='flex items-center mt-2'>
                    <div
                      className='rounded-full flex justify-center items-center w-4 max-h-4 text-ct-secondary border-ct-secondary target p-1 text-[10px]'
                      style={{
                        border: '1px solid #0474BC',
                        background: '#0474BC',
                        color: 'white',
                      }}
                    >
                      {numQuestionAnswer}
                    </div>
                    <div className='pl-2 text-[15px]'>Câu hỏi đã làm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        opened={opened}
        hideCloseButton={true}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
        centered
        size={'lg'}
        radius={20}
      >
        <div className='px-4 py-2 flex flex-col items-center'>
          <div className='text-[24px] uppercase mb-2 font-bold text-black'>hết giờ</div>
          <img src={Timer} alt='' width={102} height={102} />
          <div className='text-[16px] font-bold text-black mt-2'>
            Đã hết thời gian làm bài, vui lòng nộp bài để kết thúc bài thi
          </div>
          <div className='mt-2'>
            <div
              className='flex justify-center items-center px-8 w-[216px] py-2 text-sm rounded-3xl bg-ct-secondary text-white '
              onClick={() => submitData()}
            >
              {' '}
              Nộp bài{' '}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default index;
