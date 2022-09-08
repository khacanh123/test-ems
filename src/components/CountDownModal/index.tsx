import { Modal } from '@mantine/core';
import tick from 'assets/icon/tick.svg';
import Button from 'components/Button';
import { FC, useEffect, useState } from 'react';

interface Props {
  open: boolean;
  text: string;
  closeBtnText: string;
  nextBtnText: string;
  onClose: () => void;
  onNext: () => void;
  timeAnimate?: number;
  onAnimatedEnd?: () => void;
}
const CountDownModal: FC<Props> = ({
  open,
  text,
  closeBtnText,
  nextBtnText,
  onClose,
  onNext,
  timeAnimate = 0,
  onAnimatedEnd,
}) => {
  const [isDirectModal, setIsDirectModal] = useState(open);
  const [hiddenOnNext, setHiddenOnNext] = useState(false);
  useEffect(() => {
    setIsDirectModal(open);
    const isRedirect = localStorage.getItem('redirectPreview');
    if (isRedirect !== null) {
      setHiddenOnNext(true);
    }
  }, [open]);
  return (
    <Modal
      centered
      hideCloseButton
      closeOnClickOutside={false}
      opened={isDirectModal}
      onClose={() => setIsDirectModal(false)}
      size='lg'
      radius={30}
      classNames={{
        modal: 'overflow-hidden',
      }}
    >
      <div className='p-10'>
        <div className='flex items-center justify-center'>
          <img src={tick} alt='' />
          <p className='font-bold text-xl px-4'>{text}</p>
        </div>
        <div className='flex justify-center items-center w-full mt-10'>
          {hiddenOnNext ? null : (
            <Button onClick={onNext} className='mx-4'>
              {nextBtnText}
            </Button>
          )}
          <Button onClick={onClose} className='mx-4'>
            {closeBtnText}
          </Button>
        </div>
        <div
          className='w-[120%] h-2 bg-ct-secondary rounded-[30px]'
          style={{
            transform: 'translate(-50px, 60px)',
            animation: `time-runout ${timeAnimate}s linear forwards`,
          }}
          onAnimationEnd={onAnimatedEnd}
        ></div>
      </div>
    </Modal>
  );
};

export default CountDownModal;
