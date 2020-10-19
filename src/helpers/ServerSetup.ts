import { ApiClient } from 'twitch/lib'
import RefreshToken from './RefreshToken'
import express from 'express'
import { PubSub } from 'graphql-subscriptions'
import bodyParser from 'body-parser'
require('dotenv').config()
export const onConnect = (connectionParams: any) => {
  return { ...connectionParams }
}

export const context = async ({ req, ...props }) => {
  const app = express()
  const webhookPort = process.env.WEBHOOK_PORT || 5554
  const pubsub = new PubSub()

  app.get('/webhooks/follows', (req, res) => {
    res.status(200).send(req.query['hub.challenge'])

    console.log('Topic was subscribed to')
  })

  app.post('/webhooks/follows', bodyParser.json(), async (req, res) => {
    const follow = req.body?.data?.[0]
    const parsedFollow = {
      followedAt: follow?.followed_at,
      fromId: follow?.from_id,
      fromName: follow?.from_name,
      toId: follow?.to_id,
      toName: follow?.to_name,
    }

    pubsub.publish('FOLLOWS', parsedFollow)
    return res.status(200).send()
  })

  app.listen(webhookPort, () => {})
  const callbackUrl = process.env.CALLBACK_URL || ''
  if (props?.connection?.context) {
    const authProvider = await RefreshToken(
      props.connection.context.user_id,
      props.connection.context.client_secret,
      props.connection.context.refresh_token
    )
    const user_id =
      props.connection.context.user_id || process.env.USER_ID || ''
    const client_secret =
      props.connection.context.client_secret || process.env.SECRET || ''
    const refresh_token =
      props.connection.context.refresh_token || process.env.REFRESH_TOKEN || ''
    const twitchClient = new ApiClient({ authProvider })
    return {
      user_id,
      client_secret,
      refresh_token,
      authProvider,
      twitchClient,
      callbackUrl,
      webhookPort,
      app,
      pubsub,
    }
  }
  const authProvider = await RefreshToken(
    req?.headers?.user_id,
    req?.headers?.secret,
    req?.headers?.refresh_token
  )
  const twitchClient = new ApiClient({ authProvider })
  return {
    twitch_id: req?.headers?.twitch_id,
    refresh_token: req?.headers?.refresh_token,
    secret: req?.headers?.secret,
    user_id: req?.headers?.user_id,
    callbackUrl,
    webhookPort,
    authProvider,
    twitchClient,
    app,
  }
}