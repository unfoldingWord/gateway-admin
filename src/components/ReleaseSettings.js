import React, {
  useContext, useEffect, useState,
} from 'react'
import PropTypes from 'prop-types'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import FormControl from '@material-ui/core/FormControl'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

import { StoreContext } from '@context/StoreContext'
import { AuthContext } from '@context/AuthContext'
import { resourceSelectList } from '@common/ResourceList'

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    minWidth: '100%',
  },
}))

export default function ReleaseSettings({ authentication }) {
  const { actions: { logout } } = useContext(AuthContext)
  const classes = useStyles()
  const [resource, setResource] = useState("")
  const [version, setVersion] = useState("")

  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)


  const defaultProps = {
    options: resourceSelectList(),
    getOptionLabel: (option) => option.name,
    getOptionSelected: (option, value) => option.name === value.name
  };

  return (
    <>
      <Paper className='flex flex-col h-80 w-full p-6 pt-3 my-2'>
        <h3>Release Repository Settings</h3>
        <div className='flex flex-col justify-between my-4'>
          <FormControl variant='outlined' className={classes.formControl} >
            <Autocomplete
              {...defaultProps}
              id="select-resource"
              value={resource}
              onChange={(event, newValue) => {
                console.log("Autocomplete() onchange() setValue:", newValue)
                setResource(newValue);
              }}
              renderInput={(params) => <TextField {...params} 
              label="Select Repository" margin="normal" />}
            />      
          </FormControl>
          <FormControl variant='outlined' className={classes.formControl}>
            <TextField id="version" 
              variant='outlined'
              required={true} 
              label="Version" 
              autoFocus={true}
              defaultValue={version}
              type='text'
              onChange={(event) => {
                setVersion(event.target.value)
              }}
            />
          </FormControl>
        </div>
      </Paper>
    </>
  )
}

ReleaseSettings.propTypes = { authentication: PropTypes.object }
