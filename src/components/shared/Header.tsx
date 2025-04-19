'use client'

import { useUser } from "@clerk/nextjs"


function Header() {
    const {user}=useUser()
  return (
    <header>
        
    </header>
  )
}

export default Header