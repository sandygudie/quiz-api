import React, { useRef, useEffect } from 'react'

export default function Modal({ children,handleModalChange }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handleModalChange('close')
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return (
    <div className="z-30 bg-black/70 fixed -translate-y-[50%] -translate-x-[50%] top-[50%] left-[50%] w-screen h-screen">
      <div
        ref={ref}
        className={`z-40 rounded-lg  w-11/12 lg:w-6/12 fixed bg-white dark:bg-secondary 
            -translate-y-[50%] -translate-x-[50%] left-[50%] top-[50%] rounded-lg`}
      >
        <div className="relative overflow-auto">{children}</div>
      </div>
    </div>
  )
}
