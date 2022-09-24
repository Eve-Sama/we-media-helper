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

  const changeValueComponent: () => string = () => {
    let className = '';
    if (changeValue === 0) {
      className = styles['change-value-zero'];
    } else if (changeValue > 0) {
      className = styles['change-value-positive'];
    } else {
      className = styles['change-value-nagative'];
    }
    return className;
  };

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <div className={styles['title']}>{title}</div>
        <div className={changeValueComponent()}>{changeValue}</div>
      </div>
      <div className={styles['total-value']}>{getFormaValue(totalValue)}</div>
    </div>
  );
}
