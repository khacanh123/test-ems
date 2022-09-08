import { RootStateOrAny } from 'react-redux';

export const UserData = (state: RootStateOrAny) => state.auth.dataUser;
export const Userinfo = (state: RootStateOrAny) => state.auth.userInfo;
export const QuestionImport = (state: RootStateOrAny) => state.question.questionImport;
export const QuestionPreview = (state: RootStateOrAny) => state.question.questionPreview;
export const QuestionEdit = (state: RootStateOrAny) => state.question.questionEdit;
export const TestEdit = (state: RootStateOrAny) => state.test.testEdit;
export const Constant = (state: RootStateOrAny) => state.constant.constant;
export const storeQuestion = (state: RootStateOrAny) => state.test.listQuestion;
