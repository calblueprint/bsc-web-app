import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { selectHouseCategories, selectHouseId } from '../categoriesSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { User } from '@/types/schema'
import { useUpdateShiftMutation } from '@/features/shift/shiftApiSlice'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { capitalizeFirstLetter } from '@/utils/utils'
import { useUpdateHousesMutation } from '@/features/house/houseApiSlice'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'

type DeleteButtonProps = {
  categoryShifts: string[]
  category: string
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const DeleteCategory = (props: DeleteButtonProps) => {
  const { categoryShifts, category } = props
  const authUser = useSelector(selectCurrentUser) as User
  const houseId = useSelector(selectHouseId)
  const houseCategories = useSelector(selectHouseCategories)

  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [updateShift, {}] = useUpdateShiftMutation()
  const [updateHouses, {}] = useUpdateHousesMutation()
  const [establishContext, {}] = useEstablishContextMutation()

  const changeShiftCategory = async (category: string, shiftId: string) => {
    if (!houseCategories || houseCategories.length === 0) {
      console.log('HouseCategories is undefined or empty: ', houseCategories)
      return
    }

    try {
      const data = {
        data: { category },
        houseId: houseId,
        shiftId: shiftId as string,
      }
      // console.log('category', category)
      await updateShift(data)
    } catch (error) {
      console.log(error)
    }

    // setOpen(false)
    console.log('save')
  }

  const deleteCategory = async (category: string) => {
    if (!houseCategories || houseCategories.length === 0) {
      console.log('HouseCategories is undefined of empty: ', houseCategories)
      return
    }

    const deleteIndex = houseCategories.indexOf(category)
    if (deleteIndex === -1) {
      // if category is not found
      console.log('No category with that name was found: ', category)
      return false
    }
    const newCategories = houseCategories.map((category) =>
      capitalizeFirstLetter(category)
    )

    newCategories.splice(deleteIndex, 1)
    try {
      const data = {
        data: {
          categories: [...newCategories],
        },
        houseId: houseId,
      }
      await updateHouses(data)
      await establishContext(authUser.id)
    } catch (error) {
      console.log(error)
    }

    // setOpen(false)
    console.log('save')
  }

  const handleDeleteCategory = () => {
    if (categoryShifts) {
      categoryShifts.map((id) =>
        changeShiftCategory('', id)
          .then(() => console.log('shift edited: ' + id))
          .catch((error) => console.log(error))
      )
    } else {
      console.log('no category shifts')
    }

    deleteCategory(category)

    setOpen(false)
  }

  return (
    <React.Fragment>
      <Box marginLeft={'auto'} marginRight={3}>
        <Button variant="outlined" onClick={handleOpen}>
          Delete Category
        </Button>
      </Box>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} display={'flex'} flexDirection={'column'}>
            <Box>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                marginBottom={3}
              >
                {`This action will delete the "${category}" category and move all its shifts to "Uncategorized."`}
              </Typography>
            </Box>
            <Box display={'flex'}>
              <Button
                fullWidth
                sx={{ marginRight: 1 }}
                onClick={handleClose}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                fullWidth
                sx={{ marginLeft: 1 }}
                onClick={handleDeleteCategory}
                variant="contained"
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </React.Fragment>
  )
}

export default DeleteCategory
