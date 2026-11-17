// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api'; // Your global Axios instance with the interceptor
import { setCredentials } from '../store/authSlice';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Pre-fill the form with existing user data
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setProfileImage(userInfo.profileImage || '');
    }
  }, [userInfo]);

  // 1. Handle the Image File Upload to Cloudinary
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      // Send the file to our backend upload route
      const { data } = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Save the returned Cloudinary URL in our local state
      setProfileImage(data.imageUrl);
      setUploading(false);
      alert('Image uploaded to cloud! Now click Update Profile to save.');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Image upload failed');
      setUploading(false);
    }
  };

  // 2. Submit all updated data to MongoDB
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/api/users/profile', {
        name,
        email,
        password,
        profileImage,
      });

      // Update Redux and localStorage with the new data
      dispatch(setCredentials(data));
      alert('Profile Updated Successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Profile update failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>My Profile</h2>
      
      {profileImage && (
        <img 
          src={profileImage} 
          alt="Profile" 
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', display: 'block', marginBottom: '15px' }} 
        />
      )}

      <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>
        
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>
{/* 
        <div>
          <label>New Password (leave blank to keep current)</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div> */}

        <div>
          <label>Profile Image</label>
          <input 
            type="file" 
            onChange={uploadFileHandler} 
            style={{ width: '100%', marginTop: '5px' }}
          />
          {uploading && <p style={{ fontSize: '12px', color: 'blue' }}>Uploading image to cloud...</p>}
        </div>

        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;