// Cookie utility functions

export const cookieUtils = {
  // Set cookie
  set: (name: string, value: string, days: number = 7) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  },

  // Get cookie
  get: (name: string): string | null => {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },

  // Remove cookie
  remove: (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  },

  // Set JSON cookie
  setJSON: (name: string, value: any, days: number = 7) => {
    const jsonValue = JSON.stringify(value)
    cookieUtils.set(name, jsonValue, days)
  },

  // Get JSON cookie
  getJSON: <T>(name: string): T | null => {
    const value = cookieUtils.get(name)
    if (!value) return null
    try {
      return JSON.parse(value) as T
    } catch (error) {
      console.error('Error parsing JSON cookie:', error)
      return null
    }
  },
}
