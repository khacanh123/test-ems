import { Modal } from '@mantine/core';
import Button from 'components/Button';

type Props = {
  deleted: boolean;
  title: string | any;
  description: string | any;
  textCancel?: string;
  textConfirm?: string;
  size?: string;
  handleExit: () => void;
  handleDelete: () => void;
};
const DeleteModal = (props: Props) => {
  const {
    size,
    deleted,
    title,
    description,
    textCancel = 'Hủy',
    textConfirm = 'Xóa',
    handleExit,
    handleDelete,
  } = props;
  return (
    <div>
      <Modal opened={deleted} onClose={handleExit} hideCloseButton={true} radius={15} size={size}>
        <div className='flex justify-center' style={{ fontSize: 22, fontWeight: '600' }}>
          {title}
        </div>
        <div className='mt-4 mb-2' style={{ textAlign: 'center', fontSize: 18 }}>
          {description}
        </div>
        <div className='flex justify-center mt-12'>
          <Button variant='outline' className='m-4 py-2text-sm' onClick={handleExit}>
            {textCancel}
          </Button>
          <Button className='m-4 py-2 text-sm bg-ct-red-500' onClick={handleDelete}>
            {textConfirm}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteModal;
