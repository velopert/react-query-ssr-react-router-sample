import { createContext, useContext } from 'react'
import { QueryCache, useQueryCache } from 'react-query'

const PreloadContext = createContext<{
  done: boolean
  promises: Promise<any>[]
} | null>(null)

export default PreloadContext

export const usePreload = (
  callback: (queryCache: QueryCache) => Promise<any>
) => {
  const preloadContext = useContext(PreloadContext)
  const queryCache = useQueryCache()
  if (!preloadContext) return
  if (preloadContext.done) return

  preloadContext.promises.push(callback(queryCache))
}
