import { useState } from 'react'
import './App.css'
import Video from './Video.tsx'

function App() {

  return (
    <>
      <h1>Rover Base Station</h1>
      <h2> Rover Data</h2>
      <h3>Speed: 43 m/s</h3>
      <h3>GNNS Coordinate: 383, 374</h3>
      <h2> Live Video</h2>
      <Video></Video>
      
    </>
  )
}

export default App
