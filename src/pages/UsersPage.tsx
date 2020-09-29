import React from 'react'
import { queryCache, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { getUsers } from '../api'
import { usePreload } from '../PreloadContext'

export interface UsersPageProps {}

function UsersPage(props: UsersPageProps) {
  const { data, isLoading } = useQuery('users', getUsers)
  usePreload((queryCache) => queryCache.prefetchQuery('users', getUsers))

  if (isLoading || !data) return <div>Loading...</div>
  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>
          <Link to={`/users/${user.id}`}>{user.username}</Link>
        </li>
      ))}
    </ul>
  )
}

export default UsersPage
