import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contest: [],
  loading: false,
  error: null,
  step: 1,
  // Fields for contest creation
  title: "",
  description: "",
  duration: "",
  thumbnail: "",
  questions: [],
  editContest: false, // <-- Add this line
  // Add more fields as needed (e.g., startDate, endDate, etc.)
};

const contestSlice = createSlice({
  name: "contest",
  initialState,
  reducers: {
    setContest(state, action) {
      state.contest = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setStep(state, action) {
      state.step = action.payload;
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    setDescription(state, action) {
      state.description = action.payload;
    },
    setthumbnail(state, action) {
      state.thumbnail = action.payload;
    },
    setDuration(state, action) {
      state.duration = action.payload;
    },
    setQuestions(state, action) {
      state.questions = action.payload;
    },
    addQuestion(state, action) {
      state.questions.push(action.payload);
    },
    updateQuestion(state, action) {
      const { index, question } = action.payload;
      if (state.questions[index]) {
        state.questions[index] = question;
      }
    },
    deleteQuestion(state, action) {
      state.questions.splice(action.payload, 1);
    },
    setEditContest(state, action) { // <-- Add this reducer
      state.editContest = action.payload;
    },
    resetContestState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setContest,
  setLoading,
  setError,
  setStep,
  setTitle,
  setDescription,
  setDuration,
  setthumbnail,
  setQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setEditContest, // <-- Export it here
  resetContestState,
} = contestSlice.actions;

export default contestSlice.reducer;