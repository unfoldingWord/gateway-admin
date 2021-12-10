import YAML from 'js-yaml-parser'
import {
  REPO_NOT_FOUND,
} from '@common/constants'
import {
  doFetch,
  isServerDisconnected,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'
import {decodeBase64ToUtf8} from '@utils/decode'

export async function getTreesManifest(authentication, url) {
  let errorCode = 0
  let _tree = null
  let _manifest = null
  let _errorMessage = null
  try {
    const trees = await doFetch(url,
      authentication)
      .then(response => {
        if (response?.status !== 200) {
          errorCode = response?.status
          console.warn(`getTreesManifest() - error fetching repos tree, status code ${errorCode}\nURL=${url}`)
          return null
        }
        return response?.data
    })
    if (trees === null) { // if no repo
      _errorMessage = REPO_NOT_FOUND
    } else if ( trees.tree ) {
      _tree = trees.tree
      let _url;
      for (let i=0; i < _tree.length; i++) {
        if (_tree[i].path === "manifest.yaml") {
          _url = _tree[i].url
          break
        }
      }
      if ( _url ) {
        // get the manifest
        const __manifest = await doFetch(_url,
          authentication)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`getTreesManifest() - error fetching manifest, status code ${errorCode},
                url ${_url}
              `)
              return null
            }
            return response?.data
        })
        if ( __manifest === null ) {
          _errorMessage = "Unable to retrieve manifest"
        } else {
          if (__manifest.content && (__manifest.encoding === 'base64')) {
            const _content = decodeBase64ToUtf8(__manifest.content)
            const manifestObj = YAML.safeLoad(_content)
            _manifest = manifestObj
          } else {
            _errorMessage = "Unable to decode manifest"
          }
        }
      } else {
        _errorMessage = "No manifest found"
      }
    } else {
      _errorMessage = "No files in repo"
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)
    console.warn(`getTreesManifest() - error fetching repos tree,
      message '${message}',
      disconnected=${disconnected},
      url ${url}
      Error:`, 
      e)
    //_errorMessage = "Network error fetching repo tree"
  }
  /*
  console.log("getTreesManifest() return:",`
    RepoTree: ${_tree},
    Manifest: ${_manifest},
    Error Message: ${_errorMessage}
  `)
  */
  return {RepoTree: _tree, Manifest: _manifest, RepoTreeErrorMessage: _errorMessage}
}
