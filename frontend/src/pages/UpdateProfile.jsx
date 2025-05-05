import { useState } from 'react';
import useGlobalContextProvider from '../hooks/ContextApi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {motion} from 'framer-motion';
export default function UpdateProfile() {
    let user = JSON.parse(sessionStorage.getItem('user'))?.user;

    const [fullName, setFullName] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(user?.profile_img || '');
    const { userAuth, setUserAuth,setUserRole } = useGlobalContextProvider();
    console.log(userAuth,'userAuth');
    //console.log(user,'user');
    

    //const [preview, setPreview] = useState(user?.image || '');

    const handleUpdate = async(e) => {
        e.preventDefault();
        // Logic to update user details
        console.log('Updated Full Name:', fullName);
        console.log('Updated Password:', password);
        console.log('Updated Image:', image);
        await handleUpdateAPI();

    };

    const handleDelete = async() => {
        // Logic to delete user
        console.log('User deleted');
        await handleDeleteAPI();
    };

    const handleImageChange = (e) => {
        setImage(e.target.value);
        //setPreview(e.target.value);
    };

    async function handleDeleteAPI() {
            const confirmDelete = window.confirm(`Are you sure you want to delete your profile?`);
            if (!confirmDelete) return;
    
            try {
                let baseUrl = String(import.meta.env.VITE_API_BASE_URL);
                await axios.delete(`${baseUrl}/api/admin/users/${user._id}`);
               
                toast.success(`Profile deleted successfully!`);
                setUserAuth(null);
                setUserRole(null);
                sessionStorage.removeItem('user');
                window.location.href = '/';
               


            } catch (error) {
                toast.error(`Error deleting ${isAdmin ? 'admin' : 'user'}:`, error);
            }
        }

    async function handleUpdateAPI() {
        try {
            let baseUrl = String(import.meta.env.VITE_API_BASE_URL);
            debugger;
            const response = await axios.put(`${baseUrl}/api/admin/users/${user._id}`, {
                fullname: fullName,
                password: password,
                profile_img: image
            });
            

            if (response.status === 200) {
                toast.success('updated successfully!');
                setUserAuth((prev)=>{
                    return{
                        ...prev,
                        user: {
                            ...prev.user,
                            fullname: fullName,
                            password: response.data.user.password,
                            profile_img: image
                        }
                }});
                let userUpdate=JSON.parse(sessionStorage.getItem('user'));
                userUpdate.user.fullname=fullName;
                userUpdate.user.password=response.data.user.password;
                userUpdate.user.profile_img=image;
                sessionStorage.setItem('user', JSON.stringify(userUpdate));                
               
            }
        } catch (error) {
            toast.error('Error updating profile:', error);
        }
    }

    return (
                
        <motion.div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        initial='hidden'
        animate="visible"
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          hidden: { opacity: 0, y: 90 },
          visible: { opacity: 1, y: 0 },
        }}
        >
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Profile</h1>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ textAlign: 'center' ,display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px',justifyContent: 'center'}}>
                <img
                        src={image || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                        alt="User Preview"
                        style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px', border: '2px solid #ccc' }}
                    />
                    <div>
                    <label htmlFor="profileImg" style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Profile Image URL:</label>
                    <input
                        type="text"
                        id="profileImg"
                        value={image}
                        onChange={handleImageChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />

                    </div>
                    
                </div>
                <div>
                    <label htmlFor="fullName" style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Full Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Update
                </button>
            </form>
            <button onClick={handleDelete} style={{ marginTop: '20px', padding: '10px', borderRadius: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>
                Delete your account
            </button>
        </motion.div>
        
    );
}
