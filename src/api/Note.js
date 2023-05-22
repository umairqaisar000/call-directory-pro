import axios from "../utils/axios";

export const submitNote = async (callId, noteContent, accessToken) => {
  const url = `/calls/${callId}/note`;
  const requestBody = { content: noteContent };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const archiveCall = async (callId, accessToken) => {
  const url = `/calls/${callId}/archive`;

  try {
    const response = await axios.put(url, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
