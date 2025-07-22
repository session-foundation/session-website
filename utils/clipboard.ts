export function copyToClipboard(text: string, callback: (value: boolean) => void) {
  if (typeof window !== 'undefined') {
    // https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => callback(true))
        .catch((e) => alert(e.message));
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const copySuccess = document.execCommand('copy');
      copySuccess ? callback(true) : alert('Copy Failed');
      textArea.remove();
    }
  }
}
