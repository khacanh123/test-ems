import { questionEnumType } from 'enum';
import { Add } from 'iconsax-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ReadingQues from './ReadingQues';

interface ReadingProps {
  handleQuestionData: (data: any, parentId?: string) => void;
  data?: any;
}
const Reading = ({ handleQuestionData, data }: ReadingProps) => {
  const firstRender = useCallback(() => {
    if (data?.listQuestionChildren?.length > 0) {
      const questionChildren = data.listQuestionChildren;
      return questionChildren.map((item: any) => {
        // item['_id_key'] = uuid();
        return {
          ...item,
          id: item.idChildQuestion,
          _id_key: uuid(),
        };
      });
    } else {
      return [
        {
          id: uuid(),
          answer_type: 0,
        },
      ];
    }
  }, []);
  const [questionList, setQuestionList] = useState<any[]>(firstRender());
  const handleDeleteQuestion = (id: string, _id: string) => {
    if (id !== undefined) setQuestionList(questionList.filter((item) => item.id !== id));
    else setQuestionList(questionList.filter((item) => item._id_key !== _id));
  };

  const handleChangeAnswer = (id: string, _id: string, dataAns: any) => {
    // id: khi la sua cau hoi
    // _id: khi tao moi

    let cloneQuesList = JSON.parse(JSON.stringify(questionList));
    let index = 0;
    if (id !== undefined) {
      index = cloneQuesList.findIndex((item: any) => item.id === id);
    } else {
      cloneQuesList.map((k: any, i: number) => {
        if (k._id_key === _id) index = i;
      });
    }

    if (
      dataAns.quiz_type === questionEnumType.ONE_RIGHT ||
      dataAns.quiz_type === questionEnumType.MULTIPLE_RIGHT ||
      dataAns.quiz_type === questionEnumType.YES_NO
    ) {
      cloneQuesList[index] = {
        ...cloneQuesList[index],
        ...dataAns,
        listSelectOptions: dataAns.data,
      };
      delete cloneQuesList[index].data;
    } else if (dataAns.quiz_type === questionEnumType.SHORT) {
      cloneQuesList[index] = {
        ...cloneQuesList[index],
        ...dataAns,
        listShortAnswer: dataAns.data,
      };

      delete cloneQuesList[index].data;
    }
    setQuestionList(cloneQuesList);
  };

  useEffect(() => {
    handleQuestionData(questionList);
  }, [questionList]);
  return (
    <>
      {questionList.map((item, index) => {
        return (
          <div key={item.id} className='flex w-full items-center'>
            <ReadingQues
              key={item.id}
              _id={item._id_key}
              id={item.id}
              index={index}
              handleDeleteQuestion={handleDeleteQuestion}
              handleChangeAnswer={handleChangeAnswer}
              data={data}
            />
          </div>
        );
      })}
      <div
        className='border-2 mx-auto border-ct-secondary rounded-full w-fit mt-8'
        onClick={() =>
          setQuestionList((prevState) => [
            ...prevState,
            {
              id: uuid(),
              answer_type: 0,
            },
          ])
        }
      >
        <Add size={40} className='text-ct-secondary' color='currentColor' />
      </div>
    </>
  );
};

export default memo(Reading);
