import logo from './logo.svg'
import './App.css'
import Tree from './Tree'
import { useState } from 'react'
import { initialData, newData } from './data'

function App() {
  const dataArr = [initialData, newData]
  const [data, setData] = useState(initialData)

  function onClick(index) {
    setData(dataArr[index])
  }
  return (
    <div className="App">
      <button onClick={() => onClick(0)}>ONE</button>
      <button onClick={() => onClick(1)}>TWO</button>
      <Tree data={data} />
    </div>
  )
}

export default App
