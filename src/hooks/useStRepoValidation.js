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



export default function useStRepoValidation({authentication, owner, server, languageId}) {

  const [stRepoTree, setStRepoTree] = useState({})
  const [stRepoTreeManifest, setStRepoTreeManifest] = useState({})
  const [stRepoTreeErrorMessage, setStRepoTreeErrorMessage] = useState(null)

  // Translation Notes Hook
  // Example: https://qa.door43.org/api/v1/repos/vi_gl/vi_st/git/trees/master?recursive=true&per_page=99999
  useEffect(() => {
    async function getReposTrees() {
      let _repo = languageId
      if ( owner === "unfoldingWord" || owner === "unfoldingword" ) {
        _repo += "_ust"
      } else {
        _repo += "_gst"
      }
      const url = `${server}/api/v1/repos/${owner}/${_repo}/git/trees/master?recursive=false&per_page=999999`
      let errorCode = 0
      try {
        const stTree = await doFetch(url,
          authentication, HTTP_GET_MAX_WAIT_TIME)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`AdminContext - error fetching repos tree, status code ${errorCode}\nURL=${url}`)
              return null
            }
            return response?.data
          })

          if (stTree === null) { // if no repo
            console.warn(`AdminContext - empty repo`)
            setStRepoTreeErrorMessage("Repo Not Found")
          } else {
            setStRepoTreeErrorMessage(null)
          }
          if ( stTree.tree ) {
            setStRepoTree(stTree.tree)
            let _url;
            for (let i=0; i < stTree.tree.length; i++) {
              if (stTree.tree[i].path === "manifest.yaml") {
                _url = stTree.tree[i].url
                break
              }
            }
            if ( _url ) {
              // get the manifest
              const stManifest = await doFetch(_url,
                authentication, HTTP_GET_MAX_WAIT_TIME)
                .then(response => {
                  if (response?.status !== 200) {
                    errorCode = response?.status
                    console.warn(`AdminContext - error fetching st manifest, status code ${errorCode}`)
                    return null
                  }
                  return response?.data
              })
              if ( stManifest === null ) {
                setStRepoTreeErrorMessage("Unable to retrieve manifest")
              } else {
                if (stManifest.content && (stManifest.encoding === 'base64')) {
                  const _content = decodeBase64ToUtf8(stManifest.content)
                  const manifestObj = YAML.safeLoad(_content)
                  setStRepoTreeManifest(manifestObj)
                } else {
                  setStRepoTreeErrorMessage("Unable to decode manifest")
                }
              }
            } else {
              setStRepoTreeErrorMessage("No manifest found")
              console.log("no manifest found")
            }
          } else {
            setStRepoTreeErrorMessage("No files in repo")
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
      stRepoTree,
      stRepoTreeManifest,
      stRepoTreeErrorMessage,
    },
  }

}