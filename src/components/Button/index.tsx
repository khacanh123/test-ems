import { FC, CSSProperties } from 'react';

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
  [key: string]: any;
  variant?: 'solid' | 'outline';
};
const Button: FC<ButtonProps> = (props) => {
  const { className, children, onClick, disabled, type = 'button', style, variant } = props;

  const styles = {
    btn: `px-8 py-2 rounded-lg tracking-[1px] text-xl transition-all ${
      variant === 'outline'
        ? 'border border-ct-secondary text-ct-secondary'
        : 'bg-ct-secondary text-white'
    } ${className} ${disabled ? 'opacity-50' : ''}`,
  };
  return (
    <button {...props} className={styles.btn} type={type}>
      {children}
    </button>
  );
};

export default Button;
