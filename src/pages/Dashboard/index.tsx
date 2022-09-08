import { RingProgress, Text } from '@mantine/core';
import CardLineChart from 'components/Chart/CardLineChart';
import RoundedCheckbox from 'components/RoundedCheckbox';
import { FC } from 'react';

const DashboardContainer: FC = () => {
  const handleChange = (checked: boolean) => {
    console.log(checked);
  };
  return (
    <>
      <div className='flex flex-wrap w-full'>
        <div>
          <CardLineChart />
          <CardLineChart />
        </div>
        <div>
          <RingProgress
            label={
              <Text size='xs' align='center'>
                Application data usage
              </Text>
            }
            sections={[
              { value: 40, color: 'cyan' },
              { value: 15, color: 'orange' },
              { value: 15, color: 'grape' },
            ]}
          />
        </div>
        <div className='w-full xl:w-4/12 px-4'></div>
        <RoundedCheckbox onChange={handleChange} checked={true} />
      </div>
    </>
  );
};

export default DashboardContainer;
