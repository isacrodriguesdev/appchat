type Params = {
  text: string
  alternativeText: string
  size: number
}

export function lineClamp(params: Params) {

  if (!params.text || params.text === "@closed_attendment@")
    return params.alternativeText

  let completeText: string = ""
  let partes = params.text.trim().split("")

  if (partes.length === 0)
    completeText = params.alternativeText

  for (let i = 0; i < params.size; i++) {
    if (!partes[i])
      continue

    completeText += partes[i].replace("\n", " ")
  }

  if (partes.length >= params.size)
    completeText += "..."

  return completeText.trim()
}