import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Icon from 'assets/icondetail.svg';
import MathJaxRender from 'components/MathJax';
import { Book, Timer1 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const index = () => {
  const [Exam, setExam] = useState<any>([]);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [listSubject, setListSubject] = useState<any>([]);
  const [idTest, setIdTest] = useState(null);
  const [name, setName] = useState('');
  const params = useParams();
  const getSubject = (id: any) => {
    // console.log(id.join(''));

    let name = '';
    listSubject.map((key: any) => {
      if (key.idSubject === id) {
        name = key.name;
      }
    });

    return name;
  };
  useEffect(() => {
    const d = new Date();
    RequestAPI({
      url: PathAPI.baikiemtra + '/' + params.idTest,
      method: 'GET',
    }).then((res: any) => {
      setIdTest(res.data.listTest[0]);
      // setTotalQuestion(res.data.listQuestion.length);
      setExam(res.data);
    });
    RequestAPI({
      url: PathAPI.subject,
      method: 'GET',
    }).then((res: any) => {
      setListSubject(res.data);
    });
  }, []);
  useEffect(() => {
    const getTotalQuestion = () => {
      const d = new Date();
      if (idTest !== null) {
        RequestAPI({
          url: PathAPI.test + '/' + idTest,
          method: 'GET',
        }).then((res: any) => {
          let QuestionChildNumber = 0;
          const childQuestion = res.data.listQuestion.filter(
            (i: any) => i.listQuestionChildren.length > 0 && i.quiz_type === 6
          );
          childQuestion.map((key: any) => {
            QuestionChildNumber = QuestionChildNumber + key.listQuestionChildren.length;
          });
          console.log(QuestionChildNumber);
          setTotalQuestion(
            res.data.listQuestion.length + QuestionChildNumber - childQuestion.length
          );
          console.log(childQuestion);

          setName(res.data.listSubject[0].name);
        });
      }
    };
    getTotalQuestion();
  }, [idTest]);
  return (
    <>
      <div className='py-8 mx-[120px]'>
        <div
          className='bg-[white] container rounded-3xl mx-auto'
          style={{ boxShadow: '0px 2px 10px rgba(0, 82, 166, 0.23)' }}
        >
          <div className='px-10 pb-5'>
            <div className='flex items-center text-center'>
              <img src={Icon} alt='' />
              <div className='pl-3 text-[25px] font-bold uppercase text-black w-3/5'>
                {Exam?.name}
              </div>
            </div>
            <div className='pt-5 px-1 flex justify-between'>
              <div className='w-3/4'>
                <div className='text-[17px] text-black'>
                  Bộ môn:{' '}
                  <span className='font-bold'>
                    {''}
                    {name}
                  </span>
                </div>
                <div className='text-[17px] text-black pt-2'>
                  <span className='font-bold'>Hướng dẫn</span>
                </div>
                <div className='w-3/4 text-[15px] text-black pt-1'>
                  <MathJaxRender math={`${Exam?.guide}`} />
                </div>
              </div>
              <div className='w-1/4'>
                <div className='flex items-center'>
                  <Timer1 size='23' color='#000' />
                  <div className='text-black text-[16px]'>
                    Thời gian: <span className='font-bold pl-1'>{Exam?.timeAllow / 60} phút</span>
                  </div>
                </div>
                <div className='flex items-center pt-2'>
                  <Book size='23' color='#000' />
                  <div className='text-black text-[16px] pl-1'>
                    Số câu hỏi: <span className='font-bold'>{totalQuestion} câu</span>
                  </div>
                </div>
                <div className='pt-1'>
                  <a href={`/bai-thi/${params.slug}/${params.idTest}`}>
                    <div className='m-4 flex justify-center items-center px-8 py-2 text-sm rounded-3xl bg-ct-secondary text-white '>
                      {' '}
                      Làm bài{' '}
                    </div>
                  </a>
                </div>
                <div>
                  <div
                    className='m-4 flex justify-center items-center px-6 py-2 text-sm rounded-3xl border-current text-ct-secondary'
                    style={{ border: '1px solid #2691FF' }}
                  >
                    {' '}
                    Xem lại kết quả{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default index;
