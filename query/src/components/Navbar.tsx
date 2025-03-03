// import { Link } from 'react-router-dom';

// export const Navbar = () => {
//   return (
//     <nav className="bg-blue-600 p-4 text-white">
//       <ul className="flex justify-around">
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/signup">Signup</Link></li>
//         <li><Link to="/requester">Requester</Link></li>
//         <li><Link to="/approver">Approver</Link></li>
//         <li><Link to="/executor">Executor</Link></li>
//       </ul>
//     </nav>
//   );
// };

// import { Link } from 'react-router-dom';
// import { FaHome, FaUserPlus, FaClipboardList, FaCheckCircle, FaTools } from 'react-icons/fa';

// export const Navbar = () => {
//   return (
//     <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg">
//       <ul className="flex justify-around items-center text-white font-semibold text-lg">
//         <li className="hover:scale-105 transition-transform">
//           <Link to="/" className="flex items-center gap-2 hover:text-gray-200">
//             <FaHome /> Home
//           </Link>
//         </li>
//         <li className="hover:scale-105 transition-transform">
//           <Link to="/signup" className="flex items-center gap-2 hover:text-gray-200">
//             <FaUserPlus /> Signup
//           </Link>
//         </li>
//         <li className="hover:scale-105 transition-transform">
//           <Link to="/requester" className="flex items-center gap-2 hover:text-gray-200">
//             <FaClipboardList /> Requester
//           </Link>
//         </li>
//         <li className="hover:scale-105 transition-transform">
//           <Link to="/approver" className="flex items-center gap-2 hover:text-gray-200">
//             <FaCheckCircle /> Approver
//           </Link>
//         </li>
//         <li className="hover:scale-105 transition-transform">
//           <Link to="/executor" className="flex items-center gap-2 hover:text-gray-200">
//             <FaTools /> Executor
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };
// export default Navbar;

import { Link } from 'react-router-dom';
import { FaHome, FaClipboardList, FaCheckCircle, FaTools } from 'react-icons/fa';

export const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg fixed top-0 w-full z-10">
      <div className="container mx-auto">
        <ul className="flex justify-around items-center text-white font-semibold text-lg">
          <li className="hover:scale-105 transition-transform">
            <Link to="/" className="flex items-center gap-2 hover:text-gray-200">
              <FaHome /> Home
            </Link>
          </li>
          {/* <li className="hover:scale-105 transition-transform">
            <Link to="/signup" className="flex items-center gap-2 hover:text-gray-200">
              <FaUserPlus /> Signup
            </Link>
          </li> */}
          <li className="hover:scale-105 transition-transform">
            <Link to="/requester" className="flex items-center gap-2 hover:text-gray-200">
              <FaClipboardList /> Requester
            </Link>
          </li>
          <li className="hover:scale-105 transition-transform">
            <Link to="/approver" className="flex items-center gap-2 hover:text-gray-200">
              <FaCheckCircle /> Approver
            </Link>
          </li>
          <li className="hover:scale-105 transition-transform">
            <Link to="/executor" className="flex items-center gap-2 hover:text-gray-200">
              <FaTools /> Executor
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
