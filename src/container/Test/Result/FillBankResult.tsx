import { FC, useEffect, useState } from 'react';
import MathJaxRender from 'components/MathJax';

type FillBankProps = {
  data: any;
  result: any;
};

const FillBankResult: FC<FillBankProps> = ({ data, result }) => {
  const [content, setContent] = useState<any[]>([]);
  function stripHtml(html: string) {
    let tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  useEffect(() => {
    const RenderQuestion = () => {
      const arr: any[] = [];
      const content = stripHtml(data.text);
      let id = 0;
      let k1 = 1;
      if (result.length == 0) {
        content.split(' ').map((k: any, i: number) => {
          if (k == '___') {
            arr.push(<span className='w-5'>{`(${k1++})`} </span>);
          } else {
            arr.push(<span> {` ${k} `} </span>);
          }
        });
      } else {
        let j = 0;
        content.split(' ').map((k: any, i: number) => {
          if (k == '___') {
            const data = result[j++];
            let text = stripHtml(data.answer);
            arr.push(
              <span className='w-5'>
                {`(${k1++})`}{' '}
                {text.length == 0 ? (
                  <span className='pl-3'></span>
                ) : data.isTrue ? (
                  <span className='text-green-500'>{text}</span>
                ) : (
                  <span className='text-red-500'>{text}</span>
                )}
              </span>
            );
          } else {
            arr.push(
              <span>
                {' '}
                {` ${k} `} <span className=''></span>
              </span>
            );
          }
        });
      }

      setContent(arr);
    };

    RenderQuestion();
  }, []);
  return (
    <div className='mt-3 pl-12 text-[16px]'>
      {content.map((k: any) => {
        return k;
      })}
    </div>
  );
};
export default FillBankResult;
