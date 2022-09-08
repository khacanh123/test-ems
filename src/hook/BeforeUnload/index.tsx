import { Modal } from '@mantine/core';
import Button from 'components/Button';
interface DialogBoxProps {
  showDialog: boolean;
  cancelNavigation: any | null;
  confirmNavigation: any | null;
  sideEffectLeave?: Function;
  sideEffectStay?: Function;
}

export default function DialogBox({
  showDialog,
  cancelNavigation,
  confirmNavigation,
  sideEffectLeave,
  sideEffectStay,
}: DialogBoxProps) {
  const handleStay = () => {
    cancelNavigation();
    if (sideEffectStay) {
      sideEffectStay();
    }
  };
  const handleLeave = () => {
    confirmNavigation();
    if (sideEffectLeave) {
      sideEffectLeave();
    }
    localStorage.removeItem('redirectPreview');
    localStorage.removeItem('addTest');
  };
  return (
    <>
      <Modal
        opened={showDialog}
        hideCloseButton={true}
        radius={15}
        size={500}
        onClose={() => cancelNavigation()}
      >
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          Xác nhận thoát trang
        </div>
        <div className='m-2 text-xl text-center'>
          Các thay đổi bạn đã thực hiện có thể không được lưu.
        </div>
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <div className='flex justify-end mr-4'>
            <Button
              color='currentColor'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm text-ct-secondary'
              onClick={handleStay}
              variant='outline'
            >
              Hủy{' '}
            </Button>
          </div>
          <div className='flex justify-start'>
            <Button
              color='currentColor'
              className='m-4 flex justify-center items-center px-7 py-2 text-sm text-ct-secondary'
              onClick={handleLeave}
            >
              Xác nhận
            </Button>
          </div>
        </div>
        {/* Modal content */}
      </Modal>
    </>
  );
}
