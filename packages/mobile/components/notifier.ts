import { Easing, Notifier } from 'react-native-notifier'

export const showNotification = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => {
  Notifier.showNotification({
    title,
    description: description || '',
    // duration: 0,
    showAnimationDuration: 800,
    showEasing: Easing.bounce,
    onHidden: () => console.log('Hidden'),
    onPress: () => console.log('Press'),
    hideOnPress: false,
    translucentStatusBar: true,
  })
}
