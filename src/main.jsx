import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux"
import { ToastContainer } from 'react-toastify';
import store from "./redux/Store"
import './index.css'
import App from './App.jsx'
import "./i18n/i18n";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </StrictMode>,
)
