interface DiscordWebhookData {
  username: string
  email: string
  cashTapUser: string
  serviceName: string
  serviceType: string
  message?: string
  timestamp: string
}

export async function sendServiceRequestToDiscord(data: DiscordWebhookData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  
  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK_URL não configurada')
    return false
  }

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'TRANSPORT': return '🚗'
      case 'THEFT': return '💰'
      case 'DISTRACTION': return '🎭'
      case 'OTHER': return '⚙️'
      default: return '❓'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TRANSPORT': return 'TRANSPORTE'
      case 'THEFT': return 'ROUBO'
      case 'DISTRACTION': return 'DISTRAÇÃO'
      case 'OTHER': return 'OUTRO'
      default: return type
    }
  }

  const embed = {
    title: "🔔 NOVA SOLICITAÇÃO DE SERVIÇO",
    description: `**${getTypeEmoji(data.serviceType)} ${data.serviceName}**\n*${getTypeLabel(data.serviceType)}*`,
    color: 0x00ff00, // Verde
    thumbnail: {
      url: "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    author: {
      name: "NO NPC NETWORK",
      icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    fields: [
      {
        name: "👤 SOLICITANTE",
        value: `**${data.username}**\n📧 \`${data.email}\`\n💳 \`${data.cashTapUser}\``,
        inline: true
      },
      {
        name: "⏰ DATA/HORA",
        value: `\`${data.timestamp}\``,
        inline: true
      },
      {
        name: "📊 STATUS",
        value: "⏳ **PENDENTE**",
        inline: true
      },
      {
        name: "🔧 SERVIÇO",
        value: `**${data.serviceName}**\n*${getTypeLabel(data.serviceType)}*`,
        inline: false
      }
    ],
    footer: {
      text: "NO NPC NETWORK • Sistema de Serviços",
      icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    timestamp: new Date().toISOString()
  }

  // Adicionar mensagem se existir
  if (data.message && data.message.trim()) {
    embed.fields.push({
      name: "💬 MENSAGEM DO SOLICITANTE",
      value: `\`\`\`${data.message}\`\`\``,
      inline: false
    })
  }

  // Adicionar separador visual
  embed.fields.push({
    name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    value: "**Acesse o painel administrativo para gerenciar esta solicitação**",
    inline: false
  })

  const payload = {
    username: "NO NPC Network Bot",
    avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
    embeds: [embed]
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log('Webhook enviado para Discord com sucesso')
      return true
    } else {
      console.error('Erro ao enviar webhook para Discord:', response.status, response.statusText)
      return false
    }
  } catch (error) {
    console.error('Erro ao enviar webhook para Discord:', error)
    return false
  }
}

export async function sendServiceStatusUpdateToDiscord(
  username: string,
  serviceName: string,
  oldStatus: string,
  newStatus: string,
  adminUsername: string
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  
  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK_URL não configurada')
    return false
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳'
      case 'APPROVED': return '✅'
      case 'REJECTED': return '❌'
      case 'COMPLETED': return '🎯'
      default: return '❓'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'PENDENTE'
      case 'APPROVED': return 'APROVADO'
      case 'REJECTED': return 'REJEITADO'
      case 'COMPLETED': return 'CONCLUÍDO'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 0xffff00 // Amarelo
      case 'APPROVED': return 0x00ff00 // Verde
      case 'REJECTED': return 0xff0000 // Vermelho
      case 'COMPLETED': return 0x0099ff // Azul
      default: return 0x808080 // Cinza
    }
  }

  const embed = {
    title: "🔄 STATUS ATUALIZADO",
    description: `**${serviceName}**\n*Solicitante: ${username}*`,
    color: getStatusColor(newStatus),
    thumbnail: {
      url: "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    author: {
      name: "NO NPC NETWORK",
      icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    fields: [
      {
        name: "📊 ALTERAÇÃO DE STATUS",
        value: `${getStatusEmoji(oldStatus)} \`${getStatusLabel(oldStatus)}\` → ${getStatusEmoji(newStatus)} \`${getStatusLabel(newStatus)}\``,
        inline: false
      },
      {
        name: "👨‍💼 ADMINISTRADOR",
        value: `**${adminUsername}**`,
        inline: true
      },
      {
        name: "⏰ ATUALIZADO EM",
        value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
        inline: true
      },
      {
        name: "🔧 SERVIÇO",
        value: `**${serviceName}**\n*Solicitante: ${username}*`,
        inline: false
      }
    ],
    footer: {
      text: "NO NPC NETWORK • Sistema de Serviços",
      icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    timestamp: new Date().toISOString()
  }

  // Adicionar separador visual
  embed.fields.push({
    name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    value: "**Status atualizado com sucesso**",
    inline: false
  })

  const payload = {
    username: "NO NPC Network Bot",
    avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
    embeds: [embed]
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log('Webhook de status enviado para Discord com sucesso')
      return true
    } else {
      console.error('Erro ao enviar webhook de status para Discord:', response.status, response.statusText)
      return false
    }
  } catch (error) {
    console.error('Erro ao enviar webhook de status para Discord:', error)
    return false
  }
}

