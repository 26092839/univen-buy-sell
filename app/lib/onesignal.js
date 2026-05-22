import OneSignal from 'react-onesignal'

export async function initOneSignal() {
  await OneSignal.init({
    appId: 'adce44ff-0f43-41f2-80af-16745ccb319c',
    allowLocalhostAsSecureOrigin: true,
    notifyButton: {
      enable: true,
    },
  })
  OneSignal.showSlidedownPrompt()
}