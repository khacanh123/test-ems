import { Collapse as CollapseMantine, Image } from '@mantine/core';
import { ArrowDown2 } from 'iconsax-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type CollapseProps = {
  children: any;
  title: string;
  link?: string;
  namelink?: string;
  style?: string;
  opened?: boolean;
  icon?: string;
  arrow?: boolean;
  styleTitle?: string;
};
const Collapse = ({
  children,
  title,
  link,
  namelink,
  style = '',
  opened,
  icon,
  arrow,
  styleTitle,
}: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(opened || false);

  return (
    <div>
      <div
        className={twMerge(
          `flex items-center justify-between p-2 py-3 bg-ct-solid-blue-02 ${style}`
        )}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className='flex items-center '>
          <Image src={icon} className='mr-4' />{' '}
          <p className={`bodytext-14px-semibold ${styleTitle}`}>{title}</p>{' '}
          <span className='ml-2 text-ct-secondary cursor-pointer'>
            <a href={`${link}`} target='_blank'>
              {namelink}
            </a>
          </span>
        </div>
        {arrow === true ? (
          <div
            className='transition-all'
            style={isOpen ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0)' }}
          >
            <ArrowDown2
              size={20}
              color='currentColor'
              variant='Bold'
              style={{ color: '#017efa' }}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <CollapseMantine in={isOpen}>{children}</CollapseMantine>
    </div>
  );
};

export default Collapse;
