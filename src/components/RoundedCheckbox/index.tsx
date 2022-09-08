import { Checkbox, CheckboxProps, MantineSize } from '@mantine/core';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RoundedCheckboxProps {
  onChange?: (checked: boolean) => void;
  form?: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
  className?: string;
  size?: MantineSize;
  checked?: boolean;
}
const RoundedCheckbox = ({
  onChange,
  form,
  className = '',
  size = 'xs',
  checked,
}: RoundedCheckboxProps) => {
  const [checkedState, setCheckedState] = useState<boolean>(checked || false);

  useEffect(() => {
    onChange && onChange(checkedState);
  }, [checkedState]);

  useEffect(() => {
    if (checked !== undefined) setCheckedState(checked);
  }, [checked]);

  return (
    <Checkbox
      {...form}
      className={twMerge(className)}
      radius={100}
      classNames={{
        root: `w-fit p-[3px] h-fit border rounded-full ${
          checkedState ? 'border-[#017EFA]' : ' border-ct-gray-200'
        }`,
        input: 'border-transparent',
      }}
      size={size}
      icon={() => {
        return <></>;
      }}
      checked={checkedState}
      onChange={(e) => setCheckedState(e.target.checked)}
    />
  );
};

export default RoundedCheckbox;
