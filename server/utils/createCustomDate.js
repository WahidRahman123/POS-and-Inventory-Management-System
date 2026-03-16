export const createCustomDate = (date) => {
  const d = new Date(date)
  const now = new Date()

  d.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
  return d
}