import { Exam, Question } from "../models/exam.model.js"
import Submission from "../models/submission.model.js"
import mongoose from "mongoose";
import User from "../models/user.model.js";
const { ObjectId } = mongoose.Types;

class AnalyticsController {
  async getUserAnalytics(req, res) {
    try {
        const {id}=req.params;
      // Fetch all submissions
      const submissions = await Submission.find({studentId:id}).populate('studentId')
      .populate('examId', 'title description quizDuration');

      // Calculate score per exam
      const scorePerExam = submissions.map(submission => ({
        examName: submission.examId.title,
        examId: submission.examId._id,
        score: submission.score,
        date: submission.createdAt.toISOString().split('T')[0],
      }));


      // Calculate total exams given over time
      const totalExamsGivenOverTime = submissions.reduce((acc, submission) => {
        const date = submission.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

       const totalExamsGivenOverTimeArray = Object.entries(totalExamsGivenOverTime).map(([date, count]) => ({ date, count }));

      // Calculate correct vs incorrect ratio
      const correctIncorrectRatio = submissions.reduce((acc, submission) => {
        acc.correct += submission.totalCorrect;
        acc.incorrect += submission.totalIncorrect;
        return acc;
      }, { correct: 0, incorrect: 0 });

      // Calculate time taken per exam
      const timeTakenPerExam = submissions.map(submission => ({
        examName: submission.examId.title,
        duration: submission.examId.quizDuration,
        time: submission.timeTaken,
        submissionId: submission._id,
        timeTakenSeconds: submission.timeTakenSeconds,
        date: submission.createdAt.toISOString().split('T')[0],
      }));

      // Calculate performance trend (last 5 scores)
      const performanceTrend = submissions.slice(-5).map(submission => submission);

      res.status(200).json({
        id:id,
        reqID:req.params.id,
        scorePerExam,
        totalExamsGivenOverTime: totalExamsGivenOverTimeArray,
        correctIncorrectRatio,
        timeTakenPerExam,
        performanceTrend,
        submissions:submissions
      });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTopPerformers(req, res) {
    try {
      // Fetch top 5 performers based on their average score
      const topPerformers = await Submission.aggregate([
        {
          $group: {
            _id: "$studentId",
            averageScore: { $avg: "$score" },
          },
        },
        {
          $sort: { averageScore: -1 },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $project: {
            _id: 0,
            username: "$userDetails.username",
            profile_img: "$userDetails.profile_img",
            averageScore: 1,
          },
        },
      ]);

      res.status(200).json(topPerformers);
    } catch (error) {
      console.error("Error fetching top performers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }



  async getAdminAnalytics(req, res) {
    try {
      // Fetch total exams created
      const examsCreated = await Exam.aggregate([
        {
          $group: {
        _id: "$createdBy", 
        totalExams: { $sum: 1 },
          },
        },
        {
          $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "adminDetails",
          },
        },
        {
          $unwind: "$adminDetails",
        },
        {
          $project: {
        _id: 0,
        adminName: "$adminDetails.username",
        adminProfileImg: "$adminDetails.profile_img",
        totalExams: 1,
          },
        },
      ]);

     

      // Fetch exam attempts over time
      const examAttemptsOverTime = await Submission.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            attempts: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])//.map(item => ({ date: item._id, attempts: item.attempts }));

      

      // Calculate average score per exam
      const averageScorePerExam = await Submission.aggregate([
        {
          $group: {
            _id: "$examId",
            averageScore: { $avg: "$score" },
          },
        },
        {
          $lookup: {
            from: "exams",
            localField: "_id",
            foreignField: "_id",
            as: "examDetails",
          },
        },
        {
          $unwind: "$examDetails",
        },
        {
          $project: {
            _id: 0,
            examName: "$examDetails.title",
            averageScore: 1,
          },
        },
      ]);

     

      // Fetch top exams by attempts
      const topExamsByAttempts = await Submission.aggregate([
        {
          $group: {
            _id: "$examId",
            attempts: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "exams",
            localField: "_id",
            foreignField: "_id",
            as: "examDetails",
          },
        },
        {
          $unwind: "$examDetails",
        },
        {
          $project: {
            _id: 0,
            examName: "$examDetails.title",
            attempts: 1,
          },
        },
        {
          $sort: { attempts: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      // res.status(200).json({
      //   examsCreated,
      //   examAttemptsOverTime,
      //   averageScorePerExam,
      //   topExamsByAttempts,
      // });

      // Calculate overall user performance
      const overallUserPerformance = await Submission.aggregate([
        {
          $group: {
            _id: "$studentId",
            correct: { $sum: "$totalCorrect" },
            incorrect: { $sum: "$totalIncorrect" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $match: { "userDetails.role": "user" }, // Assuming "role" field exists in user model
        },
        {
          $project: {
            _id: 1,
            username: "$userDetails.username",
            profile_img: "$userDetails.profile_img",
            correct: 1,
            incorrect: 1,
          },
        },
      ]);

      res.status(200).json({
        examsCreated,
        examAttemptsOverTime,
        averageScorePerExam,
        topExamsByAttempts,
        overallUserPerformance
      });
    } catch (error) {
      console.error("Error fetching admin analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new AnalyticsController()