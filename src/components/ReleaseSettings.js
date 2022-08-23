import React, {
  useContext, useEffect, useState,
} from 'react'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Grid } from '@material-ui/core'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'

import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { resourceSelectList , resourceIdMapper } from '@common/ResourceList'
import { NT_BOOKS, OT_BOOKS } from '@common/BooksOfTheBible'

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    minWidth: '100%',
  },
}))

export default function ReleaseSettings() {
  const classes = useStyles()

  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)

  const {
    state: {
      releaseResources,
      releaseNotes,
      releaseName,
      releaseState,
      releaseBooks,
    },
    actions: {
      setReleaseResources,
      setReleaseNotes,
      setReleaseName,
      setReleaseState,
      setReleaseBooks,
    },
  } = useContext(AdminContext)

  const handleResourceChange = (event) => {
    const item = event.target.name
    const isChecked = event.target.checked
    console.log( item)
    console.log( isChecked)
    const newMap = new Map(releaseResources)

    if ( isChecked ) {
      newMap.set(item, isChecked)
    } else {
      newMap.delete(item)
    }
    setReleaseResources(newMap)
  }

  const handleReleaseNotesChange = event => {
    setReleaseNotes(event.target.value)
    // setTimeout( () => console.log("new version=",releaseVersion), 1)
  }

  const handleReleaseNameChange = event => {
    setReleaseName(event.target.value)
    // setTimeout( () => console.log("new version=",releaseVersion), 1)
  }

  const handleReleaseStateChange = event => {
    setReleaseState(event.target.value)
    // setTimeout( () => console.log("new version=",releaseVersion), 1)
  }

  const handleReleaseBooksChange = (name) => (event) => {
    setReleaseBooks({ ...releaseBooks, [name]: event.target.checked })
  }

  const handleSelectNoneOt = () => {
    let _bookSelectionState = { ...releaseBooks }
    Object.keys(OT_BOOKS).forEach( (bookId) => {
      _bookSelectionState[bookId] = false
    })

    setReleaseBooks(_bookSelectionState)
  }

  const handleSelectAllOt = () => {
    let _bookSelectionState = { ...releaseBooks }
    Object.keys(OT_BOOKS).forEach( (bookId) => {
      _bookSelectionState[bookId] = true
    })

    setReleaseBooks(_bookSelectionState)
  }

  const handleSelectNoneNt = () => {
    let _bookSelectionState = { ...releaseBooks }
    Object.keys(NT_BOOKS).forEach( (bookId) => {
      _bookSelectionState[bookId] = false
    })

    setReleaseBooks(_bookSelectionState)
  }

  const handleSelectAllNt = () => {
    let _bookSelectionState = { ...releaseBooks }
    Object.keys(NT_BOOKS).forEach( (bookId) => {
      _bookSelectionState[bookId] = true
    })

    setReleaseBooks(_bookSelectionState)
  }


  // debugging
  useEffect(() => {
    console.log('One or more of these changed:',
      `${releaseResources}, ${releaseName}, ${releaseNotes}`,
    )
    console.log(releaseBooks);
    console.log(releaseResources);

  }, [releaseResources, releaseName, releaseNotes, releaseBooks])

  return (
    <>
      <Paper className='flex flex-col h-90 w-full p-6 pt-3 my-2'>
        <p><b>Release Repository Settings for Organization</b> <i>{organization}</i> <b>and Language ID</b> <i>{languageId}</i></p>
        <div className='flex flex-col justify-between'>
          <Grid container spacing={3}>
            <Grid item xs={5}>
              <Paper>
                <Typography> <br/> </Typography>
                <div>
                  <Button onClick={handleSelectAllOt} color="primary" variant="contained" className={classes.button}>
                    Select All
                  </Button>
                  <Button onClick={handleSelectNoneOt} color="primary" variant="contained" className={classes.button}>
                    Select None
                  </Button>
                </div>
                <FormControl required component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Old Testament</FormLabel>
                  <FormGroup>
                    {Object.entries(OT_BOOKS).map( ([bookId,bookName]) =>
                      <FormControlLabel
                        control={<Checkbox checked={releaseBooks[bookId]} onChange={handleReleaseBooksChange(bookId)} value={bookId} />}
                        label={bookName} key={bookId}
                      />,
                    )}
                  </FormGroup>
                  <FormHelperText />
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={2}>
              <Typography> <br/> <br/> <br/> </Typography>
              <Paper>
                <FormControl required component="fieldset" className={classes.formControl}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={
                          releaseBooks['Open Bible Stories (OBS)']
                            ?
                            releaseBooks['Open Bible Stories (OBS)']
                            :
                            false
                        }
                        onChange={handleReleaseBooksChange('Open Bible Stories (OBS)')}
                        value='Open Bible Stories (OBS)' />
                      }
                      label='Open Bible Stories (OBS)'
                      key='Open Bible Stories (OBS)'
                    />
                  </FormGroup>
                  <FormHelperText />
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={5}>
              <Paper>
                <Typography> <br/> </Typography>
                <div>
                  <Button onClick={handleSelectAllNt} color="primary" variant="contained" className={classes.button}>
                    Select All
                  </Button>
                  <Button onClick={handleSelectNoneNt} color="primary" variant="contained" className={classes.button}>
                    Select None
                  </Button>
                </div>

                <FormControl required component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">New Testament</FormLabel>
                  <FormGroup>
                    {Object.entries(NT_BOOKS).map( ([bookId,bookName]) =>
                      <FormControlLabel
                        control={<Checkbox checked={releaseBooks[bookId]} onChange={handleReleaseBooksChange(bookId)} value={bookId} />}
                        label={bookName} key={bookId}
                      />,
                    )}
                  </FormGroup>
                  <FormHelperText />
                </FormControl>
              </Paper>
            </Grid>
          </Grid>

          <FormControl required component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Select Resources</FormLabel>
            <FormGroup>
              {resourceSelectList().map( ({ id,name }) =>
                <FormControlLabel
                  control={<Checkbox checked={releaseResources.get(id) || false} onChange={handleResourceChange} name={id} />}
                  label={name} key={id}
                />,
              )}
            </FormGroup>
            <FormHelperText />
          </FormControl>

          <FormControl>
            <FormLabel id="release-type-radio-buttons-group-label">Release Type</FormLabel>
            <RadioGroup
              aria-labelledby="release-type-radio-buttons-group-label"
              defaultValue="prod"
              name="release-type-radio-buttons-group"
              row
              value={releaseState}
              onChange={handleReleaseStateChange}
            >
              <FormControlLabel value="prod" control={<Radio />} label="Production" />
              <FormControlLabel value="prerelease" control={<Radio />} label="Pre-Release" />
            </RadioGroup>
          </FormControl>

          <FormControl variant='outlined' className={classes.formControl}>
            <TextField id="name"
              variant='outlined'
              required={true}
              label="Release Name"
              // autoFocus={true}
              value={releaseName}
              type='text'
              onChange={handleReleaseNameChange}
            />
          </FormControl>
          <FormControl variant='outlined' className={classes.formControl}>
            <TextField id="releaseNotes"
              variant='outlined'
              required={true}
              label="Release Notes"
              type='text'
              multiline={true}
              onChange={handleReleaseNotesChange}
              value={releaseNotes}
            />
          </FormControl>
        </div>
      </Paper>
    </>
  )
}

