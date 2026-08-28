import { useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomButton } from '@/components/form-elements/custom-button'
import { DefaultModal } from '@/components/modal'
import { ThemedText } from '@/components/themed-text'
import { useSeriesTracker } from '@/context/series-tracker-context'

export const DeleteEverything = () => {
  const router = useRouter()
  const { replaceState } = useSeriesTracker()
  const [visible, setVisible] = useState(false)

  const open = useCallback(() => setVisible(true), [])
  const close = useCallback(() => setVisible(false), [])

  const onConfirm = useCallback(async () => {
    // Clear all tracker data (profile, shows, api key)
    await replaceState({ shows: [] })
    setVisible(false)
    // Return to Home tab
    router.replace('/')
  }, [replaceState, router])

  return (
    <>
      <View style={styles.row}>
        <CustomButton
          variant="DANGER"
          title="Delete Everything"
          onPress={open}
        />
      </View>

      <DefaultModal
        title="Confirm deletion"
        visible={visible}
        onRequestClose={close}
      >
        <View>
          <ThemedText style={{ marginBottom: 8 }}>
            Are you sure you want to permanently delete all movies, your
            profile, and settings? This cannot be undone.
          </ThemedText>
          <View style={styles.modalButtons}>
            <CustomButton
              variant="CANCEL"
              title="Cancel"
              onPress={close}
              containerStyle={{ width: '45%' }}
            />
            <CustomButton
              variant="DANGER"
              title="Yes, delete"
              onPress={onConfirm}
              containerStyle={{ width: '45%' }}
            />
          </View>
        </View>
      </DefaultModal>
    </>
  )
}

const styles = StyleSheet.create({
  row: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
})
