// models/Exam.js
import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },              // quizTitle
  description: { type: String },                        // quizDescription
  icon: { type: String },                               // optional, storing icon as string (faCode etc.)
  totalQuizAttemptsAllowed: { type: Number, default: 1 }, // from quizzesData
  quizDuration: { type: Number, required: true },        // in minutes
  quizQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'question' }], // array of question references

  //for analytics
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // admin reference
totalAttempts: { type: Number, default: 0 },
averageScore: { type: Number, default: 0 },


}, { timestamps: true });

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'exam', required: true },
  mainQuestion: { type: String, required: true },
  choices: [{ type: String, required: true }],          // array of choices
  correctAnswer: { type: Number, enum: [0, 1, 2, 3], required: true }, // index
  statistics: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    incorrectAttempts: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const Exam = mongoose.model('exam', examSchema);
export const Question = mongoose.model('question', questionSchema);

//module.exports = { Exam, Question };
//export default { Exam, Question };
