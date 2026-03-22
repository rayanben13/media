import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      name: 'Rayan Bensalem',
      email: 'rayan@example.com',
      password: 'test',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Ali Karim',
      email: 'ali@example.com',
      password: 'test',
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
