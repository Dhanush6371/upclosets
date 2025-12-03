// import { useState } from 'react';
// import { LogIn } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { Department } from '../types';

// export default function LoginPage() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [department, setDepartment] = useState<Department>('overall');
//   const [error, setError] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     const success = login(email, password, department);
//     if (!success) {
//       setError('Invalid credentials or department mismatch');
//     }
//   };

//   const handleCredentialClick = (email: string, password: string, dept: Department) => {
//     setEmail(email);
//     setPassword(password);
//     setDepartment(dept);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//         <div className="flex items-center justify-center mb-8">
//           <div className="bg-blue-600 p-3 rounded-xl">
//             <LogIn className="w-8 h-8 text-white" />
//           </div>
//         </div>

//         <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Admin Dashboard</h1>
//         <p className="text-center text-gray-600 mb-8">Sign in to access your department</p>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
//               Department
//             </label>
//             <select
//               id="department"
//               value={department}
//               onChange={(e) => setDepartment(e.target.value as Department)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             >
//               <option value="overall">Overall</option>
//               <option value="design">Design</option>
//               <option value="production">Production</option>
//               <option value="finishing">Finishing</option>
//               <option value="dispatch">Dispatch</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
//           >
//             Sign In
//           </button>
//         </form>

//         <div className="mt-8 p-4 bg-gray-50 rounded-lg">
//           <p className="text-xs font-semibold text-gray-700 mb-3">Demo Credentials (click to use):</p>
//           <div className="space-y-2">
//             <button
//               type="button"
//               onClick={() => handleCredentialClick('admin@company.com', 'admin123', 'overall')}
//               className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//             >
//               <strong className="text-gray-900">Admin:</strong>
//               <span className="text-gray-600 ml-1">admin@company.com / admin123</span>
//             </button>
//             <button
//               type="button"
//               onClick={() => handleCredentialClick('design@company.com', 'design123', 'design')}
//               className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//             >
//               <strong className="text-gray-900">Design:</strong>
//               <span className="text-gray-600 ml-1">design@company.com / design123</span>
//             </button>
//             <button
//               type="button"
//               onClick={() => handleCredentialClick('production@company.com', 'production123', 'production')}
//               className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//             >
//               <strong className="text-gray-900">Production:</strong>
//               <span className="text-gray-600 ml-1">production@company.com / production123</span>
//             </button>
//             <button
//               type="button"
//               onClick={() => handleCredentialClick('finishing@company.com', 'finishing123', 'finishing')}
//               className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//             >
//               <strong className="text-gray-900">Finishing:</strong>
//               <span className="text-gray-600 ml-1">finishing@company.com / finishing123</span>
//             </button>
//             <button
//               type="button"
//               onClick={() => handleCredentialClick('dispatch@company.com', 'dispatch123', 'dispatch')}
//               className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//             >
//               <strong className="text-gray-900">Dispatch:</strong>
//               <span className="text-gray-600 ml-1">dispatch@company.com / dispatch123</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








// -----------------------------------------------------------------------------------------------------
// Adding signup functionality and improved UI/UX

// import { useState } from 'react';
// import { LogIn, UserPlus } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { Department } from '../types';

