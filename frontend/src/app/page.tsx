'use client';

import { useEffect, useState, FormEvent } from 'react';
import { User, Post } from '../types';
import { getUsers, createUser } from '../services/user.service';
import { getPosts, createPost } from '../services/post.service';

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // User form state
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userSubmitting, setUserSubmitting] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string | null>(null);

  // Post form state
  const [postTitle, setPostTitle] = useState<string>('');
  const [postContent, setPostContent] = useState<string>('');
  const [postAuthorId, setPostAuthorId] = useState<string>('');
  const [postSubmitting, setPostSubmitting] = useState<boolean>(false);
  const [postMessage, setPostMessage] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(message);
    }
  };

  const fetchPosts = async (): Promise<void> => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch posts';
      setError(message);
    }
  };

  const loadAllData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchUsers(), fetchPosts()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCreateUser = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setUserSubmitting(true);
    setUserMessage(null);
    setError(null);

    try {
      await createUser({ name: userName.trim(), email: userEmail.trim() });
      setUserMessage('User created successfully!');
      setUserName('');
      setUserEmail('');
      await fetchUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      setError(message);
    } finally {
      setUserSubmitting(false);
    }
  };

  const handleCreatePost = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!postAuthorId) {
      setError('Please select an author for the post.');
      return;
    }

    setPostSubmitting(true);
    setPostMessage(null);
    setError(null);

    try {
      await createPost({
        title: postTitle.trim(),
        content: postContent.trim(),
        userId: parseInt(postAuthorId, 10),
      });
      setPostMessage('Post created successfully!');
      setPostTitle('');
      setPostContent('');
      setPostAuthorId('');
      await fetchPosts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create post';
      setError(message);
    } finally {
      setPostSubmitting(false);
    }
  };

  return (
    <main className="container">
      <h1>Backend Management Dashboard</h1>

      {error && <div className="alert-error">{error}</div>}

      {/* Section 1: Users */}
      <section className="section">
        <h2>1. Users</h2>

        {userMessage && <div className="alert-success">{userMessage}</div>}

        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label htmlFor="user-name">Name</label>
            <input
              id="user-name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Alex Smith"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-email">Email</label>
            <input
              id="user-email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              required
            />
          </div>

          <button type="submit" disabled={userSubmitting}>
            {userSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <h3>All Users</h3>
          {loading ? (
            <p className="empty-state">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="empty-state">No users found.</p>
          ) : (
            <ul className="list">
              {users.map((user) => (
                <li key={user.id} className="list-item">
                  <strong>{user.name}</strong> — {user.email} (ID: {user.id})
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Section 2: Create Post */}
      <section className="section">
        <h2>2. Create Post</h2>

        {postMessage && <div className="alert-success">{postMessage}</div>}

        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. Learning Backend"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="e.g. Learning Prisma ORM with Express and TypeScript"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-author">Author</label>
            <select
              id="post-author"
              value={postAuthorId}
              onChange={(e) => setPostAuthorId(e.target.value)}
              required
            >
              <option value="">Select an author...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={postSubmitting || users.length === 0}>
            {postSubmitting ? 'Creating Post...' : 'Create Post'}
          </button>
          {users.length === 0 && !loading && (
            <span style={{ marginLeft: '10px', fontSize: '13px', color: '#666' }}>
              Create a user above first to assign as author.
            </span>
          )}
        </form>
      </section>

      {/* Section 3: Posts */}
      <section className="section">
        <h2>3. Posts</h2>

        {loading ? (
          <p className="empty-state">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="empty-state">No posts found.</p>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-title">{post.title}</div>
                <div className="post-content">{post.content}</div>
                <div className="post-author">
                  Author: {post.user ? `${post.user.name} (${post.user.email})` : `User #${post.userId}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
