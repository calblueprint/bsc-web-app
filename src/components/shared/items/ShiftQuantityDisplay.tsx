import Box from '@mui/material/Box'
import React from 'react'

type ShiftQuantityDisplayProps = {
  quantity: number
}

const ShiftQuantityDisplay = (props: ShiftQuantityDisplayProps) => {
  const { quantity } = props
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius={'10px'}
      paddingX={'10px'}
      paddingY={'1px'}
      marginLeft={2}
      marginTop={'1px'}
      fontSize={'14px'}
      height={'30px'}
      sx={{ backgroundColor: '#EFEFEF' }}
    >
      {`${quantity} shifts`}
    </Box>
  )
}

export default ShiftQuantityDisplay
