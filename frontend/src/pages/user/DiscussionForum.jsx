// import { useState } from 'react';
// import Navbar from '../../components/Navbar';
// import { FaUser, FaPaperPlane, FaThumbsUp, FaComment, FaTrash, FaGlobe } from 'react-icons/fa';

// const DiscussionForum = () => {
//   // Available languages
//   const languages = [
//     { code: 'en', name: 'English', flag: '🇬🇧' },
//     { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
//     { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
//     { code: 'ta', name: 'Tamil', flag: '🇮🇳' }
//   ];

//   // Sample initial data with current user
//   const currentUser = { id: 'user1', name: 'You' };
  
//   const initialPosts = [
//     {
//       id: 1,
//       text: "The park near my house needs cleaning. Can we organize something this weekend?",
//       author: { id: 'user2', name: 'Rahul' },
//       language: 'en',
//       timestamp: "2023-06-15 10:30",
//       upvotes: 3,
//       comments: [
//         {
//           id: 101,
//           text: "I can help on Sunday morning",
//           author: { id: 'user3', name: 'Priya' },
//           timestamp: "2023-06-15 11:45",
//           language: 'en'
//         }
//       ]
//     },
//     {
//       id: 2,
//       text: "माझ्या वॉर्डमध्ये कचरा ट्रक नियमित येत नाही",
//       author: currentUser,
//       language: 'mr',
//       timestamp: "2023-06-14 15:45",
//       upvotes: 5,
//       comments: []
//     }
//   ];

//   const [posts, setPosts] = useState(initialPosts);
//   const [newPost, setNewPost] = useState({ text: '', language: 'en' });
//   const [newComments, setNewComments] = useState({});

//   // Add new post
//   const handleAddPost = (e) => {
//     e.preventDefault();
//     if (!newPost.text.trim()) return;

//     const post = {
//       id: Date.now(), // Better ID generation
//       text: newPost.text,
//       author: currentUser,
//       language: newPost.language,
//       timestamp: new Date().toLocaleString(),
//       upvotes: 0,
//       comments: []
//     };

//     setPosts([post, ...posts]);
//     setNewPost({ text: '', language: 'en' });
//   };

//   // Add comment to a post
//   const handleAddComment = (postId) => {
//     if (!newComments[postId]?.text?.trim()) return;

//     const updatedPosts = posts.map(post => {
//       if (post.id === postId) {
//         return {
//           ...post,
//           comments: [
//             ...post.comments,
//             {
//               id: Date.now(), // Better ID generation
//               text: newComments[postId].text,
//               author: currentUser,
//               timestamp: new Date().toLocaleString(),
//               language: newComments[postId].language
//             }
//           ]
//         };
//       }
//       return post;
//     });

//     setPosts(updatedPosts);
//     setNewComments({ ...newComments, [postId]: { text: '', language: 'en' } });
//   };

//   // Upvote a post
//   const handleUpvote = (postId) => {
//     setPosts(posts.map(post => 
//       post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
//     ));
//   };

//   // Delete a post (only for author)
//   const handleDeletePost = (postId) => {
//     if (window.confirm("Are you sure you want to delete this post?")) {
//       setPosts(posts.filter(post => post.id !== postId));
//     }
//   };

//   // Delete a comment (only for author)
//   const handleDeleteComment = (postId, commentId) => {
//     if (window.confirm("Are you sure you want to delete this comment?")) {
//       setPosts(posts.map(post => {
//         if (post.id === postId) {
//           return {
//             ...post,
//             comments: post.comments.filter(comment => comment.id !== commentId)
//           };
//         }
//         return post;
//       }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
      
//       <div className="max-w-4xl mx-auto p-4 pt-24"> {/* Added pt-24 to account for fixed navbar */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Discussion Forum</h2>
          
