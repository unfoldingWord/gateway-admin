import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import { green, red, yellow, grey } from '@material-ui/core/colors'
import { CircularProgress, Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'
import { getBpValidationResults } from '@utils/contentValidation';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    backgroundColor: props => (props.active ? '#ffffff' : 'transparent'),
    '&:hover': {
      color: props => (props.active ? '#ffffff' : theme.palette.primary.main),
      backgroundColor: props => (props.active ? '#07b811' : '#ffffff'),
    },
    border: '1px solid #0089C7',
  },
}))
const validationResults = [];

function DownloadPDF({ active, owner, repo, bookId }) {
  const [submitDownloadPDF, setSubmitDownloadPDF] = useState(false)
  const [pdfStatus, setPDFStatus] = useState(<CircularProgress/>)
  const priorityColumn = 1
  useEffect(() => {
    // determine status of validation 
    let _status
    for (let i=1; i < validationResults.length; i++) {
      if ( parseInt(validationResults[i][priorityColumn]) >= 800 ) {
        _status = red[500]
        break // stop looking
      }
      if ( parseInt(validationResults[i][priorityColumn]) >= 600 ) {
        _status = yellow[500] // keep looking, don't break
      }
    }
    if ( _status === red[500] ) { 
      setPDFStatus(<PDFIcon style={{ color: red[500] }} aria-label="Download PDF" />)
    } else if ( _status === yellow[500]  ) {
      setPDFStatus(<PDFIcon style={{ color: yellow[500] }} aria-label="Download PDF" />)
    } else {
      setPDFStatus(<PDFIcon style={{ color: green[500] }} aria-label="Download PDF" />)
    }

    if ( !submitDownloadPDF ) return;

    async function doSubmitDownloadPDF() {
      setSubmitDownloadPDF(false)
    }
    doSubmitDownloadPDF()
  }, [submitDownloadPDF, bookId, owner, repo])
  

  const classes = useStyles({ active })
  return (
    <Tooltip title="Download PDF">
      <IconButton className={classes.iconButton} onClick={() => setSubmitDownloadPDF(true)} aria-label="Download PDF">
        {pdfStatus}
      </IconButton>
    </Tooltip>
  )
}

export default DownloadPDF
