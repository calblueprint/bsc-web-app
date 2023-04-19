import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import CategoryShiftItem from '../items/CategoryShiftItem'
import CategoryItem from '../items/CategoryItem'
import { useDispatch } from 'react-redux'
import { setIsCategoryOpen } from '../categoriesSlice'

const CategoriesTable = () => {
  const list = ['category', 'category2', 'category3', 'category4', 'category5']
  const dispatch = useDispatch()
  useEffect(() => {
    let categoryOpen = {}
    list.forEach((listItem) => {
      categoryOpen = { ...categoryOpen, [listItem]: false }
    })
    dispatch(setIsCategoryOpen({ isCategoryOpen: categoryOpen }))
  }, [])
  const table = (
    <React.Fragment>
      <Box>
        {list.map((category, index) => (
          <CategoryItem key={index} category={category} />
        ))}
      </Box>
    </React.Fragment>
  )
  return table
}

export default CategoriesTable
