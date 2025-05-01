import prisma from '@/lib/prisma';

export async function getPosts() {
  const posts = await prisma.post.findMany({
    where: {published: true},
    include: {
      author: {
        select: {
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
  return posts;
}

export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
        }
      },
    }
  });
  return post;
}

export async function searchPosts(query: string) {
  const decodedQuery = decodeURIComponent(query);
  const normalizedQuery = decodedQuery.replace(/[\s　]+/g, ' ').trim();
  const searchWords = normalizedQuery.split(' ').filter(Boolean);

  const filters = searchWords.map((word) => ({
    OR: [
      { title: { contains: word } },
      { content: { contains: word } }
    ]
  }));

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      AND: filters
    },
    include: {
      author: {
        select: {
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return posts;
}