import React from 'react'
import UserForm from '../forms/UserForm'
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import styles from '../forms/UserForm.module.css'
import Icon from '../../../assets/Icon'

function EditUserCard({
  userId,
  setOpen,
  open,
  editType,
}: {
  userId?: string
  setOpen: (value: React.SetStateAction<boolean>) => void
  open: boolean
  editType?: string
}) {
  const handleClose = () => {
    setOpen(false)
  }
  React.useEffect(() => {
    // console.log(selectUsersResult((state) => state))
  }, [])
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
        className="dialog"
      >
        <div className={styles.shiftBox}>
          <div>
            <div className={styles.flex}>
              <DialogTitle
                variant="h4"
                component="h2"
                className={styles.dialogTitle}
              >
                Edit {editType}
              </DialogTitle>
              <Button onClick={handleClose} className={styles.close}>
                <Icon type={'close'} />
              </Button>
            </div>
            <hr className={styles.line} />
          </div>
          <div className={styles.content}>
            <DialogContent>
              <UserForm
                setOpen={setOpen}
                userId={userId} //'6401c47de8d154aa9ccf5d93'
                isNewUser={false}
                editType={editType}
              />
            </DialogContent>
          </div>
        </div>
      </Dialog>
    </>
  )
}
export default EditUserCard
