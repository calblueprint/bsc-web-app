import Papa from 'papaparse'
import { useState, useEffect, useCallback } from 'react'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useGetAuthorizedUsersQuery, useAddNewAuthorizedUserMutation } from '@/features/authorizedUser/authorizedUserApiSlice';
import { AuthorizedUser } from '@/types/schema';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


//styling for modal, table, and footer
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  
};
const uploadStyle = {
    width: 800,
    height: 200,
    border: 'dotted',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 2,
}
const uploadingStyle = {
    width: 800,
    height: 200,
    backgroundColor: "#f3f5f6",
    marginTop: 2,
    border: 'solid',
    borderColor: '#F6F6F6',
    
    borderWidth: 3,
    borderRadius: 2,
}
const disabledFooter = {
    width: 900,
    backgroundColor: '#F6F6F6',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 80,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
}
const tableStyle = { 
    border:'solid', 
    borderColor: '#E2E2E2', 
    borderRadius: 1, 
    marginTop: 1
}
const rowStyle = {
    border:'solid', 
    borderColor: '#E2E2E2', 
    borderRadius: 1, 
    marginTop: 1
}
const userTableStyle = {
    backgroundColor: '#fffbfb', 
    display: 'flex', 
    alignContent: "flex-start", 
    border: 'solid #E2E2E2', 
    borderWidth: .5
}
const addUserTableStyle = {
    backgroundColor: '#fafffc', 
    display: 'flex', 
    alignContent: "flex-start", 
    border: 'solid #E2E2E2', 
    borderWidth: .5
}

