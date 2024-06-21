import axios from 'axios';

const googleApi = axios.create({
  baseURL: 'https://www.googleapis.com/',
});

export interface UserProfileDTO {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export const getUserProfile = async (accessToken: string) =>
  googleApi
    .get<UserProfileDTO>('/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
