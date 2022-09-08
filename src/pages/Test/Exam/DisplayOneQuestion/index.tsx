import { Loader, LoadingOverlay, Modal } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Icon from 'assets/icondetail.svg';
import Button from 'components/Button';
import MathJaxRender from 'components/MathJax';
import { Book, Timer1 } from 'iconsax-react';
import { useEffect, useState } from 'react';

import Timer from 'assets/timer.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { alphabet } from 'utils/utils';

const answerSelect: any[] = [];
const question: any[] = [];
const index = () => {
  const [Exam, setExam] = useState<any>([]);
  const [Question, setQuestion] = useState<any>([]);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [visible, setVisible] = useState(false);
  const [timeStart, setTimeStart] = useState('');
  const [idTest, setIdTest] = useState(1);
  const [totalTime, setTotalTime] = useState(0);
  const [opened, setOpened] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;
  const alphabe = alphabet();
  const navigate = useNavigate();
  const params = useParams();
  let listAnswer = Question[index];
  // chọn đáp án
  const SelectAnswer = (key: any, answerId: any, Q_Id: any, w: any) => {
    console.log(Q_Id);
    console.log(Question[index].idQuestion);

    if (answerSelect.length === 0) {
      let item = {
        answer: [answerId],
        idQuestion: Question[index].idQuestion,
      };
      answerSelect.push(item);
    } else {
      let chk = true;
      answerSelect.map((key: any, i: number) => {
        if (key.idQuestion === Question[index].idQuestion) {
          answerSelect[i].answer = [answerId];
          chk = false;
        }
      });
      if (chk) {
        let item = {
          answer: [answerId],
          idQuestion: Question[index].idQuestion,
        };
        answerSelect.push(item);
      }
    }
    Question[index].listSelectOptions.map(function (k: any) {
      if (k.answer_id == answerId) {
        const element = document.getElementById('answer' + k.answer_id);
        if (element !== null) {
          element.style.background = '#2691FF';
          element.style.border = 'none';
          element.style.color = '#fff';
        }
      } else {
        const element = document.getElementById('answer' + k.answer_id);
        if (element !== null) {
          element.style.background = '#fff';
          element.style.border = '1px solid #dfdfdf';
          element.style.color = '#000';
        }
      }
    });
    const ele = document.getElementById('question' + Question[index].idQuestion);
    if (ele !== null) {
      ele.style.color = '#fff';
      ele.style.background = '#0474BC';
      ele.style.border = 'none';
    }
  };
  const submitData = () => {
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
      url: PathAPI.submitTest + '?apikeyApp=wHhpdWagV2Ff8k4yInbX0SSuyiqAIAUi',
      method: 'POST',
      payload: data,
    }).then((res: any) => {
      if (typeof window !== 'undefined') {
        if (res.status) {
          localStorage.setItem('testData', JSON.stringify(res.data));
        }
      }
      window.location.href = `/ket-qua/${params.slug}/${params.idTest}`;
    });
  };

  const ReadirectQuestion = async (id: any, type?: any) => {
    if (type == 2) {
      await setIndex(id); // chọn câu hỏi
    } else {
      await setIndex(index + 1); // chuyển sang câu khác
    }
    answerSelect.map((key: any) => {
      if (key.idQuestion == Question[id + 1].idQuestion) {
        console.log(true);

        key.answer.map((k: any) => {
          const element = document.getElementById('answer' + k.answer_id);
          if (element !== null) {
            element.style.background = '#2691FF';
            element.style.border = 'none';
            element.style.color = '#fff';
          }
        });
      } else {
        Question[id + 1].listSelectOptions.map((k: any) => {
          const element = document.getElementById('answer' + k.answer_id);
          console.log(element);

          if (element !== null) {
            element.style.background = '#fff';
            element.style.border = '1px solid #dfdfdf';
            element.style.color = '#000';
          }
        });
      }
    });
  };

  useEffect(() => {
    RequestAPI({
      url: PathAPI.baikiemtra + '/' + params.idTest,
      method: 'GET',
    }).then((res: any) => {
      console.log(res.data);

      setIdTest(res.data.listTest[0]);
      setTotalTime(res.data.timeAllow / 60);
    });
  }, []);

  useEffect(() => {
    const d = new Date();
    const getData = async () => {
      setVisible(true);
      await RequestAPI({
        url: PathAPI.test + '/' + idTest,
        method: 'GET',
      }).then((res: any) => {
        setExam(res.data);
        setQuestion(res.data.listQuestion);
        setTotalQuestion(res.data.listQuestion.length);
        setVisible(false);
        setTimeStart(d.toISOString());
        setLoading(false);
      });
    };
    getData();
  }, [idTest]);
  const startCount = () => {
    var today = new Date().getTime();
    var countDownDate: any = new Date(today + totalTime * 60 * 1000);
    let i = 1;
    var x = setInterval(function () {
      var now = new Date().getTime();
      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      let ho = document.getElementById('hours');
      let hs = document.getElementById('h_s');
      let timer = document.getElementById('timer');

      if (ho !== null) {
        ho.innerHTML = hours > 0 ? hours + ' giờ' : '';
      }
      let m = document.getElementById('minutes');
      let second = document.getElementById('second');
      if (m !== null) {
        m.innerHTML = minutes + '';
      }
      if (second) {
        second.innerHTML = seconds + '';
      }
      if (i > 1 && hours <= 0 && minutes <= 0 && seconds <= 0) {
        setOpened(true);
        clearInterval();
        if (timer) {
          timer.innerHTML = 'Hết thời gian làm bài!';
        }
      }
      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
      }
      i++;
    }, 1000);
  };
  return (
    <>
      <div className='py-4 mx-[120px] px-6 overflow-y-hidden'>
        <LoadingOverlay visible={visible} />
        {startCount()}
        <div className='flex mx-auto container'>
          <div className='w-3/4'>
            <div
              className='bg-[white] rounded-3xl'
              style={{ boxShadow: '0px 2px 10px rgba(0, 82, 166, 0.23)' }}
            >
              <div className='px-10 pb-5'>
                <div className='flex items-center text-center'>
                  <img src={Icon} alt='' />
                  <div className='pl-3 text-[23px] font-bold uppercase text-black w-3/5'>
                    {Exam?.name}
                  </div>
                </div>
                <div className='pt-5 px-1 flex justify-between'>
                  <div className='pt-3'>
                    <div className='text-[17px] text-black'>
                      Bộ môn: <span className='font-bold'>Hóa học</span>
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
              className='bg-[white] rounded-3xl mt-2 py-8 px-14'
              style={{ boxShadow: '0px 2px 10px rgba(0, 82, 166, 0.23)' }}
            >
              {/* Câu hoie */}
              {Loading ? (
                <div>
                  <div className='py-5 flex justify-center items-center'>
                    <Loader />
                  </div>
                </div>
              ) : (
                <>
                  {
                    <div>
                      <div className='flex'>
                        <div className='font-bold whitespace-nowrap'>Câu {index + 1}: </div>
                        <div className='pl-1'>
                          {<MathJaxRender math={`${Question[index].text}`} />}
                          {Question[index].image ? (
                            <img
                              className='w-[150px] border-2 p-2 rounded-lg'
                              src={Question[index]?.image}
                              alt=''
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-2 mt-2 mb-2'>
                        {Question[index].listSelectOptions
                          ? Question[index].listSelectOptions.map((item: any, index: number) => {
                              if (item.answer_content) {
                                return (
                                  <div
                                    key={index}
                                    className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer'
                                    style={{
                                      border: '1px solid #dfdfdf',
                                    }}
                                    id={'answer' + item.answer_id}
                                    onClick={() =>
                                      SelectAnswer(
                                        Question[index].listSelectOptions,
                                        item.answer_id,
                                        Question[index].idQuestion,
                                        Question[index].weight
                                      )
                                    }
                                  >
                                    <p className='font-bold pr-2'>{alphabe[index]}:</p>

                                    <MathJaxRender math={`${item.answer_content}`} />
                                  </div>
                                );
                              } else if (item.answer_url_image) {
                                return (
                                  <div
                                    className=' rounded-lg px-2 py-2 cursor-pointer'
                                    style={{
                                      border: '1px solid #dfdfdf',
                                    }}
                                    id={'answer' + item.answer_id}
                                  >
                                    <img
                                      key={index}
                                      className={`w-[150px] border-2 border-ct-secondary p-2 rounded-lg`}
                                      src={item.answer_url_image}
                                      alt=''
                                    />
                                  </div>
                                );
                              }
                            })
                          : ''}
                      </div>
                      {index + 1 >= Question.length ? (
                        ''
                      ) : (
                        <div className='mt-3 flex justify-center '>
                          <div
                            className='flex justify-center items-center px-8 w-[216px] py-2 text-sm rounded-3xl bg-ct-secondary text-white '
                            onClick={() => ReadirectQuestion(index)}
                          >
                            {' '}
                            Câu tiếp theo{' '}
                          </div>
                        </div>
                      )}
                    </div>
                  }
                </>
              )}
            </div>
          </div>
          <div className='w-1/4 pl-3 sticky top-0 h-screen'>
            <div
              className='bg-[#DFDFDF] rounded-3xl fixed w-[324px]'
              style={{ boxShadow: '0px 2px 10px rgba(0, 82, 166, 0.23)' }}
            >
              {/* list câu hoi */}
              <div className='bg-[white] py-5 text-black'>
                <div className='px-6'>
                  <div className='grid grid-cols-5 gap-2'>
                    {Question
                      ? Question.map((key: any, index: any) => {
                          return (
                            <div
                              className='rounded-full flex justify-center items-center w-8 h-8 text-black text-[12px] target p-1'
                              style={{
                                border: '1px solid #dfdfdf',
                              }}
                              id={'question' + key.idQuestion}
                              onClick={() => ReadirectQuestion(index, 2)}
                            >
                              {index + 1}
                            </div>
                          );
                        })
                      : null}
                  </div>
                  <div className='pt-2 text-center'>
                    <div className='text-[14px]'>Thời gian còn lại:</div>
                    <div className='text-[16px] font-bold' id='timer'>
                      <span id='hours'>
                        <span id='h_s'></span> giờ
                      </span>{' '}
                      <span id='minutes'></span> phút <span id='second'></span> giây
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
                      00
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
                      00
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
