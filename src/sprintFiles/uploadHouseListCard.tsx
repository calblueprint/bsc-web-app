import Papa from 'papaparse'
import { useState, useEffect, useCallback } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import { Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useGetAuthorizedUsersQuery, useGetHouseAuthorizedUsersQuery, useAddNewAuthorizedUserMutation, useUpdateAuthorizedUserMutation } from '@/features/authorizedUser/authorizedUserApiSlice';
import { AuthorizedUser } from '@/types/schema';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowRight'
import DisplayShiftCard from '@/features/shift/cards/DisplayShiftCard';
import NewShiftCard from '@/features/shift/cards/NewShiftCard';
import NewShiftBtn from '@/features/shift/buttons/NewShiftBtn';


let timer: string | number | NodeJS.Timer | undefined = undefined;
//styling for modal, table, and footer

//will be moved into style file
const style = {
    borderRadius: 2,
    boxShadow: 24,

  
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
    width: 848,
    backgroundColor: '#F6F6F6',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 80,
}
const tableStyle = { 
    border:'solid', 
    borderColor: '#E2E2E2', 
    borderRadius: 1, 
    marginTop: 1,

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

const footerBtnStyle = {
    float: 'right', 
    marginTop: 2.5, 
    marginRight:6
}
const footerBackStyle = {
    float: 'right',
    marginTop: 2.5, 
}

const UploadHouseList = () => {
    //usestates
    const [fileHolder, setFileHolder] = useState<File>()
    const [file, setFile] = useState<File>()
    const [open, setOpen] = useState(false);
    //for progress bar
    const [progress, setProgress] = useState(0);
    //goes to final import page if true
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    //array holding the members that were previously in the firebase
    const [previousMembers, setPreviousMembers] = useState<(AuthorizedUser | undefined)[]>()
    //array holding the application numbers of members previously in the firebase
    const [prevMemNums, setPrevMemNums] = useState<string[] | undefined>([])
    //array holding every member who was in csv file
    const [newUsers, setNewUsers] = useState<any>();
    //array holding new members who were not previously in the firebase
    const [usersToAdd, setUsersToAdd] = useState<any>();
    //array holding users who need to be removed from the authorized users
    const [delUsers, setDelUsers] = useState<any>();
    //array holding all members
    const [allMembers, setAllMembers] = useState<(AuthorizedUser | undefined)[]>();
    //array holding the application numbers of all Members
    const [allMemNums, setAllMemNums] = useState<string[] | undefined>([])
    const [updateUsers, setUpdateUsers] = useState<(AuthorizedUser | undefined)[]>();
    const [isExpandedAdd, setIsExpandedAdd] = useState(false)
    const [isExpandedRemove, setIsExpandedRemove] = useState(false)
    //change to authuser
    //this gets all authorized users rn anyway
    //just know that this is for house atm
    const authUsers = useGetAuthorizedUsersQuery([]);
    const [addNewAuthorizedUser] = useAddNewAuthorizedUserMutation();
    const [updatePreviousAuthorizedUser] = useUpdateAuthorizedUserMutation();
    const handleAddExpand = () => setIsExpandedAdd(!isExpandedAdd)
    const handleRemoveExpand = () => setIsExpandedRemove(!isExpandedRemove)
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        resetAllStates();

    }

    //every time getAuthorizedUsers changes, it updates both the previous members array
    //and the previous members application id array
    useEffect(() => {
        if (authUsers.data) {
            const users = authUsers.data.ids.map(id => authUsers.data?.entities[id])
            
            
            //CHANGE TO CURR USER
            const eucUsers = users.filter((member) => member?.houseID =='EUC')
            setPreviousMembers(eucUsers)
            setAllMembers(users)
            eucUsers?.map((member) => {
                if (member?.applicationID){
                    //need to change to deep copy
                    setPrevMemNums(prevMemNums => [...prevMemNums, member?.applicationID]);
                }
               
            })
            users?.map((member) => {
                if (member?.applicationID){
                    setAllMemNums(allMemNums => [...allMemNums, member?.applicationID]);
                } 
            })
        }
    }, [authUsers])


    // useEffect that parses csv file, and and updates progress bar
    useEffect(() => {
        //checks if fileHolder has a file in it
        if (fileHolder) {
            //i dont htink htis works correctly but its supposed to time how long this useEffect takes lol
           timer = setInterval(() => {
            setProgress((oldProgress) => {
                
              
              const diff = Math.random() * 10;
              return Math.min(oldProgress + diff, 100);
            });
          }, 100);
            // const interval = setInterval(() => {
            //     setProgress((prev) => prev + 1);
            // }, 10);
          const userHolder: AuthorizedUser[] = []
          //papaparse parses the csv file passed in and updates the userArr when finished
          Papa.parse(fileHolder, {
            header: true,
            skipEmptyLines: true,
            download: true,
            step: function (row) {
              
              //console.log("current row", row.data)
              //HELLO LOOK AT ME, UPDATE WITH AUTH STATE HOUSE
              const currMember = row.data
              if(currMember.houseID != 'EUC'){
                setFileHolder(undefined)
                window.alert("CSV File contains data from multiple houses.")
                return ;
              } else if  (
                currMember.house === (undefined || '') ||
                currMember.lastName === (undefined || '') ||
                currMember.firstName === (undefined || '') ||
                currMember.email === (undefined || '') ||
                currMember.applicationID === (undefined || '')
              ){
                setFileHolder(undefined)
                window.alert("something is undefined")
                
                return ;
              }
              userHolder.push(row.data)
            },
            complete: function () {
                setNewUsers(userHolder)
            },
            
          })
          setProgress(100);
        }else {
            clearInterval(timer);
          }
    }, [fileHolder])
    
    /**
     * Updates fileHolder useStates and checks if file uploaded by user is a csv file.
     *
     * @param file - File that is uploaded by user
    * 
    * 
    * 
    * @public
    * 
    */
    const uploadCSV = (file: File) => {
        //checks if the file uploaded is a csv file
        if (file?.type == 'text/csv') {
          setFileHolder(file)
          //setUserArr([])
        } else {
          window.alert("Ew! This isn't a csv file. YUCk!!")
        }
      }
    /**
     * Calls uploadCSV file when upload button gets pressed and makes sure what user uploaded is not null.
     *
     * @param lst - FileLst that gets uploaded by user
    * 
    * 
    * 
    * @public
    * 
    */
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

    /**
     * After user uploads a valid file and presses next, compareMembers gets called.
     * Loops through members that were uploaded and checks whether they are a completely new member
     * to the bsc, they transfered houses, or they need to be removed from a house.
     * Updates usersToAdd, delUsers, showConfirmation, and updateUsers.
     * 
     * @public
     * 
    */
    const compareMembers = () => {
        //checks if newUsers & prevMemNums has anything in it
        if (newUsers){
            const toBeAdded: AuthorizedUser[] = []
            let oldMemIds: string[] = []
            if (prevMemNums){
                oldMemIds = prevMemNums
            }
            
            const toBeDeleted: AuthorizedUser[] = []
            const toBeUpdated: AuthorizedUser[] = []

            
            
            //loops throught the uploaded members and checks if they were already in the firebase
            newUsers.map((newUser: AuthorizedUser) => {
                //if applicaiton id is not in firebase, they will be in newUser array
                //else we take away the application id number from the array
                //of firebase member id numbers
                if (prevMemNums?.indexOf(newUser.applicationID) == -1){
                    
                    if(allMemNums?.indexOf(newUser.applicationID) != -1) {
                        toBeUpdated.push(newUser)
                    } else {
                        toBeAdded.push(newUser)
                    }
                    
                } else {
                    if(prevMemNums){
                        oldMemIds?.splice(prevMemNums?.indexOf(newUser.applicationID), 1)
                    }
                }
            })
            
            //loops through firebase members and checks if they should be deleted from
            //firebase or not
            console.log("previousMembers", previousMembers)
            console.log("oldMemIds," , oldMemIds)
            previousMembers?.map((prevMem) => {
                if (prevMem) {
                    if (oldMemIds?.indexOf(prevMem.applicationID) != -1){
                    toBeDeleted.push(prevMem)
                }
                }
                
            })
            setUsersToAdd(toBeAdded)
            setDelUsers(toBeDeleted)
            setShowConfirmation(true)
            setUpdateUsers(toBeUpdated)
        } else {
            window.alert("No change in members detected.")
        }
        
    }
    /**
     * Resets all useStates to their defaults.
     * 
     * @public
     * 
     */
    const resetAllStates = () => {
        setFileHolder(undefined)
        setProgress(0)
        setShowConfirmation(false)
        setPreviousMembers(undefined)
        setPrevMemNums([])
        setAllMemNums([])
        clearInterval(timer);
        setNewUsers(undefined)
        setUsersToAdd(undefined)
        setDelUsers(undefined)
        setUpdateUsers(undefined)
    }

    
    
    //change to auth users when you get the chacne

    /**
     * Checks if there are any users that need to the added or updated in the firebase.
     * If, so new Authorized user is created in database or updated in firebase.
     * Resets all usestates to defaults.
     * 
     * @public
     * 
     */
    const updateAuthUsers = () => {
        
        if (usersToAdd) {
            usersToAdd.map(async (user: AuthorizedUser) => {
                //fix error handling
                await addNewAuthorizedUser(user)
                
                
                
            })
        }
        if (updateUsers) {
            updateUsers.map(async (updateUser) => {
                if (updateUser) {
                    const userInfo = {
                    userId: updateUser.id, 
                    data: {
                        houseID: updateUser.houseID
                    }
                    }
                    updatePreviousAuthorizedUser(userInfo)
                }
                
            })
        }
        if (delUsers){
            delUsers.map(async (delUser: AuthorizedUser) => {
                if (delUser) {
                    const userInfo = {
                    userId: delUser.id, 
                    data: {
                        houseID: ""
                    }
                    }
                    updatePreviousAuthorizedUser(userInfo)
                }
                
            })
        }
        resetAllStates();
        handleClose();
    }
    
    return (
        
        <Box>
            {/* button that makes modal pop up */}
            <Button onClick={handleOpen}>Add Members <AddIcon/></Button>
            <Dialog
                
                sx={style}
                maxWidth='xl'
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogContent sx={{height: 500, width: 850}}>
            
                    <DialogTitle id="modal-modal-title" variant="h5"  sx={{height: 80, }}>
                        {showConfirmation ?   "Confirm upload details":"Upload a CSV File"}
                        
                        <CloseIcon sx={{float: 'right', marginRight: 0, fontSize:40,  "&:hover": {cursor: 'pointer'}}} onClick={handleClose}/>
                    </DialogTitle>

                    {/* checks if final page should be shown or upload page should be shown */}
                    {showConfirmation  ? 
                        <Box>
                            {/* table that displays members that need to be added to certain house in firebase */}
                            <TableContainer sx={{ maxHeight: 140 }}>
                                <Table stickyHeader sx={tableStyle}>
                                    <TableHead>
                                        <TableRow >
                                            Members To Be Added ({usersToAdd?.length + updateUsers?.length})
                                            <IconButton sx={{ marginLeft: "auto",}} onClick={handleAddExpand}>
                                                {isExpandedAdd ? (
                                                    <KeyboardArrowUpIcon
                                                        sx={{ fontSize: 20, color: 'black'  }}
                                                    />
                                                    ) : (
                                                    <KeyboardArrowDownIcon
                                                        sx={{ fontSize: 20, color: 'black', }}
                                                    />
                                                )}
                                            </IconButton>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        
                                        {isExpandedAdd && usersToAdd?.concat(updateUsers)?.map((user: AuthorizedUser, index:number) => {
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
                            {/* table that displays members that need to be removed from house in firebase */}
                            <TableContainer sx={{ maxHeight: 140 }}>
                                <Table stickyHeader sx={tableStyle}>
                                    <TableHead>
                                        <TableRow >
                                            Members To Be Removed ({delUsers?.length})
                                            <IconButton onClick={handleRemoveExpand}>
                                                {isExpandedRemove ? (
                                                    <KeyboardArrowUpIcon
                                                        sx={{ fontSize: 20, color: 'black'  }}
                                                    />
                                                    ) : (
                                                    <KeyboardArrowDownIcon
                                                        sx={{ fontSize: 20, color: 'black' }}
                                                    />
                                                )}
                                            </IconButton>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isExpandedRemove && delUsers?.map((user : AuthorizedUser, index : number) => {
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
                            {/* if there is not a valid file that has been uploaded, displays upload button */}
                            {(!fileHolder ) ? 
                                // upload button
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
                                // uploading file screen
                                <Box>
                                    <Container sx={uploadingStyle}>
                                        <Container sx={{display: "flex", flexDirection: 'column', alignItems: 'baseline'}}>
                                        <CloseIcon sx={{alignSelf: "flex-end", marginTop: 2,  fontSize:18,  "&:hover": {cursor: 'pointer'}}} onClick={resetAllStates}/>
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
                

                    {/* footer at the bottom of modal */}
                    <Box sx={disabledFooter}>

                        {progress == 100 ? 
                            <Container>
                                {/* button that is displayed depends on what page of modal */}
                                <Button variant="contained" sx={footerBtnStyle}  onClick={() => showConfirmation ?  updateAuthUsers() : compareMembers()}>
                                    {showConfirmation ?  "Import":"Next"}
                                </Button>
                                <Button variant="text" sx={footerBackStyle} onClick={resetAllStates}> Back</Button>
                                
                            </Container>
                            
                        :   <Container>
                                <Button variant="contained" disabled sx={footerBtnStyle} >
                                    Next
                                </Button>
                                {fileHolder ? 
                                    <Button variant="text" sx = {footerBackStyle} onClick={resetAllStates}>Back</Button>
                                : 
                                    <></>
                                }
                                
                                
                            </Container>
                        }
                    </Box>

                </DialogContent>   
            </Dialog>
        </Box>
    )
}

export default UploadHouseList
