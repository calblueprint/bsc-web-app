import * as React from 'react'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import {
  Box,
  ClickAwayListener,
  IconButton,
  Typography,
  styled,
} from '@mui/material'
import { TooltipProps } from '@mui/material/Tooltip'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'

type DetailedToolTipBtnProps = {
  messagePopUp: string
  placement?: TooltipProps['placement']
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'black',
    color: 'white',
    maxWidth: 280,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))

/* General ToolTip function
Displays a button with an information icon.
When clicked, it will display the custom messagePopUp next to the button.
Preferably should contain a message to help user with flow/control navigate.

Can also input a placement which consists of (no input defaults to "bottom"):
"bottom-end" | "bottom-start" | "bottom" | "left-end" | "left-start" |
"left" | "right-end" | "right-start" | "right" | "top-end" | "top-start" |"top"
*/
export const DetailedToolTipBtn: React.FC<DetailedToolTipBtnProps> = ({
  messagePopUp,
  placement,
}: DetailedToolTipBtnProps) => {
  const [open, setOpen] = React.useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <HtmlTooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          placement={placement}
          title={
            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography color="inherit">{messagePopUp}</Typography>
                <CloseIcon onClick={handleTooltipClose}>
                  <InfoOutlinedIcon color="primary" />
                </CloseIcon>
              </Box>
            </React.Fragment>
          }
        >
          <IconButton onClick={handleTooltipOpen}>
            <InfoOutlinedIcon color="primary" />
          </IconButton>
        </HtmlTooltip>
      </div>
    </ClickAwayListener>
  )
}
