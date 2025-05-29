import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
  currentQuestion: null,
  loading: false,
  error: null,
  success: false,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestions(state, action) {
      state.questions = action.payload;
    },
    setCurrentQuestion(state, action) {
      state.currentQuestion = action.payload;
    },
    addQuestion(state, action) {
      state.questions.push(action.payload);
      state.success = true;
    },
    updateQuestion(state, action) {
      const updated = action.payload;
      state.questions = state.questions.map(q =>
        q._id === updated._id ? updated : q
      );
      state.success = true;
    },
    deleteQuestion(state, action) {
      state.questions = state.questions.filter(q => q._id !== action.payload);
      state.success = true;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSuccess(state, action) {
      state.success = action.payload;
    },
    clearQuestionStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  setQuestions,
  setCurrentQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setLoading,
  setError,
  setSuccess,
  clearQuestionStatus,
} = questionSlice.actions;

export default questionSlice.reducer;