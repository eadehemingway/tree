import logo from './logo.svg'
import './App.css'
import Tree from './Tree'
import { useState } from 'react'
import { initialData, newData } from './data'

function App() {
  const dataArr = [initialData, newData]
  const [data, setData] = useState()

  function onClick() {
    setData()
  }
  return (
    <div className="App">
      <Tree />
    </div>
  )
}

export default App
