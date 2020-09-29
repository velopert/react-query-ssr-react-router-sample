import React from 'react'
import ReactDOMServer from 'react-dom/server'
import express from 'express'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import path from 'path'
import fs from 'fs'
import PreloadContext from './PreloadContext'
import { Query, QueryCache, ReactQueryCacheProvider } from 'react-query'
import { dehydrate, DehydratedState } from 'react-query/hydration'

// Read file directories from asset-manifest.json
const manifest = JSON.parse(
  fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf8')
)

const chunks = Object.keys(manifest.files)
  .filter((key) => /chunk\.js$/.exec(key)) // find keys ending with 'chunk.js'
  .map((key) => `<script src="${manifest.files[key]}"></script>`) // convert to script tag
  .join('')

function createPage(root: string, dehydratedState: DehydratedState) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no"
      />
      <meta name="theme-color" content="#000000" />
      <title>React App</title>
      <link href="${manifest.files['main.css']}" rel="stylesheet" />
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">
        ${root}
      </div>
      <script>
        window.__REACT_QUERY_INITIAL_QUERIES__ = ${JSON.stringify(
          dehydratedState
        ).replace(/</g, '\\u003c')};
      </script>
      <script src="${manifest.files['runtime-main.js']}"></script>
      ${chunks}
      <script src="${manifest.files['main.js']}"></script>
    </body>
    </html>
      `
}

const app = express()

// Handler for processing SSR
const serverRender: express.RequestHandler = async (req, res, next) => {
  const context = {}

  const preloaderContext = {
    done: false,
    promises: [],
  }

  const queryCache = new QueryCache()

  const jsx = (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <PreloadContext.Provider value={preloaderContext}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </PreloadContext.Provider>
    </ReactQueryCacheProvider>
  )

  ReactDOMServer.renderToStaticMarkup(jsx) // render to execute usePreloader in components
  preloaderContext.done = true
  try {
    await Promise.all(preloaderContext.promises) // await collected promises
  } catch (e) {}

  const root = ReactDOMServer.renderToString(jsx)
  const dehydratedState = dehydrate(queryCache)

  res.send(createPage(root, dehydratedState))
}

const serve = express.static(path.resolve('./build'), {
  index: false, // disable using index.html
})

app.use(serve) // order matters; must be used before serverRender
app.use(serverRender)

app.listen(5000, () => {
  console.log('Running on http://localhost:5000')
})
