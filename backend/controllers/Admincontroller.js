import express from "express";
import mongoose from "mongoose";

import User from "../models/user.model.js"
import { Exam } from "../models/exam.model.js"
import bryptjs from 'bcryptjs'
class AdminController {
    async getAllUsers(req, res) {
        try {
            const admins = await User.find({ role: 'admin' });
            const users = await User.find({ role: 'user' });

            res.status(200).json({ admins, users });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ message: 'Failed to fetch users' });
        }
    }
    async getAssignedStudents(req, res) {
        try {
            const { quizId } = req.query;

            if (!quizId) {
                return res.status(400).json({ message: 'Quiz ID is required' });
            }

            const assignedStudents = await User.find({
                'enrolledExams.examId': quizId
            }, 'username _id profile_img'); // Fetch only username and _id

            res.status(200).json({ assignedStudents });
        } catch (error) {
            console.error('Error fetching assigned students:', error);
            res.status(500).json({ message: 'Failed to fetch assigned students', error: error.message });
        }
    }

    async assignUserstoQuiz(req, res) {
        try {
            const { quizId, students } = req.body;

            if (!quizId || !students || !Array.isArray(students)) {
                return res.status(400).json({ message: 'Invalid request data' });
            }

            const examId = new mongoose.Types.ObjectId(quizId); // Corrected ObjectId instantiation

            // Update each student's enrolledExams
            await Promise.all(
                students.map(async (studentId) => {
                    await User.findByIdAndUpdate(
                        studentId,
                        {
                            $addToSet: {
                                enrolledExams: { examId },
                            },
                        },
                        { new: true }
                    );
                })
            );

            res.status(200).json({ message: 'Students successfully assigned to the quiz' });
        } catch (error) {
            console.error('Error assigning students to quiz:', error);
            res.status(500).json({ message: 'Failed to assign students to the quiz', error: error.message });
        }
    }
    async assignQuiztoStudents(req, res) {
        try {
            const { quizId, studentId } = req.body;

            if (!quizId || !students) {
                return res.status(400).json({ message: 'Invalid request data' });
            }

            const examId = new mongoose.Types.ObjectId(quizId); // Corrected ObjectId instantiation

            // Update each student's enrolledExams
           
                    await User.findByIdAndUpdate(
                        studentId,
                        {
                            $addToSet: {
                                enrolledExams: { examId },
                            },
                        },
                        { new: true }
                    );
               
            

            res.status(200).json({ message: 'Students successfully assigned to the quiz' });
        } catch (error) {
            console.error('Error assigning students to quiz:', error);
            res.status(500).json({ message: 'Failed to assign students to the quiz', error: error.message });
        }

    }

    async unassignQuizfromStudent(req, res) {
        try {
            const { quizId, studentId } = req.body;
    
            if (!quizId || !studentId) {
                return res.status(400).json({ message: 'Invalid request data' });
            }
    
            const examId = new mongoose.Types.ObjectId(quizId);
    
            // Remove the exam from the student's enrolledExams array
            await User.findByIdAndUpdate(
                studentId,
                {
                    $pull: {
                        enrolledExams: { examId },
                    },
                },
                { new: true }
            );
    
            res.status(200).json({ message: 'Quiz successfully unassigned from the student' });
        } catch (error) {
            console.error('Error unassigning quiz from student:', error);
            res.status(500).json({
                message: 'Failed to unassign quiz from the student',
                error: error.message,
            });
        }
    }
    
    async assignQuiztoStudent(req, res) {
        try {
            const { quizId, studentId, quizAttemptsLeft } = req.body;

            if (!quizId || !studentId) {
                return res.status(400).json({ message: 'Quiz ID and Student ID are required' });
            }

            // Add the student to the assigned list for the quiz
            // const result = await AssignedStudents.findOneAndUpdate(
            //     { quizId },
            //     { $addToSet: { students: studentId } },
            //     { upsert: true, new: true }
            // );
            //enrolledExams.quizAttemptsLeft:parseInt(quizAttemptsLeft)
            const examId = new mongoose.Types.ObjectId(quizId);
            const result = await User.findByIdAndUpdate(
                studentId,
                {
                    $addToSet: {
                        enrolledExams: { examId, quizAttemptsLeft: parseInt(quizAttemptsLeft) },                        
                    },
                },
                { new: true }
            );




            res.status(200).json({ message: 'Student successfully assigned to the quiz', result });
        } catch (error) {
            console.error('Error assigning quiz to student:', error);
            res.status(500).json({ message: 'Failed to assign quiz to student', error: error.message });
        }
    }

    async unassignQuizfromStudent(req, res) {
        try {
            const { quizId, studentId } = req.body;

            if (!quizId || !studentId) {
                return res.status(400).json({ message: 'Quiz ID and Student ID are required' });
            }

            // Remove the student from the assigned list for the quiz
            const examId = new mongoose.Types.ObjectId(quizId);
            const result = await User.findByIdAndUpdate(
                studentId,
                {
                    $pull: {
                        enrolledExams: { examId },
                    },
                },
                { new: true }
            );
            

            res.status(200).json({ message: 'Student successfully unassigned from the quiz', result });
        } catch (error) {
            console.error('Error unassigning quiz from student:', error);
            res.status(500).json({ message: 'Failed to unassign quiz from student', error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByIdAndDelete(id);
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { fullname, email,password,profile_img } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            let updateObj = {}
            if(profile_img){
                updateObj.profile_img = profile_img
            }

            if(password){
                const hashPassword = bryptjs.hashSync(password)
                updateObj.password = hashPassword
            }

            if(fullname){
                updateObj.fullname = fullname
            }

            if(email){
                updateObj.email = email
            }

    
            const user = await User.findByIdAndUpdate(
                id,
                updateObj,
                { new: true }
            );
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            res.status(200).json({ message: 'User updated successfully', user });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new AdminController();