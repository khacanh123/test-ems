import { Select } from '@mantine/core';
import { getImageLink } from 'api';
import logoBlue from 'assets/loading.jpg';
import Button from 'components/Button';
import CK5Editor from 'components/CK5Editor';
import RoundedCheckbox from 'components/RoundedCheckbox';
import { AnswerType } from 'enum';
import { Add, ArrowDown2, Gallery, Trash } from 'iconsax-react';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { answerOneRightType } from '../../type';

type MultiChoiceOneRightProps = {
  handleQuestionData: (data: any) => void;
  data?: any;
  handleAnswer: (answer: number) => void;
  inputAnswer?: number;
};
const MultiChoiceOneRight: FC<MultiChoiceOneRightProps> = ({
  handleQuestionData,
  data,
  handleAnswer,
  inputAnswer,
}) => {
  const listQuestion = data?.listSelectOptions;
  const firstRender = useCallback(() => {
    if (listQuestion) {
      return listQuestion.map((item: any) => {
        return {
          id: uuid(),
          answer_url_image: item.answer_url_image,
          answer_content: item.answer_content,
          is_true: item.is_true,
        };
      });
    }

    return [
      {
        id: uuid(),
        answer_content: '',
        answer_url_image: '',
        is_true: false,
      },
      {
        id: uuid(),
        answer_content: '',
        answer_url_image: '',
        is_true: false,
      },
      {
        id: uuid(),
        answer_content: '',
        answer_url_image: '',
        is_true: false,
      },
      {
        id: uuid(),
        answer_content: '',
        answer_url_image: '',
        is_true: false,
      },
    ];
  }, []);
  const [answerType, setAnswerType] = useState<number>(1);
  const [answerList, setAnswerList] = useState<answerOneRightType[]>(firstRender());

  function handleAddAnswer() {
    setAnswerList((pre) => [
      ...pre,
      {
        id: uuid(),
        answer_content: '',
        answer_url_image: '',
        is_true: false,
      },
    ]);
  }

  const handleDeleteAnswer = (id: string) => {
    setAnswerList(answerList.filter((item) => item.id !== id));
  };

  const handleChangeAnswer = (id: string, data: answerOneRightType) => {
    const cloneAnswerList = JSON.parse(JSON.stringify(answerList));
    const index = cloneAnswerList.findIndex((item: answerOneRightType) => item.id === id);
    if (data.is_true) {
      cloneAnswerList.forEach((item: answerOneRightType) => {
        if (item.id !== id) {
          item.is_true = false;
        }
      });
    }
    cloneAnswerList[index] = data;
    setAnswerList(cloneAnswerList);
  };

  // useEffect(() => {
  //     if (data?.answer_typer !== 0 ) {
  //         setAnswerType(data?.answer_typer);
  //     }
  // }, [data?.answer_type]);

  useEffect(() => {
    if (inputAnswer != undefined) {
      if (isNaN(inputAnswer) == false) {
        if (inputAnswer !== 0) {
          setAnswerType(inputAnswer);
        }
      }
    }
  }, [inputAnswer]);

  useEffect(() => {
    handleQuestionData(answerList);
  }, [answerList]);

  useEffect(() => {
    if (answerType != 0) {
      handleAnswer(answerType);
    }
  }, [answerType]);

  useEffect(() => {});

  return (
    <div className='text-black px-4'>
      <Select
        required
        size='lg'
        className='w-1/3 py-4'
        radius={15}
        rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
        styles={{ rightSection: { pointerEvents: 'none' } }}
        label='Chọn kiểu đáp án'
        defaultValue={'' + answerType}
        value={'' + answerType}
        data={[
          { value: '1', label: 'Kiểu chữ' },
          { value: '2', label: 'Kiểu ảnh' },
        ]}
        onChange={(value: string) => {
          setAnswerType(Number(value));
          setAnswerList((pre) => [
            {
              id: uuid(),
              answer_content: '',
              answer_url_image: '',
              is_true: false,
            },
            {
              id: uuid(),
              answer_content: '',
              answer_url_image: '',
              is_true: false,
            },
            {
              id: uuid(),
              answer_content: '',
              answer_url_image: '',
              is_true: false,
            },
            {
              id: uuid(),
              answer_content: '',
              answer_url_image: '',
              is_true: false,
            },
          ]);
        }}
      />

      <p className='font-bold text-md my-2 font-[Gilroy] mb-3'>Câu trả lời</p>
      {answerList.map((answer: answerOneRightType) => (
        <Answer
          key={answer.id || answer._id}
          answer={answer}
          handleDeleteAnswer={handleDeleteAnswer}
          handleChangeAnswer={handleChangeAnswer}
          answerType={answerType}
        />
      ))}
      <Button
        className='flex items-center justify-center w-fit px-0 pr-3 text-sm'
        onClick={handleAddAnswer}
      >
        <Add className='mx-2' size={30} variant='Outline' color='white' />
        <p>Thêm câu trả lời</p>
      </Button>
    </div>
  );
};

