import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function authRoutes(fastify: FastifyInstance) {
  
  fastify.post('/users', async (request) => {
    const createUserBody = z.object({
      access_token: z.string(),
    });

    const { access_token } = createUserBody.parse(request.body);

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userData = await userResponse.json();

    const userInfoResponse = z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      picture: z.string().url(),
    });

    const userInfo = userInfoResponse.parse(userData);

    let user = await prisma.user.findUnique({ where: { googleId: userInfo.id } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatar_url: userInfo.picture,
        },
      });
    };

    const token = fastify.jwt.sign({
      name: user.name,
      avatar_url: user.avatar_url,
    }, {
      sub: user.id,
      expiresIn: '7 days',
    });

    return { token };
  });

  fastify.get('/me', { onRequest: [authenticate] }, async (request) => {
    return { user: request.user };
  })
};
