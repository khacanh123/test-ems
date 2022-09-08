import { Select } from '@mantine/core';
import CK5Editor from 'components/CK5Editor';
import UploadAsset from 'components/UploadAsset';
import { FieldType, questionEnumType } from 'enum';
import { ArrowDown2, Trash } from 'iconsax-react';
import { memo, useCallback, useEffect, useState } from 'react';
import QuestionCreateType from '.';
import { assetQuestion } from '..';
import { notify } from '../../../../../utils/notify';

type ReadingQuesProps = {
  index: number;
  id: string;
  handleDeleteQuestion: (id: string, _id: any) => void;
  handleChangeAnswer: (id: string, _id: any, data: any) => void;
  data?: any;
  _id?: string;
};

const ReadingQues = ({
  index,
  id,
  handleDeleteQuestion,
  handleChangeAnswer,
  data,
  _id,
}: ReadingQuesProps) => {
  const dataChildQuestion =
    data !== null && data?.hasOwnProperty('listQuestionChildren')
      ? data?.listQuestionChildren[index]
      : {
          text: '',
          solution: '',
          image: '',
          solution_image: '',
          audio: '',
          video: '',
          answer_type: '',
          quiz_type: questionEnumType.ONE_RIGHT,
        };

  const firstRender = () => {
    if (data !== null && data?.hasOwnProperty('listQuestionChildren')) {
      return {
        text: dataChildQuestion?.text,
        solution: dataChildQuestion?.solution,
        image: dataChildQuestion?.image,
        solution_image: dataChildQuestion?.solution_image,
        audio: dataChildQuestion?.audio,
        video: dataChildQuestion?.video,
        quiz_type: dataChildQuestion?.quiz_type,
        // answer_type: dataChildQuestion?.answer_type,
      };
    } else {
      return {
        text: '',
        solution: '',
        image: '',
        solution_image: '',
        audio: '',
        video: '',
        quiz_type: questionEnumType.ONE_RIGHT,
      };
    }
  };
  const [dataQuestion, setDataQuestion] = useState<any>(firstRender());
  const [answerType, setAnswerType] = useState<number>(1);

  const [typeQuestionAccept, setTypeQuestionAccept] = useState<any>([
    {
      value: '' + questionEnumType.ONE_RIGHT,
      label: '1 đáp án đúng',
    },
    {
      value: '' + questionEnumType.MULTIPLE_RIGHT,
      label: 'Nhiều đáp án đúng',
    },
    {
      value: '' + questionEnumType.YES_NO,
      label: 'Câu trả lời đúng sai',
    },
    {
      value: '' + questionEnumType.SHORT,
      label: 'Câu trả lời ngắn',
    },
  ]);

  const handleQuestionData = useCallback((data: any) => {
    setDataQuestion((pre: any) => {
      return {
        ...pre,
        data,
      };
    });
  }, []);

  const handleAnswer = useCallback((inputanswer_type: any) => {
    setDataQuestion((pre: any) => {
      return {
        ...pre,
        answer_type: inputanswer_type,
      };
    });
  }, []);

  const handleUrlAssetQuestion = ({ url, field }: { url: string; field: FieldType }) => {
    switch (field) {
      case FieldType.IMAGE: {
        setDataQuestion((prevState: assetQuestion) => {
          return {
            ...prevState,
            image: url,
          };
        });
        break;
      }
      case FieldType.AUDIO: {
        setDataQuestion((prevState: assetQuestion) => {
          return {
            ...prevState,
            audio: url,
          };
        });
        break;
      }
      case FieldType.VIDEO: {
        setDataQuestion((prevState: assetQuestion) => {
          return {
            ...prevState,
            video: url,
          };
        });
        break;
      }
      case FieldType.SOLUTION_IMAGE: {
        setDataQuestion((prevState: assetQuestion) => {
          return {
            ...prevState,
            solution_image: url,
          };
        });
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    handleChangeAnswer(id, _id, dataQuestion);
  }, [dataQuestion]);

  useEffect(() => {
    if (data !== null && data?.hasOwnProperty('listQuestionChildren')) {
      const newTypeQuestionAccept = typeQuestionAccept.map((item: any) => {
        if (Number(item.value) !== dataChildQuestion?.quiz_type) {
          return {
            ...item,
            disabled: true,
          };
        } else return item;
      });
      setTypeQuestionAccept(newTypeQuestionAccept);
    }
  }, [dataChildQuestion]);

  return (
    <>
      <div className='border w-[calc(100%-40px)] border-ct-gray-300 rounded-xl mx-4 my-4 p-4 flex'>
        <div className='bg-ct-secondary w-fit h-fit flex justify-center items-center text-white p-2 rounded-full'>
          <p className='w-5 h-5 text-center leading-5'>{index + 1}</p>
        </div>
        <div className='w-full px-7'>
          <Select
            required
            className='w-1/2 pb-3'
            radius={15}
            rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
            styles={{ rightSection: { pointerEvents: 'none' } }}
            label='Kiểu câu hỏi'
            placeholder='Kiểu câu hỏi'
            data={typeQuestionAccept}
            onChange={(value: string) => {
              setDataQuestion((prevState: any) => {
                return {
                  ...prevState,
                  quiz_type: parseInt(value),
                };
              });
            }}
            value={'' + dataQuestion.quiz_type}
          />
          <div className='text-black w-full'>
            <CK5Editor
              contentQuestion={dataQuestion.text}
              handleContent={(text: string) => {
                setDataQuestion((prevState: any) => ({
                  ...prevState,
                  text,
                }));
              }}
              placeholder='Nhập nội dung câu hỏi'
              label='Nội dung câu hỏi'
              required
            />
            <UploadAsset
              handleUrlAsset={handleUrlAssetQuestion}
              fieldType={FieldType.IMAGE}
              data={dataQuestion.image}
            />
            <div className='mt-8 w-full'>
              <CK5Editor
                contentQuestion={dataQuestion.solution}
                handleContent={(solution: string) => {
                  setDataQuestion((prevState: any) => ({
                    ...prevState,
                    solution,
                  }));
                }}
                placeholder='Nhập nội dung giải thích'
                label='Nội dung giải thích'
              />
              <UploadAsset
                handleUrlAsset={handleUrlAssetQuestion}
                fieldType={FieldType.SOLUTION_IMAGE}
                data={dataQuestion.solution_image}
              />
            </div>
          </div>
          <div className='w-full'>
            <QuestionCreateType
              quiz_type={dataQuestion.quiz_type}
              handleQuestionData={handleQuestionData}
              data={dataChildQuestion}
              handleAnswer={handleAnswer}
              inputAnswer={dataChildQuestion?.answer_type}
            />
          </div>
        </div>
      </div>

      <div className='w-max'>
        <Trash
          className='mx-2'
          size={20}
          variant='Outline'
          color='#DD405F'
          onClick={() => {
            if (index !== 0) {
              handleDeleteQuestion(id, _id);
            } else {
              notify({
                type: 'error',
                message: 'Không thể xóa câu hỏi duy nhất',
              });
            }
          }}
        />
      </div>
    </>
  );
};

export default memo(ReadingQues);
