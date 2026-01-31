import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import { Button, Divider, Menu } from 'react-native-paper'
import { MoveToTopButton } from './card-menu-buttons'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useSeriesTracker } from '@/context/series-tracker-context'

type Props = {
  showId: string
  showTitle: string
}

const MenuItemIcon = ({ name, color }: { name: string; color: string }) => (
  <Ionicons name={name as any} size={20} color={color} />
)

export const CardMenu = ({ showId, showTitle }: Props) => {
  const [visible, setVisible] = useState(false)
  const { getShowById, removeShow, moveShowToTop } = useSeriesTracker()
  const { tint: tintColor } = useThemeColor({}, ['tint'])

  const show = getShowById(showId)

  const closeMenu = () => setVisible(false)

  const handleOpenIMDb = async () => {
    closeMenu()
    if (show?.imdbUrl) {
      await WebBrowser.openBrowserAsync(show.imdbUrl)
    }
  }

  const handleMoveToTop = async () => {
    closeMenu()
    await moveShowToTop(showId)
  }

  const handleRemove = async () => {
    closeMenu()
    await removeShow(showId)
  }

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Button onPress={() => setVisible(true)} mode="text" compact>
          <Ionicons name="ellipsis-vertical" size={20} color={tintColor} />
        </Button>
      }
      contentStyle={{ minWidth: 200 }}
    >
      <Menu.Item
        onPress={handleMoveToTop}
        title="Move to Top"
        leadingIcon={() => <MenuItemIcon name="arrow-up" color={tintColor} />}
      />
      <Link href={`/show/${showId}`} asChild>
        <Menu.Item
          onPress={closeMenu}
          title="View Details"
          leadingIcon={() => <MenuItemIcon name="eye" color={tintColor} />}
        />
      </Link>
      <Menu.Item
        onPress={handleOpenIMDb}
        title="Open on IMDb"
        leadingIcon={() => <MenuItemIcon name="link" color={tintColor} />}
      />
      <Divider />
      <Menu.Item
        onPress={handleRemove}
        title="Remove Show"
        leadingIcon={() => <MenuItemIcon name="trash" color="#ff4444" />}
      />
    </Menu>
  )
}
