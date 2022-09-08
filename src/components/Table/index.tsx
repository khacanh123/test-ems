import { LoadingOverlay, Table as TableMantine } from '@mantine/core';
import { memo } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import './style.css';

type columns = {
  title: string | JSX.Element;
  centered?: boolean;
  size?: number;
  hidden?: boolean;
};
type data = {
  [key: string]: any;
};
interface TableProps {
  dataSource: { columns: columns[]; data: data[any] };
  // className?: string;
  // style?: CSSProperties;
  loading?: boolean;
  isDragable?: boolean;
  handleResultDrag?: any;
}

const Table = (props: TableProps) => {
  const { dataSource, loading, isDragable, handleResultDrag } = props;
  const centerColumn: number[] = [];
  const hiddenColumnIndex: number[] = [];

  if (!dataSource.data || dataSource.data.length === 0) {
    return <p className='p-10 w-fit mx-auto'>Không có dữ liệu</p>;
  }

  return (
    <>
      <div className='w-full relative'>
        {loading ? <LoadingOverlay visible={true} /> : ''}
        {!isDragable ? (
          <TableMantine
            verticalSpacing='md'
            highlightOnHover
            className='w-full border overflow-x-scroll'
          >
            <thead className='p-2 w-full'>
              <tr>
                {dataSource.columns.map((column: any, index: number, old) => {
                  if (column.centered) {
                    centerColumn.push(index);
                  }
                  if (column.hidden) {
                    hiddenColumnIndex.push(index);
                  }

                  return (
                    <th
                      className={`p-0 border-b-0 ${index !== 0 ? 'thead' : ''}`}
                      key={index}
                      style={{
                        display: column.hidden ? 'none' : '',
                      }}
                    >
                      <div
                        className={`whitespace-nowrap flex justify-between items-center`}
                        style={{
                          width: `${column.size}px` ? `${column.size}px` : '',
                          display: column.hidden ? 'none' : '',
                        }}
                      >
                        <div className={`px-4 ${column.centered ? 'mx-auto' : ''}`}>
                          {column.title}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className='w-full'>
              {dataSource.data.map((item: any, index: number) => (
                <tr key={index}>
                  {Object.keys(item).map((key: string, index2) => {
                    const isCenter = centerColumn.includes(index2);
                    const isHidden = hiddenColumnIndex.includes(index2);
                    if (key !== 'centered' && !isHidden) {
                      return (
                        <td
                          className={`pr-2 border-b-0 ${index2 !== 0 ? 'thead' : ''}`}
                          key={index2}
                        >
                          <div className={`whitespace-nowrap`}>
                            <div className={`px-4 w-fit ${isCenter ? 'mx-auto' : ''}`}>
                              {item[key] || <>&nbsp;</>}
                            </div>
                          </div>
                        </td>
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </TableMantine>
        ) : (
          <>
            <DragDropContext onDragEnd={handleResultDrag}>
              <Droppable droppableId='listQuestionSelected'>
                {(provided) => (
                  <TableMantine
                    verticalSpacing='md'
                    highlightOnHover
                    className='w-full border overflow-x-scroll listQuestionSelected'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <thead className='p-2 w-full'>
                      <tr>
                        {dataSource.columns.map((column: any, index: number, old) => {
                          if (column.centered) {
                            centerColumn.push(index);
                          }
                          if (column.hidden) {
                            hiddenColumnIndex.push(index);
                          }

                          return (
                            <th
                              className={`p-0 border-b-0 ${index !== 0 ? 'thead' : ''}`}
                              key={index}
                              style={{
                                display: column.hidden ? 'none' : '',
                              }}
                            >
                              <div
                                className={`whitespace-nowrap flex justify-between items-center`}
                                style={{
                                  width: `${column.size}px` ? `${column.size}px` : '',
                                  display: column.hidden ? 'none' : '',
                                }}
                              >
                                <div className={`px-4 ${column.centered ? 'mx-auto' : ''}`}>
                                  {column.title}
                                </div>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className='w-full'>
                      {dataSource.data.map((item: any, index: number) => (
                        <Draggable
                          key={item.idQuestion}
                          draggableId={item.idQuestion.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <tr
                              key={index}
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              className='active:bg-blue-400 hover:bg-blue-400'
                            >
                              {Object.keys(item).map((key: string, index2) => {
                                const isCenter = centerColumn.includes(index2);
                                const isHidden = hiddenColumnIndex.includes(index2);
                                if (key !== 'centered' && !isHidden) {
                                  return (
                                    <td
                                      className={`pr-2 border-b-0 ${index2 !== 0 ? 'thead' : ''}`}
                                      key={index2}
                                    >
                                      <div className={`whitespace-nowrap`}>
                                        <div className={`px-4 w-fit ${isCenter ? 'mx-auto' : ''}`}>
                                          {item[key] || <>&nbsp;</>}
                                        </div>
                                      </div>
                                    </td>
                                  );
                                }
                              })}
                            </tr>
                          )}
                        </Draggable>
                      ))}
                    </tbody>
                  </TableMantine>
                )}
              </Droppable>
            </DragDropContext>
          </>
        )}
      </div>
    </>
  );
};

export default memo(Table);
