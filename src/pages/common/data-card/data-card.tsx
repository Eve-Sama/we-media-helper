import styles from './style.module.scss';
interface DataCardProps {
  title: string;
  changeValue: number;
  totalValue: number;
}

export function DataCard(props: DataCardProps) {
  const { title, changeValue = 0, totalValue = 0 } = props;

  const getFormaValue = (value: number): string => {
    return value.toLocaleString();
  };

  const changeValueComponent: () => JSX.Element = () => {
    let className = '';
    if (changeValue === 0) {
      return null;
    }
    if (changeValue > 0) {
      className = styles['change-value-positive'];
    } else {
      className = styles['change-value-nagative'];
    }
    return <div className={className}>{changeValue}</div>;
  };

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <div className={styles['title']}>{title}</div>
        {changeValueComponent()}
      </div>
      {/* totalValue 虽然在解构的时候默认值为0, 但是传入值如果是 NaN, 则解构默认值不起作用 */}
      <div className={styles['total-value']}>{getFormaValue(totalValue || 0)}</div>
    </div>
  );
}
