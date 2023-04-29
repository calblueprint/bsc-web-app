// Generates a pin number for a user
export const generatePinNumber = (numDigitsInPin: number) => {
  return Math.floor(
    Math.random() * (10 ** numDigitsInPin - 10 ** (numDigitsInPin - 1)) +
      10 ** (numDigitsInPin - 1)
  )
}