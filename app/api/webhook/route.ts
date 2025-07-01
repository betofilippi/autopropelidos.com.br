import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar o webhook secret (deve ser configurado no ambiente)
    const webhookSecret = process.env.WEBHOOK_SECRET
    const signature = request.headers.get("x-webhook-signature")

    if (!webhookSecret || signature !== webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validar a estrutura dos dados
    if (!body.title || !body.content || !body.source || !body.url) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Aqui você implementaria a lógica para salvar a notícia
    // Por exemplo, salvando em um banco de dados ou CMS

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
