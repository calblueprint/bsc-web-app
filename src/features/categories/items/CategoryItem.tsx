import React, { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectIsCategoryOpen,
  selectShiftsCategory,
  setIsCategoryOpen,
} from '../categoriesSlice'
import { RootState } from '@/store/store'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import CategoryShiftItem from './CategoryShiftItem'
import uuid from 'react-uuid'
import ShiftQuantityDisplay from '@/components/shared/items/ShiftQuantityDisplay'
import Button from '@mui/material/Button'
import DeleteCategory from '../buttons/DeleteCategory'

type CategoryItemProps = {
  category: string
}

const CategoryItem = (props: CategoryItemProps) => {
  //** Extract the compenents' props */
  const { category } = props

  //** Edit state for category name */
  const [isEditing, setIsEditing] = useState(false)

  //** Get the category collaps state from redux state */
  const isCategoryOpen = useSelector((state: RootState) =>
    selectIsCategoryOpen(state, category)
  )

  //** Get Ids for category from redux state */
  const categoryShifts = useSelector((state: RootState) =>
    selectShiftsCategory(state, category)
  )

  //** hook to dispatch redux actions */
  const dispatch = useDispatch()

  const handleCategoryToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const targetClassList = target.classList
    // const targetId = target.id

    // console.log(targetClassList)
    // console.log(targetId)

    // Check if the target element has a class or ID that identifies it as the category box
    if (
      targetClassList.contains('MuiBox-root') ||
      // targetId === 'MuiBox-root' ||
      targetClassList.contains('MuiTypography-root')
    ) {
      dispatch(
        setIsCategoryOpen({
          isCategoryOpen: { [category]: !isCategoryOpen },
        })
      )
    }
  }

  const item = (
    <React.Fragment>
      <Box marginBottom={2} component={Paper}>
        <Box
          display={'flex'}
          paddingTop={2}
          paddingBottom={1}
          onClick={(event) => handleCategoryToggle(event)}
        >
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
          <Typography
            variant="h3"
            sx={{
              textTransform: 'capitalize',
            }}
          >
            {category}
          </Typography>
          <ShiftQuantityDisplay
            quantity={categoryShifts ? categoryShifts.length : 0}
          />
          {category === 'Uncategorized' ? null : (
            <Box marginLeft={'auto'} marginRight={3}>
              <DeleteCategory
                categoryShifts={categoryShifts}
                category={category}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <Collapse in={isCategoryOpen} timeout="auto" unmountOnExit>
          <Box>
            <Table aria-label="shifts" sx={{ margin: '0' }}>
              <TableBody>
                {categoryShifts
                  ? categoryShifts.map((id) => {
                      return <CategoryShiftItem key={uuid()} shiftId={id} />
                    })
                  : null}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </Box>
    </React.Fragment>
  )

  return item
}

export default CategoryItem
