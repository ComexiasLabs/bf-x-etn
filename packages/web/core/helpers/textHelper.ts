export const handleCopyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch((err) => {
    console.error('Failed to copy text: ', err);
  });
};

export const omitBeforeAt = (input: string): string => {
  const atIndex = input.indexOf('@');
  if (atIndex !== -1) {
    return input.substring(atIndex);
  }
  return input; // Return the original string if '@' is not found
};