const UploadHouseList = () => {
    //usestates
    const [fileHolder, setFileHolder] = useState<File>()
    const [file, setFile] = useState<File>()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    //for progress bar
    const [progress, setProgress] = useState(0);
    //goes to final import page if true
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    //array holding the members that were previously in the firebase
    const [previousMembers, setPreviousMembers] = useState()
    //array holding the application numbers of members previously in the firebase
    const [prevMemNums, setPrevMemNums] = useState<number[] | undefined>([])
    //array holding every member who was in csv file
    const [newUsers, setNewUsers] = useState<any>();
    //array holding new members who were not previously in the firebase
    const [usersToAdd, setUsersToAdd] = useState<any>();
    //array holding users who need to be removed from the authorized users
    const [delUsers, setDelUsers] = useState<any>();
    
    //change to authuser
    const authUsers = useGetAuthorizedUsersQuery('EUC');
    const [addNewAuthorizedUser] = useAddNewAuthorizedUserMutation();

    

    //every time getAuthorizedUsers changes, it updates both the previous members array
    //and the previous members application id array
    useEffect(() => {
        if (authUsers.data) {
            setPreviousMembers(Object.values(authUsers.data?.entities))
            Object.values(authUsers.data?.entities)?.map((member) => {
                if (member?.applicationID){
                    setPrevMemNums(prevMemNums => [...prevMemNums, member?.applicationID]);
                }
               
            })
        }
    }, [authUsers])

    //
    // useEffect(()=> {
    //     if (prevMemNums?.length > 0 && previousMembers) {
    //         previousMembers.map((member) => {
    //             const currMemId = member.applicationID
    //             if (prevMemNums.indexOf(currMemId) != -1){

    //             }
    //         })
    //     }
    // }, [prevMemNums, previousMembers])

    
    // useEffect that parses csv file, and and updates progress bar
    useEffect(() => {
        //checks if fileHolder has a file in it
        
        if (fileHolder) {
            console.log(fileHolder)
            //i dont htink htis works correctly but its supposed to time how long this useEffect takes lol
          const timer = setInterval(() => {
            setProgress((oldProgress) => {
              
              const diff = Math.random() * 10;
              return Math.min(oldProgress + diff, 100);
            });
          }, 500);
      
          const userHolder: AuthorizedUser[] = []
          //papaparse parses the csv file passed in and updates the userArr when finished
          Papa.parse(fileHolder, {
            header: true,
            skipEmptyLines: true,
            download: true,
            step: function (row) {
              
              console.log("current row", row.data)
              //HELLO LOOK AT ME, UPDATE WITH AUTH STATE HOUSE
              
              if(row.data.houseID != 'EUC'){
                window.alert("CSV File contains data from multiple houses.")
                return ;
              }
              userHolder.push(row.data)
            },
            complete: function () {
                console.log("hurray!")
                setNewUsers(userHolder)
            },
          })
        }
    }, [fileHolder])
    //
    //
    const uploadCSV = (file: File) => {
        //checks if the file uploaded is a csv file
        if (file?.type == 'text/csv') {
          setFileHolder(file)
          //setUserArr([])
        } else {
          window.alert("Ew! This isn't a csv file. YUCk!!")
        }
      }
    
    const handleUploadClick = (lst: FileList | null) => {
        if (lst === null) {
            console.log('Invalid input')
            return
        }
        uploadCSV(lst[0])
        const item = lst.item(0)
        if (item !== null) {
            setFile(item)
        }
    }

    //function that compared members uploaded from csv and 
    //previous members from firebase
    const compareMembers = () => {
        //checks if newUsers & prevMemNums has anything in it
        if (newUsers && prevMemNums?.length){
            const toBeAdded = []
            const oldMemIds = prevMemNums
            const toBeDeleted = []
            
            //loops throught the uploaded members and checks if they were already in the firebase
            newUsers.map((newUser) => {
                //if applicaiton id is not in firebase, they will be in newUser array
                //else we take away the application id number from the array
                //of firebase member id numbers
                if (prevMemNums.indexOf(newUser.applicationID) == -1){
                    toBeAdded.push(newUser)
                    
                } else {
                    oldMemIds.splice(prevMemNums.indexOf(newUser.applicationID), 1)
                }
            })
            //loops through firebase members and checks if they should be deleted from
            //firebase or not
            previousMembers.map((prevMem) => {
                if (oldMemIds.indexOf(prevMem.applicationID) != -1){
                    toBeDeleted.push(prevMem)
                }
            })
            setUsersToAdd(toBeAdded)
            setDelUsers(toBeDeleted)
            setShowConfirmation(true)
        }
        
    }
    //change to auth users when you get the chacne
    const updateAuthUsers = () => {
        
        if (usersToAdd) {
            usersToAdd.map(async (user) => {
                //fix error handling
                await addNewAuthorizedUser(user)
                setFileHolder(undefined)
                setProgress(0)
                setShowConfirmation(false)
                setPreviousMembers(undefined)
                setPrevMemNums(undefined)
                setNewUsers(undefined)
                setUsersToAdd(undefined)
                setDelUsers(undefined)
                
                
            })
        }
        if (delUsers){
            console.log("To Be Developed")
        }
        handleClose();
    }
    
    return (
        <Box>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h2" component="h2" sx={{fontSize: 45}}>
                    {showConfirmation ?   "Confirm upload details":"Upload a CSV File"}
                    
                    <CloseIcon sx={{float: 'right',marginRight:3, fontSize:40,  "&:hover": {cursor: 'pointer'}}} onClick={handleClose}/>
                </Typography>
                {showConfirmation  ? 
                    <Box>
                        <TableContainer sx={{ }}>
                            <Table stickyHeader aria-label="sticky table" sx={tableStyle}>
                                <TableHead>
                                    <TableRow >
                                        Members To Be Added ({usersToAdd.length})
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usersToAdd?.map((user, index) => {
                                        return (
                                            <TableRow key={index}  sx={addUserTableStyle}>
                                                <TableCell sx={{border: 'none'}}>
                                                    <AddIcon></AddIcon>
                                                </TableCell >
                                                <TableCell sx={{border: 'none'}}>
                                                    {user.firstName} {user.lastName}
                                                </TableCell>
                                                <TableCell sx={{marginLeft: "auto", border: 'none'}}>
                                                    {user.email}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TableContainer sx={{  }}>
                            <Table stickyHeader aria-label="sticky table" sx={tableStyle}>
                                <TableHead>
                                    <TableRow >
                                        Members To Be Removed ({delUsers.length})
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {delUsers?.map((user, index) => {
                                        return (
                                            <TableRow key={index} sx={userTableStyle}>
                                                <TableCell sx={{border: 'none'}}>
                                                    <RemoveIcon></RemoveIcon>
                                                </TableCell >
                                                <TableCell sx={{border: 'none'}}>
                                                    {user.firstName} {user.lastName}
                                                </TableCell>
                                                <TableCell sx={{marginLeft: "auto", border: 'none'}}>
                                                    {user.email}
                                                </TableCell>
                                                
                                            </TableRow>
                                        )
                                    })}
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                    </Box>
                : 
                    <Box>
                        {(!fileHolder ) ? 
                            <Box>
                        
                                <Button component="label" sx={uploadStyle}>
                                    <FileUploadIcon sx={{display: 'flex', alignItems: 'center',flexWrap: 'wrap'}}/>
                                    
                                    <Typography id="modal-modal-description" sx={{}}>
                                        Choose a CSV file containing member information to upload
                                    </Typography> 
                                    <input hidden accept=".csv" multiple type="file" onChange={(e) => handleUploadClick(e.target.files)}/>
                                </Button>
                            </Box>
                        : 
                            <Box>
                                <Container sx={uploadingStyle}>
                                    <Container sx={{display: "flex", flexDirection: 'column', alignItems: 'baseline'}}>
                                        
                                        <DescriptionOutlinedIcon sx={{fontSize: 40}}/>
                                    
                                    
                                        <Typography sx={{flexGrow: 4}}>
                                            {fileHolder?.name}
                                            
                                        </Typography>
                                        <Typography sx={{}}>
                                            {fileHolder?.size} MB
                                        </Typography>
                                        <Typography sx={{alignSelf: "flex-end"}}>
                                            {progress == 100 ? "Done": "Uploading..."}
                                        </Typography>
                                    </Container>
                                    <LinearProgress sx={{ borderRadius: 3, blockSize: 10, color: 'blue'}} variant="determinate" value={progress} />
                                </Container>

                            </Box>
                        }
                    </Box>
                }
                

                
                <Box sx={disabledFooter}>
                    {progress == 100 ? 
                        <Button variant="contained" sx={{float: 'right', margin: 2.5, marginRight:6}}  onClick={() => showConfirmation ?  updateAuthUsers() : compareMembers()}>
                            {showConfirmation ?  "Import":"Next"}
                        </Button>
                    :
                        <Button variant="contained" disabled sx={{float: 'right', margin: 2.5, marginRight:6}} >
                            Next
                        </Button>
                    }
                </Box>

                    
                 
            </Box>
            </Modal>
        </Box>
    )
}

export default UploadHouseList
