import React from 'react'
import { Link } from 'react-router-dom'

const ProductLowQuantityMsg = ({ count }) => {
  return (
    <div className='bg-red-600 text-white px-4 py-1 text-center'>
      <span className='font-bold'>{count}</span> item(s) are low in stock. <Link to="/product/low-stock" className='underline'>Click Here to See the List</Link>.
    </div>
  )
}

export default ProductLowQuantityMsg