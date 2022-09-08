import Loading from 'components/Loading';
import { questionEnumType } from 'enum';
import { lazy, Suspense } from 'react';

const FillBlank = lazy(() => import('./FillBlank'));
const MultiChoiceMultiRight = lazy(() => import('./MultiChoiceMultiRight'));
const MultiChoiceOneRight = lazy(() => import('./MultiChoiceOneRight'));
const Pair = lazy(() => import('./Pair'));
const Reading = lazy(() => import('./Reading'));
const Sort = lazy(() => import('./Sort'));
const ShortAnswer = lazy(() => import('./ShortAnswer'));
const YesNoAnswer = lazy(() => import('./YesNoAnswer'));

const QuestionCreateType = (props: any) => {
  const { quiz_type, handleQuestionData, data, handleAnswer, inputAnswer } = props;

  const switchQuestionType = (quiz_type: questionEnumType) => {
    switch (Number(quiz_type)) {
      case questionEnumType.ESSAY:
        return <></>;
      case questionEnumType.ONE_RIGHT:
        return (
          <MultiChoiceOneRight
            handleQuestionData={handleQuestionData}
            data={data}
            handleAnswer={handleAnswer}
            inputAnswer={inputAnswer}
          />
        );
      case questionEnumType.MULTIPLE_RIGHT:
        return (
          <MultiChoiceMultiRight
            handleQuestionData={handleQuestionData}
            data={data}
            handleAnswer={handleAnswer}
            inputAnswer={inputAnswer}
          />
        );
      case questionEnumType.YES_NO:
        return <YesNoAnswer handleQuestionData={handleQuestionData} data={data} />;
      case questionEnumType.SHORT:
        return <ShortAnswer handleQuestionData={handleQuestionData} data={data} />;
      case questionEnumType.PAIR:
        return <Pair handleQuestionData={handleQuestionData} data={data} />;
      case questionEnumType.READING:
        return <Reading handleQuestionData={handleQuestionData} data={data} />;
      case questionEnumType.FILL_BLANK:
        return <FillBlank handleQuestionData={handleQuestionData} data={data} />;
      case questionEnumType.SORT:
        return <Sort handleQuestionData={handleQuestionData} data={data} />;
      default:
        return <></>;
    }
  };
  return <Suspense fallback={<Loading />}>{switchQuestionType(quiz_type)}</Suspense>;
};

export default QuestionCreateType;
