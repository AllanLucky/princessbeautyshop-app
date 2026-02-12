
import React from 'react'
import Banner from '../components/Banner'
import Products from '../components/Products'
import Category from '../components/Category'

const Home = () => {
  return (
    <div>
      <Banner />
      <Category/>
      <Products />
    </div>
  )
}

export default Home