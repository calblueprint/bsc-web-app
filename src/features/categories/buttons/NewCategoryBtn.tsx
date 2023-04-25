import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { selectCurrentUser } from '@/features/auth/authSlice'
import { useSelector } from 'react-redux'
import { selectHouseCategories, selectHouseId } from '../categoriesSlice'
import { User } from '@/types/schema'
import { useUpdateHousesMutation } from '@/features/house/houseApiSlice'
import { useEstablishContextMutation } from '@/features/auth/authApiSlice'
import { capitalizeFirstLetter } from '@/utils/utils'

const NewCategoryBtn = () => {
  const authUser = useSelector(selectCurrentUser) as User
  const houseId = useSelector(selectHouseId)
  const houseCategories = useSelector(selectHouseCategories)

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState('')

  const [updateHouses, {}] = useUpdateHousesMutation()
  const [establishContext, {}] = useEstablishContextMutation()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setInputValue('')
    setError(false)
    setHelperText('')
  }

  const validateInput = () => {
    // Add your validation logic here
    if (inputValue.length < 2) {
      setError(true)
      setHelperText('Input must be at least 2 characters long')
    } else {
      setError(false)
      setHelperText('')
    }
  }

  const handleSave = async () => {
    if (error) {
      console.log('ERROR')
      return
    }
    if (!inputValue) {
      return
    }
    if (!houseCategories || houseCategories.length === 0) {
      console.log('HouseCategories is undefined of empty: ', houseCategories)
      return
    }

    try {
      const data = {
        data: {
          categories: [...houseCategories, capitalizeFirstLetter(inputValue)],
        },
        houseId: houseId,
      }
      await updateHouses(data)
      await establishContext(authUser.id)
    } catch (error) {
      console.log(error)
    }
    resetForm()
    setOpen(false)
    console.log('save')
  }

  const button = (
    <Button
      onClick={() => setOpen(true)}
      sx={{ marginLeft: 'auto', marginBottom: 2, fontSize: '16px' }}
      variant="contained"
    >
      New Category +
    </Button>
  )
  const form = (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>
          <Box display={'flex'}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h3">Create Category</Typography>
            </Box>
            <Box flexGrow={1} />
            <Box>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={handleClose}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            component="form"
            // sx={{
            //   '& > :not(style)': { m: 1, width: '25ch' },
            // }}
            sx={{ minWidth: '100%' }}
            display={'flex'}
            flexDirection={'column'}
            noValidate
            autoComplete="off"
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Category Name"
              id="outlined-basic"
              value={inputValue}
              onChange={handleChange}
              onBlur={validateInput}
              error={error}
              helperText={helperText}
            />
            <Button
              sx={{ marginLeft: 'auto', marginTop: 2, fontSize: '16px' }}
              variant="contained"
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
  return (
    <React.Fragment>
      {button}
      {form}
    </React.Fragment>
  )
}

export default NewCategoryBtn
