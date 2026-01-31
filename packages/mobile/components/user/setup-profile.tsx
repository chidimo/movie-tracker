import { Pressable } from 'react-native'
import { ProfileFormModal } from './profile-form-modal'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { useOnOffSwitch } from '@/hooks/use-on-off-switch'
import { useThemeColor } from '@/hooks/use-theme-color'

export const SetupProfile = () => {
  const { hasProfile } = useSeriesTracker()
  const { success: successColor } = useThemeColor({}, ['success'])
  const { isOn, setOn, setOff } = useOnOffSwitch()

  return (
    <>
      <ThemedView>
        <Pressable onPress={setOn}>
          <ThemedView
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <ThemedText type="subtitle">Step 1: Create a profile</ThemedText>
            {hasProfile && (
              <ThemedText style={{ color: successColor }}>✓</ThemedText>
            )}
          </ThemedView>
          <ThemedText>Create a profile to track your shows</ThemedText>
        </Pressable>
      </ThemedView>

      <ProfileFormModal
        visible={isOn}
        onRequestClose={setOff}
        title="Create your profile"
        helpText="Profile is stored locally"
        submitButtonText="Save"
      />
    </>
  )
}
