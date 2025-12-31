const Post = require("../models/Post");
const generateAlias = require("../utils/aliasGenerator");

exports.getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    // Find posts from database, sort by newest first (-1 means descending)
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    // Get the data sent from frontend (title, content, category)
    const { title, content, category } = req.body;

    const postData = {
      title,
      content,
      category,
      userId: req.user._id,
      alias: req.user.alias,
    };

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      console.log("Processing files:", req.files.length);
      postData.media = req.files.map((file) => {
        console.log("File details:", {
          path: file.path,
          filename: file.filename,
          mimetype: file.mimetype,
        });
        return {
          url: file.path, // Cloudinary URL
          publicId: file.filename, // Cloudinary public ID
          resourceType: file.mimetype?.startsWith("video") ? "video" : "image",
        };
      });
    }

    console.log("Post data to save:", JSON.stringify(postData, null, 2));
    const newPost = await Post.create(postData); // Saved to MongoDB
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike - remove user from likes array
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Remove from dislikes if present
      post.dislikes = post.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
      // Add to likes
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.dislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyDisliked = post.dislikes.includes(userId);

    if (alreadyDisliked) {
      // Undo dislike - remove user from dislikes array
      post.dislikes = post.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Remove from likes if present
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      // Add to dislikes
      post.dislikes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.user._id;
    const alias = req.user.alias;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      userId,
      alias,
      content: content.trim(),
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the owner of the post
    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { title, content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the owner of the post
    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    if (title) post.title = title;
    if (content !== undefined) post.content = content;
    post.updatedAt = new Date();
    post.isEdited = true;

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const userId = req.user._id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    comment.content = content.trim();
    comment.isEdited = true;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Post.aggregate([
      {
        $project: {
          userId: 1,
          alias: 1,
          title: 1,
          category: 1,
          createdAt: 1,
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $group: {
          _id: "$userId",
          alias: { $first: "$alias" },
          totalLikes: { $sum: "$likesCount" },
          totalPosts: { $sum: 1 },
          topPost: {
            $max: {
              title: "$title",
              category: "$category",
              createdAt: "$createdAt",
              likesCount: "$likesCount",
              commentsCount: "$commentsCount",
            },
          },
        },
      },
      {
        $match: {
          totalLikes: { $gt: 0 },
        },
      },
      {
        $sort: { totalLikes: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
