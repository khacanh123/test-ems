import { RequestAPI } from 'api';
import { PathAPI } from 'api/route';
import Collapse from 'components/Collapse';
import { ArrowRotateLeft, Graph, Edit, Trash, TableDocument } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './style.css';
import Vector from 'assets/img/Vector.png';
import Ellipse from 'assets/img/Ellipse.png';
// import DropdownCustom from './Dropdown';
import { notify } from 'utils/notify';
import { useDispatch } from 'react-redux';
import { updateTestEdit } from 'store/slice/test';

interface clip {
  id: number;
  title: string;
  listQuiz: listQuiz[];
}
interface lesson {
  id: number;
  title: string;
  clip: clip[];
  listQuiz: listQuiz[];
}
interface section {
  id: number;
  threads: string;
  listLesson: lesson[];
  listQuiz: listQuiz[];
}
interface unit {
  id: number;
  name: string;
  section: section[];
  listQuiz: listQuiz[];
}
interface listQuiz {
  name: string;
  idBaikiemtra: number;
}

function QuizItem(
  quizItem: any,
  listLesson: any,
  onEdit: Function,
  onReset: Function,
  onDelete: Function,
  onViewReport: Function,
  index: number,
  disable: any
) {
  return (
    <div className='flex items-center'>
      <Collapse
        opened={true}
        key={index}
        title={quizItem.name || quizItem.title}
        icon={Ellipse}
        arrow={false}
        style={`ml-5`}
      >
        {/* {quizItem ? (
        <div>
          
        </div>
      ) : ''} */}
      </Collapse>
      <div className='flex items-center'>
        {' '}
        {!disable.disableViewReport && (
          <div
            className='bg-ct-secondary p-2 rounded-md ml-2'
            onClick={() => onViewReport(quizItem)}
          >
            <TableDocument color='white' variant='Outline' size='15' />
          </div>
        )}
        {!disable.disableEdit && (
          <div className='bg-ct-secondary p-2 rounded-md ml-2' onClick={() => onEdit(quizItem)}>
            <Edit color='white' variant='Outline' size='15' />
          </div>
        )}
        {!disable.disableReset && (
          <div
            className='bg-ct-green-400 p-2 ml-2 rounded-md'
            onClick={() => onReset(quizItem, listLesson)}
          >
            <ArrowRotateLeft size='15' variant='Outline' color='white' />
          </div>
        )}
        {!disable.disableDelete && (
          <div className='bg-ct-red-500 p-2 rounded-md ml-2' onClick={() => onDelete(quizItem)}>
            <Trash color='white' variant='Outline' size='15' />
          </div>
        )}
      </div>
    </div>
  );
}

export default function CourseTree({
  Section = [],
  onViewReport = (listQuiz: any) => {},
  onEdit = (listQuiz: any) => {},
  onDelete = (listQuiz: any) => {},
  onReset = (listQuiz: any, listLesson: any) => {},
  dropdownCustom = (listLesson: any) => {},
  disableEdit = false,
  disableReset = false,
  disableDelete = false,
  disableViewReport = true,
}) {
  return (
    <div className='border mt-6'>
      {}
      {Section &&
        Section.map((key: any, index: number) => {
          return (
            <div className='border-b  bg-ct-gray-600'>
              <Collapse
                opened={true}
                key={index}
                title={key.name}
                arrow={true}
                styleTitle={`font-semibold `}
                style={`border-b`}
              >
                {key.listSection ? (
                  <div className=' bg-white '>
                    {key?.listSection.map((listSection: any, index2: number) => {
                      console.log(listSection);
                      return (
                        <div className='border-b'>
                          <Collapse
                            opened={true}
                            key={index2}
                            title={listSection.threads}
                            arrow={listSection.listLesson.length >= 1}
                            styleTitle={`font-semibold `}
                            icon={Vector}
                            style={`ml-5 `}
                          >
                            {listSection.listLesson ? (
                              <div className='ml-5'>
                                {listSection.listLesson.map((listLesson: any, index3: number) => {
                                  return (
                                    <Collapse
                                      opened={true}
                                      key={index3}
                                      title={listLesson.title}
                                      styleTitle={`font-semibold `}
                                      icon={Ellipse}
                                      style={`ml-5`}
                                    >
                                      <div className='pl-5 boder-b'>
                                        {listLesson.listQuiz ? (
                                          <div className=' '>
                                            {listLesson.listQuiz.map(
                                              (listQuiz: any, index3: number) => {
                                                return (
                                                  <div className='flex items-center'>
                                                    <Collapse
                                                      opened={true}
                                                      key={index2}
                                                      title={listQuiz.name}
                                                      icon={Ellipse}
                                                      arrow={false}
                                                      style={`ml-5`}
                                                    >
                                                      {/* {listQuiz ? (
                                            <div>
                                              
                                            </div>
                                          ) : ''} */}
                                                    </Collapse>
                                                    <div className='flex items-center'>
                                                      {' '}
                                                      {
                                                        // nếu listQuiz có examFormat === 2 thì ẩn edit
                                                        listQuiz?.examFormat === 2 ? (
                                                          ''
                                                        ) : (
                                                          <div
                                                            className='bg-ct-secondary p-2 rounded-md ml-2'
                                                            onClick={() => onEdit(listQuiz)}
                                                          >
                                                            <Edit
                                                              color='white'
                                                              variant='Outline'
                                                              size='15'
                                                            />
                                                          </div>
                                                        )
                                                      }
                                                      <div
                                                        className='bg-ct-green-400 p-2 ml-2 rounded-md'
                                                        onClick={() =>
                                                          onReset(listQuiz, listLesson)
                                                        }
                                                      >
                                                        <ArrowRotateLeft
                                                          size='15'
                                                          variant='Outline'
                                                          color='white'
                                                        />
                                                      </div>
                                                      <div
                                                        className='bg-ct-red-500 p-2 rounded-md ml-2'
                                                        onClick={() => onDelete(listQuiz)}
                                                      >
                                                        <Trash
                                                          color='white'
                                                          variant='Outline'
                                                          size='15'
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        ) : (
                                          ''
                                        )}
                                      </div>
                                      {dropdownCustom(listLesson)}
                                    </Collapse>
                                  );
                                })}
                              </div>
                            ) : (
                              ''
                            )}
                          </Collapse>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ''
                )}
                {key.listQuiz ? (
                  <div>
                    {key.listQuiz.map((listQuiz: any, index3: number) => {
                      return QuizItem(
                        listQuiz,
                        null,
                        onEdit,
                        onReset,
                        onDelete,
                        onViewReport,
                        index3,
                        {
                          disableDelete,
                          disableReset,
                          disableEdit,
                          disableViewReport,
                        }
                      );
                    })}
                  </div>
                ) : (
                  ''
                )}
              </Collapse>
            </div>
          );
        })}
    </div>
  );
}
