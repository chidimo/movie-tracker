import { StyleSheet, View } from 'react-native'
import { ProfileSettings } from '../user/profile-settings'
import { DeleteEverything } from './delete-everything'
import { EnableNotifications } from './enable-notifications'
import { SetupNotificationLeadDays } from './setup-notification-lead-days'
import { ThemeSelector } from './theme-selector'
import { AIDebugInfo } from '@/components/debug/ai-debug-info'
import { HorizontalSeparator } from '@/components/horizontal-separator'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Colors, Fonts } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'

const SettingSection = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description?: string
}) => {
  const { mutedText: mutedTextColor } = useThemeColor({}, ['mutedText'])
  return (
    <ThemedView>
      <View style={{ marginBottom: 12 }}>
        <ThemedText type="subtitle">{title}</ThemedText>
        {description && (
          <ThemedText style={{ color: mutedTextColor, marginTop: 4 }}>
            {description}
          </ThemedText>
        )}
      </View>
      {children}
    </ThemedView>
  )
}

export const SettingsScreen = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.surface,
        dark: Colors.dark.surfaceAlt,
      }}
      headerImage={null}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Settings
        </ThemedText>
      </ThemedView>

      <SettingSection
        title="Theme"
        description="Choose light, dark, or follow your system setting."
      >
        <ThemeSelector />
      </SettingSection>
      <HorizontalSeparator />
      <SettingSection
        title="Profile"
        description="Manage your profile information."
      >
        <ProfileSettings />
      </SettingSection>
      <HorizontalSeparator />
      <AIDebugInfo />
      <HorizontalSeparator />
      <SettingSection
        title="Notifications"
        description="Enable or disable notifications."
      >
        <EnableNotifications />
      </SettingSection>
      <HorizontalSeparator />
      <SettingSection
        title="Notification lead time"
        description="Days before an episode airs to notify you."
      >
        <SetupNotificationLeadDays />
      </SettingSection>
      <HorizontalSeparator />
      <SettingSection
        title="Danger zone"
        description="This will delete your profile, all saved shows, and any settings. This action cannot be undone."
      >
        <DeleteEverything />
      </SettingSection>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
})
