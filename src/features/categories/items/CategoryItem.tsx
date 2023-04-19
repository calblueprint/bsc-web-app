import React from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsCategoryOpen, setIsCategoryOpen } from '../categoriesSlice'
import { RootState } from '@/store/store'

type CategoryItemProps = {
  category: string
}

const CategoryItem = (props: CategoryItemProps) => {
  const { category } = props

  const isCategoryOpen = useSelector((state: RootState) =>
    selectIsCategoryOpen(state, category)
  )

  const dispatch = useDispatch()

  const item = (
    <React.Fragment>
      <Box marginBottom={2} component={Paper}>
        <Box display={'flex'} paddingTop={2} paddingBottom={1}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() =>
              dispatch(
                setIsCategoryOpen({
                  isCategoryOpen: { [category]: !isCategoryOpen },
                })
              )
            }
          >
            {isCategoryOpen ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
          </IconButton>
          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
            {category}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    </React.Fragment>
  )

  return item
}

export default CategoryItem
