import { ContainerStyle } from './style';
import { useNavigate } from 'react-router-dom';

export function Setting() {
  const navigateFunction = useNavigate();
  const navigate = (target: string): void => navigateFunction(target);
  return (
    <ContainerStyle>
      <h2 onClick={() => navigate('bilibili')}>Bilibili</h2>
      <h2 onClick={() => navigate('juejin')}>掘金</h2>
    </ContainerStyle>
  );
}
