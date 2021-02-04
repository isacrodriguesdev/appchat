import { Message } from "global"

export default class LastMessageController {

  private message: Message

  public text: string = ""
  public icon: string = ""

  constructor(message: any) {
    
    this.message = message

    if(!message.type)
      return

    else if (this.chat()) {
      this.text = message.message
    }
    else if (this.image()) {
      this.text = "Imagem"
      this.icon = "image"
    }
    else if (this.audio()) {
      this.text = "Mensagem de voz"
      this.icon = "mic"
    }
    else if (this.all()) {
      this.text = "Documento"
      this.icon = "insert-drive-file"
    }
  }

  private chat() {
    return ["chat", "system"].includes(this.message.type)
  }
  private image() {
    return ["image"].includes(this.message.type) || this.message.type.split("/")[0] === "image"
  }
  private audio() {
    return ["ptt", "audio"].includes(this.message.type) || this.message.type.split("/")[0] === "audio"
  }
  private all() {
    return this.message.type.split("/")[0]
  }
}
