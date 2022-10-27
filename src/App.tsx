import { useRoutes } from 'react-router-dom';

import { router } from './router';

import 'antd/dist/antd.min.css';

function App() {
  return useRoutes(router);
}

export default App;