// export default function LoginPage() {
//   const { login, register } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [department, setDepartment] = useState<Department>('overall');
//   const [error, setError] = useState('');
//   const [isLogin, setIsLogin] = useState(true);
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     if (!isLogin && password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (!isLogin) {
//       // Registration
//       const success = register(email, password, department);
//       if (success) {
//         setSuccessMessage('Registration successful! You can now log in.');
//         setIsLogin(true);
//         setPassword('');
//         setConfirmPassword('');
//       } else {
//         setError('Registration failed. User may already exist.');
//       }
//     } else {
//       // Login
//       const success = login(email, password, department);
//       if (!success) {
//         setError('Invalid credentials or department mismatch');
//       }
//     }
//   };

//   const handleCredentialClick = (email: string, password: string, dept: Department) => {
//     setEmail(email);
//     setPassword(password);
//     setDepartment(dept);
//     setConfirmPassword(password);
//   };

//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     setError('');
//     setSuccessMessage('');
//     setPassword('');
//     setConfirmPassword('');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
//         <div className="flex items-center justify-center mb-8">
//           <div className={`p-3 rounded-xl ${isLogin ? 'bg-blue-600' : 'bg-green-600'}`}>
//             {isLogin ? (
//               <LogIn className="w-8 h-8 text-white" />
//             ) : (
//               <UserPlus className="w-8 h-8 text-white" />
//             )}
//           </div>
//         </div>

//         <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
//           {isLogin ? 'Admin Dashboard' : 'Create Account'}
//         </h1>
//         <p className="text-center text-gray-600 mb-8">
//           {isLogin ? 'Sign in to access your department' : 'Register for a new account'}
//         </p>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         {successMessage && (
//           <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
//             {successMessage}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               placeholder="Enter your password"
//               required
//               minLength={6}
//             />
//           </div>

//           {!isLogin && (
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Confirm your password"
//                 required
//                 minLength={6}
//               />
//             </div>
//           )}

//           <div>
//             <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
//               Department
//             </label>
//             <select
//               id="department"
//               value={department}
//               onChange={(e) => setDepartment(e.target.value as Department)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             >
//               <option value="overall">Overall</option>
//               <option value="design">Design</option>
//               <option value="production">Production</option>
//               <option value="finishing">Finishing</option>
//               <option value="dispatch">Dispatch</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className={`w-full text-white py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl ${
//               isLogin 
//                 ? 'bg-blue-600 hover:bg-blue-700' 
//                 : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {isLogin ? 'Sign In' : 'Create Account'}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <button
//             type="button"
//             onClick={toggleMode}
//             className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
//           >
//             {isLogin 
//               ? "Don't have an account? Sign up" 
//               : 'Already have an account? Sign in'
//             }
//           </button>
//         </div>

//         {isLogin && (
//           <div className="mt-8 p-4 bg-gray-50 rounded-lg">
//             <p className="text-xs font-semibold text-gray-700 mb-3">Demo Credentials (click to use):</p>
//             <div className="space-y-2">
//               <button
//                 type="button"
//                 onClick={() => handleCredentialClick('admin@company.com', 'admin123', 'overall')}
//                 className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//               >
//                 <strong className="text-gray-900">Admin:</strong>
//                 <span className="text-gray-600 ml-1">admin@company.com / admin123</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleCredentialClick('design@company.com', 'design123', 'design')}
//                 className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//               >
//                 <strong className="text-gray-900">Design:</strong>
//                 <span className="text-gray-600 ml-1">design@company.com / design123</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleCredentialClick('production@company.com', 'production123', 'production')}
//                 className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//               >
//                 <strong className="text-gray-900">Production:</strong>
//                 <span className="text-gray-600 ml-1">production@company.com / production123</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleCredentialClick('finishing@company.com', 'finishing123', 'finishing')}
//                 className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//               >
//                 <strong className="text-gray-900">Finishing:</strong>
//                 <span className="text-gray-600 ml-1">finishing@company.com / finishing123</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleCredentialClick('dispatch@company.com', 'dispatch123', 'dispatch')}
//                 className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
//               >
//                 <strong className="text-gray-900">Dispatch:</strong>
//                 <span className="text-gray-600 ml-1">dispatch@company.com / dispatch123</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









// -----------------------------------------------------------------------------------------------------
// real authentication integration with JWT and backend API


import { useState } from 'react';
import { LogIn, UserPlus, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Department } from '../types';

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState<Department>('overall');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (!isLogin) {
        // Registration
        const success = await register(email, password, department);
        if (success) {
          setSuccessMessage('Registration successful! You can now log in.');
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        } else {
          setError('Registration failed. User may already exist.');
        }
      } else {
        // Login
        const success = await login(email, password, department);
        if (!success) {
          setError('Invalid credentials or department mismatch');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleCredentialClick = (email: string, password: string, dept: Department) => {
    setEmail(email);
    setPassword(password);
    setDepartment(dept);
    setConfirmPassword(password);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccessMessage('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center mb-8">
          <div className={`p-3 rounded-xl ${isLogin ? 'bg-blue-600' : 'bg-green-600'}`}>
            {isLogin ? (
              <LogIn className="w-8 h-8 text-white" />
            ) : (
              <UserPlus className="w-8 h-8 text-white" />
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {isLogin ? 'Admin Dashboard' : 'Create Account'}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {isLogin ? 'Sign in to access your department' : 'Register for a new account'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
          )}

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="overall">Overall</option>
              <option value="design">Design</option>
              <option value="production">Production</option>
              <option value="finishing">Finishing</option>
              <option value="dispatch">Dispatch</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl flex items-center justify-center ${
              isLogin 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-green-600 hover:bg-green-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            disabled={loading}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </button>
        </div>

        {isLogin && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-3">Demo Credentials (click to use):</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleCredentialClick('admin@gmail.com', 'admin@123', 'overall')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
              >
                <strong className="text-gray-900">Admin:</strong>
                <span className="text-gray-600 ml-1">admin@gmail.com / admin@123</span>
              </button>
              <button
                type="button"
                onClick={() => handleCredentialClick('design@gmail.com', 'design@123', 'design')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
              >
                <strong className="text-gray-900">Design:</strong>
                <span className="text-gray-600 ml-1">design@gmail.com / design@123</span>
              </button>
              <button
                type="button"
                onClick={() => handleCredentialClick('prod@gmail.com', 'prod@123', 'production')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
              >
                <strong className="text-gray-900">Production:</strong>
                <span className="text-gray-600 ml-1">prod@gmail.com / prod@123</span>
              </button>
              <button
                type="button"
                onClick={() => handleCredentialClick('finish@gmail.com', 'finish@123', 'finishing')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
              >
                <strong className="text-gray-900">Finishing:</strong>
                <span className="text-gray-600 ml-1">finish@gmail.com / finish@123</span>
              </button>
              <button
                type="button"
                onClick={() => handleCredentialClick('dispatch@gmail.com', 'dispatch@123', 'dispatch')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all text-xs"
              >
                <strong className="text-gray-900">Dispatch:</strong>
                <span className="text-gray-600 ml-1">dispatch@gmail.com / dispatch@123</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}