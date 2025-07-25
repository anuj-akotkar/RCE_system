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
  startTime: "",
  endTime: "",
  thumbnail: "",
  questions: [],
  editContest: false,
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
    setStartTime(state, action) {
      state.startTime = action.payload;
    },
    setEndTime(state, action) {
      state.endTime = action.payload;
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
    setEditContest(state, action) {
      state.editContest = action.payload;
    },
    resetContestState(state) {
      Object.assign(state, initialState);
    },
    // Load contest data for editing
    loadContestForEdit(state, action) {
      const contest = action.payload;
      state.title = contest.title || "";
      state.description = contest.description || "";
      state.duration = contest.timeLimit || "";
      state.startTime = contest.startTime ? new Date(contest.startTime).toISOString().slice(0, 16) : "";
      state.endTime = contest.endTime ? new Date(contest.endTime).toISOString().slice(0, 16) : "";
      state.thumbnail = contest.thumbnail || "";
      state.questions = contest.questions || [];
      state.editContest = true;
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
  setStartTime,
  setEndTime,
  setthumbnail,
  setQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setEditContest,
  resetContestState,
  loadContestForEdit,
} = contestSlice.actions;

export default contestSlice.reducer;