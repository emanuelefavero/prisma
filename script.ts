import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // * CREATE
  // const user = await prisma.user.create({ data: { name: 'Michael' } })

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

  // * READ
  // READ ALL
  const user = await prisma.user.findMany()

  // READ ONE (and only show the name)
  // const user = await prisma.user.findMany({
  //   where: {
  //     name: 'Michael',
  //   },

  //   select: {
  //     name: true,
  //   },
  // })

  console.log(user)
}

main()
  .catch((e) => console.error(e.message))
  .finally(async () => await prisma.$disconnect())
