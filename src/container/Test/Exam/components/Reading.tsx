import React, { FC } from 'react';
import { alphabet } from 'utils/utils';
import MathJaxRender from 'components/MathJax';
import MultiChoiceOneRight from './MultiChoiceOneRight';
import MultiChoiceMultiRight from './MultiChoiceMultiRight';
import Writing from './Writing';
import YesOrNo from './YesOrNo';
import { questionEnumType } from 'enum';

type MultiChoiceOneRightProps = {
  handleQuestionData: (
    data: any, //item câu hỏi
    answer_id: number | string, // đáp án lựa chọn,
    id_Question: number, // id câu hỏi
    idChildQuestion?: number, // id câu hỏi con
    type?: number, // kiểu câu hỏi cha
    answerType?: number // kiểu câu hỏi con
  ) => void;
  data?: any; // item câu hỏi
  idQuestion?: number; // id câu hỏi
  weight?: number; // trọng số
  key?: any; // item câu hỏi con
  answerType?: number; // kiểu câu hỏi con
  index?: any; // vị trí của câu hỏi con trong danh sách câu hỏi
};
const Reading: FC<MultiChoiceOneRightProps> = ({
  handleQuestionData,
  data,
  idQuestion,
  key,
  answerType,
  index,
}) => {
  const alphabe = alphabet();
  const handleSelectOption = (
    key: any, // item câu hỏi
    answerId: any, // đáp án lựa chọn
    Q_Id: any, // id câu hỏi cha
    idChildQuestion: any, // id câu hỏi con
    type: any, // kiểu câu hỏi cha
    aw: any // kiểu câu hỏi của câu hỏi con
  ) => {
    handleQuestionData(key, answerId, Q_Id, idChildQuestion, type, aw);
    const ele = document.getElementById('question' + Q_Id + '' + idChildQuestion);
    if (ele !== null) {
      ele.style.color = '#fff';
      ele.style.background = '#0474BC';
      ele.style.border = 'none';
    }
  };
  const RenderQuestion = (item: any, type: questionEnumType) => {
    switch (Number(type)) {
      case questionEnumType.ESSAY || 1: {
        return (
          <div>
            <div className='flex'>
              <div className='font-bold whitespace-nowrap'>Câu {index++}</div>
              <div className='pl-1'>
                {<MathJaxRender math={`${item.text}`} />}
                {item.image ? (
                  <img className=' border-2 p-2 rounded-lg' src={item?.image} alt='' />
                ) : (
                  ''
                )}
              </div>
            </div>
            <MultiChoiceOneRight
              handleQuestionData={handleSelectOption}
              data={item.listSelectOptions}
              key={key}
              idChildQuestion={item.idChildQuestion}
              idQuestion={idQuestion}
              type={6}
              answerType={item.quiz_type}
            />
          </div>
        );
      }

      case questionEnumType.YES_NO || 3:
        return (
          <div>
            <div className='flex'>
              <div className='font-bold whitespace-nowrap'>Câu {index++}</div>
              <div className='pl-1'>
                {<MathJaxRender math={`${item.text}`} />}
                {item.image ? (
                  <img className='w-[150px] border-2 p-2 rounded-lg' src={item?.image} alt='' />
                ) : (
                  ''
                )}
              </div>
            </div>
            <YesOrNo
              handleQuestionData={handleSelectOption}
              data={item.listSelectOptions}
              key={key}
              idChildQuestion={item.idChildQuestion}
              idQuestion={idQuestion}
              type={6}
              answerType={item.quiz_type}
            />
          </div>
        );
      case questionEnumType.MULTIPLE_RIGHT || 2:
        return (
          <div>
            <div className='flex'>
              <div className='font-bold whitespace-nowrap'>Câu {index++}</div>
              <div className='pl-1'>
                {<MathJaxRender math={`${item.text}`} />}
                {item.image ? (
                  <img className='w-[150px] border-2 p-2 rounded-lg' src={item?.image} alt='' />
                ) : (
                  ''
                )}
              </div>
            </div>
            <MultiChoiceMultiRight
              handleQuestionData={handleSelectOption}
              data={item.listSelectOptions}
              key={key}
              idChildQuestion={item.idChildQuestion}
              idQuestion={idQuestion}
              type={6}
              answerType={item.quiz_type}
            />
          </div>
        );
      case questionEnumType.SHORT || 4:
        return (
          <div>
            <div className='flex'>
              <div className='font-bold whitespace-nowrap'>Câu {index++}</div>
              <div className='pl-1'>
                {<MathJaxRender math={`${item.text}`} />}
                {item.image ? (
                  <img className='w-[150px] border-2 p-2 rounded-lg' src={item?.image} alt='' />
                ) : (
                  ''
                )}
              </div>
            </div>
            <Writing
              handleQuestionData={handleSelectOption}
              data={item.listSelectOptions}
              key={key}
              idChildQuestion={item.idChildQuestion}
              idQuestion={idQuestion}
              type={6}
              answerType={item.quiz_type}
            />
          </div>
        );
      default:
        break;
    }
  };
  return (
    <>
      {data?.map((item: any, i: number) => {
        return RenderQuestion(item, item.quiz_type);
      })}
    </>
  );
};
export default Reading;
