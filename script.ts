import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// * log all database queries (good for debugging)
// const prisma = new PrismaClient({
//   log: ['query', 'info', 'warn'],
// })

// ===============================================

async function main() {
  // ! For Testing - delete all users before (only use for this example)
  await prisma.user.deleteMany()

  // -----------------------------------------------

  // * CREATE
  const createUser = await prisma.user.create({
    data: {
      name: 'Pam',
      email: 'pam@paper.com',
      age: 26,

      // * Create a userPreference object at the same time. (relation)
      userPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },

    // * Include the userPreference object in the response
    // include: {
    //   userPreference: true,
    // },

    // * Only show the name and the id of userPreference in the response
    select: {
      name: true,
      userPreference: { select: { id: true } },
    },
  })

  console.log('createUser', createUser)
  // { name: 'Pam', userPreference: { id: 1 } }

  // ```````````````````````````````````````````````

  const createUsers = await prisma.user.createMany({
    data: [
      {
        name: 'Michael',
        email: 'michael@paper.com',
        age: 41,
      },
      {
        name: 'Dwight',
        email: 'dwight@paper.com',
        age: 35,
      },
    ],

    // ? You can't use include or select with createMany
  })

  console.log('createUsers', createUsers)
  // { count: 2 }

  // ----------------------------------------------

  // * UPDATE
  // UPDATE ONE
  // const user = await prisma.user.update({
  //   where: {
  //     id: 2,
  //   },

  //   data: {
  //     name: 'Jim',
  //   },
  // })

  // -----------------------------------------------

  // * DELETE
  // DELETE ALL
  // const user = await prisma.user.deleteMany()

  // DELETE ONE OR MORE
  // const user = await prisma.user.deleteMany({
  //   where: {
  //     name: 'Michael',
  //   },
  // })

  // DELETE ONE
  // You need a unique identifier to delete one (you can setup a unique identifier in the schema.prisma file by adding @unique to the field)
  // const user = await prisma.user.delete({
  //   where: {
  //     id: 2,
  //   },
  // })

  // -----------------------------------------------

  // * READ
  // READ ALL
  // const user = await prisma.user.findMany()

  // READ ONE (and only show the name)
  // const user = await prisma.user.findMany({
  //   where: {
  //     name: 'Michael',
  //   },

  //   select: {
  //     name: true,
  //   },
  // })
}

// ===============================================

main()
  .catch((e) => console.error(e.message))
  .finally(async () => await prisma.$disconnect())
