export interface CreateStaticTestType {
  openStaticPopup: boolean;
  setOpenStaticPopup: (opened: boolean) => void;
  handleChangeListQuestion: (listQuestion: any[]) => void;
  handleCountQuestion: (countPoint: CountPoint) => void;
  className?: string;
  handleChangeScore: (data: any[]) => void;
}

export type CreateDynamicTestProps = {
  openDynamicPopup: boolean;
  setOpenDynamicPopup: (opened: boolean) => void;
  handleChangeListQuestion: (listQuestion: any) => void;
  handleCountQuestion: (countPoint: CountPoint) => void;
  className?: string;
};
export interface FormType {
  idClass: string[];
  idSubject: string;
  quiz_type: string;
  format: string;
  awareness_level: string;
  level: string;
  idTag: [];
}
export interface CountQuestionType {
  Essay: number;
  Sort: number;
  YesNo: number;
  Pair: number;
  Reading: number;
  ShortAnswer: number;
  MultiChoiceOneRight: number;
  MultiChoiceMultiRight: number;
  FillBlank: number;
}

export interface CountPoint {
  totalQuestion: number;
  totalPointSelected: number;
}
export type QuestionFormType = {
  listClass: string[];
  listSubject: string[];
  listTag: [];
  name: string;
  testFormat: number;
  testType: number;
  listQuestion: [];
  listConditions: [];
  maxMark: number;
  awarenessLevel: string;
};
export type ConditionFormType = {
  timeStart: string;
  timeEnd: string;
  timeAllow: number;
  maxNumAttempt: number;
  sort: number;
  // guide: string;
  isPauseAllow: boolean;
  minusWhenWrong: boolean;
  isQuickTest: boolean;
  active: boolean;
  minQuestionSubmit: number;
  resultReturnType: number;
  gradingSingleQuestionType: number;
  isChangeScore: boolean;
};
