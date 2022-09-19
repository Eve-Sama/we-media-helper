import styles from './style.module.scss';

export function DataCard(props: { title: string; changeValue: number; totalValue: number }) {
  const { title, changeValue = 0, totalValue = 0 } = props;
  const reg = /(?=(\B\d{3})+$)/g;
  const getFormaValue = (value: number): string => {
    return value.toString().replace(reg, ',');
  };

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <div className={styles['title']}>{title}</div>
        <div className={styles['change-value']}>{changeValue}</div>
      </div>
      <div className={styles['total-value']}>{getFormaValue(totalValue)}</div>
    </div>
  );
}
