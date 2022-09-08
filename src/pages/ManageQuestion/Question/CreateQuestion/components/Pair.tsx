import { Select, TextInput } from '@mantine/core';
import { getImageLink } from 'api';
import { AnswerType } from 'enum';
import { Add, ArrowDown2, Gallery, Trash } from 'iconsax-react';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { pairAnswerType } from '../../type';

type PairQuestionProps = {
  handleQuestionData: (data: any) => void;
  data?: any;
};
const PairQuestion: FC<PairQuestionProps> = ({ handleQuestionData, data }) => {
  const listPairOptions = data?.listPairOptions;
  const firstRender = useCallback(() => {
    if (listPairOptions?.keys?.length > 0) {
      return Array.from({ length: listPairOptions.keys.length }).map((_, index) => {
        return {
          id: uuid(),
          value1: listPairOptions.keys[index].text,
          value2: listPairOptions.values[index].text,
          image1: listPairOptions.keys[index].image,
          image2: listPairOptions.values[index].image,
        };
      });
    }
    return [
      {
        id: uuid(),
        value1: '',
        value2: '',
        image1: '',
        image2: '',
      },
    ];
  }, []);
  const [answerType, setAnswerType] = useState<number>(AnswerType.TEXT);
  const [answerList, setAnswerList] = useState<pairAnswerType[]>(firstRender());
  const handleAddAnswer = () => {
    setAnswerList((pre) => [
      ...pre,
      {
        id: uuid(),
        value1: '',
        value2: '',
        image1: '',
        image2: '',
      },
    ]);
  };
  const handleDeleteAnswer = (id: string) => {
    setAnswerList(answerList.filter((item) => item.id !== id));
  };
  const handleChangeAnswer = (id: string, data: pairAnswerType) => {
    const cloneAnswerList = [...answerList];
    const index = cloneAnswerList.findIndex((item) => item.id === id);
    cloneAnswerList[index] = data;
    setAnswerList(cloneAnswerList);
  };

  useEffect(() => {
    if (data?.answer_type != 0 && data?.answer_type != undefined) {
      setAnswerType(data?.answer_type);
    }
  }, [data?.answer_type]);

  // useEffect(() => {
  //     if (answerType === AnswerType.TEXT) {
  //         let newData = answerList.map((item: any) => {
  //             return {
  //                 ...item,
  //                 image1: '',
  //                 image2: '',
  //             };
  //         });
  //         setAnswerList(newData);
  //     }
  //     if (answerType === AnswerType.IMAGE) {
  //         let newData = answerList.map((item: any) => {
  //             return {
  //                 ...item,
  //                 value1: '',
  //                 value2: '',
  //             };
  //         });
  //         setAnswerList(newData);
  //     }
  // }, [answerType]);

  useEffect(() => {
    const reformData = {
      keys: [
        {
          text: '',
          image: '',
        },
      ],
      values: [
        {
          text: '',
          image: '',
        },
      ],
    };
    reformData.keys = answerList.map((item) => {
      return {
        text: item.value1,
        image: item.image1,
      };
    });
    reformData.values = answerList.map((item) => {
      return {
        text: item.value2,
        image: item.image2,
      };
    });
    handleQuestionData(reformData);
  }, [answerList]);

  return (
    <div className='px-4'>
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
          localStorage.setItem('answerType', value);
          setAnswerList(() => [
            {
              id: uuid(),
              value1: '',
              value2: '',
              image1: '',
              image2: '',
            },
          ]);
        }}
      />
      <p className='font-bold text-md my-2 font-[Gilroy] mb-3'>Câu trả lời</p>
      {answerList.map((answer: pairAnswerType) => (
        <Answer
          key={answer.id}
          answer={answer}
          handleDeleteAnswer={handleDeleteAnswer}
          handleChangeAnswer={handleChangeAnswer}
          answerType={answerType}
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
          Thêm cặp đáp án
        </button>
      </div>
    </div>
  );
};
interface AnswerProps {
  answerType: number;
  answer: pairAnswerType;
  handleDeleteAnswer: (id: string) => void;
  handleChangeAnswer: (id: string, data: pairAnswerType) => void;
}
const Answer = ({ answerType, answer, handleDeleteAnswer, handleChangeAnswer }: AnswerProps) => {
  const [answerState, setAnswerState] = useState<pairAnswerType>(answer);
  const imgRef1 = useRef<any>(null);
  const imgRef2 = useRef<any>(null);

  const handleChooseImageAnswer = () => {
    if (imgRef1.current.files[0]) {
      let img = imgRef1?.current?.files[0];
      if (img) {
        getImageLink({ img }).then((res: any) => {
          if (res.status) {
            let uri = res.data.images[0].uri;
            setAnswerState({ ...answer, image1: uri });
          }
        });
        imgRef1.current.value = null;
      }
    }
    if (imgRef2.current.files[0]) {
      let img = imgRef2?.current?.files[0];
      if (img) {
        getImageLink({ img }).then((res: any) => {
          if (res.status) {
            let uri = res.data.images[0].uri;
            setAnswerState({ ...answer, image2: uri });
          }
        });
        imgRef2.current.value = null;
      }
    }
  };

  useEffect(() => {
    handleChangeAnswer(answer.id, answerState);
  }, [answerState]);

  return (
    <div className='flex items-center pb-6'>
      <div className='w-1/2'>
        <p className='text-ct-gray-300 mb-4'>Lời nhắc</p>
        <div className='flex items-center'>
          {!answerState.image1 ? (
            <TextInput
              disabled={answerType == 2}
              size='lg'
              className='w-4/5'
              radius={15}
              placeholder='Nhập nội dung câu trả lời'
              value={answerState.value1}
              onChange={(event) => {
                setAnswerState({
                  ...answerState,
                  value1: event.currentTarget.value,
                });
              }}
            />
          ) : (
            ''
          )}{' '}
          {answerState.image1 ? (
            <img
              className='w-[150px] border-2 border-ct-gray-400 p-2 rounded-lg'
              src={answerState.image1}
              alt=''
            />
          ) : (
            ''
          )}
          <Gallery
            className='ml-4'
            size={20}
            variant='Outline'
            onClick={() => {
              answerType == 2 && imgRef1?.current?.click();
            }}
            color={answerType == 1 ? 'gray' : 'black'}
          />
        </div>
      </div>
      <div className='w-1/2'>
        <p className='text-ct-gray-300 mb-4'>Đáp án</p>
        <div className='flex items-center'>
          {!answerState.image2 ? (
            <TextInput
              disabled={answerType == 2}
              size='lg'
              className='w-4/5'
              radius={15}
              placeholder='Nhập nội dung câu trả lời'
              value={answerState.value2}
              onChange={(event) => {
                setAnswerState({
                  ...answerState,
                  value2: event.currentTarget.value,
                });
              }}
            />
          ) : (
            ''
          )}{' '}
          {answerState.image2 ? (
            <img
              className='w-[150px] border-2 border-ct-gray-400 p-2 rounded-lg'
              src={answerState.image2}
              alt=''
            />
          ) : (
            ''
          )}
          <Gallery
            className='ml-4'
            size={20}
            variant='Outline'
            onClick={() => {
              answerType == 2 && imgRef2?.current?.click();
            }}
            color={answerType == 1 ? 'gray' : 'black'}
          />
        </div>
      </div>
      <Trash
        onClick={() => handleDeleteAnswer(answer.id)}
        className='mx-2 mt-10'
        size={20}
        variant='Outline'
        color='#DD405F'
      />
      <input
        type='file'
        accept='image/*'
        ref={imgRef1}
        onChange={handleChooseImageAnswer}
        className='hidden'
      />
      <input
        type='file'
        accept='image/*'
        ref={imgRef2}
        onChange={handleChooseImageAnswer}
        className='hidden'
      />
    </div>
  );
};
export default memo(PairQuestion);
