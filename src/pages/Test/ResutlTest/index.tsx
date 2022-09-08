import { RingProgress } from '@mantine/core';
import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Icon from 'assets/icondetail.svg';
import { Book, Timer1 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { alphabet, formatTimeString } from 'utils/utils';
const index = () => {
  const [Exam, setExam] = useState<any>([]);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [dataTest, setDataTest] = useState<any>([]);
  const [timeStart, setTimeStart] = useState<any>();
  const [totalQuestionTrue, setTotalQuestionTrue] = useState(0);
  const [idTest, setIdTest] = useState(1);
  const [timer, setTimer] = useState('');
  const params = useParams();
  const alphabe = alphabet();
  const [infoTest, setInfoTest] = useState<any>();
  useEffect(() => {
    RequestAPI({
      url: PathAPI.baikiemtra + '/' + params.idTest,
      method: 'GET',
    }).then((res: any) => {
      setIdTest(res.data.listTest[0]);
      setInfoTest(res.data);
      console.log(res.data.resultReturnType);
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
            }
          }
        }
      });
    }
  }, [Exam]);
  return (
    <>
      <div className='py-8 mx-[120px]'>
        <div
          className='bg-[white] rounded-3xl mx-auto container'
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

                {infoTest?.resultReturnType == 0 ? (
                  ''
                ) : (
                  <div className='pt-3'>
                    <a href={`/dap-an/${params.slug}/${params.idTest}`}>
                      <div
                        className='flex justify-center items-center text-ct-secondary text-sm rounded-3xl px-8 py-2 w-full'
                        style={{ border: '1px solid #2691FF' }}
                      >
                        {' '}
                        Xem đáp án{' '}
                      </div>
                    </a>
                  </div>
                )}
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
      </div>
    </>
  );
};
export default index;
