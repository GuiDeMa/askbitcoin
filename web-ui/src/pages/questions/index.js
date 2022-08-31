import { useState } from 'react';
// material-ui
import { Typography, Grid, Button, CardContent, Stack, Rating } from '@mui/material';

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
import FormControlSelect from 'components/ui-component/extended/Form/FormControlSelect';

import { useRouter } from 'next/router';
import axios from 'utils/axios';

const QuestionPage = () => {
  const [queryParams, setQueryParams] = useState('');
  const { user, wallet, isLoggedIn } = useAuth();

  const router = useRouter();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  async function postQuestion(content) {
    if (!isLoggedIn) {
      enqueueSnackbar('Please, Log In', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        },
        variant: 'error'
      });
      return;
    }

    try {
      console.log('postQuestion', content);

      enqueueSnackbar(`Posting Question: ${content}`, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        },
        variant: 'info'
      });

      switch (wallet) {
        case 'relayx':
          let result = await relayone.send({
            opReturn: [
              'onchain',
              '1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN',
              'question',
              JSON.stringify({
                content
              })
            ],
            currency: 'USD',
            amount: 0.01,
            to: '1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN'
          });
          let { amount, currency, identity, paymail, rawTx, satoshis, txid } = result;
          console.log(result);

          let post = `I just answered an askbitcoin.ai question, find it here:
          https://askbitcoin.ai/answers${txid}`;

          enqueueSnackbar(`Question successfully posted}`, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            },
            variant: 'success',
            action: () => <Button href={`https://twetch.com/compose?text=${post}&draft=0`}>Twetchdat</Button>
          });

          /* (async () => {
            try {
              let { data: postTransactionResponse } = await axios.post('https://askbitcoin.ai/api/v1/transactions', {
                transaction: rawTx
              });

              console.log('postTransactionResponse', postTransactionResponse);
            } catch (error) {
              console.error('postTransactionResponse', error);
            }
          })();

          (async () => {
            try {
              let { data: postTransactionResponse } = await axios.post('http://askbitcoin.ai/api/v1/questions', {
                transaction: rawTx
              });

              console.log('api.questions.post.response', postTransactionResponse);

              router.push(`/questions/${txid}`);
            } catch (error) {
              console.error('api.questions.post.response', error);
            }
          })();

          (async () => {
            try {
              let { data: postTransactionResponse } = await axios.post('https://pow.co/api/v1/transactions', {
                transaction: rawTx
              });

              console.log('powco_post_transaction_response', postTransactionResponse);
            } catch (error) {
              console.error('powco_post_transaction_response', error);
            }
          })();

          (async () => {
            try {
              let { data: postTransactionResponse } = await axios.post('https://pow.co/api/v1/jobs', {
                transaction: rawTx
              });

              console.log('powco_post_transaction_response', postTransactionResponse);
            } catch (error) {
              console.error('powco_post_transaction_response', error);
            }
          })(); */

          break;
        case 'twetch':
          //TODO
          break;
        case 'handcash':
          //TODO
          break;
        default:
          console.error('No wallet selected');
          return;
      }
    } catch (error) {
      enqueueSnackbar(`Error Posting Question: ${error.message}`, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        },
        variant: 'error'
      });
    }
  }
  window.postQuestion = postQuestion;

  function onQuestion(question) {
    console.log('on question', question);
    enqueueSnackbar(`new question: ${question.content}`);
  }

  const events = useEvents(`questions`, onQuestion);

  window.events = events;

  let { data, error, refresh, loading } = useAPI(`/questions`, queryParams);

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

  const onChangeFilter = (filter) => {
    setQueryParams(filter.query);
  };

  const { questions } = data;

  return (
    <MainCard>
      <FormControl submit={postQuestion} placeholder="Ask Bitcoin a question" />
      <Grid container sx={{ pb: '16px' }} spacing={1}>
        <Grid item xs={6}>
          <Typography align="right" variant="h2">
            <FormattedMessage id="questions-pow" />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControlSelect handleFilter={onChangeFilter} />
        </Grid>
      </Grid>
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
