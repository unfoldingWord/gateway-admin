import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import useTnRepoValidation from '@hooks/useTnRepoValidation'




export const AdminContext = React.createContext({});

export default function AdminContextProvider({
  children,
}) {

  
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

  /**
   * in the case of a network error, process and display error dialog
   * @param {string} errorMessage - optional error message returned
   * @param {number} httpCode - http code returned
   */
   function processError(errorMessage, httpCode=0) {
    console.log("processError() message:", errorMessage, httpCode)
    //processNetworkError(errorMessage, httpCode, logout, router, setNetworkError, setLastError )
  }


  const {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
      tnRepoTreeErrorMessage,
    },
  } = useTnRepoValidation({authentication, owner, server, languageId});


  // create the value for the context provider
  const context = {
    state: {
      tnRepoTree,
      tnRepoTreeManifest,
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

/*

  const [tnRepoTree, setTnRepoTree] = useState({})
  const [tnRepoTreeManifest, setTnRepoTreeManifest] = useState({})
  const [tnRepoTreeErrorMessage, setTnRepoTreeErrorMessage] = useState(null)


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

          if (tnTree === null) { // if no repo
            console.warn(`AdminContext - empty repo`)
            setTnRepoTreeErrorMessage("Repo Not Found")
          } else {
            setTnRepoTreeErrorMessage(null)
          }
          if ( tnTree.tree ) {
            setTnRepoTree(tnTree.tree)
            let _url;
            for (let i=0; i < tnTree.tree.length; i++) {
              if (tnTree.tree[i].path === "manifest.yaml") {
                _url = tnTree.tree[i].url
                break
              }
            }
            if ( _url ) {
              // get the manifest
              const tnManifest = await doFetch(_url,
                authentication, HTTP_GET_MAX_WAIT_TIME)
                .then(response => {
                  if (response?.status !== 200) {
                    errorCode = response?.status
                    console.warn(`AdminContext - error fetching tn manifest, status code ${errorCode}`)
                    processError(null, errorCode)
                    return null
                  }
                  return response?.data
              })
              if ( tnManifest === null ) {
                setTnRepoTreeErrorMessage("Unable to retrieve manifest")
              } else {
                if (tnManifest.content && (tnManifest.encoding === 'base64')) {
                  const _content = decodeBase64ToUtf8(tnManifest.content)
                  const manifestObj = YAML.safeLoad(_content)
                  setTnRepoTreeManifest(manifestObj)
                } else {
                  setTnRepoTreeErrorMessage("Unable to decode manifest")
                }
              }
            } else {
              setTnRepoTreeErrorMessage("No manifest found")
              console.log("no manifest found")
            }
          } else {
            setTnRepoTreeErrorMessage("No files in repo")
          }
  
      } catch (e) {
        const message = e?.message
        const disconnected = isServerDisconnected(e)
        console.warn(`AdminContext - error fetching repos tree, message '${message}', disconnected=${disconnected}`, e)
        processError(e)
      }
    }

    if (authentication) {
      getReposTrees()
    } else {
      console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])


*/