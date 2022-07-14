// material-ui
import { Typography, Grid, CardContent, Stack, Rating } from '@mui/material';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import StarBorderTwoToneIcon from '@mui/icons-material/StarBorderTwoTone';
import RateReviewTwoToneIcon from '@mui/icons-material/RateReviewTwoTone';

import Link from 'next/link';

// ==============================|| ANSWER PAGE ||============================== //
import { useAPI } from 'hooks/useAPI';
import { FormattedMessage } from 'react-intl';
import Post from 'components/ui-component/cards/Post';

const AnswersPage = () => {
  let { data, error, refresh, loading } = useAPI('/answers');

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

  const { answers } = data;

  console.log({ answers });

  return (
    <MainCard title={<FormattedMessage id="answers-pow" />}>
      <Stack direction="column" justifyContent="flex-end">
        {answers.map((answer) => {
          return <Post key={answer.tx_id} answer post={answer} />;
        })}
      </Stack>
    </MainCard>
  );
};

AnswersPage.Layout = 'authGuard';
export default AnswersPage;