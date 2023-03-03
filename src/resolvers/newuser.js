const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const newUser = await prisma.user.create({
    data: {
      username: 'johndoe',
      password: 'password123',
      email: 'johndoe@example.com'
    }
  })
  console.log(newUser)
}

main()