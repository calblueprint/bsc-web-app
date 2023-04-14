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
import { Container } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

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

// const modalstyle = {
//     width: 400,
//     height: 400
// }
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

const UploadHouseList = () => {
    const [fileHolder, setFileHolder] = useState<File>()
    const [file, setFile] = useState<File>()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        //checks if fileHolder has a file in it
        
        if (fileHolder) {
            console.log(fileHolder)
          const userHolder: any[] = []
          const timer = setInterval(() => {
            setProgress((oldProgress) => {
              
              const diff = Math.random() * 10;
              return Math.min(oldProgress + diff, 100);
            });
          }, 500);
      
    
          //papaparse parses the csv file passed in and updates the userArr when finished
          Papa.parse(fileHolder, {
            header: true,
            skipEmptyLines: true,
            download: true,
            step: function (row) {
              userHolder.push(row.data)
              console.log("current row", row.data)
            },
            complete: function () {
                console.log("hurray!")
              //setUserArr(userHolder)
            //   uploadRowsToFirebase(userHolder)
            },
          })
        //   return () => {
        //     clearInterval(timer);
        //   };
        }
    }, [fileHolder])
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
                    Upload a CSV File
                    <CloseIcon sx={{float: 'right',marginRight:3, fontSize:40,  "&:hover": {cursor: 'pointer'}}} onClick={handleClose}/>
                </Typography>
                {(!fileHolder && progress != 100) ? 
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

                
                <Box sx={disabledFooter}>
                    {progress == 100 ? 
                        <Button variant="contained" sx={{float: 'right', margin: 2.5, marginRight:6}}>
                            Next
                        </Button>
                    :
                        <Button variant="contained" disabled sx={{float: 'right', margin: 2.5, marginRight:6}}>
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
{/* <Button sx={uploadStyle}>
                        <input  type="file"  onChange={(e) => handleUploadClick(e.target.files)}/>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Choose a CSV file containing member information to upload
                        </Typography> 
                    </Button> */}