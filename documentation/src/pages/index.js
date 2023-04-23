import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import 'react-toastify/dist/ReactToastify.css';

import './index.scss'

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <div className="container">
        <div className="heroBanner">
          <div className="content">
            <h1 className="">QUIZBASE</h1>
            <p>Quiz questions for programming languages.</p>
            <button className="btn">Get Started</button>
          </div>{' '}
          <img src="img/quizbase-bulb.svg" alt="quizbase text" />
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>

        <section className="features">
          <img src="img/free.png" alt="image" />
        </section>
      </div>
    </Layout>
  )
}

// todo
// review content, make content great
// Styling,
// It's a react app, add login for creating quiz
// Add API Helper
// When a user adds an item, hold it for verification, before adding to the list,
// thank you for contributing, we will verifeld your addition , feel free to add more!,
// There can edit their add and edit it
