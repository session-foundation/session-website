function _capitalize(input: string) {
  return `${input[0].toUpperCase()}${input.substring(1)}`;
}
export default function capitalize(input: string, separator: string = ' ') {
  let output = '';
  separator = input.indexOf(separator) < 0 ? ' ' : separator;
  if (input.indexOf(separator) >= 0) {
    let words = input.split(separator);
    words = words.map((word) => {
      return _capitalize(word);
    });
    output = words.join(separator);
  } else {
    output = _capitalize(input);
  }
  return output;
}
