// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api'; 
import { setCredentials } from '../store/authSlice';
import './Profile.css';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // NEW: UI validation states instead of using alert()
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setProfileImage(userInfo.profileImage || '');
    }
  }, [userInfo]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setProfileImage(data.imageUrl);
      setUploading(false);
      setSuccessMsg('Image uploaded to cloud! Click Update Profile to save.');
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMsg('Image upload failed. Please try again.');
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data } = await api.put('/api/users/profile', {
        name,
        email,
        password,
        profileImage,
      });

      dispatch(setCredentials(data));
      setSuccessMsg('Profile Updated Successfully!');
      setPassword(''); // Clear the password field after successful update
    } catch (error) {
      console.error('Update error:', error);
      setErrorMsg(error.response?.data?.message || 'Profile update failed');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <p>Manage your account details and settings.</p>
        </div>

        {/* Validation Messages */}
        {errorMsg && <div className="message-box error-box">{errorMsg}</div>}
        {successMsg && <div className="message-box success-box">{successMsg}</div>}

        {/* Profile Image Preview */}
        <div className="profile-image-container">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-img" />
          ) : (
            <div className="profile-img-placeholder">No Image</div>
          )}
        </div>

        <form className="profile-form" onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              id="name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input"
              required
            />
          </div>

        

          <div className="form-group">
            <label htmlFor="imageUpload">Update Profile Image</label>
            <input 
              id="imageUpload"
              type="file" 
              onChange={uploadFileHandler} 
              className="file-input"
              accept="image/*"
            />
            {uploading && <span className="upload-status">Uploading image to cloud...</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;