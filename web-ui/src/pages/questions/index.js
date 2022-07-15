// material-ui
import { Typography, Grid, CardContent, Stack, Rating } from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import StarBorderTwoToneIcon from '@mui/icons-material/StarBorderTwoTone';
import RateReviewTwoToneIcon from '@mui/icons-material/RateReviewTwoTone';

import Link from 'next/link';

// ==============================|| QUESTION PAGE ||============================== //
import { useAPI } from 'hooks/useAPI';
import useAuth from 'hooks/useAuth';
import { FormattedMessage } from 'react-intl';
import Post from 'components/ui-component/cards/Post';
import FormControl from 'components/ui-component/extended/Form/FormControl';
import Avatar from 'components/ui-component/extended/Avatar';

import { useSnackbar } from 'notistack';
import { useEvents } from 'hooks/useEvents';

function postQuestion(content) {
  const json = JSON.stringify({
    content
  });

  relayone
    .send({
      opReturn: ['onchain', '1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN', 'question', json],
      currency: 'USD',
      amount: 0.01,
      to: '1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN'
    })
    .then(console.log)
    .catch(console.error);
}

const QuestionPage = () => {
  window.postQuestion = postQuestion;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function onQuestion(question) {
    console.log('on question', question);
    enqueueSnackbar(`new question: ${question.content}`);
  }

  const events = useEvents(`questions`, onQuestion);

  window.events = events;

  const { user } = useAuth();
  let { data, error, refresh, loading } = useAPI('/questions');

  console.log({ data, error, refresh, loading });

  if (error) {
    console.log('ERROR', error);
    return <p>Error</p>;
  }

  if (loading && !data) {
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  }

  const { questions } = data;

  return (
    <MainCard title={<FormattedMessage id="questions-pow" />}>
      <FormControl submit={postQuestion} placeholder="Ask Bitcoin a question" />
      <Stack direction="column" justifyContent="flex-end">
        {questions.map((question) => {
          return <Post key={question.id} post={question} />;
        })}
      </Stack>
    </MainCard>
  );
};

QuestionPage.Layout = 'authGuard';
export default QuestionPage;
