import React from 'react'

import Script from 'dangerous-html/react'
import { Helmet } from 'react-helmet'

import './home.css'

const Home = (props) => {
  return (
    <div className="home-container">
      <Helmet>
        <title>shest.qq</title>
        <meta property="og:title" content="shest.qq" />
      </Helmet>
      <div>
        <div className="home-container2">
          <Script
            html={`<div><a href="https://allcalc.ru/node/1888" data-weight="450px" data-height="400px">Сколько дней осталось до конца лета - allcalc</a><script src="https://allcalc.ru/widgets/script.js"></script></div>`}
          ></Script>
        </div>
      </div>
    </div>
  )
}

export default Home
