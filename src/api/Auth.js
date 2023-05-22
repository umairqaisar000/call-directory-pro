import axios from "../utils/axios";

export const login = async (username, password) => {
  try {
    const response = await axios.post("/auth/login", {
      username: username,
      password: password,
    });
    const { access_token, user } = response.data;
    localStorage.setItem("token", access_token);

    return { access_token, user };
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

// Refresh Token Endpoint
export const refreshToken = async (accessToken) => {
  try {
    const response = await axios.post("/auth/refresh-token", null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { access_token, user } = response.data;
    localStorage.setItem("token", access_token);
    return { access_token, user };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

// Fetch paginated calls
export const fetchCalls = async (offset, limit, filter) => {
  try {
    const accessToken = localStorage.getItem("token");
    const response = await axios.get(`/calls?offset=${offset}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { nodes, totalCount, hasNextPage } = response.data;
    // Modify the nodes based on the filter
    if (filter === "Archived") {
      const filteredNodes = nodes.filter((node) => {
        return node.is_archived === true;
      });
      return { nodes: filteredNodes, totalCount, hasNextPage };
    } else if (filter === "Unarchived") {
      const filteredNodes = nodes.filter((node) => {
        return node.is_archived === false;
      });
      return { nodes: filteredNodes, totalCount, hasNextPage };
    } else {
      return { nodes, totalCount, hasNextPage };
    }
  } catch (error) {
    console.error("Error fetching calls:", error);
    throw error;
  }
};
