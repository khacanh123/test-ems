import CK5Editor from 'components/CK5Editor';
import RoundedCheckbox from 'components/RoundedCheckbox';
import { Add, Trash } from 'iconsax-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { shortAnswerType } from '../../type';

type ShortAnswerProps = {
  handleQuestionData: (data: any) => void;
  data?: any;
};
const ShortAnswer = ({ handleQuestionData, data }: ShortAnswerProps) => {
  const listShortAnswer = data?.listShortAnswer || data;
  const firstRender = useCallback(() => {
    if (listShortAnswer?.listKeyword?.length > 0) {
      return listShortAnswer.listKeyword.map((keyword: string) => {
        return {
          id: uuid(),
          keyword,
        };
      });
    } else {
      return [
        {
          id: uuid(),
          keyword: '',
        },
      ];
    }
  }, []);

  const [listKeyword, setListKeyword] = useState<shortAnswerType[]>(firstRender());
  const [isExact, setIsExact] = useState(data?.listShortAnswer?.isExact || false);
  const [isCapital, setIsCapital] = useState(data?.listShortAnswer?.isCapital || false);

  const handleAddAnswer = () => {
    setListKeyword([
      ...listKeyword,
      {
        id: uuid(),
        keyword: '',
      },
    ]);
  };
  const handleDeleteAnswer = (id: string) => {
    setListKeyword(listKeyword.filter((item) => item.id !== id));
  };
  const handleChangeAnswer = (id: string, data: shortAnswerType) => {
    const cloneAnswerList = JSON.parse(JSON.stringify(listKeyword));
    const index = cloneAnswerList.findIndex((item: shortAnswerType) => item.id === id);
    cloneAnswerList[index] = data;
    setListKeyword(cloneAnswerList);
  };

  useEffect(() => {
    const reformKeyword = listKeyword.map((item) => {
      return item.keyword;
    });
    handleQuestionData({ listKeyword: reformKeyword, isExact, isCapital });
  }, [listKeyword, isExact, isCapital]);

  return (
    <div className='text-black px-4'>
      <p className='font-bold text-md my-2 font-[Gilroy] mb-3'>Keyword câu trả lời</p>
      <div className='my-4'>
        <div
          className='flex w-fit my-2 cursor-pointer select-none'
          onClick={() => {
            setIsExact(!isExact);
          }}
        >
          <RoundedCheckbox onChange={() => {}} checked={isExact} />
          <p className='ml-2'>Cho phép đúng từ khoá trong câu trả lời</p>
        </div>
        <div
          className='flex w-fit my-2 cursor-pointer select-none'
          onClick={() => {
            setIsCapital(!isCapital);
          }}
        >
          <RoundedCheckbox onChange={() => {}} checked={isCapital} />
          <p className='ml-2'>Kiểm tra in hoa in thường</p>
        </div>
      </div>
      {listKeyword.map((answer: shortAnswerType) => (
        <Answer
          key={answer.id}
          answer={answer}
          handleDeleteAnswer={handleDeleteAnswer}
          handleChangeAnswer={handleChangeAnswer}
        />
      ))}

      <div
        className='flex items-center w-fit py-2 pr-4 rounded-lg bg-ct-secondary text-white font-semibold text-xl'
        onClick={handleAddAnswer}
      >
        <Add className='mx-2' size={30} variant='Outline' color='white' />
        <button
          type='button'
          className='text-sm'
          style={{ wordSpacing: '1px', letterSpacing: '1px' }}
        >
          Thêm Keyword
        </button>
      </div>
    </div>
  );
};

interface AnswerProps {
  answer: shortAnswerType;
  handleDeleteAnswer: (id: string) => void;
  handleChangeAnswer: (id: string, data: shortAnswerType) => void;
}
const Answer = ({ answer, handleDeleteAnswer, handleChangeAnswer }: AnswerProps) => {
  return (
    <div className='flex items-center pb-6'>
      <CK5Editor
        handleContent={(content: any) => {
          handleChangeAnswer(answer.id, { id: answer.id, keyword: content });
        }}
        className='w-4/5'
        placeholder='Nhập Keyword'
        contentQuestion={answer.keyword}
        disableItem={['imageUpload', 'mediaEmbed']}
      />
      <Trash
        onClick={() => handleDeleteAnswer(answer.id)}
        className='mx-2'
        size={20}
        variant='Outline'
        color='#DD405F'
      />
    </div>
  );
};

export default memo(ShortAnswer);
