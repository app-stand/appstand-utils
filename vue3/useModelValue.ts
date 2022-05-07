import {computed} from 'vue'

export default function useModelValue<T>(
  props: {
    modelValue: T
    [key: string]: unknown
  },
  emit: (event: 'update:modelValue', ...args: unknown[]) => void
) {
  return computed({
    get: () => props.modelValue,
    set: (value: T) => emit('update:modelValue', value),
  })
}
