import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GraphQL query to fetch GitHub user data
const GITHUB_USER_QUERY = `
  query getUserData($login: String!) {
    user(login: $login) {
      name
      login
      avatarUrl
      bio
      repositories(ownerAffiliations: OWNER, privacy: PUBLIC) {
        totalCount
      }
      followers {
        totalCount
      }
      following {
        totalCount
      }
      url
      createdAt
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        totalRepositoriesWithContributedCommits
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      topRepositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}) {
        nodes {
          name
          url
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          updatedAt
        }
      }
      repositoriesContributedTo(includeUserRepositories: false) {
        totalCount
      }
      starredRepositories {
        totalCount
      }
    }
  }
`;
async function fetchGitHubProfile(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub profile');
  }

  const profile = await response.json();
  return profile;
}

async function fetchGitHubUserData(accessToken: string, username: string) {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GITHUB_USER_QUERY,
        variables: { login: username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.user;
  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user || !user.password) return null
        
        const isValid = await bcrypt.compare(credentials.password, user.password)
        return isValid ? user : null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
    GitHubProvider({
      id: 'github-candidat',
      clientId: process.env.GITHUB_CANDIDATE_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CANDIDATE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account && (account.provider === 'google' || account.provider.includes('github'))) {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email ?? '' },
        });

        if (!existingUser) {
          // Split the name and use the first part as firstName
          const firstName = user.name?.split(' ')[0] || '';
          const role = account.provider.includes('candidat') ? 'candidat' : 'recruiter';
          
          existingUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || '',
              firstName: firstName,
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              image: user.image || '',
              role: role,
            }
          });
        }

        // If it's a GitHub login, fetch and store GitHub data
        if ((account.provider === 'github-candidat') && account.access_token) {
          try {
            const githubProfile = await fetchGitHubProfile(account.access_token);

            const githubUsername = githubProfile.login;
            
            // Fetch GitHub user data
            const githubData = await fetchGitHubUserData(account.access_token, githubUsername);
            
            if (githubData) {
              // Update or create GitHub profile
              await prisma.gitHubProfile.upsert({
                where: { userId: existingUser.id },
                update: {
                  login: githubData.login,
                  bio: githubData.bio,
                  avatarUrl: githubData.avatarUrl,
                  followersCount: githubData.followers.totalCount,
                  followingCount: githubData.following.totalCount,
                  repositoriesCount: githubData.repositories.totalCount,
                  topRepositories: githubData.topRepositories.nodes,
                  contributionsTotal: githubData.contributionsCollection.totalCommitContributions,
                  contributionsCalendar: githubData.contributionsCollection.contributionCalendar,
                  // currentStreak: streaks.current,
                  // longestStreak: streaks.longest,
                  updatedAt: new Date(),
                },
                create: {
                  userId: existingUser.id,
                  login: githubData.login,
                  bio: githubData.bio,
                  avatarUrl: githubData.avatarUrl,
                  followersCount: githubData.followers.totalCount,
                  followingCount: githubData.following.totalCount,
                  repositoriesCount: githubData.repositories.totalCount,
                  topRepositories: githubData.topRepositories.nodes,
                  contributionsTotal: githubData.contributionsCollection.totalCommitContributions,
                  contributionsCalendar: githubData.contributionsCollection.contributionCalendar,
                  // currentStreak: streaks.current,
                  // longestStreak: streaks.longest,
                },
              });
            }
          } catch (error) {
            console.error('Error storing GitHub data:', error);
            // Don't throw error to allow login to continue
          }
        }
      }

      return true; // Allow login
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.name = token.name as string
        session.user.role = token.role as string;
      }
      return session
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      // On first login, user is available
      if (user) {
        // Fetch user from DB to get full info (e.g., role)
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (dbUser) {
          token.sub = dbUser.id
          token.name = dbUser.name
          token.role = dbUser.role
        }
      }

      return token
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }