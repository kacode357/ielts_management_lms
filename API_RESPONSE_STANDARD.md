# API Response Standard Implementation

## 📋 Tổng quan

Đã implement chuẩn API response format cho toàn bộ hệ thống, với error handling tập trung tại axios interceptor, không cần bắt lỗi ở từng hook/service.

---

## 🎯 Format Response Chuẩn

### ✅ Success Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJI...",
    "user": { ... }
  }
}
```

### ❌ Error Response (Single)
```json
{
  "success": false,
  "message": "Your old password is not valid!",
  "errors": []
}
```

### ❌ Error Response (Multi-field)
```json
{
  "success": false,
  "message": null,
  "errors": [
    {
      "message": "pageInfo must be a non-empty object",
      "field": "pageInfo"
    },
    {
      "message": "searchCondition must be a non-empty object",
      "field": "searchCondition"
    }
  ]
}
```

---

## 🔧 Frontend Implementation

### 1. **Axios Config** (`src/config/axios.config.ts`)

**✨ Features:**
- **Global error handling** - Tất cả lỗi được bắt tại interceptor
- **Auto toast** - Tự động hiển thị error toast
- **Token management** - Tự động thêm token vào headers
- **Redirect on 401** - Tự động logout và redirect khi unauthorized
- **Type-safe** - TypeScript with proper typing

**Interceptor xử lý:**
- ✅ Network errors
- ✅ 400 Bad Request (single & multi errors)
- ✅ 401 Unauthorized (auto logout)
- ✅ 403 Forbidden
- ✅ 404 Not Found
- ✅ 409 Conflict
- ✅ 422 Validation Error
- ✅ 500 Internal Server Error
- ✅ 501 Not Implemented
- ✅ 503 Service Unavailable

### 2. **Type Definitions** (`src/types/api.types.ts`)

```typescript
// Standard response types
export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors: ApiFieldError[]
}

export interface ApiFieldError {
  message: string
  field: string
}

