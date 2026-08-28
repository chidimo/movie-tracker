import { MaterialIcons } from '@expo/vector-icons'
import * as React from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedText } from './themed-text'
import { ThemedView } from './themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

type Props = {
  title: string | React.ReactNode
  visible: boolean
  modalBehavior?: 'slide-from-bottom' | 'fade-into-view'
  onRequestClose: () => void
}

export const DefaultModal = (props: React.PropsWithChildren<Props>) => {
  const {
    title,
    children,
    visible,
    onRequestClose,
    modalBehavior = 'slide-from-bottom',
  } = props
  const { bottom } = useSafeAreaInsets()
  const scheme = useColorScheme() ?? 'light'
  const {
    background: bgColor,
    text: textColor,
    overlay: overlayColor,
  } = useThemeColor({}, ['background', 'text', 'overlay'])
  const dividerColor = Colors[scheme].icon

  const modalViewStyle =
    modalBehavior === 'slide-from-bottom'
      ? {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }
      : { borderRadius: 10, paddingVertical: 20 }

  return (
    <ThemedView style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        visible={visible}
        onRequestClose={onRequestClose}
        transparent
      >
        <View
          style={[
            styles.innerCenter,
            {
              justifyContent:
                modalBehavior === 'slide-from-bottom' ? 'flex-end' : 'center',
              marginBottom: bottom,
              backgroundColor: overlayColor,
            },
          ]}
        >
          <View
            style={[
              styles.modalView,
              { backgroundColor: bgColor, shadowColor: textColor },
              modalViewStyle,
            ]}
          >
            <View
              style={[
                styles.titleContainer,
                { borderBottomColor: dividerColor },
              ]}
            >
              <View style={{ width: '89%' }}>
                {typeof title === 'string' ? (
                  <ThemedText style={[styles.title, { color: textColor }]}>
                    {title}
                  </ThemedText>
                ) : (
                  title
                )}
              </View>
              <Pressable onPress={onRequestClose}>
                <MaterialIcons name="close" size={48} color={textColor} />
              </Pressable>
            </View>
            <ScrollView>{children}</ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  innerCenter: {
    flex: 1,
  },
  modalView: {
    paddingHorizontal: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
