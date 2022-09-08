import { Anchor, Button, Group, useMantineTheme } from '@mantine/core';
import { Calendar, TimeInput } from '@mantine/dates';
import { upperFirst, useMergedRef } from '@mantine/hooks';
import { ClockIcon } from '@modulz/radix-icons';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useRef, useState } from 'react';
import DateTimePickerBase from './DateTimePickerBase';

const DateTimePicker = forwardRef(
  (
    {
      value,
      onChange,
      defaultValue,
      classNames,
      styles,
      shadow = 'sm',
      locale = 'vi',
      inputFormat,
      transitionDuration = 100,
      transitionTimingFunction,
      nextMonthLabel,
      previousMonthLabel,
      closeCalendarOnChange = false,
      labelFormat = 'MMMM YYYY',
      dayClassName,
      dayStyle,
      disableOutsideEvents,
      minDate,
      maxDate,
      excludeDate,
      initialMonth,
      initiallyOpened = false,
      name = 'date',
      size = 'sm',
      dropdownType = 'popover',
      clearable = true,
      disabled,
      clearButtonLabel,
      fixOnBlur = true,
      withinPortal = true,
      dateParser,
      firstDayOfWeek = 'monday',
      onFocus,
      onBlur,
      amountOfMonths,
      allowLevelChange,
      initialLevel,
      ...others
    }: any,
    ref
  ) => {
    const theme = useMantineTheme();
    const finalLocale = locale || theme.datesLocale;
    const dateFormat = 'h:mm - M/D/YYYY';
    const [dropdownOpened, setDropdownOpened] = useState(initiallyOpened);
    const calendarSize = size === 'lg' || size === 'xl' ? 'md' : 'sm';
    const inputRef = useRef<HTMLInputElement>();
    const [lastValidValue, setLastValidValue] = useState(defaultValue ?? null);
    const [_value, setValue] = useState(value);
    const [calendarMonth, setCalendarMonth] = useState(_value || initialMonth || new Date());

    const [focused, setFocused] = useState(false);
    const [inputState, setInputState] = useState(
      _value instanceof Date ? upperFirst(dayjs(_value).locale(finalLocale).format(dateFormat)) : ''
    );

    useEffect(() => {
      if (value === null && !focused) {
        setInputState('');
      }

      if (value instanceof Date && !focused) {
        setInputState(dayjs(value).locale(finalLocale).format(dateFormat));
      }
    }, [value, focused]);

    useEffect(() => {
      if (!dropdownOpened) {
        setValue(value);
      }
    }, [dropdownOpened]);

    const handleValueChange = (date: any) => {
      if (_value) {
        date.setHours(_value.getHours());
        date.setMinutes(_value.getMinutes());
      } else {
        const now = new Date(Date.now());
        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
      }
      setValue(date);
      closeCalendarOnChange &&
        setInputState(upperFirst(dayjs(date).locale(finalLocale).format(dateFormat)));
      closeCalendarOnChange && setDropdownOpened(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleClear = () => {
      setValue(null);
      setLastValidValue(null);
      setInputState('');
      setDropdownOpened(true);
      inputRef.current?.focus();
      onChange(null);
    };

    const parseDate = (date: any) =>
      dateParser ? dateParser(date) : dayjs(date, dateFormat, finalLocale).toDate();

    const handleInputBlur = (e: any) => {
      typeof onBlur === 'function' && onBlur(e);
      setFocused(false);
    };

    const handleInputFocus = (e: any) => {
      typeof onFocus === 'function' && onFocus(e);
      setFocused(true);
    };

    const handleChange = (e: any) => {
      setDropdownOpened(true);

      const date = parseDate(e.target.value);
      if (dayjs(date).isValid()) {
        setValue(date);
        setLastValidValue(date);
        closeCalendarOnChange && setInputState(e.target.value);
        setCalendarMonth(date);
      } else {
        closeCalendarOnChange && setInputState(e.target.value);
      }
    };

    const handleTimeChange = (date: any) => {
      setValue(date);
      closeCalendarOnChange &&
        setInputState(upperFirst(dayjs(date).locale(finalLocale).format(dateFormat)));
      closeCalendarOnChange && setDropdownOpened(false);
    };

    const handleNow = () => {
      const now = new Date(Date.now());
      setValue(now);
      setInputState(upperFirst(dayjs(now).locale(finalLocale).format(dateFormat)));
      setDropdownOpened(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
      onChange(now);
    };

    const handleOk = () => {
      setInputState(upperFirst(dayjs(_value).locale(finalLocale).format(dateFormat)));
      setDropdownOpened(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
      onChange(_value);
    };

    return (
      <DateTimePickerBase
        dropdownOpened={dropdownOpened}
        setDropdownOpened={setDropdownOpened}
        shadow={shadow}
        transitionDuration={transitionDuration}
        ref={useMergedRef(ref, inputRef)}
        size={size}
        styles={styles}
        classNames={classNames}
        onChange={handleChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        name={name}
        inputLabel={inputState}
        __staticSelector='DateTimePicker'
        dropdownType={dropdownType}
        clearable={clearable && !!_value && !disabled}
        clearButtonLabel={clearButtonLabel}
        onClear={handleClear}
        disabled={disabled}
        withinPortal={withinPortal}
        {...others}
      >
        <Calendar
          classNames={classNames}
          styles={styles}
          locale={finalLocale}
          nextMonthLabel={nextMonthLabel}
          previousMonthLabel={previousMonthLabel}
          month={undefined}
          initialMonth={initialMonth || (_value instanceof Date ? _value : new Date())}
          onMonthChange={setCalendarMonth}
          value={_value instanceof Date ? _value : dayjs(_value).toDate()}
          onChange={handleValueChange}
          labelFormat={labelFormat}
          dayClassName={dayClassName}
          dayStyle={dayStyle}
          disableOutsideEvents={disableOutsideEvents}
          minDate={minDate}
          maxDate={maxDate}
          excludeDate={excludeDate}
          __staticSelector='DateTimePicker'
          fullWidth={dropdownType === 'modal'}
          size={dropdownType === 'modal' ? 'lg' : calendarSize}
          firstDayOfWeek={firstDayOfWeek}
          preventFocus={false}
          amountOfMonths={amountOfMonths}
          allowLevelChange={allowLevelChange}
          initialLevel={initialLevel}
          mb='sm'
        />

        <Group align='center'>
          <Anchor ml='xs' component='button' color='blue' onClick={handleNow}>
            Now
          </Anchor>
          <TimeInput
            sx={(t) => ({ flexGrow: 1 })}
            icon={<ClockIcon />}
            styles={{
              controls: { justifyContent: 'center', marginLeft: -20 },
              input: {
                borderRadius: '10px',
              },
            }}
            disabled={!_value}
            value={_value}
            onChange={handleTimeChange}
          />
          {!closeCalendarOnChange && (
            <Button mr='xs' className='bg-ct-secondary' onClick={handleOk}>
              Ok
            </Button>
          )}
        </Group>
      </DateTimePickerBase>
    );
  }
);

export default DateTimePicker;