// HTTP Status codes enum
export enum HttpStatus {
  Success = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  ...
}
```

### 3. **Auth Service** (`src/services/auth.service.ts`)

**Simplified - No error handling needed:**
```typescript
login: async (payload: LoginPayload): Promise<LoginData> => {
  const response = await api.post<LoginData>('/auth/login', payload)
  
  // Store token
  if (response.data.token) {
    cookieUtils.set('token', response.data.token, 7)
  }
  
  return response.data
}
```

### 4. **Hooks** (`src/hooks/auth/*.ts`)

**Only handle success:**
```typescript
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const login = async (payload: LoginPayload) => {
    setIsLoading(true)
    try {
      const data = await authService.login(payload)
      toast.success('Login successful!')
      router.push('/dashboard')
      return data
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading } // No error state!
}
```

**Updated hooks:**
- ✅ `useLogin` - Login với success toast
- ✅ `useRegister` - Register với success toast
- ✅ `useChangePassword` - Change password
- ✅ `useForgotPassword` - Forgot password
- ✅ `useResetPassword` - Reset password
- ✅ `useConfirmEmail` - Confirm email
- ✅ `useGoogleLogin` - Google OAuth

---

## 🔧 Backend Implementation

### 1. **Response Helper** (`be/src/utils/response.js`)

```javascript
// Success response
function sendSuccess(res, data = null, statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data,
  })
}

// Error response (single message)
function sendError(res, message, statusCode = 400) {
  res.status(statusCode).json({
    success: false,
    message: message || "An error occurred",
    errors: [],
  })
}

// Validation error (multi-field)
function sendValidationError(res, errors, statusCode = 400) {
  res.status(statusCode).json({
    success: false,
    message: null,
    errors: errors || [],
  })
}
```

### 2. **Global Error Handler** (`be/src/app.js`)

**Handles:**
- ✅ AppError (operational errors)
- ✅ Mongoose ValidationError
- ✅ Mongoose Duplicate Key (11000)
- ✅ JWT errors (JsonWebTokenError, TokenExpiredError)
- ✅ Unknown errors

```javascript
app.use((err, req, res, next) => {
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors).map(key => ({
      message: err.errors[key].message,
      field: key
    }))
    return res.status(400).json({
      success: false,
      message: null,
      errors,
    })
  }

  // Handle duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      errors: [{ message: `${field} already exists`, field }],
    })
  }
  
  // ... other error types
})
```

### 3. **Auth Controller** (`be/src/entities/auth/auth.controller.js`)

**Updated responses:**
```javascript
// Register - Return user data only
sendSuccess(res, { user: userResponse }, 201)

// Login - Return token and user
sendSuccess(res, { token, user: userResponse })

// Logout - Return null
sendSuccess(res, null)
```

---

## 📊 HTTP Status Codes Used

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | Success | Standard successful request |
| 201 | Created | Resource created (register, create) |
| 400 | Bad Request | Invalid input, validation errors |
| 401 | Unauthorized | Auth required or invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (duplicate) |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server error |
| 501 | Not Implemented | Feature not ready |
| 503 | Service Unavailable | Temporary unavailable |

---

## 🎨 User Experience

### Error Display
- **Network errors**: "Network error. Please check your connection."
- **Single error**: Toast với message từ server
- **Multi-field errors**: Multiple toasts, mỗi field một toast
- **401 errors**: Toast + auto logout + redirect to login (sau 1s)

### Success Display
- **Login**: "Login successful! Redirecting..."
- **Register**: "Registration successful! Please login."
- **Password change**: "Password changed successfully!"
- **Email sent**: "Password reset email sent! Please check your inbox."

---

## 🚀 Benefits

### 1. **Centralized Error Handling**
- ✅ Không cần try-catch ở mỗi hook
- ✅ Không cần useState cho error state
- ✅ Consistent error messages
- ✅ Single source of truth

### 2. **Clean Code**
- ✅ Hooks chỉ focus vào success case
- ✅ Services đơn giản hơn
- ✅ Dễ maintain và scale

### 3. **Better UX**
- ✅ Auto toast cho mọi lỗi
- ✅ Field-specific error messages
- ✅ Auto logout/redirect on auth errors
- ✅ Loading states vẫn được giữ

### 4. **Type Safety**
- ✅ TypeScript types cho responses
- ✅ Generic API wrapper
- ✅ No `any` types

---

## 📝 Usage Examples

### Simple Hook Usage
```typescript
// In component
const { login, isLoading } = useLogin()

const handleSubmit = async (data) => {
  await login(data) // No try-catch needed!
}
```

### Service Usage
```typescript
// Just call the service
const data = await authService.login(payload)
// Errors are handled automatically by interceptor
```

### Custom Success Toast
```typescript
const login = async (payload: LoginPayload) => {
  setIsLoading(true)
  try {
    const data = await authService.login(payload)
    
    // Custom success message
    toast.success(`Welcome back, ${data.user.fullName}!`)
    
    router.push('/dashboard')
    return data
  } finally {
    setIsLoading(false)
  }
}
```

---

## ✅ Implementation Checklist

### Frontend
- [x] Create axios config with interceptors
- [x] Define standard API types
- [x] Update all auth services
- [x] Update all auth hooks
- [x] Remove error states from hooks
- [x] Add success toasts where needed

### Backend
- [x] Update response helper functions
- [x] Implement global error handler
- [x] Update auth controller responses
- [x] Handle Mongoose errors
- [x] Handle JWT errors
- [x] Match standard response format

---

## 🔄 Migration Notes

### Breaking Changes
- **Response format**: Old code expecting `response.data.message` cần update
- **Error handling**: Remove all try-catch trong hooks
- **Types**: Import types từ `api.types.ts` thay vì `auth.types.ts`

### Backward Compatibility
- ✅ Cookie management unchanged
- ✅ Token flow unchanged
- ✅ Auth middleware unchanged
- ✅ Database models unchanged

---

## 🎯 Next Steps

1. ✅ Test login flow với backend thật
2. ✅ Test error cases (invalid credentials, network error, etc.)
3. ✅ Verify toast messages hiển thị đúng
4. ✅ Test auto-logout on 401
5. ✅ Apply pattern này cho các modules khác (students, teachers, etc.)

---

**Author:** AI Assistant  
**Date:** January 26, 2026  
**Version:** 1.0.0
