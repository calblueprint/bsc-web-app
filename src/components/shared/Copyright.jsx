import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://bsc.coop/">
        2023 Berkeley Student Cooperative / (510) 848-1936 / 2424 Ridge Road,
        Berkeley, CA 94709
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default Copyright
