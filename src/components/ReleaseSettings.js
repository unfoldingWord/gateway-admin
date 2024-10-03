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
import {
  Grid, Link,
} from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'

import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { resourceSelectList , resourceIdMapper } from '@common/ResourceList'
import { NT_BOOKS, OT_BOOKS } from '@common/BooksOfTheBible'
import { latestReleaseVersion, branchExists } from '@utils/dcsApis'
import { AuthenticationContext } from "gitea-react-toolkit"
import { Alert } from "@material-ui/lab";

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

  const { state: authentication } = useContext(AuthenticationContext)

  const resources = resourceSelectList()

  const [currentVersions, setCurrentVersions] = useState(new Map())
  const [refreshVersions, setRefreshVersions] = useState(true)
  const [bookSelectionMessage, setBookSelectionMessage] = useState('')

  const prepResourceForRelease = async (resourceId) => {
    const tokenid = authentication.token.sha1
    const branch = 'release_' + currentVersions.get(resourceId)
    const previousReleaseBranchExists = await branchExists({
      server,
      organization,
      languageId,
      resourceId:resourceIdMapper(organization, resourceId),
      tokenid,
      branch,
    })

    if ( ! previousReleaseBranchExists ) {
      setBookSelectionMessage('This is the first release of this resource with Gateway Admin, all books ready to be published must be selected.')
    } else {
      setBookSelectionMessage('')
    }
  }

  const handleResourceChange = (event) => {
    const item = event.target.name
    const isChecked = event.target.checked
    const newMap = new Map(releaseResources)

    if ( isChecked ) {
      newMap.set(item, isChecked)
      prepResourceForRelease(item)
    } else {
      newMap.delete(item)
    }
    setReleaseResources(newMap)
  }

  const handleReleaseNotesChange = event => {
    setReleaseNotes(event.target.value)
  }

  const handleReleaseNameChange = event => {
    setReleaseName(event.target.value)
  }

  const handleReleaseStateChange = event => {
    setReleaseState(event.target.value)
  }

  const handleReleaseBooksChange = (event) => {
    const item = event.target.name
    const newMap = new Map(releaseBooks)

    if ( event.target.checked ) {
      newMap.set(item, true)
    } else {
      newMap.delete(item)
    }
    setReleaseBooks(newMap)
  }

  const handleSelectNoneOt = () => {
    const newMap = new Map(releaseBooks)

    Object.keys(OT_BOOKS).forEach( (bookId) => {
      newMap.delete(bookId)
    })

    setReleaseBooks(newMap)
  }

  const handleSelectAllOt = () => {
    const newMap = new Map(releaseBooks)

    Object.keys(OT_BOOKS).forEach( (bookId) => {
      newMap.set(bookId, true)
    })

    setReleaseBooks(newMap)
  }

  const handleSelectNoneNt = () => {
    const newMap = new Map(releaseBooks)

    Object.keys(NT_BOOKS).forEach( (bookId) => {
      newMap.delete(bookId)
    })

    setReleaseBooks(newMap)
  }

  const handleSelectAllNt = () => {
    const newMap = new Map(releaseBooks)

    Object.keys(NT_BOOKS).forEach( (bookId) => {
      newMap.set(bookId, true)
    })

    setReleaseBooks(newMap)
  }

  useEffect( () => {
    async function fetchAllLatestVersion() {
      const versions = new Map()

      await Promise.allSettled( resources.map( async ({ id:resourceId,name }) => {
        const currentVersion = await latestReleaseVersion({
          server, organization,languageId,resourceId: resourceIdMapper(organization, resourceId),
        })
        versions.set(resourceId, currentVersion === 'v0' ? 'none' : currentVersion)
      }))
      setCurrentVersions(versions)
    }

    if (refreshVersions && languageId && organization && resources && server) {
      fetchAllLatestVersion()
      setRefreshVersions(false)
    }
  }, [languageId, organization, resources, server, refreshVersions])

  // debugging
  useEffect(() => {
    console.log('One or more of these changed:',
      `${releaseResources}, ${releaseName}, ${releaseNotes}`,
    )
    console.log(releaseBooks)
    console.log(releaseResources)
  }, [releaseResources, releaseName, releaseNotes, releaseBooks])

  return (
    <>
      <Paper className='flex flex-col h-90 w-full p-6 pt-3 my-2'>
        <p><b>Resource Release Settings for Organization</b> <i>{organization}</i> <b>and Language ID</b> <i>{languageId}</i></p>
        <div className='flex flex-col justify-between'>
          <Grid container spacing={3}>
            <Grid item xs={5}>
              <Paper>
                <Typography> <br/> </Typography>
                <div className='flex space-x-4'>
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
                        control={<Checkbox checked={releaseBooks.get(bookId) || false} onChange={handleReleaseBooksChange} name={bookId} />}
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
                        <Checkbox checked={releaseBooks.get('obs') || false}
                          onChange={handleReleaseBooksChange}
                          name='obs' />
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
                <div className='flex space-x-4'>
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
                        control={<Checkbox checked={releaseBooks.get(bookId) || false} onChange={handleReleaseBooksChange} name={bookId} />}
                        label={bookName} key={bookId}
                      />,
                    )}
                  </FormGroup>
                  <FormHelperText />
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
          <FormControl
            required
            component='fieldset'
            className={classes.formControl}
          >
            <FormLabel component='legend'>Select Resources</FormLabel>
            <FormGroup>
              {resources.map(({ id, name }) => (
                <Grid container spacing={2} direction='row' key={id}
                  onClick={() =>
                    handleResourceChange({ target: { name: id, checked: !releaseResources.get(id) } })
                  }
                >
                  <Grid item xs={4} style={{ margin: 'auto' }}>
                    <Checkbox
                      checked={releaseResources.get(id) || false}
                      onChange={handleResourceChange}
                      name={id}
                    />
                    {name}
                  </Grid>
                  <Grid item xs={4} style={{ margin: 'auto' }}>
                    <Link
                      target='_blank'
                      href={`${server}/${organization}/${languageId}_${resourceIdMapper(organization, id)}`}
                    >
                      {`${organization}/${languageId}_${resourceIdMapper(organization, id)}`}
                    </Link>
                  </Grid>
                  <Grid item xs={4} style={{ margin: 'auto' }}>
                    <span>
                      Latest Release:{' '}
                      {currentVersions.get(id) &&
                      currentVersions.get(id) !== 'none' ? (
                          <Link
                            target='_blank'
                            href={`${server}/${organization}/${languageId}_${resourceIdMapper(organization, id)}/releases/tag/${currentVersions.get(id)}`}
                          >
                            {currentVersions.get(id)}
                          </Link>
                        ) : (
                          'none'
                        )}
                    </span>
                  </Grid>
                </Grid>
              ))}
            </FormGroup>
            <FormHelperText />
          </FormControl>
          {bookSelectionMessage ? <Alert severity="warning" style={{ marginBottom: '20px' }}>{bookSelectionMessage}</Alert> : '' }
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

