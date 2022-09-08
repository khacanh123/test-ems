import RoundedCheckbox from 'components/RoundedCheckbox';
import { memo, useCallback, useEffect, useState } from 'react';
type YesNoAnswerProps = {
  handleQuestionData: (data: any) => void;
  data?: any;
};

const YesNoAnswer = ({ handleQuestionData, data }: YesNoAnswerProps) => {
  const listQuestion = data?.listSelectOptions;
  const firstRender = useCallback(() => {
    if (listQuestion) {
      if (listQuestion[0].is_true) {
        return true;
      } else if (listQuestion[1].is_true) {
        return false;
      }
    }
    return true;
  }, []);
  const [result, setResult] = useState<boolean>(firstRender());
  const answerRefomart = [
    {
      answer_content: 'Đúng',
      answer_url_image: null,
      answer_url_mp3: null,
      is_true: false,
    },
    {
      answer_content: 'Sai',
      answer_url_image: null,
      answer_url_mp3: null,
      is_true: false,
    },
  ];
  useEffect(() => {
    if (result) {
      answerRefomart[0].is_true = true;
    } else {
      answerRefomart[1].is_true = true;
    }
    handleQuestionData(answerRefomart);
  }, [result]);

  useEffect(() => {
    handleQuestionData(answerRefomart);
  }, []);

  return (
    <div className='text-black px-4 my-6'>
      <p className='font-bold text-md my-2 font-[Gilroy] mb-3'>Câu trả lời</p>
      <div className='flex'>
        <div className='flex mr-4' onClick={() => setResult(true)}>
          <RoundedCheckbox onChange={() => {}} checked={result ? true : false} />
          <span className='px-2 cursor-pointer select-none'>Đúng</span>
        </div>
        <div className='flex' onClick={() => setResult(false)}>
          <RoundedCheckbox onChange={() => {}} checked={!result ? true : false} />
          <span className='px-2 cursor-pointer select-none'>Sai</span>
        </div>
      </div>
    </div>
  );
};

export default memo(YesNoAnswer);
