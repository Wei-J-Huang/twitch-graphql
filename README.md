# Twitch GraphQL Server

This is an open source twitch API graphql wrapper. It is not currently working, but I think you can see where it's heading.

By default it will run at `http://localhost:5555/graphql`.

## Environment Variables

This project assumes that you already have a Twitch API App set up, and an OAuth token with every scope (this is a wrapper for the API, so we will be touching all of it). This information will be stored inside of several environment variables in a .env file. If you need a Twitch API Application (for user ID and client secret), information regarding setting one up is [documented in the Twitch API documentation.](https://dev.twitch.tv/docs/api/) If you require an OAuth or refresh token, there is [documentation available in the Twitch API documentation.](https://dev.twitch.tv/docs/authentication) Alternatively, there is a [guide below on how to retrieve a refresh token.](#getting-a-twitch-refresh-token)

| Variable      | Value                                                 |
| ------------- | ----------------------------------------------------- |
| SECRET        | Your application's secret                             |
| USER_ID       | Your application's User ID                            |
| TWITCH_ID     | Your Twitch account's ID                              |
| REFRESH_TOKEN | The refresh token for your OAuth token                |
| PORT          | The port that you want to run the server on           |
| GRAPHIQL      | Whether or not you want the server to enable graphiql |

## Command line arguments

```
-p, --port The port number that the server should use. Not available with yarn dev. [number]

-g, --graphiql Enables graphiql. [flag]
```

## Commands

| Command    | Action                                                        |
| ---------- | ------------------------------------------------------------- |
| yarn build | Runs typescript compiler, compiles to ./dist                  |
| yarn start | Runs ./dist statically, does not refresh                      |
| yarn dev   | Runs auto refreshing development server                       |
| yarn dev-g | Runs auto refreshing development server with graphiql enabled |

## Contributing

Contributors should be using [prettier](https://prettier.io/) to automatically format their code as they write. TSLint will automatically lint code written to make sure that it meets the [project's guidelines.](#code-style)

To contribute please follow these steps:

1. Clone the repository: ` git clone https://github.com/ColeWalker/twitch-graphql-server`
2. Create a new branch named after the issue that you're going to fix. Prefix branch name with a Conventional Commits type. Example:
   `git checkout -b feature/add-port-config`
3. Write code and write tests for your code. We use jest and ts-jest. If your code is not properly covered by tests, it will be rejected. Since this is a wrapper for an external API, our tests cannot be thorough, however, you should provide as much coverage as possible. Follow any .test.ts file for examples.
4. Commit your code following the Conventional Commits standard. If your commits do not meet the standard the pull request will automatically fail.
5. Push your branch to the repository and submit a pull request with the issue linked.
6. Wait for the CI to check to make sure that your tests pass, and then if all goes well, your code will be published!

## Code Style

This project uses tslint, commitlint, and prettier to format its code and commit messages. I recommend that you install editor plugins for all three. TSLint and Prettier will lint code, while commitlint will lint commit messages to make sure that they follow the [conventional commits standard.](https://www.conventionalcommits.org/en/v1.0.0/)

Conventional commits is a standard for commit messages. It is used in this project to make commit history easier to read at a glance, and keep everything uniform. Additionally, it can help with automated versioning down the line.

The general format is as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

More information can be found on the [conventional commits website.](https://www.conventionalcommits.org/en/v1.0.0/)

## Getting a Twitch Refresh Token

After you have set up your twitch application, you can get all of the required keys by doing the following:

1. Visit the following url: `https://id.twitch.tv/oauth2/authorize?client_id=YOUR APPLICATION CLIENT ID&redirect_uri=http://localhost&response_type=code&scope=channel:read:subscriptions+channel_subscriptions+analytics:read:games+chat:read whispers:read+channel:read:redemptions+bits:read`
2. It will send you to `localhost://code=SOME CODE/other-junk` copy the code only.
3. Paste the code into a POST request at this URL: `https://id.twitch.tv/oauth2/token?client_id=YOUR CLIENT ID&client_secret=YOUR CLIENT SECRET&code=YOUR CODE&grant_type=authorization_code&redirect_uri=http://localhost`

This will respond with the refresh token that you need.