//           {/* New Post Form */}
//           <form onSubmit={handleAddPost} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
//             <div className="flex items-center mb-3 gap-2">
//               <FaGlobe className="text-gray-500" />
//               <select 
//                 value={newPost.language}
//                 onChange={(e) => setNewPost({...newPost, language: e.target.value})}
//                 className="border rounded-lg px-3 py-1.5 text-sm bg-white"
//               >
//                 {languages.map(lang => (
//                   <option key={lang.code} value={lang.code}>
//                     {lang.flag} {lang.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <textarea
//               value={newPost.text}
//               onChange={(e) => setNewPost({...newPost, text: e.target.value})}
//               placeholder="Share your thoughts with the community..."
//               className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
//               rows={4}
//               required
//             />
//             <div className="flex justify-end">
//               <button 
//                 type="submit" 
//                 className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center"
//               >
//                 <FaPaperPlane className="mr-2" /> Post Message
//               </button>
//             </div>
//           </form>

//           {/* Posts List */}
//           <div className="space-y-6">
//             {posts.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 No discussions yet. Be the first to post!
//               </div>
//             ) : (
//               posts.map(post => (
//                 <div key={post.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//                   {/* Post Header */}
//                   <div className="p-4 border-b flex justify-between items-start">
//                     <div className="flex items-center">
//                       <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
//                         <FaUser />
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-800">{post.author.name}</span>
//                         <div className="flex items-center mt-1">
//                           <span className="text-xs text-gray-500 mr-2">
//                             {post.timestamp}
//                           </span>
//                           <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
//                             {languages.find(l => l.code === post.language)?.flag} 
//                             {languages.find(l => l.code === post.language)?.name}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <button 
//                         onClick={() => handleUpvote(post.id)}
//                         className="flex items-center text-gray-500 hover:text-blue-500"
//                       >
//                         <FaThumbsUp className="mr-1" /> 
//                         <span className="text-sm font-medium">{post.upvotes}</span>
//                       </button>
//                       {post.author.id === currentUser.id && (
//                         <button 
//                           onClick={() => handleDeletePost(post.id)}
//                           className="text-gray-400 hover:text-red-500 p-1"
//                           title="Delete post"
//                         >
//                           <FaTrash size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Post Content */}
//                   <div className="p-4">
//                     <p className="text-gray-800 mb-4 whitespace-pre-line">{post.text}</p>
//                   </div>

//                   {/* Comments Section */}
//                   <div className="border-t">
//                     {post.comments.length > 0 && (
//                       <div className="p-4 bg-gray-50">
//                         <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
//                           <FaComment className="mr-2" /> {post.comments.length} comments
//                         </h3>
//                         {post.comments.map(comment => (
//                           <div key={comment.id} className="flex mb-4 last:mb-0">
//                             <div className="bg-gray-200 text-gray-600 rounded-full p-2 mr-3 flex-shrink-0">
//                               <FaUser size={12} />
//                             </div>
//                             <div className="flex-1 relative">
//                               <div className="bg-white p-3 rounded-lg border border-gray-200">
//                                 <div className="flex justify-between items-start mb-1">
//                                   <span className="font-medium text-sm text-gray-800">{comment.author.name}</span>
//                                   {comment.author.id === currentUser.id && (
//                                     <button 
//                                       onClick={() => handleDeleteComment(post.id, comment.id)}
//                                       className="text-xs text-gray-400 hover:text-red-500"
//                                     >
//                                       <FaTrash size={12} />
//                                     </button>
//                                   )}
//                                 </div>
//                                 <p className="text-gray-700 text-sm mb-2">{comment.text}</p>
//                                 <div className="flex items-center justify-between">
//                                   <span className="text-xs text-gray-400">
//                                     {comment.timestamp}
//                                   </span>
//                                   <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
//                                     {languages.find(l => l.code === comment.language)?.flag}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {/* Add Comment */}
//                     <div className="p-4 bg-gray-50 border-t">
//                       <div className="flex">
//                         <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3 flex-shrink-0">
//                           <FaUser />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center mb-3 gap-2">
//                             <FaGlobe className="text-gray-500 text-sm" />
//                             <select 
//                               value={newComments[post.id]?.language || 'en'}
//                               onChange={(e) => setNewComments({
//                                 ...newComments, 
//                                 [post.id]: {
//                                   ...newComments[post.id],
//                                   language: e.target.value
//                                 }
//                               })}
//                               className="border rounded-lg px-3 py-1.5 text-xs bg-white"
//                             >
//                               {languages.map(lang => (
//                                 <option key={lang.code} value={lang.code}>
//                                   {lang.flag} {lang.name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                           <textarea
//                             value={newComments[post.id]?.text || ''}
//                             onChange={(e) => setNewComments({
//                               ...newComments, 
//                               [post.id]: {
//                                 ...newComments[post.id],
//                                 text: e.target.value
//                               }
//                             })}
//                             placeholder="Write a comment..."
//                             className="w-full p-3 border rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
//                             rows={2}
//                           />
//                           <div className="flex justify-end">
//                             <button
//                               onClick={() => handleAddComment(post.id)}
//                               disabled={!newComments[post.id]?.text?.trim()}
//                               className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                             >
//                               <FaPaperPlane className="mr-1" size={12} /> Post Comment
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiscussionForum;

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { FaUser, FaPaperPlane, FaTrash, FaGlobe, FaHeart } from "react-icons/fa"

