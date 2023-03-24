const required = (key: string) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`required env var ${key} not found`)
  }

  return value
}

const env = {
  mongoUrl: required("MONGO_URL"),
  dataPort: required("DATA_PORT"),
  htmlPort: required("HTML_PORT"),
  allowedOrigins: required("ALLOWED_ORIGINS"),
}

export default env
