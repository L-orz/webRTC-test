import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'

import './style/index.less'
import App from './App'

async function start() {
  await render()
}

async function render() {
  ReactDOM.render(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>,
    document.getElementById('root'),
  )
}

start()
