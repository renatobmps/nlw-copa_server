import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@prisma.io',
      name: 'test',
      avatar_url: 'https://github.com/prisma.png',
      googleId: '123456789',
    },
  });

  const poll = await prisma.poll.create({
    data: {
      title: 'Bolão 1',
      code: 'BOLAO1',
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: '2022-11-20T13:00:00.969Z',
      firstTeamCountryCode: 'QA',
      secondTeamCountryCode: 'EC',
      guesses: {
        create: {
          firstTeamPoints: 0,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_pollId: {
                userId: user.id,
                pollId: poll.id,
              },
            },
          },
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: '2022-11-21T10:00:00.969Z',
      firstTeamCountryCode: 'GB',
      secondTeamCountryCode: 'IR',
    },
  });
};

main().catch((e) => {
  throw e;
});
