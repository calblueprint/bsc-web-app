import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Button, ClickAwayListener, IconButton } from '@mui/material';
import { TooltipProps } from '@mui/material/Tooltip';
import Icon from '@/assets/Icon';

type DetailedToolTipBtnProps = {
    messagePopUp: string
    placement?: TooltipProps["placement"]
  }
  
  export const DetailedToolTipBtn: React.FC<DetailedToolTipBtnProps> = ({
    messagePopUp,
    placement,
  }: DetailedToolTipBtnProps) => {
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
      setOpen(false);
    };
  
    const handleTooltipOpen = () => {
      setOpen(true);
    };

    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={messagePopUp}
                placement={placement}
                arrow
              >
                <IconButton onClick={handleTooltipOpen}>Hello</IconButton>
              </Tooltip>
            </div>
          </ClickAwayListener>
    )
  }