import NewCategoryBtn from '@/features/categories/buttons/NewCategoryBtn'
import CategoriesTable from '@/features/categories/tables/CategoriesTable'
import Box from '@mui/material/Box'

import React from 'react'
const ManagerCategoriesTabContent = () => {
  return (
    <React.Fragment>
      <Box display={'flex'} flexDirection={'column'}>
        <NewCategoryBtn />
        <CategoriesTable />
      </Box>
    </React.Fragment>
  )
}
export default ManagerCategoriesTabContent
