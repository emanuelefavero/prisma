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

  // ---------------------------------------------

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

  // ``````````````````````````````````````````````

  console.log('createUser', createUser)
  // { name: 'Pam', userPreference: { id: 1 } }
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

  // ----------------------------------------------

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

  // ---------------------------------------------

  // * READ
  // * find all users
  const findUsers = await prisma.user.findMany()

  // * find one user by an unique field (email)
  const findUser = await prisma.user.findUnique({
    where: {
      email: 'pam@paper.com',
    },
  })

  // * find user by multiple unique fields that we specified
  // ? @@unique([age, name])
  const findUserByMultipleUniqueFields = await prisma.user.findUnique({
    where: {
      age_name: {
        age: 26,
        name: 'Pam',
      },
    },
  })

  const findSortAndLimitResults = await prisma.user.findMany({
    take: 2, // limit
    skip: 1, // skip
    orderBy: {
      age: 'desc', // sort
    },
  })

  // ? findFirst - find a user by any field that is not unique
  // ? distinct - return only distinct results (only first occurence of each result with a particular field)

  // ````````````````````````````````````````````

  console.log('findUsers', findUsers)
  console.log('findUser', findUser)
  console.log('findUserByMultipleUniqueFields', findUserByMultipleUniqueFields)
  console.log('findSortAndLimitResults', findSortAndLimitResults)
}

// ===============================================

main()
  .catch((e) => console.error(e.message))
  .finally(async () => await prisma.$disconnect())
