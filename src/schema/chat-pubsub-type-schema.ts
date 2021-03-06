import { createModule, gql } from 'graphql-modules'
import asyncify from 'callback-to-async-iterator'
import { ChatClient } from 'twitch-chat-client'
import RefreshToken from '../helpers/RefreshToken'

export interface Chat {
  channel: string
  displayName: string
  message: string
}

export const ChatPubSubResolvers = {
  Subscription: {
    newChat: {
      subscribe: async (
        _: any,
        args: { channel: string },
        { user_id, secret, refresh_token }: GraphQLModules.Context
      ) => {
        const authProvider = await RefreshToken(user_id, secret, refresh_token)
        const chatClient = new ChatClient(authProvider, {
          channels: [args.channel],
        })
        await chatClient.connect()

        const curriedOnChat = async (cb: any) =>
          chatClient.onMessage(async (channel, user, message) => {
            return cb({ channel, displayName: user, message })
          })

        const asyncified = asyncify(curriedOnChat)

        return asyncified
      },
      resolve: (chat: any) => {
        return chat
      },
    },
  },
}

export const ChatPubSubSchema = gql`
  type Chat {
    message: String
    displayName: String
    channel: String
  }

  extend type Subscription {
    newChat(channel: String!): Chat
  }
`

export const ChatPubSubModule = createModule({
  id: `chat-pubsub-module`,
  dirname: __dirname,
  typeDefs: ChatPubSubSchema,
  resolvers: ChatPubSubResolvers,
})
