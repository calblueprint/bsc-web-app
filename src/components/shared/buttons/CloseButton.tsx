import { Close } from '@mui/icons-material'
import { Button } from '@mui/material'

const CloseButton = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <Button onClick={() => handleClick()}>
      <Close color="primary" />
    </Button>
  )
}
export default CloseButton
