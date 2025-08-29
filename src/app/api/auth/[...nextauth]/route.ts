import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GraphQL query to fetch GitHub user data
const GITHUB_USER_QUERY = `
  query {
    viewer{
      name
      login
      avatarUrl
      bioHTML
      location
      url
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoriesWithContributedCommits
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
      
      # Repositories owned by the user
    repositories(first: 50, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        url
        isFork
        stargazerCount
        forkCount
        createdAt
        updatedAt
        primaryLanguage {
          name
          color
        }
        languages(first: 2) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
        repositoryTopics(first: 10) {
          nodes {
            topic {
              name
            }
          }
        }
      }
    }

    # Contributions to other repos (collaboration signal)
    repositoriesContributedTo(first: 20, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST]) {
      totalCount
      nodes {
        name
        owner {
          login
        }
        url
      }
    }

    # Pull requests (collaboration + code review)
    pullRequests(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        title
        url
        state
        createdAt
        mergedAt
        additions
        deletions
      }
    }

    # Issues raised (problem solving + communication)
    issues(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        title
        url
        state
        createdAt
        closedAt
      }
    }

    # Code review activity
    contributionsCollection {
      totalPullRequestReviewContributions
    }
      starredRepositories {
        totalCount
      }
    }
  }
`;

async function fetchGitHubUserData(accessToken: string) {
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GITHUB_USER_QUERY,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.viewer;
  } catch (error) {
    // console.error('Error fetching GitHub user data:', error);
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
      // authorization: {
      //   params: {
      //     scope: "read:user user:email repo",
      //   },
      // },
    }),
    GitHubProvider({
      id: 'github-candidat',
      clientId: process.env.GITHUB_CANDIDATE_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CANDIDATE_CLIENT_SECRET!,
      // authorization: {
      //   params: {
      //     scope: "read:user user:email repo",
      //   },
      // },
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
            
            // Fetch GitHub user data
            const githubData = await fetchGitHubUserData(account.access_token);
            if (githubData) {
              // Update or create GitHub profile
              await prisma.gitHubProfile.upsert({
                where: { userId: existingUser.id },
                update: {
                  accessToken: account.access_token,
                  login: githubData.login,
                  name: githubData.name,
                  bioHTML: githubData.bioHTML,
                  location: githubData.location,
                  url: githubData.url,
                  githubCreatedAt : githubData.createdAt,
                  avatarUrl: githubData.avatarUrl,
                  followersCount: githubData.followers.totalCount,
                  followingCount: githubData.following.totalCount,

                  contributionsCollection: githubData.contributionsCollection,
                  repositories : githubData.repositories,
                  Contributions: githubData.Contributions,
                  pullRequests: githubData.pullRequests,
                  issues : githubData.issues,
                  CodeReviewActivity : githubData.CodeReviewActivity,

                  updatedAt: new Date(),
                },
                create: {
                  userId: existingUser.id,
                  accessToken: account.access_token,
                  name: githubData.name,
                  login: githubData.login,
                  bioHTML: githubData.bioHTML,
                  location: githubData.location,
                  url: githubData.url,
                  githubCreatedAt : githubData.createdAt,
                  avatarUrl: githubData.avatarUrl,
                  followersCount: githubData.followers.totalCount,
                  followingCount: githubData.following.totalCount,

                  contributionsCollection: githubData.contributionsCollection,
                  repositories : githubData.repositories,
                  Contributions: githubData.Contributions,
                  pullRequests: githubData.pullRequests,
                  issues : githubData.issues,
                  CodeReviewActivity : githubData.CodeReviewActivity,
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