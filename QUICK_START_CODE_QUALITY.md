# Quick Start - Code Quality Features

## 🚀 Using the New Code Quality Features

### Constants (`src/constants/index.ts`)

```typescript
import {
  ANIMATION_DURATION,
  BREAKPOINTS,
  VALIDATION,
  TOAST_DURATION,
  Z_INDEX
} from '../constants'

// Responsive design
const isMobile = window.innerWidth < BREAKPOINTS.DESKTOP

// Animations
<motion.div transition={{ duration: ANIMATION_DURATION.DEFAULT }} />

// Validation
if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) { ... }

// Z-index
style={{ zIndex: Z_INDEX.MODAL }}
```

### Validation Schemas (`src/schemas/index.ts`)

```typescript
import {
  emailSchema,
  creditCardSchema,
  validateData,
  getErrorMessages
} from '../schemas'

// Validate form data
const result = validateData(creditCardSchema, formData)

if (!result.success) {
  const errors = getErrorMessages(result.errors)
  setFormErrors(errors)
} else {
  // result.data is fully typed!
  processPayment(result.data)
}

// Validate single field
const emailError = validateField(emailSchema, email)
if (emailError) {
  setError(emailError)
}
```

### Style Constants (`src/styles/constants.ts`)

```typescript
import {
  inputStyle,
  labelStyle,
  primaryButtonStyle,
  cardStyle,
  flexBetweenStyle
} from '../styles/constants'

// Apply reusable styles
<label style={labelStyle}>Email</label>
<input style={inputStyle} />
<button style={primaryButtonStyle}>Submit</button>

// Combine styles
<div style={{ ...cardStyle, ...flexBetweenStyle }}>
  Card with flex layout
</div>
```

### Error Handling (`src/utils/errorHandler.ts`)

```typescript
import {
  handleAsync,
  handleError,
  safeLocalStorage,
  ValidationError
} from '../utils/errorHandler'

// Async operation with automatic error handling
const data = await handleAsync(
  () => fetchUserData(),
  'Fetch User Data',
  'Failed to load user information'
)

// Safe localStorage
const cart = safeLocalStorage.getItem('cart', [])
safeLocalStorage.setItem('cart', updatedCart)

// Custom errors
throw new ValidationError('Invalid email format')
```

## 📝 Common Patterns

### Form Validation Pattern
```typescript
import { validateData, getErrorMessages } from '../schemas'
import { userSchema } from '../schemas'

const [errors, setErrors] = useState({})

const handleSubmit = (e) => {
  e.preventDefault()

  const result = validateData(userSchema, formData)

  if (!result.success) {
    setErrors(getErrorMessages(result.errors))
    return
  }

  // Process validated data
  submitForm(result.data)
}
```

### Responsive Design Pattern
```typescript
import { BREAKPOINTS } from '../constants'

const [isMobile, setIsMobile] = useState(
  window.innerWidth < BREAKPOINTS.DESKTOP
)

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < BREAKPOINTS.DESKTOP)
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

### Error Handling Pattern
```typescript
import { handleAsync } from '../utils/errorHandler'

const loadData = async () => {
  const data = await handleAsync(
    () => api.fetchData(),
    'Data Load',
    'Could not load data'
  )

  if (data) {
    setData(data)
  }
}
```

## 🎨 Style Patterns

### Button with Hover
```typescript
import { primaryButtonStyle, buttonHoverState } from '../styles/constants'

<button
  style={primaryButtonStyle}
  onMouseEnter={(e) => {
    Object.assign(e.currentTarget.style, buttonHoverState)
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)'
  }}
>
  Click Me
</button>
```

### Card Component
```typescript
import { cardStyle, cardHoverState } from '../styles/constants'

<div
  style={cardStyle}
  onMouseEnter={(e) => {
    Object.assign(e.currentTarget.style, cardHoverState)
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)'
  }}
>
  Card content
</div>
```

## 💡 Tips

1. **Always use constants** instead of magic numbers
2. **Validate with Zod** for type safety and error messages
3. **Reuse style constants** to maintain consistency
4. **Handle errors properly** with toast notifications
5. **Type everything** - no 'any' types allowed

## 📚 Full Documentation

See `/CODE_QUALITY_IMPROVEMENTS.md` for complete documentation.
