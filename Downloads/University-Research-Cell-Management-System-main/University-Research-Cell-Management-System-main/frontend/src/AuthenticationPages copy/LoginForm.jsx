import { Link } from 'react-router-dom';

export default function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center  bg-[url('/image1.png')] bg-cover bg-center relative p-4">
       <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
       <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-md p-6 z-10">
        <h2 className="text-xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-sm text-gray-500 mb-4">Sign in to your account</p>

        <form className="space-y-3">
          <input type="email" placeholder="Email" className="w-full border rounded p-2" />
          <input type="password" placeholder="Password" className="w-full border rounded p-2" />
            <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Remember Me</label>
         <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">
            Login </button>
        <p className="text-center text-lg mt-3 p-7">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-500">
              Create one </Link>
           </p>
        </form>

       
      </div>
    </div>
  );
}
