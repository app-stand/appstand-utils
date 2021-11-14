/** HELPERS **/
// Firebase
export { unwrapQuerySnapshot } from './helpers/firebase/firestore'
export { checkIfUserHasMinimumRole } from './helpers/firebase/functions-admin'

// Ionic
export { openModal } from './helpers/ionic/modalHelpers'
export {
  handleError,
  handleWarning,
  handleInfo,
  handleSuccess,
  displayNotification,
} from './helpers/ionic/toastHandler'
