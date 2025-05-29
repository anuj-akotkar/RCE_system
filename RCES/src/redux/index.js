import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import catalogReducer from "../slices/catalogSlice";
import contestDetailReducer from "../slices/contestDetailsSlice";
import codeReducer from "../slices/codeSlice";
import contactReducer from "../slices/contactSlice";
import contestProgressReducer from "../slices/contestProgressSlice";
import contestReducer from "../slices/contestSlice";
import feedbackReducer from "../slices/feedbackSlice";
import questionReducer from "../slices/questionSlice";
import submissionReducer from "../slices/submissionSlice";
import userProfileReducer from "../slices/userProfileSlice";
import adminReducer from "../slices/adminSlice";
import leaderboardReducer from "../slices/leaderboardSlice";
import notificationReducer from "../slices/notificationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  catalog: catalogReducer,
  contestDetail: contestDetailReducer,
  code: codeReducer,
  contact: contactReducer,
  contestProgress: contestProgressReducer,
  contest:contestReducer,
  feedback: feedbackReducer,
  question: questionReducer,
  submission: submissionReducer,
  userProfile: userProfileReducer,
  admin: adminReducer,
  leaderboard: leaderboardReducer,
  notification: notificationReducer,
});

export default rootReducer;