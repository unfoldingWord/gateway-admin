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
