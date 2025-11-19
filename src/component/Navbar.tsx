// // src/components/Navbar.tsx
// import React, { useContext } from "react";
// import { Link } from "react-router-dom";

// import { UserContext } from "../context/User";

// const Navbar: React.FC = () => {
//   const userContext = useContext(UserContext);

//   if (!userContext) {
//     return (
//       <nav className="navbar">
//         <div className="navbar-left">
//           <Link
//             to="/"
//             className="navbar-logo text-3xl font-bold text-[hsl(0,0%,100%)] my-auto"
//           >
//             TAXAVA
//           </Link>
//         </div>

//         <div className="navbar-center"></div>
//       </nav>
//     );
//   }

//   const { user, logoutUser } = userContext;

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <Link
//           to="/"
//           className="navbar-logo text-3xl font-bold text-[#FFFFF] my-auto"
//         >
//           TAXAVA
//         </Link>
//       </div>

//       <div className="navbar-center"></div>

//       <div className="navbar-right">
//         {user && (
//           <Link
//             to="/login"
//             onClick={logoutUser}
//             className="text-white bg-[#574ff2] focus:outline-[#3731ab] active:bg-[#3731ab] hover:bg-[#3731ab] px-4 py-2 font-medium rounded-lg text-sm cursor-pointer"
//           >
//             Log out
//           </Link>
//         )}
//         {}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
