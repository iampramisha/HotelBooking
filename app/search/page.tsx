import Search from '@/components/Search'
import { title } from 'process'
import React from 'react'
export const metadata={
    title:'Search Rooms'
}
const SearchPage = () => {
  return (
    <div>
      <Search/>
    </div>
  )
}

export default SearchPage
