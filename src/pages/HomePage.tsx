import React from 'react'
import { Link } from 'react-router-dom'

export interface HomePageProps {}

function HomePage(props: HomePageProps) {
  return (
    <div>
      <h1>Welcome to HomePage</h1>
      <Link to="/users">Users</Link>
    </div>
  )
}

export default HomePage
