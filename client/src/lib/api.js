const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function for API calls
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Add auth token if available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = "Something went wrong";
      try {
        const data = await response.json();
        errorMessage = data.message || errorMessage;
      } catch (e) {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Auth API calls
export const authAPI = {
  signup: async (email, password) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile: async () => {
    return apiRequest("/auth/profile");
  },

  changePassword: async (passwordData) => {
    return apiRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  },

  deleteAccount: async () => {
    return apiRequest("/auth/delete-account", {
      method: "DELETE",
    });
  },
};

// Posts API calls
export const postsAPI = {
  getAllPosts: async () => {
    return apiRequest("/posts");
  },

  createPost: async (postData) => {
    return apiRequest("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  },

  likePost: async (postId) => {
    return apiRequest(`/posts/${postId}/like`, {
      method: "PUT",
    });
  },

  dislikePost: async (postId) => {
    return apiRequest(`/posts/${postId}/dislike`, {
      method: "PUT",
    });
  },

  getPostById: async (postId) => {
    return apiRequest(`/posts/${postId}`);
  },

  addComment: async (postId, content) => {
    return apiRequest(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },

  deletePost: async (postId) => {
    return apiRequest(`/posts/${postId}`, {
      method: "DELETE",
    });
  },

  deleteComment: async (postId, commentId) => {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    });
  },

  updatePost: async (postId, data) => {
    return apiRequest(`/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updateComment: async (postId, commentId, content) => {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
  },

  getLeaderboard: async () => {
    return apiRequest("/posts/leaderboard");
  },
};
