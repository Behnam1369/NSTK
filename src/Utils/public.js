export function fileSize(file) {
  if (file.size < 1024) {
    return file.size + " B";
  } else if (file.size < 1024 * 1024) {
    return (file.size / 1024).toFixed(2) + " KB";
  } else if (file.size < 1024 * 1024 * 1024) {
    return (file.size / (1024 * 1024)).toFixed(2) + " MB";
  } else if (file.size < 1024 * 1024 * 1024 * 1024) {
    return (file.size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  } else {
    return (file.size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + " TB";
  }
}
