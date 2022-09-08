import Button from 'components/Button';
import { Add } from 'iconsax-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { shuffle } from 'utils/utils';
import { v4 as uuid } from 'uuid';

interface SortProps {
  handleQuestionData: (data: any) => void;
  data?: any;
}
interface word {
  id: string;
  text: string;
}
const Sort = ({ handleQuestionData, data }: SortProps) => {
  const listSortOptions = data?.listSortOptions;
  const firstRenderOption = useCallback(() => {
    if (listSortOptions?.options?.length > 0) {
      return listSortOptions?.options?.map((item: any) => {
        return {
          id: uuid(),
          text: item,
        };
      });
    } else {
      return [
        {
          id: uuid(),
          text: '',
        },
      ];
    }
  }, []);
  const firstRenderWordList = useCallback(() => {
    const noistWordList = listSortOptions?.options?.filter(
      (x: string) => !listSortOptions?.solution?.includes(x)
    );
    if (noistWordList?.length > 0) {
      return noistWordList.map((item: string) => {
        return {
          id: uuid(),
          text: item,
        };
      });
    } else {
      return [
        {
          id: uuid(),
          text: '',
        },
      ];
    }
  }, []);
  const [option, setOption] = useState(firstRenderOption());
  const [noiseWordList, setNoiseWordList] = useState(firstRenderWordList());

  useEffect(() => {
    const optionList = option.map((item: word) => item.text);
    const noiseList = noiseWordList.map((item: word) => item.text);
    const optionMixed = shuffle(optionList.concat(noiseList));
    const solution = optionList;

    handleQuestionData({
      options: optionMixed,
      solution,
    });
  }, [option, noiseWordList]);

  return (
    <div>
      {' '}
      <div className='w-full mx-4'>
        <p className='font-bold text-md my-2 font-[Gilroy] mb-3'>Câu trả lời</p>
        <div className='flex w-full flex-wrap items-center mt-4'>
          {option.map((item: word) => (
            <div className='mr-4 mb-2'>
              <div className='relative w-fit h-fit' suppressContentEditableWarning>
                <div
                  key={item.id}
                  id={item.id}
                  className='min-w-[100px] rounded-xl border-2 p-4 py-2 outline-none'
                  role='input'
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={(e: any) => {
                    const { textContent } = e.target;
                    setOption(
                      option.map((word: word) => {
                        if (word.id === item.id) {
                          return {
                            ...word,
                            text: textContent,
                          };
                        }
                        return word;
                      })
                    );
                  }}
                >
                  {item.text}
                </div>
                <div className='absolute -top-2 -right-2'>
                  <div
                    className='bg-ct-red-500 rounded-full p-[2px]'
                    onClick={() => {
                      setOption(option.filter((item2: word) => item2.id !== item.id));
                    }}
                  >
                    <Add size={16} className='text-ct-red-500 rotate-45' color='white' />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button
            className='flex px-2 h-min text-sm items-center mb-2'
            onClick={() => {
              setOption([
                ...option,
                {
                  id: uuid(),
                  text: '',
                },
              ]);
            }}
          >
            <Add />
            Thêm
          </Button>
        </div>
        <p>{option.map((word: word) => word.text).join(' ')}</p>
        <div className='my-16'></div>
        <p className='font-bold text-md my-2 font-[Gilroy] mb-3'>Từ gây nhiễu</p>
        <div className='flex w-full flex-wrap items-center mt-4'>
          {noiseWordList.map((item: word) => (
            <div className='mr-4'>
              <div className='relative w-fit h-fit'>
                <div
                  key={item.id}
                  className='min-w-[100px] rounded-xl border-2 p-4 py-2 outline-none'
                  role='textbox'
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={(e: any) => {
                    const { textContent } = e.target;
                    setNoiseWordList(
                      noiseWordList.map((noiseWord: word) => {
                        if (noiseWord.id === item.id) {
                          return {
                            ...noiseWord,
                            text: textContent,
                          };
                        }
                        return noiseWord;
                      })
                    );
                  }}
                >
                  {item.text}
                </div>
                <div className='absolute -top-2 -right-2'>
                  <div
                    className='bg-ct-red-500 rounded-full p-[2px]'
                    onClick={() => {
                      setNoiseWordList(
                        noiseWordList.filter((item2: word, index: number) => item2.id !== item.id)
                      );
                    }}
                  >
                    <Add size={16} className='text-ct-red-500 rotate-45' color='white' />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button
            className='flex px-2 h-min text-sm items-center'
            onClick={() => {
              setNoiseWordList([
                ...noiseWordList,
                {
                  id: uuid(),
                  text: '',
                },
              ]);
            }}
          >
            <Add />
            Thêm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(Sort);
