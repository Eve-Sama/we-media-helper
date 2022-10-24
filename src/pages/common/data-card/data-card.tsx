import styles from './style.module.scss';

interface DataCardProps {
  title: string;
  changeValue: number;
  totalValue: number;
  url: string;
}

export function DataCard(props: DataCardProps) {
  const { title, changeValue = 0, totalValue = 0, url } = props;

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

  const handleCardClick = () => {
    if (url.length !== 0) {
      window.electron.ipcRenderer.send('openURL', { url });
    }
  };

  return (
    <div className={styles['container']} onClick={() => handleCardClick()} style={{ cursor: url.length === 0 ? 'unset' : 'pointer' }}>
      <div className={styles['header']}>
        <div className={styles['title']}>{title}</div>
        {changeValueComponent()}
      </div>
      <div className={styles['total-value']}>{getFormaValue(totalValue)}</div>
    </div>
  );
}
