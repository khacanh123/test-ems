import { questionEnumType } from 'enum';
import { Add, Trash } from 'iconsax-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ShortAnswer from './ShortAnswer';

interface FillBlankProps {
  handleQuestionData: (data: any) => void;
  data?: any;
}
interface ShortAnswerType {
  listKeyword: string[];
  isExact: boolean;
  isCapital: boolean;
}
interface FillBlankQuestionType {
  idChildQuestion: any;
  quiz_type: number;
  solution: string;
  solution_image: any;
  listShortAnswer: ShortAnswerType;
}

const FillBlank = ({ handleQuestionData, data }: FillBlankProps) => {
  const listQuestionChildren = data?.listQuestionChildren || [];
  const firstRender = useCallback(() => {
    if (listQuestionChildren?.length > 0) {
      return listQuestionChildren;
    } else {
      return [
        {
          id: uuid(),
          quiz_type: questionEnumType.SHORT,
          solution: '',
          solution_image: null,
          listShortAnswer: {
            listKeyword: [],
            isExact: false,
            isCapital: false,
          },
        },
      ];
    }
  }, []);
  const [questionList, setQuestionList] = useState<FillBlankQuestionType[]>(firstRender());
  const handleDeleteQuestion = (id: string) => {
    setQuestionList(questionList.filter((item) => item.idChildQuestion !== id));
  };

  const handleChangeAnswerQues = (id: string, data: any) => {
    const cloneQuestionList = JSON.parse(JSON.stringify(questionList));
    const index = cloneQuestionList.findIndex((item: any) => item.idChildQuestion === id);
    if (index !== -1) {
      cloneQuestionList[index].listShortAnswer = data;
      handleQuestionData(cloneQuestionList);
      setQuestionList(cloneQuestionList);
    }
  };
  return (
    <>
      <p className='px-4 my-4 mt-6'>
        <span className='underline font-bold'>Lưu ý</span>: Với câu hỏi điền vào chỗ trống: sử dụng
        chuỗi kí tự ___ (3 dấu gạch dưới) để biểu thị cho chỗ trống trong câu hỏi.
        <br />
        Ví dụ: Công cha như núi ___
      </p>
      {questionList?.map((item, index) => {
        return (
          <div key={item.idChildQuestion} className='flex w-full items-center'>
            <Question
              index={index}
              idQuestion={item.idChildQuestion}
              data={item?.listShortAnswer}
              handleDeleteQuestion={handleDeleteQuestion}
              handleChangeAnswer={handleChangeAnswerQues}
            />
          </div>
        );
      })}
      <div
        className='border-2 mx-auto border-ct-secondary rounded-full w-fit mt-8'
        onClick={() => {
          setQuestionList((prevState) => {
            const clonePrevState = JSON.parse(JSON.stringify(prevState));
            clonePrevState.push({
              id: uuid(),
              quiz_type: questionEnumType.SHORT,
              solution: '',
              solution_image: null,
              listShortAnswer: {
                listKeyword: [],
                isExact: false,
                isCapital: false,
              },
            });
            return clonePrevState;
          });
        }}
      >
        <Add size={40} className='text-ct-secondary' color='currentColor' />
      </div>
    </>
  );
};
interface QuestionProps {
  index: number;
  data: ShortAnswerType;
  idQuestion: any;
  handleDeleteQuestion: (id: string) => void;
  handleChangeAnswer: (id: string, data: any) => void;
}

const Question = ({
  index,
  data,
  idQuestion,
  handleDeleteQuestion,
  handleChangeAnswer,
}: QuestionProps) => {
  const [answerListWithType, setAnswerListWithType] = useState<ShortAnswerType>(data);

  const handleQuestionData = (dataQues: any) => {
    const cloneAnswerList: ShortAnswerType = JSON.parse(JSON.stringify(answerListWithType));
    cloneAnswerList.listKeyword = dataQues.listKeyword;
    cloneAnswerList.isExact = dataQues.isExact;
    cloneAnswerList.isCapital = dataQues.isCapital;
    handleChangeAnswer(idQuestion, cloneAnswerList);
    setAnswerListWithType(cloneAnswerList);
  };

  useEffect(() => {
    setAnswerListWithType(data);
  }, [data]);

  return (
    <>
      <div className='border w-full border-ct-gray-300 rounded-xl mx-4 my-4 p-4 flex'>
        <div className='bg-ct-secondary w-fit h-fit flex justify-center items-center text-white p-2 rounded-full'>
          <p className='w-5 h-5 text-center leading-5'>{index + 1}</p>
        </div>
        <div className='w-full'>
          <ShortAnswer handleQuestionData={handleQuestionData} data={answerListWithType} />
        </div>
      </div>
      <Trash
        className='mx-2'
        size={20}
        variant='Outline'
        color='#DD405F'
        onClick={() => {
          // if (index !== 0) {
          handleDeleteQuestion(idQuestion);
          // } else {
          //     notify({
          //         type: 'error',
          //         message: 'Không thể xóa cặp keyword duy nhất',
          //     });
          // }
        }}
      />
    </>
  );
};
export default memo(FillBlank);
