import {computed} from 'vue'

function useModelValue<T>(
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

export {useModelValue}
