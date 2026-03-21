import React from 'react'
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignUp() {
    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";

    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSignUp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName, email, password, mobile, role
            }, { withCredentials: true })
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        if (!mobile) {
            return setErr("mobile no is required")
        }
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            }, { withCredentials: true })
            dispatch(setUserData(data))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-200 p-4'>
            <div className='w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200'>
                
                <h1 className='text-4xl font-extrabold mb-2 text-center' style={{ color: primaryColor }}>Zaykaa</h1>
                <p className='text-gray-500 text-center mb-6'>Create your account and start ordering delicious food</p>

                <div className='space-y-4'>

                    <input type="text" placeholder='Full Name'
                        className='w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none transition cursor-pointer'
                        onChange={(e) => setFullName(e.target.value)} value={fullName} />

                    <input type="email" placeholder='Email'
                        className='w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none transition cursor-pointer'
                        onChange={(e) => setEmail(e.target.value)} value={email} />

                    <input type="text" placeholder='Mobile Number'
                        className='w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none transition cursor-pointer'
                        onChange={(e) => setMobile(e.target.value)} value={mobile} />

                    <div className='relative'>
                        <input type={showPassword ? "text" : "password"}
                            placeholder='Password'
                            className='w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none transition cursor-pointer'
                            onChange={(e) => setPassword(e.target.value)} value={password} />

                        <span className='absolute right-4 top-3 cursor-pointer text-gray-500'
                            onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </span>
                    </div>

                    <div className='flex gap-2'>
                        {['user', 'owner', 'deliveryBoy'].map((r) => (
                            <button key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 rounded-lg font-medium border transition ${role === r
                                    ? 'bg-orange-500 text-white'
                                    : 'text-orange-500 border-orange-500 hover:bg-orange-100'
                                    }`}>
                                {r}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className='w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition flex items-center justify-center cursor-pointer'>
                        {loading ? <ClipLoader size={20} color='white' /> : "Create Account"}
                    </button>

                    {err && <p className='text-red-500 text-center'>*{err}</p>}

                    <button
                        onClick={handleGoogleAuth}
                        className='w-full py-3 rounded-lg border flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer'>
                        <FcGoogle size={22} />
                        Continue with Google
                    </button>

                    <p className='text-center text-sm'>
                        Already have an account?
                        <span
                            className='text-orange-500 font-semibold cursor-pointer ml-1'
                            onClick={() => navigate("/signin")}>
                            Sign In
                        </span>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default SignUp;
