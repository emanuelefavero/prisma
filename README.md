# Prisma

This is a cheat sheet repo for the [Prisma](https://www.prisma.io/) database [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping?useskin=vector).
Prisma is a database toolkit that makes it easy to query, migrate and model your database

> Prisma can use any database, but this cheat sheet is focused on PostgreSQL (_Note: Very little would change with a different database, that's the magic of Prisma_)

## Installation

- setup a new project with `npm init -y`
- install Prisma and needed dev dependencies with `npm i -D prisma @prisma/client`

> Note: For a Typescript project, you'll need to install `typescript` and `ts-node` as well as well as any other dev dependencies you need for your project (such as `@types/node` for a Node project)
>
> It is also recommended to install `nodemon` for development

### Full Command for a Node Typescript Project

```bash
npm i -D prisma typescript ts-node @types/node nodemon
```

- create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "lib": ["esnext"],
    "esModuleInterop": true
  }
}
```

### Initialize Prisma

- this will create a `prisma` folder with a `schema.prisma` file

```bash
npx prisma init --datasource-provider postgresql
```

> _--datasource-provider is optional and will default to `postgresql`_

## Setup a Database

- Setup any database you want to use with Prisma and get the connection string

> Note: I've created a new database with [supabase](https://supabase.com/) which is a firebase-like database service that uses PostgreSQL

- Add your database connection URI string to `.env`

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

### \*Prisma VS Code Extension

Install the [prisma vs-code extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) for syntax highlighting and more

Add the following to your `settings.json` file to enable this extension for `.prisma` files:

```json
"[prisma]": {
  "editor.defaultFormatter": "Prisma.prisma"
}
```

## Define your Database Schema

- Define your database models

```prisma
model User {
id Int @id @default(autoincrement())
email String @unique
name String?
posts Post[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Post {
id Int @id @default(autoincrement())
title String
content String?
published Boolean @default(false)
author User @relation(fields: [authorId], references: [id])
authorId Int
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

```

## Initialize your database

> **Remember to run this command after any changes to your schema**

```bash
npx prisma migrate dev
```

> if prisma complains, run this command: `npx prisma migrate dev --name init`

## Install Prisma Client

```bash
npm i @prisma/client
```

> When you install Prisma Client, it automatically generates a client for your defined models, if you need to regenerate the client, run `npx prisma generate`

## Use Prisma Client

- create a `prisma.ts` or `script.ts` file or any file you want to use Prisma in

- import the client

```ts
import { PrismaClient } from '@prisma/client'
```

- create a new instance of the client

```ts
const prisma = new PrismaClient()
```

> Note: Tell prisma to log all database queries
> **Useful WHEN debugging**

```ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
})
```

- use the client to query your database

```ts
async function main() {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
  // ... WRITE HERE ALL YOUR QUERIES
}
main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

> Note: Check the example project in this repo for prisma client and schema models examples

## Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Prisma Quick Start](https://www.prisma.io/)
- [Prisma Playground](https://playground.prisma.io/)

## License

- [MIT](LICENSE.md)
