import React, {
  useContext, useEffect, useState,
} from 'react'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import FormControl from '@material-ui/core/FormControl'
import { makeStyles } from '@material-ui/core/styles'
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { RadioGroup, Radio } from '@material-ui/core';

import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    minWidth: '100%',
  },
}))

export default function PrintSettings() {
  const classes = useStyles()
  const errorMessage = 'One or more of must be checked'
  const [state, setState] = useState({
    ot: false,
    nt: false,
    bpFilter: true,
  });

  const handleCheckboxChange = (event) => {
    const _state = { ...state, [event.target.name]: event.target.checked }
    setState(_state)
    setPrintContraints(_state)
  };

  const { ot, nt, bpFilter } = state;

  const error = [ot, nt, bpFilter].filter((v) => v).length < 1;

  const [value, setValue] = useState('lt');


  const handleChange = (event) => {
    const _radioValue = event.target.value
    setValue(_radioValue)
    setPrintResource(_radioValue)
  };

  const {
    state: {
      printResource,
      printConstraints,
    },
    actions: {
      setPrintResource,
      setPrintContraints,
    }
  } = useContext(AdminContext)

  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)

  // initialize context with default value of state
  setPrintContraints(state)
  setPrintResource(value)

  return (
    <>
      <Paper className='flex flex-col h-90 w-full p-6 pt-3 my-2'>
        <p><b>Print Repository Settings for Organization</b> <i>{organization}</i> <b>and Language ID</b> <i>{languageId}</i></p>
        <div className='flex flex-col justify-between my-4'>
          <FormControl variant='outlined' className={classes.formControl} >
            <FormLabel component="legend">Select Literal or Simplified Translation</FormLabel>
            <RadioGroup aria-label="lt-or-st" name="lt-or-st" value={value} onChange={handleChange}>
              <FormControlLabel value="lt" control={<Radio />} label="Literal" />
              <FormControlLabel value="st" control={<Radio />} label="Simplified" />
            </RadioGroup>          
          </FormControl>

          <FormControl required error={error} component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Select What to Print</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={ot} onChange={handleCheckboxChange} name="ot" />}
                label="Old Testament"
              />
              <FormControlLabel
                control={<Checkbox checked={nt} onChange={handleCheckboxChange} name="nt" />}
                label="New Testament"
              />
              <FormControlLabel
                control={<Checkbox checked={bpFilter} onChange={handleCheckboxChange} name="bpFilter" />}
                label="Filter by Selected Book Packages"
              />
            </FormGroup>
            <FormHelperText>{errorMessage}</FormHelperText>
          </FormControl>        
        </div>
      </Paper>
    </>
  )
}

