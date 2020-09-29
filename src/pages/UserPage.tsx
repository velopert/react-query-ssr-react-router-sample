import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getUser } from '../api'
import { usePreload } from '../PreloadContext'

export interface UserPageProps {}

function UserPage(props: UserPageProps) {
  const params = useParams<{ id: string }>()
  const userId = parseInt(params.id, 10)

  const fetchUser = (key: string, id: number) => getUser(id)
  const { data, isLoading } = useQuery(['user', userId], fetchUser)

  usePreload((queryCache) =>
    queryCache.prefetchQuery(['user', userId], fetchUser)
  )

  if (!data || isLoading) return <div>Loading...</div>
  return (
    <div>
      <h2>{data.username}</h2>
      <p>Email: {data.email}</p>
      <p>Website: {data.website}</p>
    </div>
  )
}

export default UserPage
