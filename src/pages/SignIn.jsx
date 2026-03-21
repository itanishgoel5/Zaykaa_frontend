import React from 'react'
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {
    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSignIn = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email, password
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
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                email: result.user.email,
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
                <p className='text-gray-500 text-center mb-6'>Sign in to continue your food journey</p>

                <div className='space-y-4'>

                    <input
                        type="email"
                        placeholder='Email'
                        className='w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none transition cursor-pointer'
                        onChange={(e) => setEmail(e.target.value)} value={email}
                    />

                    <div className='relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Password'
                            className='w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none transition cursor-pointer'
                            onChange={(e) => setPassword(e.target.value)} value={password}
                        />

                        <span
                            className='absolute right-4 top-3 cursor-pointer text-gray-500'
                            onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </span>
                    </div>

                    <div
                        className='text-right text-orange-500 font-medium cursor-pointer hover:underline'
                        onClick={() => navigate("/forgot-password")}>
                        Forgot Password?
                    </div>

                    <button
                        className='w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition flex items-center justify-center cursor-pointer'
                        onClick={handleSignIn}
                        disabled={loading}>
                        {loading ? <ClipLoader size={20} color='white' /> : "Sign In"}
                    </button>

                    {err && <p className='text-red-500 text-center'>*{err}</p>}

                    <button
                        className='w-full py-3 rounded-lg border flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer'
                        onClick={handleGoogleAuth}>
                        <FcGoogle size={22} />
                        Sign In with Google
                    </button>

                    <p className='text-center text-sm cursor-pointer'>
                        Want to create a new account?
                        <span
                            className='text-orange-500 font-semibold ml-1'
                            onClick={() => navigate("/signup")}>
                            Sign Up
                        </span>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default SignIn;
