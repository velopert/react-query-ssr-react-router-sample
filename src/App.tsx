import React from 'react'
import logo from './logo.svg'
import './App.css'
import { Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import UsersPage from './pages/UsersPage'
import UserPage from './pages/UserPage'

function App() {
  return (
    <>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/users">
        <UsersPage />
      </Route>
      <Route path="/users/:id">
        <UserPage />
      </Route>
    </>
  )
}

export default App
