import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../slices/auth/authSlice';
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import '../styles/loginform.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        let valid = true;
        if (!email.trim()) {
            setEmailError('Email is required');
            valid = false;
        } else if (!email.endsWith('@lumel.com')) {
            setEmailError('Email must be a lumel.com email');
            valid = false;
        }
        else if (!password.trim()) {
            setPasswordError('Password is required');
            valid = false;
        }
        if (!valid) {
            return;
        }
        dispatch(loginStart());

        try {
            const response = await fetch('http://localhost:3008/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Login data", data);

            if (response.ok) {
                const { token, user } = data;
                console.log("user data ", user)
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                dispatch(loginSuccess({ user: data.user, token: data.token }));
                toast.success('Login Successful', { className: 'custom-color',autoClose: 2000 });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000)
            }
            else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (err) {
            dispatch(loginFailure(err.message));
        }
    };

    return (
        <section className='login-container'>
            <div className='login-first-part'>
            </div>

            <form onSubmit={handleLogin} className='login-form'>
                {error && <p className="error-text">{error}</p>}
                <div className='form-head'>
                    <h2> <span><FaUser /></span> Sign In</h2>
                </div>

                <label htmlFor="email">EMAIL</label>
                <input
                    type="email"
                    placeholder="Email"
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p className="error-text">{emailError}</p>}

                <label htmlFor="password">PASSWORD</label>
                <div className='password'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                </div>

                {passwordError && <p className="error-text">{passwordError}</p>}



                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

            </form>
        </section>
    );
};

export default LoginForm;
