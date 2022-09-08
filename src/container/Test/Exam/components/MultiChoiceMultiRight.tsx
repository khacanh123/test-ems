import React, { FC } from 'react';
import { alphabet } from 'utils/utils';
import MathJaxRender from 'components/MathJax';

type MultiChoiceOneRightProps = {
  handleQuestionData: (
    data: any,
    answer_id: number | string,
    id_Question: number,
    idChildQuestion?: number,
    type?: number,
    answerType?: number
  ) => void;
  data?: any;
  idQuestion?: number;
  weight?: number;
  idChildQuestion?: number;
  type?: number;
  answerType?: number;
};
const MultiChoiceMultiRight: FC<MultiChoiceOneRightProps> = ({
  handleQuestionData,
  data,
  idQuestion,
  idChildQuestion,
  type,
  answerType,
}) => {
  const alphabe = alphabet();
  // console.log(data);
  const handleSelectOption = (key: any, answerId: any, Q_Id: any, type: any, aw: any) => {
    handleQuestionData(key, answerId, Q_Id, idChildQuestion, type, aw);

    const ele = document.getElementById('question' + Q_Id);
    if (ele !== null) {
      ele.style.color = '#fff';
      ele.style.background = '#0474BC';
      ele.style.border = 'none';
    }
  };
  return (
    <div className='grid grid-cols-2 gap-2 mt-2 mb-2'>
      {data
        ? data?.map((item: any, index: number) => {
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
                    handleSelectOption(data, item.answer_id, idQuestion, type, answerType)
                  }
                >
                  <p className='font-bold pr-2'>{alphabe[index]}:</p>

                  <MathJaxRender math={`${item.answer_content}`} />
                </div>
              );
            } else if (item.answer_url_image) {
              return (
                <div
                  key={index}
                  className=' rounded-3xl flex items-center px-2 py-2 cursor-pointer'
                  style={{
                    border: '1px solid #dfdfdf',
                  }}
                  id={'answer' + item.answer_id}
                  onClick={() =>
                    handleSelectOption(data, item.answer_id, idQuestion, type, answerType)
                  }
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
          })
        : ''}
    </div>
  );
};
export default MultiChoiceMultiRight;
