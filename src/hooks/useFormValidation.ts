import { useState, useCallback, useEffect } from 'react'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: unknown) => boolean | string
  message?: string
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface FormErrors {
  [key: string]: string
}

interface FormTouched {
  [key: string]: boolean
}

export const useFormValidation = <T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: ValidationRules
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<FormTouched>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValid, setIsValid] = useState(false)

  // Common validation patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\-+()]+$/,
    zip: /^\d{5}(-\d{4})?$/,
    creditCard: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
    cvv: /^\d{3,4}$/,
  }

  // Validate a single field
  const validateField = useCallback((name: string, value: unknown): string => {
    const rules = validationRules[name]
    if (!rules) return ''

    if (rules.required && !value) {
      return rules.message || 'This field is required'
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return rules.message || `Minimum ${rules.minLength} characters required`
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return rules.message || `Maximum ${rules.maxLength} characters allowed`
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return rules.message || 'Invalid format'
    }

    if (rules.custom) {
      const result = rules.custom(value)
      if (typeof result === 'string') return result
      if (!result) return rules.message || 'Invalid value'
    }

    return ''
  }, [validationRules])

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    let hasErrors = false

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name as keyof T])
      if (error) {
        newErrors[name] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    return !hasErrors
  }, [values, validationRules, validateField])

  // Handle input change with real-time validation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const processedValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setValues(prev => ({ ...prev, [name]: processedValue }))
    
    // Real-time validation if field has been touched
    if (touched[name]) {
      const error = validateField(name, processedValue)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  // Handle field blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [validateField])

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // Check if form is valid
  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== '')
    const hasEmptyRequired = Object.keys(validationRules).some(name => {
      const rules = validationRules[name]
      return rules.required && !values[name as keyof T]
    })
    
    setIsValid(!hasErrors && !hasEmptyRequired)
  }, [values, errors, validationRules])

  // Handle form submission
  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault()
      
      // Touch all fields
      const allTouched: FormTouched = {}
      Object.keys(validationRules).forEach(name => {
        allTouched[name] = true
      })
      setTouched(allTouched)
      
      // Validate all fields
      if (!validateAll()) {
        return
      }
      
      setIsSubmitting(true)
      
      try {
        await onSubmit(values)
        reset()
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }, [values, validationRules, validateAll, reset])

  // Set field value programmatically
  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (touched[name as string]) {
      const error = validateField(name as string, value)
      setErrors(prev => ({ ...prev, [name as string]: error }))
    }
  }, [touched, validateField])

  // Set multiple values
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }))
  }, [])

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    setMultipleValues,
    patterns,
  }
}

// Pre-defined validation rules for common fields
export const commonValidations = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    required: true,
    pattern: /^[\d\s\-+()]{10,}$/,
    message: 'Please enter a valid phone number',
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  },
  creditCard: {
    required: true,
    pattern: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
    message: 'Please enter a valid credit card number',
  },
  cvv: {
    required: true,
    pattern: /^\d{3,4}$/,
    message: 'Please enter a valid CVV',
  },
  zip: {
    required: true,
    pattern: /^\d{5}(-\d{4})?$/,
    message: 'Please enter a valid ZIP code',
  },
}