import React from 'react'
import './spinner.css'

const index = ({ width, height, color }) => {
  return (
    <div aria-label="loading" className="spinner">
      <div
        style={{ width: width, height: height, borderColor: color }}
        className="spinner__animate"
      />
    </div>
  )
}

export default index
