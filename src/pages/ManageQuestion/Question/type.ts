export type answerype = {
  answer_type: number;
};
export type answerOneRightType = {
  id: string;
  _id?: string;
  answer_content: string;
  answer_url_image: string;
  answer_url_mp3?: string;
  is_true: boolean;
};
export type answerMultiRightType = {
  id: string;
  answer_content: string;
  answer_url_image: string;
  answer_url_mp3?: string;
  is_true: boolean;
};
export type shortAnswerType = {
  id: string;
  keyword: string;
};
export type pairAnswerType = {
  id: string;
  value1: string;
  value2: string;
  image1: string;
  image2: string;
};
export type subjectType = {
  label: string;
  value: string;
};
