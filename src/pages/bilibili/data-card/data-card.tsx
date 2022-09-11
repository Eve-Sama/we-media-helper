import { ContainerStyle } from './data-card-style';

// export function DataCard(title: string, changeValue: number, totalValue: number) {
export function DataCard(props: { title: string; changeValue: number; totalValue: number }) {
  const { title, changeValue, totalValue } = props;
  const reg = /(?=(\B\d{3})+$)/g;
  const getFormaValue = (value: number): string => {
    return value.toString().replace(reg, ',');
  };

  return (
    <ContainerStyle>
      <div className="container">
        <div className="header">
          <div className="title">{title}</div>
          <div className="change-value">{changeValue}</div>
        </div>
        <div className="total-value">{getFormaValue(totalValue)}</div>
      </div>
    </ContainerStyle>
  );
}
