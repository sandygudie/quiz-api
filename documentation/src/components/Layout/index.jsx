import React from 'react'
import AppProvider from '../../context'

export default function index({ children }) {
  return <AppProvider>{children}</AppProvider>
}
