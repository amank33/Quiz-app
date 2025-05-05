import { Exam, Question } from "../models/exam.model.js"
import Submission from "../models/submission.model.js"
import mongoose from "mongoose";
import User from "../models/user.model.js";
const { ObjectId } = mongoose.Types;

class ExamController {
  async createNewExam(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { title, description, icon, totalQuizAttemptsAllowed, quizDuration, quizQuestions, createdBy } = req.body;
      //const user = req.userAuth.user; // Get user from auth middleware

      // Create the exam first with createdBy field
      const newExam = new Exam({
        title,
        description,
        icon,
        totalQuizAttemptsAllowed,
        quizDuration,
        createdBy: createdBy // Add the user ID as createdBy
      });

      const savedExam = await newExam.save({ session });

      // Create and save all questions with reference to the exam
      const questionPromises = quizQuestions.map(q => {
        const question = new Question({
          examId: savedExam._id,
          mainQuestion: q.mainQuestion,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          statistics: q.statistics
        });
        return question.save({ session });
      });

      const savedQuestions = await Promise.all(questionPromises);
      
      // Update exam with question references
      savedExam.quizQuestions = savedQuestions.map(q => q._id);
      await savedExam.save({ session });

      await session.commitTransaction();

      // Return the complete exam with populated questions and creator info
      const completeExam = await Exam.findById(savedExam._id)
        .populate('quizQuestions')
        .populate('createdBy', 'username email profile_img'); // Only select needed user fields

      res.status(200).json({
        status: true,
        message: "New exam created successfully.",
        data: completeExam
      });

    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        status: false,
        message: error.message
      });
    } finally {
      session.endSession();
    }
  }

  async getAllExams(req, res) {
    try {
      // const exams = await Exam.find({})
      //   .populate("quizQuestions")
      //   .populate('createdBy', 'username email profile_img');

        const exams = await Exam.aggregate([
          {
            $lookup: {
          from: "questions", 
          localField: "quizQuestions",
          foreignField: "_id",
          as: "quizQuestions"
            }
          },
          {
            $lookup: {
          from: "users", 
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy"
            }
          },
          {
            $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true // In case createdBy is null
            }
          },
          {
            $project: {
          "createdBy.password": 0, // Exclude sensitive fields
          "createdBy.__v": 0
            }
          }
        ]);
      
      res.status(200).json({
        status: true,
        message: "All exams fetched successfully.",
        data: exams
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      })
    }
  }

  async getExamById(req, res) {
    try {
      const exam = await Exam.findById(req.params.id)
        .populate("quizQuestions")
        .populate('createdBy', 'username email profile_img');
        
      if (!exam) {
        return res.status(404).json({
          status: false,
          message: "Exam not found"
        })
      }
      res.status(200).json({
        status: true,
        message: "Exam fetched successfully.",
        data: exam
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      })
    }
  }

  async updateExam(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { title, description, icon, totalQuizAttemptsAllowed, quizDuration, quizQuestions } = req.body;
      
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({
          status: false,
          message: "Exam not found"
        });
      }

      //updating the user quizAteemptsLeft field if quizattemptsallowed is modifeid
      let prevquizAttemptsLeft = exam.totalQuizAttemptsAllowed;
      if(prevquizAttemptsLeft !== totalQuizAttemptsAllowed) {
        const users = await User.find({ "enrolledExams.examId": exam._id });
        for(const user of users) {
          const enrolledExams = user.enrolledExams;
          for(const enrolledExam of enrolledExams) {
            if(enrolledExam.examId.toString() === exam._id.toString()) {
              let update=totalQuizAttemptsAllowed-enrolledExam.totalAttempts;
              enrolledExam.quizAttemptsLeft = update<0?0:update;
              //enrolledExam.quizAttemptsLeft = totalQuizAttemptsAllowed-enrolledExam.totalAttempts;
            }
          }
          await user.save({ session });
        }
      }

      // Update exam fields but preserve createdBy
      exam.title = title;
      exam.description = description;
      exam.icon = icon;
      exam.totalQuizAttemptsAllowed = totalQuizAttemptsAllowed;
      exam.quizDuration = quizDuration;

      // Delete existing questions
      await Question.deleteMany({ examId: exam._id }, { session });

      // Create new questions
      const questionPromises = quizQuestions.map(q => {
        const question = new Question({
          examId: exam._id,
          mainQuestion: q.mainQuestion,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          statistics: q.statistics
        });
        return question.save({ session });
      });

      const savedQuestions = await Promise.all(questionPromises);
      exam.quizQuestions = savedQuestions.map(q => q._id);
      
      await exam.save({ session });
      await session.commitTransaction();

      // Return updated exam with populated questions and creator info
      const updatedExam = await Exam.findById(exam._id)
        .populate('quizQuestions')
        .populate('createdBy', 'username email profile_img');

      res.status(200).json({
        status: true,
        message: "Exam updated successfully.",
        data: updatedExam
      });

    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        status: false,
        message: error.message
      });
    } finally {
      session.endSession();
    }
  }
  async updateExam2(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { title, description, icon, totalQuizAttemptsAllowed, quizDuration, quizQuestions } = req.body;
      
      const exam = await Exam.findById(req.params.id);
      if (!exam) {
        return res.status(404).json({
          status: false,
          message: "Exam not found"
        });
      }
      

      //updating the user quizAteemptsLeft field if quizattemptsallowed is modifeid
      let prevquizAttemptsLeft = exam.totalQuizAttemptsAllowed;
      // res.status(200).json({
      //   status: true,
      //   message: "Exam updated successfully.",
      //   prevquizAttemptsLeft: prevquizAttemptsLeft,
      //   newquizAttemptsLeft: totalQuizAttemptsAllowed

      // });
      if(prevquizAttemptsLeft !== totalQuizAttemptsAllowed) {
        const users = await User.find({ "enrolledExams.examId": exam._id });
        
        for(const user of users) {
          const enrolledExams = user.enrolledExams;
          for(const enrolledExam of enrolledExams) {
            // res.status(200).json({
            //   status: true,
            //   message: "Exam updated successfully.",
            //   exam: exam._id,
            //   enrolledExam: enrolledExam.examId,       
      
            // });
            
            if(enrolledExam.examId.toString() === exam._id.toString()) {
              res.status(200).json({
                status: true,
                message: "Exam updated successfully.",
                enrolledExamquizAttemptsLeft: enrolledExam.quizAttemptsLeft,
                updatingthis:totalQuizAttemptsAllowed-enrolledExam.totalAttempts,        
        
              });
              let update=totalQuizAttemptsAllowed-enrolledExam.totalAttempts;
              enrolledExam.quizAttemptsLeft = update<0?0:update; //totalQuizAttemptsAllowed-enrolledExam.totalAttempts;
            }
          }
          let updatedUser = await user.save({ session });
          
        }
      }
      

      // Update exam fields but preserve createdBy
      exam.title = title;
      exam.description = description;
      exam.icon = icon;
      exam.totalQuizAttemptsAllowed = totalQuizAttemptsAllowed;
      exam.quizDuration = quizDuration;

      // // Delete existing questions
      // await Question.deleteMany({ examId: exam._id }, { session });

      // // Create new questions
      // const questionPromises = quizQuestions.map(q => {
      //   const question = new Question({
      //     examId: exam._id,
      //     mainQuestion: q.mainQuestion,
      //     choices: q.choices,
      //     correctAnswer: q.correctAnswer,
      //     statistics: q.statistics
      //   });
      //   return question.save({ session });
      // });

      // const savedQuestions = await Promise.all(questionPromises);
      // exam.quizQuestions = savedQuestions.map(q => q._id);
      
      //await exam.save({ session });
      await session.commitTransaction();

      // Return updated exam with populated questions and creator info
      // const updatedExam = await Exam.findById(exam._id)
      //   .populate('quizQuestions')
      //   .populate('createdBy', 'username email profile_img');

      // res.status(200).json({
      //   status: true,
      //   message: "Exam updated successfully.",
      //   data: updatedExam
      // });

    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        status: false,
        message: error.message
      });
    } finally {
      session.endSession();
    }
  }


  async deleteExam(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      // Find the exam to delete
      const exam = await Exam.findById(id);
      if (!exam) {
        return res.status(404).json({
          status: false,
          message: "Exam not found",
        });
      }

      // Delete associated questions
      await Question.deleteMany({ examId: id }, { session });

      // Delete associated submissions
      await Submission.deleteMany({ examId: id }, { session });

      // Delete associated user statistics (if any)
      const users = await User.find({ "enrolledExams.examId": id }).session(session);
      await Promise.all(users.map(async (user) => {
        user.enrolledExams = user.enrolledExams.filter(exam => exam.examId.toString() !== id.toString());
        //user.totalExamsGiven = (user.totalExamsGiven || 0) - 1; // Decrease total exams given
        await user.save({ session });
      }));

      // Delete the exam
      await Exam.findByIdAndDelete(id, { session });

      await session.commitTransaction();

      res.status(200).json({
        status: true,
        message: "Exam and associated questions deleted successfully.",
      });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        status: false,
        message: error.message,
      });
    } finally {
      session.endSession();
    }
  }

  async submitQuiz(req, res) {
    // return res.status(200).json({
    //   status: true,
    //   message: "Quiz submission inside successfully.",
    // });
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { studentId, examId, answers, score, totalCorrect, totalIncorrect, timeTaken,timeTakenSeconds } = req.body;

      // Save submission to the Submission model
      const newSubmission = new Submission({
        studentId,
        examId,
        answers,
        score,
        totalCorrect,
        totalIncorrect,
        timeTaken,
        timeTakenSeconds
      });
      await newSubmission.save({ session });

      // Update user statistics in the User model
      const user = await User.findById(studentId).session(session);
      if (!user) {
        throw new Error("User not found");
      }
      const enrolledExam = user.enrolledExams.find(exam => exam.examId.toString() === examId);
      if (!enrolledExam) {
        throw new Error("Enrolled exam not found for user");
      }
      enrolledExam.totalAttempts += 1;
      enrolledExam.score = enrolledExam.score+score; // Update the score for the exam
      enrolledExam.quizAttemptsLeft -= 1; // Decrease attempts left
      if (enrolledExam.quizAttemptsLeft < 0) {
        enrolledExam.quizAttemptsLeft = 0; // Ensure it doesn't go negative
      }
      user.totalExamsGiven = (user.totalExamsGiven || 0) + 1;
      user.totalCorrectAnswers = (user.totalCorrectAnswers || 0) + totalCorrect;
      user.totalIncorrectAnswers = (user.totalIncorrectAnswers || 0) + totalIncorrect;
      user.lastSubmissionDate = new Date();

      await user.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        status: true,
        message: "Quiz submission saved successfully.",
      });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        status: false,
        message: error.message,
      });
    } finally {
      session.endSession();
    }
  }
}

export default new ExamController()