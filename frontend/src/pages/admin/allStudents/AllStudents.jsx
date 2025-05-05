import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import {motion} from 'framer-motion';
import './modalStyles.css'; // Import custom styles for the modal
import { toast } from 'react-hot-toast';

Modal.setAppElement('#root');

export default function AllStudents() {
    const [adminUsers, setAdminUsers] = useState([]);
    const [regularUsers, setRegularUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            try {
                let baseUrl = String(import.meta.env.VITE_API_BASE_URL);
                const response = await axios.get(`${baseUrl}/api/admin/users`);
                const { admins, users } = response.data;
                setAdminUsers(admins);
                setRegularUsers(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        fetchUsers();
    }, []);

    async function handleDelete(userId, isAdmin) {
        const confirmDelete = window.confirm(`Are you sure you want to delete this ${isAdmin ? 'admin' : 'user'}?`);
        if (!confirmDelete) return;

        try {
            let baseUrl = String(import.meta.env.VITE_API_BASE_URL);
            await axios.delete(`${baseUrl}/api/admin/users/${userId}`);
            if (isAdmin) {
                setAdminUsers((prev) => prev.filter((user) => user._id !== userId));
            } else {
                setRegularUsers((prev) => prev.filter((user) => user._id !== userId));
            }
            toast.success(`${isAdmin ? 'Admin' : 'User'} deleted successfully!`);
        } catch (error) {
            toast.error(`Error deleting ${isAdmin ? 'admin' : 'user'}:`, error);
        }
    }

    function openModal(user) {
        setCurrentUser(user);
        setUpdatedName(user.fullname);
        setUpdatedEmail(user.email);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setCurrentUser(null);
    }

    async function handleUpdate() {
        try {
            let baseUrl = String(import.meta.env.VITE_API_BASE_URL);
            const response = await axios.put(`${baseUrl}/api/admin/users/${currentUser._id}`, {
                fullname: updatedName,
                email: updatedEmail,
            });

            if (response.status === 200) {
                if (currentUser.role === 'admin') {
                    setAdminUsers((prev) =>
                        prev.map((user) =>
                            user._id === currentUser._id ? { ...user, fullname: updatedName, email: updatedEmail } : user
                        )
                    );
                } else {
                    setRegularUsers((prev) =>
                        prev.map((user) =>
                            user._id === currentUser._id ? { ...user, fullname: updatedName, email: updatedEmail } : user
                        )
                    );
                }
                
                closeModal();
                toast.success('updated successfully!');
            }
        } catch (error) {
            toast.error('Error updating user:', error);
        }
    }

    return (
        <motion.div className="p-6 bg-gray-100 min-h-screen"
        initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1 }}
            variants={{
              hidden: { opacity: 0, y: -100 },
              visible: { opacity: 1, y: 0 },
            }}
        >
            {/* <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">All Users</h1> */}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Update User"
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                <h2 className="text-xl font-bold mb-4">Update Details</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            <motion.div className="mb-10"
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1 }}
            variants={{
              hidden: { opacity: 0, y: -100 },
              visible: { opacity: 1, y: 0 },
            }}
            >
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Admins</h2>
                <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Profile Image</th>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Name</th>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Username</th>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Email</th>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminUsers.map((admin, index) => (
                            <tr key={admin._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100'}>
                                <td className="border border-gray-300 px-6 py-4">
                                    <img src={admin.profile_img} alt="Profile" className="w-12 h-12 rounded-full shadow-md" />
                                </td>
                                <td className="border border-gray-300 px-6 py-4 text-gray-700">{admin.fullname}</td>
                                <td className="border border-gray-300 px-6 py-4 text-gray-700">{admin.username}</td>
                                <td className="border border-gray-300 px-6 py-4 text-gray-700">{admin.email}</td>
                                <td className="border border-gray-300 px-6 py-4 text-gray-700">
                                    <button
                                        onClick={() => handleDelete(admin._id, true)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => openModal(admin)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2 }}
            variants={{
              hidden: { opacity: 0, y: -100 },
              visible: { opacity: 1, y: 0 },
            }}
            >
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Users</h2>
                <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Profile Image</th>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Name</th>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Username</th>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Email</th>
                            <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {regularUsers.map((user, index) => (
                            <tr key={user._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100'}>
                                <td className="border border-gray-300 px-6 py-4">
                                    <img src={user.profile_img} alt="Profile" className="w-12 h-12 rounded-full shadow-md" />
                                </td>
                                <td className="border border-gray-300 px-6 py-4 text-gray-700">{user.fullname}</td>
                                <td className="border border-gray-300 px-6 py-4 text-gray-700">{user.username}</td>
                                <td className="border border-gray-300 px-6 py-4 text-gray-700">{user.email}</td>
                                <td className="border border-gray-300 px-6 py-4 text-gray-700">
                                    <button
                                        onClick={() => handleDelete(user._id, false)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => openModal(user)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    );
}