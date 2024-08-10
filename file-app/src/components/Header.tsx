import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

export const Header = () => {
  return (
    <div className='fixed top-0 left-0 right-0 z-50 border-b bg-slate-100 rounded-sm'>
      <div className=' flex items-center mx-auto my-auto justify-between p-2'>
        <div id='logo' className='flex flex-col items-center gap-0'>
          <Link className='flex my-0' href={'/'}>
            <h2 className='text-black font-bold text-lg'>CCC</h2>
            <h3 className='font-bold text-red-700 text-lg'>M</h3>
          </Link>
          <h6 className='text-emerald-950 font-bold text-[0.5rem] mt-0 mb-0'>App-File</h6>
        </div>
        <OrganizationSwitcher/>
        <UserButton/>
      </div>
    </div>
  )
}
