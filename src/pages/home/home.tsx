import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();
  const jump = (url: string) => {
    navigate(url);
  };
  return (
    <>
      <div onClick={() => jump('bilibili')}>bilibili</div>
      <div onClick={() => jump('juejin')}>juejin</div>
      <div onClick={() => jump('setting/bilibili')}>setting/bilibili</div>
      <div onClick={() => jump('setting/juejin')}>setting/juejin</div>
    </>
  );
}
