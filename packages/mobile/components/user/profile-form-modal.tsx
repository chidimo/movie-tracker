import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { CustomButton } from '../form-elements/custom-button'
import { CustomInput } from '../form-elements/custom-input'
import { DefaultModal } from '../modal'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { ThemedView } from '@/components/themed-view'
import { ThemedText } from '@/components/themed-text'

type ProfileForm = {
  name: string
}

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
}

interface ProfileFormModalProps {
  visible: boolean
  onRequestClose: () => void
  title?: string
  helpText?: string
  submitButtonText?: string
}

export const ProfileFormModal = ({
  visible,
  onRequestClose,
  title = 'Create your profile',
  helpText = 'Profile is stored locally',
  submitButtonText = 'Save',
}: ProfileFormModalProps) => {
  const { setProfile, state } = useSeriesTracker()

  const form = useForm<ProfileForm>({
    defaultValues: { name: state?.profile?.name ?? '' },
    reValidateMode: 'onChange',
    values: { name: state?.profile?.name ?? '' },
    mode: 'onSubmit',
  })

  const onSubmit = form.handleSubmit(async ({ name }) => {
    const slug = slugifyName(name)
    await setProfile({
      slug,
      name,
      registeredAt: state?.profile?.registeredAt || new Date().toISOString(),
    })
    onRequestClose()
  })

  return (
    <DefaultModal
      title={title}
      visible={visible}
      onRequestClose={onRequestClose}
      modalBehavior="fade-into-view"
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.help}>{helpText}</ThemedText>

          <View style={styles.formRow}>
            <Controller
              control={form.control}
              name="name"
              rules={{ required: 'Name is required' }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <CustomInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Your name"
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                  error={error?.message}
                  containerStyle={styles.inputContainer}
                />
              )}
            />
          </View>

          <CustomButton onPress={onSubmit} title={submitButtonText} />
        </ThemedView>
      </KeyboardAvoidingView>
    </DefaultModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 16,
    justifyContent: 'center',
  },
  help: {
    textAlign: 'left',
    marginBottom: 8,
  },
  formRow: {
    gap: 8,
  },
  inputContainer: {
    width: '100%',
  },
})
