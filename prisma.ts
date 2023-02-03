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
  // Update One
  // const updateOne = await prisma.user.update({
  //   where: {
  //     email: 'michael@paper.com',
  //   },

  //   data: {
  //     age: {
  //       increment: 1, // ? increment, decrement, multiply, divide, append, prepend, delete, remove, disconnect, connect, set
  //     },
  //   },
  // })

  // Update Many
  // const updateMany = await prisma.user.updateMany({
  //   where: {
  //     age: { gt: 40 },
  //   },

  //   data: {
  //     email: '...@paper.com',
  //   },
  // })

  // * CONNECT, DISCONNECT, SET
  // const connect = await prisma.user.update({
  //   where: {
  //     email: 'pam@paper.com',
  //   },

  //   data: {
  //     userPreference: {
  //       connect: {
  //         id: '9c7c2634-5cab-428d-8ca8-0db26bc3c684',  // ? userPreferenceId from pam
  //       },
  //     },
  //   },
  // })

  // const disconnect = await prisma.user.update({
  //   where: {
  //     email: 'pam@paper.com',
  //   },

  //   data: {
  //     userPreference: {
  //       disconnect: true, // ? now pam's userPreference is null
  //     },
  //   },
  // })

  // ``````````````````````````````````````````````
  // console.log('updateOne', updateOne)
  // console.log('updateMany', updateMany)
  // console.log('connect', connect)
  // console.log('disconnect', disconnect)

  // ----------------------------------------------

  // * DELETE
  // * delete all
  // const deleteAll = await prisma.user.deleteMany()

  // * delete many that match a condition
  // const deleteAllUsersAged40Plus = await prisma.user.deleteMany({
  //   where: {
  //     age: { gt: 40 },
  //   },
  // })

  // * delete one
  // You need a unique identifier to delete one (you can setup a unique identifier in the schema.prisma file by adding @unique to the field)
  // const deleteOne = await prisma.user.delete({
  //   where: {
  //     email: 'pam@paper.com',
  //   },
  // })

  // ``````````````````````````````````````````````

  // console.log('deleteAll', deleteAll)
  // console.log('deleteAllUsersAged40Plus', deleteAllUsersAged40Plus)
  // console.log('deleteOne', deleteOne)

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

  // * find users, sort and limit results
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

  // CHECK HOW MANY USERS ARE IN THE DATABASE
  // you can also use this to check how many results you get from a query
  console.log('Users length', findUsers.length)

  console.log('findUsers', findUsers)
  console.log('findUser', findUser)
  console.log('findUserByMultipleUniqueFields', findUserByMultipleUniqueFields)
  console.log('findSortAndLimitResults', findSortAndLimitResults)

  // ---------------------------------------------

  // * FILTERS
  // * not
  const notFilter = await prisma.user.findMany({
    where: {
      name: { not: 'Pam' },
    },
  })

  // * in, notIn
  const inFilter = await prisma.user.findMany({
    where: {
      name: { in: ['Pam', 'Dwight'] },
    },
  })

  // * lt, lte, gt, gte
  const ltFilter = await prisma.user.findMany({
    where: {
      age: { lt: 30 },
    },
  })

  // * contains, startsWith, endsWith
  const containsFilter = await prisma.user.findMany({
    where: {
      name: { contains: 'a' },
    },
  })

  // * AND, OR, NOT
  const andFilter = await prisma.user.findMany({
    where: {
      AND: [{ name: 'Pam' }, { age: { lt: 30 } }],
    },
  })

  // ARRAY FILTERING
  // * some, none, every
  // ! hypothetical example
  // const someFilter = await prisma.user.findMany({
  //   where: {
  //     posts: {
  //       some: {
  //         title: 'Hello World',
  //       },
  //     },
  //   },
  // })

  // ````````````````````````````````````````````
  console.log('notFilter', notFilter)
  console.log('inFilter', inFilter)
  console.log('ltFilter', ltFilter)
  console.log('containsFilter', containsFilter)
  console.log('andFilter', andFilter)
}

// ===============================================

main()
  .catch((e) => console.error(e.message))
  .finally(async () => await prisma.$disconnect())
