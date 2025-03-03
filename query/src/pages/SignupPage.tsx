// import React, { useState } from 'react';

// const SignupPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log({ username, password, email });
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-xl font-bold mb-4">Signup</h2>
//         <label className="block mb-2">
//           Username:
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//           />
//         </label>
//         <label className="block mb-2">
//           Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//           />
//         </label>
//         <label className="block mb-4">
//           Password:
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//           />
//         </label>
//         <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Signup</button>
//       </form>
//     </div>
//   );
// };

// export default SignupPage;

// import React, { useState } from 'react';

// const AuthPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState('');
//   const [isLogin, setIsLogin] = useState(true); // To toggle between login and signup form

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (isLogin) {
//         console.log({ username, password });
//       } else {
//         console.log({ username, password, email, role });
//       }
//   };
  
// //   const handleSubmit = (e) => {
// //     e.preventDefault();
    
// //   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-80">
//         <form onSubmit={handleSubmit}>
//           <h2 className="text-lg font-semibold text-center mb-4">
//             {isLogin ? 'Login' : 'Signup'}
//           </h2>

//           {/* Username Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1" htmlFor="username">
//               Username:
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1" htmlFor="password">
//               Password:
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//             />
//           </div>

//           {/* Email Field (only shown during signup) */}
//           {!isLogin && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1" htmlFor="email">
//                 Email:
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded"
//               />
//             </div>
//           )}

//           {/* Role Selection (only shown during signup) */}
//           {!isLogin && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1" htmlFor="role">
//                 Role:
//               </label>
//               <select
//                 id="role"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded"
//               >
//                 <option value="">Select Role</option>
//                 <option value="requester">Requester</option>
//                 <option value="approver">Approver</option>
//                 <option value="executor">Executor</option>
//               </select>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 w-full">
//             {isLogin ? 'Login' : 'Signup'}
//           </button>
//         </form>

//         {/* Toggle between Login and Signup */}
//         <div className="text-center mt-4">
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-blue-500 hover:underline"
//           >
//             {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;


// import React, { useState } from 'react';

// const AuthPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState('');
//   const [isLogin, setIsLogin] = useState(true); // To toggle between login and signup form


//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (isLogin) {
//         console.log({ username, password });
//       } else {
//         console.log({ username, password, email, role });
//       }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-blue-100">
//       <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
//         <form onSubmit={handleSubmit}>
//           <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//             {isLogin ? 'Login' : 'Signup'}
//           </h2>

//           {/* Username Field */}
//           <div className="mb-4">
//             <label
//               className="block text-sm font-semibold text-gray-600 mb-2"
//               htmlFor="username"
//             >
//               Username:
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
//               placeholder="Enter your username"
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-4">
//             <label
//               className="block text-sm font-semibold text-gray-600 mb-2"
//               htmlFor="password"
//             >
//               Password:
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
//               placeholder="Enter your password"
//             />
//           </div>

//           {/* Email Field (only shown during signup) */}
//           {!isLogin && (
//             <div className="mb-4">
//               <label
//                 className="block text-sm font-semibold text-gray-600 mb-2"
//                 htmlFor="email"
//               >
//                 Email:
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
//                 placeholder="Enter your email"
//               />
//             </div>
//           )}

//           {/* Role Selection (only shown during signup) */}
//           {!isLogin && (
//             <div className="mb-4">
//               <label
//                 className="block text-sm font-semibold text-gray-600 mb-2"
//                 htmlFor="role"
//               >
//                 Role:
//               </label>
//               <select
//                 id="role"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
//               >
//                 <option value="">Select Role</option>
//                 <option value="requester">Requester</option>
//                 <option value="approver">Approver</option>
//                 <option value="executor">Executor</option>
//               </select>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition duration-300"
//           >
//             {isLogin ? 'Login' : 'Signup'}
//           </button>
//         </form>

//         {/* Toggle between Login and Signup */}
//         <div className="text-center mt-6">
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-blue-500 hover:underline text-sm"
//           >
//             {isLogin
//               ? "Don't have an account? Sign up"
//               : 'Already have an account? Login'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;
