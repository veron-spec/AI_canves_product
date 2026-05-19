export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export interface LoginErrors {
  email?: string
  password?: string
}

export interface RegisterErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeTerms?: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}
