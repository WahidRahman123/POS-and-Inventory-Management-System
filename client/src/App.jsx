import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { increment } from "./features/counter/counter";

function App() {  
  const { value } = useSelector(state => state.counter);
  const dispatch = useDispatch();
  
  return (
    <>
      <h1 className="text-red-500">Hello World {value}</h1>
      <button onClick={() => dispatch(increment())}>Click Me</button>
    </>
  )
}

export default App
