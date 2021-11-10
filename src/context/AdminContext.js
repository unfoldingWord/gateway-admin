import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import {
  HTTP_GET_MAX_WAIT_TIME,
} from '@common/constants'
import {
  doFetch,
  isServerDisconnected,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'


export const AdminContext = React.createContext({});

export default function AdminContextProvider({
  children,
}) {
  const [tnRepoTree, setTnRepoTree] = useState({})
  const [tnRepoTreeErrorMessage, setTnRepoTreeErrorMessage] = useState(null)

  
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const {
    state: {
      owner,
      server,
      languageId,
    },
  } = useContext(StoreContext)

  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_tn/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      let errorCode = 0
      try {
        const tnTree = await doFetch(`${server}/api/v1/repos/${owner}/${languageId}_tn/git/trees/master?recursive=false&per_page=999999`,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`AdminContext - error fetching repos tree, status code ${errorCode}`)
              processError(null, errorCode)
              return null
            }
            return response?.data
          })

          if (tnTree === null) { // if no orgs
            console.warn(`AdminContext - empty repo`)
            setTnRepoTreeErrorMessage("Repo Not Found")
          } else {
            setTnRepoTreeErrorMessage(null)
          }
  
          setTnRepoTree(tnTree)
  
      } catch (e) {
        const message = e?.message
        const disconnected = isServerDisconnected(e)
        console.warn(`AdminContext - error fetching repos tree, message '${message}', disconnected=${disconnected}`, e)
        processError(e)
      }
    }

    if (authentication) {
      getReposTrees()
      if ( tnRepoTreeErrorMessage ) {
        console.log("tnRepoTreeErrorMessage", tnRepoTreeErrorMessage)
      } else {
        console.log("tnRepoTree", tnRepoTree)
      }
    } else {
      console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])


  // create the value for the context provider
  const context = {
    state: {
      tnRepoTree,
      tnRepoTreeErrorMessage,
    },
  };

  return (
    <AdminContext.Provider value={context}>
      {children}
    </AdminContext.Provider>
  );
};

AdminContextProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
