import localforage from 'localforage';
import {
  doFetch,
  isServerDisconnected,
} from '@utils/network'

localforage.setDriver([localforage.INDEXEDDB, localforage.WEBSQL]);

localforage.ready().then(function() {
  // This code runs once localforage
  // has fully initialized the selected driver.
  console.log(localforage.driver()); 
}).catch(function (e) {
  console.log(e); // `No available storage method found.`
  // One of the cases that `ready()` rejects,
  // is when no usable storage driver is found
});

export const sessionStore = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: 'session-store',
});

export async function clearCaches() {
  console.log("Clearing localforage.INDEXEDDB sessionStore");
  await sessionStore.clear();
  await sessionStore.setItem("Session-Cleared","true")
}



/**
 * get content from cache if present, otherwise use fetch()
 * The return value is an object:
 * - data: contains the data (content or error message)
 * - error: if true, then data is an error message; othewise the content
 * Note: only one should be null!
 * @param {string} url
 * @param {object} authentication
 * @return {object} returned object with content or an error
 */
export async function getContent(url, authentication) {
  console.log("getContent() entering")
  let results = {}
  // let content = await localforage.sessionStore.getItem(url)
  // if ( content !== null ) {
  //   console.log("getContent() cached=", content)
  //   results.data = content
  //   results.error = false
  //   return results
  // }

  let errorCode
  let _errorMessage = null
  let fetchError = true
  let content
  // not in cache ... go get it
  console.log("getContent() not in cache, fetching")
  try {
    content = await doFetch(url, authentication)
      .then(response => {
        console.log("response=", response)
        if (response?.status !== 200) {
          errorCode = response?.status
          console.warn(`doFetch - error fetching file,
            status code ${errorCode},
            URL=${url},
            response:`,response)
          fetchError = true
          return null
      }
      fetchError = false
      return response?.data
    })
    if (fetchError) {
      _errorMessage = `Fetch error`
      content = null // just to be sure
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)
    console.warn(`doFetch - error fetching file,
      message '${message}',
      disconnected=${disconnected},
      URL=${url},
      error message:`, 
      e)
    _errorMessage = "Network error"
    content = null
  }
  // if ( content ) {
  //   localforage.sessionStore.setItem(url,content)
  // } 
  console.log("getContent() results=", results)
  results.data = content 
  results.error = fetchError

  return results
}
