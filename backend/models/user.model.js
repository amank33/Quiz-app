import mongoose from "mongoose";
let profile_imgs_name_list = [
    "Garfield",
    "Tinkerbell",
    "Annie",
    "Loki",
    "Cleo",
    "Angel",
    "Bob",
    "Mia",
    "Coco",
    "Gracie",
    "Bear",
    "Bella",
    "Abby",
    "Harley",
    "Cali",
    "Leo",
    "Luna",
    "Jack",
    "Felix",
    "Kiki",
  ];
  let profile_imgs_collections_list = [
    "notionists-neutral",
    "adventurer-neutral",
    "fun-emoji",
  ];
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      lowercase: true,
    //   required: true,
      minlength: [3, "fullname must be 3 letters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
        type: String,
        required: true,
      },
    username: {
      type: String,
      minlength: [3, "Username must be 3 letters long"],
      unique: true,
    },
    // bio: {
    //   type: String,
    //   maxlength: [200, "Bio should not be more than 200"],
    //   default: "",
    // },
    profile_img: {
      type: String,
      default: () => {
        return `https://api.dicebear.com/6.x/${
          profile_imgs_collections_list[
            Math.floor(Math.random() * profile_imgs_collections_list.length)
          ]
        }/svg?seed=${
          profile_imgs_name_list[
            Math.floor(Math.random() * profile_imgs_name_list.length)
          ]
        }`;
      },
    },
    role:{
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    enrolledExams: [
      {
        examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
        quizAttemptsLeft: { type: Number, default: 1 }, // based on totalQuizAttemptsAllowed
        totalAttempts: { type: Number, default: 0 },        
        score: { type: Number, default: 0 }
      }
    ],

    //added for analytics
    lastSubmissionDate: { type: Date }, // when user last gave an exam
totalCorrectAnswers: { type: Number, default: 0 },
totalIncorrectAnswers: { type: Number, default: 0 },
totalExamsGiven: { type: Number, default: 0 },

  },
  { timestamps: true }
);

const User = mongoose.model('user', userSchema)

export default User