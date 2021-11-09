import {
  useContext,
  useEffect,
  useState,
} from 'react'
import { Workspace } from 'resource-workspace-rcl'
import { makeStyles } from '@material-ui/core/styles'

import { StoreContext } from '@context/StoreContext'
import CircularProgress from '@components/CircularProgress'
import {
  addNetworkDisconnectError,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'
import { useRouter } from 'next/router'
import { HTTP_CONFIG } from '@common/constants'
import { ALL_BIBLE_BOOKS } from '@common/BooksOfTheBible'
import NetworkErrorPopup from '@components/NetworkErrorPopUp'
import { Card, useResourceClickListener } from 'translation-helps-rcl'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    margin: '0 1px !important',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  dragIndicator: {},
}))

function RepoValidation() {
  const router = useRouter()
  const classes = useStyles()
  const [workspaceReady, setWorkspaceReady] = useState(false)
  const [networkError, setNetworkError] = useState(null)
  const {
    state: {
      owner,
      server,
      appRef,
      languageId,
      currentLayout,
      loggedInUser,
      tokenNetworkError,
    },
    actions: {
      logout,
      setCurrentLayout,
      setTokenNetworkError,
      setLastError,
    },
  } = useContext(StoreContext)

  /**
   * in the case of a network error, process and display error dialog
   * @param {string} errorMessage - optional error message returned
   * @param {number} httpCode - http code returned
   */
  function processError(errorMessage, httpCode=0) {
    processNetworkError(errorMessage, httpCode, logout, router, setNetworkError, setLastError )
  }

  /**
   * show either tokenNetworkError or NetworkError for workspace
   * @return {JSX.Element|null}
   */
  function showNetworkError() {
    if (tokenNetworkError) { // if we had a token network error on startup
      if (!tokenNetworkError.router) { // needed for reload of page
        setTokenNetworkError({ ...tokenNetworkError, router }) // make sure router is set
      }
      return (
        <NetworkErrorPopup
          networkError={tokenNetworkError}
          setNetworkError={(error) => {
            setTokenNetworkError(error)
            setNetworkError(null) // clear this flag in case it was also set
          }}
          hideClose={true}
          onRetry={reloadApp}
        />
      )
    } else if (networkError) { // for all other workspace network errors
      return (
        <NetworkErrorPopup
          networkError={networkError}
          setNetworkError={setNetworkError}
          onActionButton={onNetworkActionButton}
          hideClose={true}
          /* show reload if send feedback not enabled */
          onRetry={!networkError.actionButtonText ? reloadApp : null}
        />
      )
    }
    return null
  }

  /**
   * process error and determine if there is a problem with connection to server
   *  if showAnyError is true we display an error popup
   *    the process then is to check if this is server connection problem - if so we display that message, if not we display the error returned
   *  if showAnyError is false (default) we only display an error popup if there is a problem connecting to server
   * @param {string} message - the error message we received fetching a resource
   * @param {boolean} isAccessError - if false then the error type is not one that would be caused by server connection problems
   * @param {number} resourceStatus - status code returned fetching resource
   * @param {object} error - error object for detected error, could be a parsing error, etc.  This will take precedence over message
   * @param {boolean} showAllErrors - if true then always show a popup error message, otherwise just show server error message if we can't talk to server
   */
  function onResourceError(message, isAccessError, resourceStatus, error, showAllErrors = false) {
    if (!networkError ) { // only show if another error not already showing
      if (showAllErrors) {
        processNetworkError(error || message, resourceStatus, logout, router, setNetworkError, setLastError, setLastError)
      } else {
        if (isAccessError) { // we only show popup for access errors
          addNetworkDisconnectError(error || message, 0, logout, router, setNetworkError, setLastError)
        }
      }
    }
  }


  useEffect(() => {
    setWorkspaceReady(false)

    if (owner && languageId && appRef && server && loggedInUser) {
      setWorkspaceReady(true)
    }// eslint-disable-next-line
  }, [owner, languageId, appRef, server, loggedInUser])



  const config = {
    server,
    ...HTTP_CONFIG,
  }

  return (
    (tokenNetworkError || networkError || !workspaceReady) ? // Do not render workspace until user logged in and we have user settings
      <>
        {showNetworkError()}
        <CircularProgress size={180} />
      </>
      :
        <Workspace
          layout={currentLayout}
          classes={classes}
          gridMargin={[10, 10]}
          onLayoutChange={(_layout, layouts) => {
            setCurrentLayout(layouts)
          }}

          minW={3}
          minH={4}

          rowHeight={25}
          layoutWidths={[
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ]}
          layoutHeights={[ 
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
            [10,10],
          ]}

        >
          {
            Object.keys(ALL_BIBLE_BOOKS).map( (bookId) =>           
              <Card title={ALL_BIBLE_BOOKS[bookId]} classes={classes} hideMarkdownToggle={true}>
                <p style={{ padding: '30px' }}>
                  {ALL_BIBLE_BOOKS[bookId]} has bookId of "{bookId}".
                </p>
              </Card>
            )
          }
        </Workspace>
  )
}

export default RepoValidation
/*
          rowHeight={25}
          layoutWidths={[
            [1, 1, 1],
            [2, 2, 2],
            [3, 3, 3],
            [4, 4, 4],
          ]}
          layoutHeights={[[10,10], [10, 10], [10, 10], [10, 10]]}
          minW={3}
          minH={4}
          breakpoints={{
            lg: 900,
            sm: 680,
            xs: 300,
          }}
          columns={{
            lg: 12,
            sm: 6,
            xs: 3,
          }}
*/