const DiscussionForum = () => {
  const [user, setUser] = useState(null)
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState({ message: "", language: "en" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Available languages
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", flag: "🇧🇩" },
    { code: "gu", name: "Gujarati", flag: "🇮🇳" },
    { code: "te", name: "Telugu", flag: "🇮🇳" },
    { code: "kn", name: "Kannada", flag: "🇮🇳" },
    { code: "ml", name: "Malayalam", flag: "🇮🇳" },
    { code: "or", name: "Odia", flag: "🇮🇳" },
  ]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchDiscussions()
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/discussions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDiscussions(data.discussions || [])
      } else {
        throw new Error("Failed to fetch discussions")
      }
    } catch (error) {
      setError("Error loading discussions: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPost = async (e) => {
    e.preventDefault()
    if (!newPost.message.trim()) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: newPost.message,
          language: newPost.language,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setDiscussions([data.discussion, ...discussions])
        setNewPost({ message: "", language: "en" })
        setError("")
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to post message")
      }
    } catch (error) {
      setError("Error posting message: " + error.message)
    }
  }

  const handleLike = async (discussionId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/discussions/${discussionId}/like`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDiscussions(
          discussions.map((discussion) => (discussion._id === discussionId ? data.discussion : discussion)),
        )
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleDelete = async (discussionId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/discussions/${discussionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setDiscussions(discussions.filter((discussion) => discussion._id !== discussionId))
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete post")
      }
    } catch (error) {
      setError("Error deleting post: " + error.message)
    }
  }

  const getLanguageName = (code) => {
    const lang = languages.find((l) => l.code === code)
    return lang ? `${lang.flag} ${lang.name}` : code
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 pt-24">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Discussion Forum</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          {/* New Post Form */}
          <form onSubmit={handleAddPost} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3 gap-2">
              <FaGlobe className="text-gray-500" />
              <select
                value={newPost.language}
                onChange={(e) => setNewPost({ ...newPost, language: e.target.value })}
                className="border rounded-lg px-3 py-1.5 text-sm bg-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={newPost.message}
              onChange={(e) => setNewPost({ ...newPost, message: e.target.value })}
              placeholder="Share your thoughts with the community..."
              className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              rows={4}
              maxLength={500}
              required
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{newPost.message.length}/500 characters</span>
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <FaPaperPlane className="mr-2" /> Post Message
              </button>
            </div>
          </form>

          {/* Posts List */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading discussions...</p>
              </div>
            ) : discussions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No discussions yet. Be the first to post!</div>
            ) : (
              discussions.map((discussion) => (
                <div
                  key={discussion._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4 border-b flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                        <FaUser />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">
                          {discussion.user.name}
                          {discussion.user._id === user.id && " (You)"}
                        </span>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 mr-2">{formatDate(discussion.createdAt)}</span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                            {getLanguageName(discussion.language)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">Ward: {discussion.user.ward}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLike(discussion._id)}
                        className={`flex items-center ${
                          discussion.likes?.includes(user.id) ? "text-red-500" : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <FaHeart className="mr-1" />
                        <span className="text-sm font-medium">{discussion.likes?.length || 0}</span>
                      </button>
                      {(discussion.user._id === user.id || user.role === "admin") && (
                        <button
                          onClick={() => handleDelete(discussion._id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Delete post"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-gray-800 whitespace-pre-line">{discussion.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscussionForum
