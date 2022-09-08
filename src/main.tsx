import { RoleContext } from 'context/RoleContext';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.min.css';
import store from 'store';
import 'styles/tailwind.css';
import App from './App';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <RoleContext>
          <App />
        </RoleContext>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
