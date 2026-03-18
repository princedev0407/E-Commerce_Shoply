import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/shopping.png'

const NavLogo = ({ onClick }) => {
  return (
    <Link 
      to="/" 
      onClick={onClick}
      className='flex items-center gap-2 transition-opacity hover:opacity-80'
    >
      {/* Logo Image */}
      <img src={logo} alt="Shoply logo" className='h-9 w-9 object-contain' />

      {/* Logo Text */}
      <span className='text-2xl font-bold tracking-tight text-red-800 transition-colors hover:text-indigo-600'>
        Shop<span className='text-indigo-600'>ly</span>
      </span>
    </Link>
  )
}

export default NavLogo