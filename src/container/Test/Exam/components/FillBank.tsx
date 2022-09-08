import { FC, useEffect, useState } from 'react';

type FillBankProps = {
  handleQuestionData: (
    data: any,
    answer_id: any,
    id_Question: number,
    idChildQuestion?: number | string,
    type?: number,
    answerType?: number
  ) => void;
  data: any;
  idQuestion: number;
};

const FillBank: FC<FillBankProps> = ({ handleQuestionData, data, idQuestion }) => {
  const [content, setContent] = useState<any[]>([]);
  function stripHtml(html: string) {
    let tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  const changeAnswerFill = () => {
    console.log(data.listQuestionChildren.length);
    const dataFill: any[] = [];
    for (let i = 0; i < data.listQuestionChildren.length; i++) {
      const ele = document.getElementById('fill' + idQuestion + i) as HTMLInputElement;
      if (ele != null) {
        const item = {
          idChildQuestion: data.listQuestionChildren[i].idChildQuestion,
          answer: `<p>${ele.value}</p>`,
        };
        dataFill.push(item);
        if (ele.value.length == 0) {
          ele.style.width = '40px';
        } else {
          ele.style.width = ele.value.length * 10 + 10 + 'px';
        }
      }
    }
    const ele = document.getElementById('question' + idQuestion);
    if (ele !== null) {
      ele.style.color = '#fff';
      ele.style.background = '#0474BC';
      ele.style.border = 'none';
    }
    handleQuestionData('', dataFill, idQuestion, '', 7);
  };
  useEffect(() => {
    const RenderQuestion = () => {
      const arr: any[] = [];
      const content = stripHtml(data.text);
      let id = 0;
      let k1 = 1;
      content.split(' ').map((k: any, i: number) => {
        if (k == '___') {
          arr.push(
            <span>
              {`(${k1++})`}
              <input
                id={'fill' + idQuestion + id}
                className='w-[40px] border-b-[1px] focus:outline-none border-[black] h-[20px] leading-[23px]'
                onChange={() => changeAnswerFill()}
              />
            </span>
          );
          id++;
        } else {
          arr.push(<span> {` ${k} `} </span>);
        }
      });

      setContent(arr);
    };

    RenderQuestion();
  }, []);
  return (
    <div className='mt-3 pl-12 text-[16px]'>
      {content.map((k: any) => {
        return k;
      })}
    </div>
  );
};
export default FillBank;
