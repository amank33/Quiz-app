// models/Submission.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'exam', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'question' },
      answer: { type: Number, enum: [0, 1, 2, 3] }, // selected option index
      answeredResult: { type: Number, enum: [-1, 0, 1], default: -1 } // -1: Not answered, 0: Incorrect, 1: Correct
    }
  ],
  score: { type: Number, default: 0 },
  totalCorrect: { type: Number, default: 0 },
  totalIncorrect: { type: Number, default: 0 },
  timeTaken: { type: String },
  timeTakenSeconds: { type: Number }
}, { timestamps: true });

const Submission= mongoose.model('submission', submissionSchema);


export default Submission