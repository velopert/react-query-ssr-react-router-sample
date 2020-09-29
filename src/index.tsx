import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { hydrate } from 'react-query/hydration'

if ((window as any).__REACT_QUERY_INITIAL_QUERIES__) {
  const queryCache = new QueryCache()
  const dehydratedState = (window as any).__REACT_QUERY_INITIAL_QUERIES__

  hydrate(queryCache, dehydratedState)

  ReactDOM.hydrate(
    <React.StrictMode>
      <ReactQueryCacheProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReactQueryCacheProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
} else {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
