import { Select } from '@mantine/core';
import { getImageLink } from 'api';
import { AnswerType, FieldType } from 'enum';
import { ArrowDown2, DocumentUpload, Trash } from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';
import { notify } from 'utils/notify';

type UploadAssetProps = {
  handleUrlAsset: ({ url, field }: { url: string; field: FieldType }) => void;
  fieldType: FieldType;
  data?: any;
};

const UploadAsset = ({ handleUrlAsset, fieldType, data }: UploadAssetProps) => {
  const [typeAsset, setTypeAsset] = useState<AnswerType>(AnswerType.IMAGE);
  const [assetUrl, setAssetUrl] = useState<string>(data || '');
  const imgRef = useRef<any>(null);
  const videoRef = useRef<any>(null);
  const audioRef = useRef<any>(null);

  const handleUpload = () => {
    if (typeAsset === AnswerType.IMAGE) {
      if (imgRef.current) {
        let img = imgRef?.current?.files[0];
        if (img.size >= 5000000) {
          notify({
            type: 'error',
            message: 'Hình ảnh bạn đang quá kích cỡ 5MB',
          });
        } else {
          if (img) {
            getImageLink({ img }).then((res: any) => {
              if (res.status) {
                const uri = res.data.images[0].uri;
                setAssetUrl(uri);
              }
            });
          }
        }
      }
    } else if (typeAsset === AnswerType.VIDEO) {
      if (videoRef.current) {
        let video = videoRef?.current?.files[0];
        if (video) {
          getImageLink({ video }).then((res: any) => {
            if (res.status) {
              const uri = res.data.images[0].uri;
              setAssetUrl(uri);
            }
          });
        }
      }
    } else if (typeAsset === AnswerType.AUDIO) {
      if (audioRef.current) {
        let audio = audioRef?.current?.files[0];
        if (audio) {
          getImageLink({ audio }).then((res: any) => {
            if (res.status) {
              const uri = res.data.images[0].uri;
              setAssetUrl(uri);
            }
          });
        }
      }
    }
  };

  const handleChooseFile = () => {
    if (typeAsset === AnswerType.IMAGE) {
      if (imgRef.current) {
        imgRef.current.click();
      }
    } else if (typeAsset === AnswerType.VIDEO) {
      if (videoRef.current) {
        videoRef.current.click();
      }
    } else if (typeAsset === AnswerType.AUDIO) {
      if (audioRef.current) {
        audioRef.current.click();
      }
    }
  };

  useEffect(() => {
    handleUrlAsset({
      url: assetUrl,
      field: fieldType,
    });
  }, [assetUrl]);

  return (
    <div className='pb-6'>
      <div className='flex items-center h-fit'>
        <Select
          size='lg'
          className='w-fit py-4'
          radius={15}
          rightSection={<ArrowDown2 size={15} color='currentColor' variant='Bold' />}
          styles={{ rightSection: { pointerEvents: 'none' } }}
          data={[
            {
              value: AnswerType.IMAGE.toString(),
              label: 'Ảnh',
              disabled: false,
            },
            {
              value: AnswerType.VIDEO.toString(),
              label: 'Video',
              disabled: true,
            },
            {
              value: AnswerType.AUDIO.toString(),
              label: 'Âm thanh',
              disabled: true,
            },
          ]}
          value={typeAsset.toString()}
          onChange={(value) => {
            setTypeAsset(Number(value));
          }}
        />
        <div
          className='flex bg-ct-secondary text-white p-3 rounded-xl mx-4'
          onClick={handleChooseFile}
        >
          <DocumentUpload className='mx-2' size={20} variant='Outline' />
          <p>Tải lên </p>
        </div>
      </div>
      {typeAsset === AnswerType.IMAGE && assetUrl !== '' && (
        <div className='flex justify-between items-center'>
          <img src={assetUrl} className='w-fit h-fit max-w-[512px] max-h-[512px]' alt='Ảnh' />
          <Trash
            className='mx-2'
            size={30}
            variant='Outline'
            color='#DD405F'
            onClick={() => {
              setAssetUrl('');
            }}
          />
        </div>
      )}
      <input
        type='file'
        accept='.jpg, .jpeg, .png'
        ref={imgRef}
        onChange={handleUpload}
        className='hidden'
      />
      <input type='file' accept='.mp4' ref={videoRef} onChange={handleUpload} className='hidden' />
      <input
        type='file'
        accept='.mp3, .wav, .ogg'
        ref={audioRef}
        onChange={handleUpload}
        className='hidden'
      />
    </div>
  );
};

export default UploadAsset;
