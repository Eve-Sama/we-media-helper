import styles from './style.module.scss';

interface DataCardProps {
  title: string;
  changeValue: number;
  totalValue: number;
  url: string;
  text: string;
  color: string;
}

export function DataCard(props: DataCardProps) {
  const { title, changeValue = 0, totalValue = 0, url, text, color } = props;

  const getFormaValue = (value: number): string => {
    if (text.length > 0) {
      return text;
    } else {
      return value.toLocaleString();
    }
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
      <div className={styles['total-value']}>
        <span style={{ color: color ? color : 'unset' }}>{getFormaValue(totalValue)}</span>
      </div>
    </div>
  );
}
