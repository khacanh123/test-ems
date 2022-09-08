import { Button, Modal } from '@mantine/core';
import CK5Editor from 'components/CK5Editor';
import React, { FC, useState } from 'react';
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
  key?: any;
  answerType?: number;
  type?: any;
  idChildQuestion?: number;
};
const Writing: FC<MultiChoiceOneRightProps> = ({
  handleQuestionData,
  idQuestion,
  type,
  idChildQuestion,
  answerType,
}) => {
  const alphabe = alphabet();
  const [opened, setOpened] = useState(false);
  const [content, setContent] = useState('');
  const handleSelectOption = (Q_Id: any, type: any) => {
    if (content !== '') {
      handleQuestionData('', content, Q_Id, idChildQuestion, type, answerType);
      const ele = document.getElementById('question' + Q_Id + '');
      if (ele !== null) {
        ele.style.color = '#fff';
        ele.style.background = '#0474BC';
        ele.style.border = 'none';
      }
    }

    setOpened(false);
  };
  return (
    <>
      <div
        className='w-full h-10 border-slate-300 rounded-3xl border mt-3 line-clamp-1 flex items-center px-4 py-2'
        onClick={() => setOpened(true)}
      >
        {content !== '' ? <MathJaxRender math={`${content}`} /> : ''}
      </div>
      <Modal
        opened={opened}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
        centered
        size={'75%'}
        hideCloseButton
      >
        {/* Modal content */}
        <CK5Editor
          handleContent={(content: any) => {
            // setAnswerState({
            //     ...answerState,
            //     answer_content: content,
            // });
            setContent(content);
          }}
          className='w-full'
          placeholder='Nhập câu trả lời'
          contentQuestion={content}
          disableItem={['imageUpload', 'mediaEmbed']}
        />
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button
              variant='outline'
              color='#017EFA'
              onClick={() => {
                setOpened(false);
                setContent('');
              }}
            >
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='#017EFA'
              style={{ backgroundColor: '#017EFA' }}
              onClick={() => handleSelectOption(idQuestion, type)}
            >
              {' '}
              Đồng ý{' '}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Writing;
