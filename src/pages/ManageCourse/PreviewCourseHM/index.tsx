import Vector from 'assets/img/Vector.png';
import Ellipse from 'assets/img/Ellipse.png';
import Collapse from 'components/Collapse';
import { Graph } from 'iconsax-react';
import { useEffect, useState } from 'react';

const PreviewCourseHM = () => {
  const [listCourse, setListCourse] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [number, setNumber] = useState<number>(1);
  const data = localStorage.getItem('listCourseHM');
  useEffect(() => {
    if (data) {
      setListCourse(JSON.parse(data));
    }
  }, []);

  return (
    <div className='mx-auto px-4'>
      <div className='relative w-full max-w-full flex flex-grow items-center flex-1 text-ct-neutral-400'>
        <h6 className='uppercase bg-ct-secondary w-min rounded-full p-2 mb-1 text-xs font-semibold'>
          <Graph size={20} color='white' />
        </h6>{' '}
        <div className='font-bold ml-5 text-xl '>{listCourse?.course?.fullname}</div>
      </div>
      <div className=' bg-ct-gray-600 mt-5 border'>
        <div className='border-b p-5'>
          <h1 className='text-xl font-bold'>Đề cương khoá học</h1>
        </div>
        {listCourse?.course?.topics &&
          listCourse?.course?.topics.map((item: any, index: number) => {
            return (
              <div className='border-b'>
                <Collapse
                  opened={true}
                  key={index}
                  title={item.info?.topic_name}
                  arrow={item.sections.length >= 1 ? true : false}
                  styleTitle={`font-semibold `}
                >
                  {item.sections.map((section: any, index1: number) => {
                    return (
                      <div className='bg-white'>
                        <Collapse
                          opened={true}
                          key={index1}
                          title={section.title}
                          icon={Vector}
                          arrow={section.childs.length > 1 ? true : false}
                          styleTitle={`font-semibold `}
                          style={'border-b pl-8'}
                        >
                          {section.childs.map((childs: any, index2: number) => {
                            return (
                              <div className='pl-8 border-b'>
                                {childs.data.info?.name ? (
                                  <Collapse
                                    opened={true}
                                    key={index2}
                                    title={childs.data.info?.name}
                                    icon={Ellipse}
                                    arrow={false}
                                    style={``}
                                  >
                                    {childs.data.quiz ? (
                                      <div className='pl-4'>
                                        {childs.data?.quiz.map((quiz: any, index3: number) => {
                                          return (
                                            <Collapse
                                              opened={true}
                                              key={index3}
                                              title={'Kiểm tra:'}
                                              arrow={false}
                                              styleTitle={`font-medium`}
                                              link={quiz.reference}
                                              namelink={childs.data.info?.name}
                                            >
                                              <div></div>
                                            </Collapse>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </Collapse>
                                ) : (
                                  ''
                                )}
                              </div>
                            );
                          })}
                        </Collapse>
                      </div>
                    );
                  })}
                </Collapse>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PreviewCourseHM;
