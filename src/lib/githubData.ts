import axios from 'axios';

export type GitHubUserData = {
  name: string;
  login: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
};

export const getGitHubUserData = async (accessToken: string): Promise<GitHubUserData | null> => {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response.data;
    return {
      name: data.name,
      login: data.login,
      avatar_url: data.avatar_url,
      bio: data.bio,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
    };
  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
    return null;
  }
};
