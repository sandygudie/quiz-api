import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <div className="px-4 md:px-12 container">
        <div className="heroBanner">
          <div className="content">
            <h1 className="">QUIZBASE</h1>
            <p>Quiz questions for programming languages.</p>
            <a href="https://quizbase.netlify.app/docs/getting-started" className="btn">
              Get Started
            </a>
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
// fixed refresh token