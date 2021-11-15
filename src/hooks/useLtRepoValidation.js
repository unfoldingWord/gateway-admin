import { useEffect, useState } from 'react';
import YAML from 'js-yaml-parser'
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
import {decodeBase64ToUtf8} from '@utils/decode'



export default function useLtRepoValidation({authentication, owner, server, languageId}) {

  const [ltRepoTree, setLtRepoTree] = useState({})
  const [ltRepoTreeManifest, setLtRepoTreeManifest] = useState({})
  const [ltRepoTreeErrorMessage, setLtRepoTreeErrorMessage] = useState(null)

  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_lt/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      let _repo = languageId
      if ( owner === "unfoldingWord" || owner === "unfoldingword" ) {
        _repo += "_ult"
      } else {
        _repo += "_glt"
      }
      const url = `${server}/api/v1/repos/${owner}/${_repo}/git/trees/master?recursive=false&per_page=999999`
      let errorCode = 0
      try {
        const ltTree = await doFetch(url,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`AdminContext - error fetching repos tree, status code ${errorCode}\nURL=${url}`)
              return null
            }
            return response?.data
          })

          if (ltTree === null) { // if no repo
            console.warn(`AdminContext - empty repo`)
            setLtRepoTreeErrorMessage("Repo Not Found")
          } else {
            setLtRepoTreeErrorMessage(null)
          }
          if ( ltTree.tree ) {
            setLtRepoTree(ltTree.tree)
            let _url;
            for (let i=0; i < ltTree.tree.length; i++) {
              if (ltTree.tree[i].path === "manifest.yaml") {
                _url = ltTree.tree[i].url
                break
              }
            }
            if ( _url ) {
              // get the manifest
              const ltManifest = await doFetch(_url,
                authentication, HTTP_GET_MAX_WAIT_TIME)
                .then(response => {
                  if (response?.status !== 200) {
                    errorCode = response?.status
                    console.warn(`AdminContext - error fetching lt manifest, status code ${errorCode}`)
                    return null
                  }
                  return response?.data
              })
              if ( ltManifest === null ) {
                setLtRepoTreeErrorMessage("Unable to retrieve manifest")
              } else {
                if (ltManifest.content && (ltManifest.encoding === 'base64')) {
                  const _content = decodeBase64ToUtf8(ltManifest.content)
                  const manifestObj = YAML.safeLoad(_content)
                  setLtRepoTreeManifest(manifestObj)
                } else {
                  setLtRepoTreeErrorMessage("Unable to decode manifest")
                }
              }
            } else {
              setLtRepoTreeErrorMessage("No manifest found")
              console.log("no manifest found")
            }
          } else {
            setLtRepoTreeErrorMessage("No files in repo")
          }
  
      } catch (e) {
        const message = e?.message
        const disconnected = isServerDisconnected(e)
        console.warn(`AdminContext - error fetching repos tree, message '${message}', disconnected=${disconnected}`, e)
      }
    }

    if (authentication && owner && server && languageId) {
      getReposTrees()
    } else {
      console.warn(`AdminContext - reached, but not logged in`)
    }
  }, [authentication, owner, server, languageId])


  return {
    state: {
      ltRepoTree,
      ltRepoTreeManifest,
      ltRepoTreeErrorMessage,
    },
  }

}