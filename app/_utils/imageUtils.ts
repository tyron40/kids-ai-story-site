export async function urlToFile(url: string) {
  const response = await fetch(url)
  const data = await response.blob()

  return new File([data], "result.png", {
    type: "image/png",
  })
}

export function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

export async function urlToBase64(url: string) {
  const file = await urlToFile(url)
  return toBase64(file)
}

export async function getImageData(image: File | string) {
  if (typeof image === "object") {
    return (await toBase64(image)) as string
  }

  return image
}
