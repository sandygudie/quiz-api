import React, { useState } from 'react'
import Layout from '@theme/Layout'
import './style.css'

export default function ApiHelper() {
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [limit, setLimit] = useState(0)
  const [generatedUrl, setGeneratedUrl] = useState('')

  const genetateURL = () => {
    const baseURL = 'https://quizbase.onrender.com/api/v1/quiz'
    let url = `${baseURL}?limit=${limit}${difficulty && '&difficulty=Easy'}${
      category && '&category=CSS'
    }`
    setGeneratedUrl(url)
  }
  return (
    <Layout title={'API helper'} description="The Api helper to generate API URL">
      <div className="api-helper">
        <h1>API GENERATOR</h1>
        <h2>You can generate an API URL by completing the field below </h2>
        {generatedUrl && <p className="generatedurl">{generatedUrl}</p>}
        <div className="form">
          <div className="field">
            {' '}
            <label> Category:</label>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
              }}
            >
              <option disabled value="">
                Select Category
              </option>
              <option>HTML</option>
              <option>CSS</option>
              <option>JAVASCRIPT</option>
            </select>
          </div>
          <div className="field">
            {' '}
            <label> Difficulty Level:</label>
            <select
              value={difficulty}
              onChange={(event) => {
                setDifficulty(event.target.value)
              }}
            >
              <option disabled value="">
                Select Difficulty
              </option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="field">
            {' '}
            <label> Limit:</label>
            <input onChange={(event) => setLimit(event.target.value)} value={limit} type="number" />
          </div>

          <button onClick={() => genetateURL()}>GENERATE URL</button>
        </div>
      </div>
    </Layout>
  )
}
