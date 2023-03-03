const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
  
  const allPosts = await prisma.post.findMany()
  console.log(allPosts)
}

main().catch((e) => console.error(e))
