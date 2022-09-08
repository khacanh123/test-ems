import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'xuanchiennx-custom-ck5new';
import { PathAPI } from 'api/route';
import { memo, useEffect, useState } from 'react';
import { EditorProps } from 'types';
import customAxios from 'utils/customAxios';
import { notify } from 'utils/notify';
import './index.css';

const CK5Editor = ({
  handleContent,
  label,
  placeholder,
  contentQuestion,
  error,
  required,
  showOnly,
  className,
  disableItem,
}: EditorProps) => {
  const [content, setContent] = useState(`<p>${contentQuestion ? contentQuestion : ''}</p>`);

  useEffect(() => {
    contentQuestion && setContent(contentQuestion);
  }, [contentQuestion]);

  return (
    <div className={`text-black font-[Gilroy] ${className}`}>
      <style>
        {error
          ? `
                    .ckstyle-err .ck-editor__editable {
                        border: 1px solid red !important;
                    }
                    .ckstyle-err .ck-toolbar {
                        border: 1px solid red !important;
                    }
                `
          : ''}
      </style>
      <style>
        {showOnly
          ? `
                        .ckstyle .ck-editor__editable {
                            min-height: min-content !important;
                            border-radius: 16px !important;
                        }
                        .ckstyle .ck-toolbar {
                            display: none !important;
                        }
                    `
          : ''}
      </style>
      <span className='font-bold my-2'>{label}</span>
      {required ? <span className='text-ct-red-500 '> *</span> : ''}
      <div className={`${error ? 'ckstyle-err' : ''} ${showOnly ? 'ckstyle' : ''}`}>
        <CKEditor
          editor={Editor}
          data={content}
          onReady={(editor: any) => {
            editor.ui.editor.isReadOnly = showOnly;
            editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
              return MyUploadAdapter(loader);
            };
          }}
          onChange={(event: any, editor: any) => {
            const data = editor.getData();
            setContent(data);
            handleContent(data);
          }}
        />
      </div>
      <p className={`${error ? 'text-ct-red-500 text-sm' : 'hidden'}`}>
        Câu hỏi không được để trống
      </p>
    </div>
  );
};

function MyUploadAdapter(loader: any) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        loader.file.then((img: any) => {
          formData.append('image', img, img.name);
          customAxios
            .post(PathAPI.uploadFormdata, formData)
            .then((res: any) => {
              if (res.status) {
                notify({ type: 'success', message: 'Tải ảnh thành công' });
                resolve({
                  default: res.data.images[0].uri,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              notify({ type: 'error', message: 'Tải ảnh thất bại' });
              reject(err);
            });
        });
      });
    },
  };
}
export default memo(CK5Editor);