interface AnswerProps {
  answerType: number;
  answer: answerOneRightType;
  handleDeleteAnswer: (id: string) => void;
  handleChangeAnswer: (id: string, data: answerOneRightType) => void;
}
const Answer = ({ answerType, answer, handleDeleteAnswer, handleChangeAnswer }: AnswerProps) => {
  const [imgAns, setImgAns] = useState<string>('');
  const [newimgAns, setNewImgAns] = useState<string>('');
  const [answerState, setAnswerState] = useState<answerOneRightType>(answer);
  const imgRef = useRef<any>(null);

  const handleChooseImageAnswer = () => {
    if (imgRef.current) {
      let img = imgRef?.current?.files[0];
      if (img) {
        getImageLink({ img }).then((res: any) => {
          if (res.status) {
            const uri = res.data.images[0].uri;
            setNewImgAns(uri);
            setImgAns(uri);
            setAnswerState({ ...answer, answer_url_image: uri });
          }
        });
      }
    }
  };

  useEffect(() => {
    handleChangeAnswer(answer.id, answerState);
  }, [answerState]);

  useEffect(() => {
    if (answerType === AnswerType.TEXT) {
      setAnswerState({ ...answer, answer_url_image: '' });
    } else {
      setAnswerState({ ...answer, answer_content: '' });
    }
  }, [answerType]);

  return (
    <div className='flex items-center pb-6'>
      {answerType !== AnswerType.IMAGE ? (
        <CK5Editor
          handleContent={(content: any) => {
            setAnswerState({
              ...answerState,
              answer_content: content,
            });
          }}
          className='w-4/5'
          placeholder='Nội dung câu hỏi'
          contentQuestion={answerState.answer_content}
          disableItem={['imageUpload', 'mediaEmbed']}
        />
      ) : (
        <img
          className='w-[150px] border-2 border-ct-gray-400 p-2 rounded-lg'
          src={answerState.answer_url_image ? answerState.answer_url_image : logoBlue}
          alt=''
        />
      )}
      <Gallery
        className='mx-2 ml-8'
        size={20}
        variant='Outline'
        onClick={() => {
          answerType == 2 && imgRef?.current?.click();
        }}
        color={answerType == 1 ? 'gray' : 'black'}
      />
      <Trash
        onClick={() => handleDeleteAnswer(answer.id)}
        className='mx-2'
        size={20}
        variant='Outline'
        color='#DD405F'
      />
      <RoundedCheckbox
        className='mx-2 ml-10'
        checked={answer.is_true}
        onChange={(checked) => {
          setAnswerState((pre: any) => {
            return { ...pre, is_true: checked };
          });
        }}
      />
      <input
        type='file'
        accept='image/*'
        ref={imgRef}
        onChange={handleChooseImageAnswer}
        className='hidden'
      />
    </div>
  );
};

export default memo(MultiChoiceOneRight);
