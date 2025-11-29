# Developer Security Guide

Quick reference for working with the secure authentication system.

---

## Demo Login Credentials

### Admin Account
```
Email: admin@kobysthreads.com
Password: SecureAdmin2025!
```

### User Accounts
```
Email: john@example.com
Password: SecureUser2025!

Email: sarah@example.com
Password: SecureUser2025!
```

---

## Common Tasks

### 1. User Authentication

```typescript
import { useAuth } from './contexts/AuthContext'

function LoginComponent() {
  const { login } = useAuth()

  const handleLogin = async () => {
    const success = await login(email, password)
    if (success) {
      // User authenticated
    }
  }
}
```

### 2. User Registration

```typescript
import { useAuth } from './contexts/AuthContext'

function RegisterComponent() {
  const { register } = useAuth()

  const handleRegister = async () => {
    const { success, message } = await register(email, password, name)
    if (success) {
      // User created and logged in
    }
  }
}
```

### 3. Password Operations

```typescript
import { hashPassword, verifyPassword } from './utils/crypto'

// Hash a password (for testing/admin tools)
const hash = await hashPassword('myPassword')

// Verify a password
const isValid = await verifyPassword('inputPassword', storedHash)
```

### 4. Input Sanitization

```typescript
import { sanitizeText, sanitizeHTML, sanitizeURL } from './utils/sanitize'

// For plain text inputs (recommended)
const cleanText = sanitizeText(userInput)

// For HTML content (use with caution)
const cleanHTML = sanitizeHTML(richTextInput)

// For URLs
const safeURL = sanitizeURL(potentiallyDangerousURL)
```

### 5. Session Management

```typescript
import {
  createSession,
  getSession,
  clearSession,
  hasActiveSession
} from './utils/sessionManager'

// Create a session after authentication
const token = createSession(userId)

// Check if user has active session
if (hasActiveSession()) {
  // User is logged in
}

// Clear session on logout
clearSession()
```

---

## Security Rules

### ✅ DO

- **Always sanitize user input** before storing or displaying
- **Hash passwords** before storing (use `hashPassword()`)
- **Use secure sessions** (they expire automatically)
- **Validate URLs** before using them
- **Check authentication** before sensitive operations
- **Use HTTPS** in production
- **Keep dependencies updated** (`npm audit`)

### ❌ DON'T

- **Never store plain-text passwords**
- **Never use hardcoded credentials**
- **Never commit .env files**
- **Never skip input sanitization**
- **Never trust client-side validation alone**
- **Never use `dangerouslySetInnerHTML` without sanitization**
- **Never disable CORS in production**

---

## File Structure

```
src/
├── utils/
│   ├── crypto.ts           # Password hashing, token generation
│   ├── sanitize.ts         # Input sanitization, XSS protection
│   └── sessionManager.ts   # Secure session management
├── stores/
│   └── useUserStore.ts     # User management with hashed passwords
├── contexts/
│   └── AuthContext.tsx     # Authentication context (async)
└── components/
    └── admin/
        └── UserManagement.tsx  # Admin user management
```

---

## Testing

### Test Authentication Flow

```bash
# 1. Start dev server
npm run dev

# 2. Test login
# Navigate to /login
# Use demo credentials above

# 3. Test registration
# Navigate to /login
# Click "Create Account"
# Register with new credentials

# 4. Test password change
# Login as user
# Navigate to account settings
# Change password
```

### Test XSS Protection

```javascript
// Try entering in chat:
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
javascript:alert('XSS')

// All should be sanitized and safe
```

---

## Troubleshooting

### Issue: "Cannot read property of undefined"

**Cause:** Not awaiting async auth functions

**Fix:**
```typescript
// ❌ Wrong
const user = authenticate(email, password)

// ✅ Correct
const user = await authenticate(email, password)
```

### Issue: "Session expired"

**Cause:** Session timeout or browser closed

**Fix:** Re-login. Sessions expire after 24 hours or browser close.

### Issue: "Password incorrect"

**Cause:** Trying to use old passwords

**Fix:** Use new secure passwords:
- Admin: `SecureAdmin2025!`
- Users: `SecureUser2025!`

### Issue: TypeScript errors about async

**Cause:** Function signature doesn't return Promise

**Fix:**
```typescript
// ❌ Wrong
authenticate: (email: string, password: string) => StoredUser | null

// ✅ Correct
authenticate: (email: string, password: string) => Promise<StoredUser | null>
```

---

## API Reference

### Crypto Utils (`/src/utils/crypto.ts`)

```typescript
// Hash a password (SHA-256)
hashPassword(password: string): Promise<string>

// Verify password against hash
verifyPassword(password: string, hash: string): Promise<boolean>

// Generate secure random token
generateSecureToken(): string

// Demo credentials
DEMO_CREDENTIALS: {
  ADMIN_EMAIL: string,
  ADMIN_PASSWORD_HASH: string,
  USER_EMAIL: string,
  USER_PASSWORD_HASH: string,
  USER2_EMAIL: string,
  USER2_PASSWORD_HASH: string
}

// Get demo password for testing
getDemoPassword(role: 'admin' | 'user'): string
```

### Sanitize Utils (`/src/utils/sanitize.ts`)

```typescript
// Sanitize HTML with allowed tags
sanitizeHTML(dirty: string): string

// Strip all HTML, return plain text
sanitizeText(dirty: string): string

// Sanitize user input with basic formatting
sanitizeUserInput(dirty: string): string

// Validate and sanitize URLs
sanitizeURL(url: string): string

// Escape HTML entities
escapeHTML(text: string): string

// Sanitize JSON string
sanitizeJSON(jsonString: string): string
```

### Session Manager (`/src/utils/sessionManager.ts`)

```typescript
// Create new session, returns token
createSession(userId: string): string

// Get current session if valid
getSession(): SessionData | null

// Validate session token
validateSession(token: string): boolean

// Clear current session
clearSession(): void

// Get user ID from session
getSessionUserId(): string | null

// Check if session active
hasActiveSession(): boolean

// Extend session expiration
extendSession(): boolean

// Store minimal user data (non-sensitive)
storeUserData(userData: MinimalUserData): void

// Get stored user data
getUserData(): MinimalUserData | null

// Clear stored user data
clearUserData(): void
```

---

## Production Checklist

Before deploying to production:

- [ ] Implement server-side authentication
- [ ] Switch to bcrypt/argon2 for password hashing
- [ ] Add rate limiting on authentication endpoints
- [ ] Enable HTTPS only
- [ ] Add CSRF protection
- [ ] Implement input validation at API level
- [ ] Set up security monitoring
- [ ] Configure CSP headers
- [ ] Run security audit
- [ ] Conduct penetration testing
- [ ] Set up logging and alerting
- [ ] Remove demo credentials
- [ ] Update .env with production values

---

## Quick Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Run tests (when available)
npm test
```

---

## Support

- **Security Issues:** security@kobysthreads.com
- **Documentation:** `/SECURITY.md`
- **Changelog:** `/SECURITY_CHANGELOG.md`
- **Summary:** `/SECURITY_FIX_SUMMARY.md`

---

**Last Updated:** 2025-01-25
**Version:** 2.0 (Post-Security Fix)
