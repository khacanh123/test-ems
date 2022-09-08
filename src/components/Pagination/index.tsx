import { Pagination as Paginate } from '@mantine/core';
import { useState } from 'react';

type PaginationProps = {
  handlePaging: (page: number) => void;
  total: number;
  border?: boolean;
  sibling?: number;
};

const Pagination = ({ handlePaging, total, border, sibling }: PaginationProps) => {
  const [activePage, setActivePage] = useState(1);
  return (
    <>
      <Paginate
        total={total}
        spacing={-5}
        radius={100}
        siblings={sibling}
        classNames={{
          item: `rounded-full text-ct-secondary hover:bg-gray-300 px-3 py-1 m-1 ${
            border ? 'border' : 'border-none'
          }`,
          active: 'bg-ct-secondary text-white',
        }}
        page={activePage}
        onChange={(page) => {
          setActivePage((pre) => page), handlePaging(page);
        }}
      />
    </>
  );
};

export default Pagination;
