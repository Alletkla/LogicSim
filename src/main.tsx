import './index.scss'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Application } from './Application'
import BodyWidget from './components/BodyWidget'
import Header from './components/Header'
import { ToastProvider } from './components/Toast/ToastContext'

let app = new Application()

/**
 * 
 * @TODO Sidebar with all loaded nodes, clone the clicked node and add it to canvas
 * @TODO Right Click Support for editing Sidebar Nodes
 * @TODO wrapped Node doenst activate properly
 */

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  // <App />
  <ToastProvider>
    <Header app={app}></Header>
    <BodyWidget app={app} />
  </ToastProvider>
  // </React.StrictMode>,
)
