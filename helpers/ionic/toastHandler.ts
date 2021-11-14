import { toastController } from '@ionic/vue'

export async function handleError(e: any, message?: string) {
  console.error(e)
  const toast = await toastController.create({
    header: 'Something went wrong.',
    message: message,
    duration: 5000,
    position: 'top',
    color: 'danger',
    buttons: [
      {
        text: 'Close',
        role: 'cancel',
      },
    ],
  })
  return toast.present()
}

export async function handleWarning(message?: string, header?: string) {
  const toast = await toastController.create({
    header: header || 'Warning',
    message: message,
    duration: 5000,
    position: 'top',
    color: 'primary',
    buttons: [
      {
        text: 'Close',
        role: 'cancel',
      },
    ],
  })
  return toast.present()
}

export async function handleSuccess(message?: string, header?: string) {
  const toast = await toastController.create({
    header: header || 'Succees!',
    message: message,
    duration: 5000,
    position: 'top',
    color: 'success',
    buttons: [
      {
        text: 'Close',
        role: 'cancel',
      },
    ],
  })
  return toast.present()
}

export async function displayNotification(message?: string, header?: string) {
  const toast = await toastController.create({
    header: header,
    message: message,
    duration: 10000,
    position: 'top',
    color: 'primary',
    buttons: [
      {
        text: 'Close',
        role: 'cancel',
      },
    ],
  })
  return toast.present()
}
