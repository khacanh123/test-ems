import { questionEnumType } from 'enum';

export const haveAnswerRight = (typeQuestion: number, answerList: any) => {
  let count = 0;
  if (typeQuestion === (questionEnumType.ONE_RIGHT || questionEnumType.MULTIPLE_RIGHT)) {
    answerList.listSelectOptions.map((answer: any) => {
      if (answer.is_true) {
        count++;
      }
    });
    if (count > 0) {
      return true;
    } else return false;
  }
  if (typeQuestion === questionEnumType.SHORT) {
    answerList.listShortAnswer.listKeyword.map((answer: any) => {
      count++;
    });
    if (count > 0) {
      return true;
    } else return false;
  }
  if (typeQuestion === questionEnumType.READING) {
    const checkAnswer: any[] = [];

    answerList.listQuestionChildren.map((children: any) => {
      // 1 đáp án, nhiều đáp án, yes/no
      if (children.quiz_type === 1 || children.quiz_type === 2 || children.quiz_type === 3) {
        const filter = children.listSelectOptions.filter((i: any) => i.is_true === true);
        if (filter.length === 0) {
          checkAnswer.push(false);
        } else {
          checkAnswer.push(true);
        }
      } else {
        const filter =
          children.listShortAnswer != null ? children.listShortAnswer.listKeyword.length : 0;
        if (filter === 0) {
          checkAnswer.push(false);
        } else {
          checkAnswer.push(true);
        }
      }
    });
    const check = checkAnswer.filter((i: any) => i === false);
    if (check.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};
export const checkAllAnswerQuestion = (questionList: any) => {
  let countAnswerTrue = 0;
  let countQuestion = 0;
  let result = true;
  let totalQuesChildren = 0;

  // true là có câu không có đáp án đúng nào, false là tất cả các câu đều có đáp án đúng
  questionList.map((question: any) => {
    if (question.quiz_type === (questionEnumType.ONE_RIGHT || questionEnumType.MULTIPLE_RIGHT)) {
      question.listSelectOptions.map((answer: any) => {
        if (answer.is_true) {
          countAnswerTrue++;
        }
      });
      if (countAnswerTrue >= 1) {
        countQuestion++;
      }
    }
    if (question.quiz_type === questionEnumType.SHORT) {
      if (question.listShortAnswer.listKeyword.length > 0) {
        countQuestion++;
      }
    }
    if (question.quiz_type === questionEnumType.READING) {
      totalQuesChildren = question.listQuestionChildren.length;
      question.listQuestionChildren.map((item: any) => {
        if (
          item.quiz_type ===
          (questionEnumType.ONE_RIGHT || questionEnumType.MULTIPLE_RIGHT || questionEnumType.YES_NO)
        ) {
          item.listSelectOptions.map((answer: any) => {
            if (answer.is_true) {
              countAnswerTrue++;
            }
          });
          if (countAnswerTrue >= 1) {
            countQuestion++;
          }
        }
        if (item.quiz_type === questionEnumType.SHORT) {
          if (item.listShortAnswer.listKeyword.length > 0) {
            countQuestion++;
          }
        }
      });
      if (countQuestion >= totalQuesChildren) {
        result = false;
      }
      return result;
    }
  });
  if (countQuestion >= questionList.length) {
    result = false;
  }
  return result;
};

export const getLengthListKeyWordMax = (question: any) => {
  let lengthMax = 0;
  let lengthPre = 0;
  question.map((item: any, index: number) => {
    if (index === 0) {
      lengthMax = item.listShortAnswer.listKeyword.length;
      lengthPre = item.listShortAnswer.listKeyword.length;
    } else {
      if (item.listShortAnswer.listKeyword.length > lengthPre) {
        lengthMax = item.listShortAnswer.listKeyword.length;
        lengthPre = item.listShortAnswer.listKeyword.length;
      }
    }
  });
  return lengthMax;
};
