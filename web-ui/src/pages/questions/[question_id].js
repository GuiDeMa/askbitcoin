import { useState } from 'react';
// material-ui
import { Typography, Grid, Button } from '@mui/material';

import Link from 'next/link';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import Post from 'components/ui-component/cards/Post';
import FormControl from 'components/ui-component/extended/Form/FormControl';
import FormControlSelect from 'components/ui-component/extended/Form/FormControlSelect';

import { useAPI } from 'hooks/useAPI';
import useAuth from 'hooks/useAuth';

import { useRouter } from 'next/router';

import { FormattedMessage } from 'react-intl';

import { useSnackbar } from 'notistack';

// ==============================|| QUESTION DETAIL PAGE ||============================== //

import { useEffect } from 'react';
import { useEvents } from 'hooks/useEvents';

const QuestionDetailPage = () => {
  const [queryParams, setQueryParams] = useState('');
  window.postAnswer = postAnswer;
  const { user, wallet, isLoggedIn } = useAuth();

  const router = useRouter();
  const query = router.query;

  const { enqueueSnackbar } = useSnackbar();

  async function postAnswer(question_tx_id, content) {
    const json = JSON.stringify({
      question_tx_id,
      content
    });

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
      switch (wallet) {
        case 'relayx':
          let result = await relayone.send({
            opReturn: ['onchain', '1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN', 'answer', json],
            currency: 'USD',
            amount: 0.01,
            to: '1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN'
          });
          let { amount, currency, identity, paymail, rawTx, satoshis, txid } = result;
          console.log(result);

          let post = `I just answered a question on askbitcoin.ai, you can find it here: https://askbitcoin.ai/answers/${txid}`;

          enqueueSnackbar(`Answer Posted by ${paymail}`, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center'
            },
            variant: 'success',
            action: () => (
              <Button target="_blank" rel="noreferrer" href={`https://twetch.com/compose?text=${post}&draft=0`}>
                Twetchdat
              </Button>
            )
          });

          /* let { data: postTransactionResponse } = await axios.post('https://askbitcoin.ai/api/v1/transactions', {
            transaction: rawTx
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
              let { data: postTransactionResponse } = await axios.post('https://askbitcoin.ai/api/v1/answers', {
                transaction: rawTx
              });

              console.log('api.answers.post.response', postTransactionResponse);

              router.push(`/answers/${txid}`);
            } catch (error) {
              console.error('api.answers.post.response', error);
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
      enqueueSnackbar(`Error Posting Answer: ${error.message}`, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        },
        variant: 'error'
      });
    }
  }

  function onAnswer(answer) {
    console.log('on answer', answer);
    enqueueSnackbar(`new answer: ${answer.content}`);
  }

  const events = useEvents(`questions.${query.question_id}.answer`, onAnswer);

  window.events = events;

  let { data, error, refresh, loading } = useAPI(`/questions/${query.question_id}`, queryParams);

  if (error) {
    console.error('ERROR', error);
    return <p>Error</p>;
  }

  if (!data) {
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  }

  const onChangeFilter = (filter) => {
    setQueryParams(filter.query);
  };

  const { question, answers } = data;

  return (
    <MainCard>
      <Post post={question} />
      <FormControl question={question.tx_id} submit={postAnswer} placeholder="Add your answer" />
      <Grid container sx={{ pb: '16px' }} spacing={1}>
        <Grid item xs={6}>
          <Typography align="right" variant="h2">
            <FormattedMessage id="answers-pow" />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControlSelect handleFilter={onChangeFilter} />
        </Grid>
      </Grid>
      {answers.map((answer) => {
        return <Post key={answer.tx_id} answer post={answer} />;
      })}
    </MainCard>
  );
};
QuestionDetailPage.Layout = 'authGuard';
export default QuestionDetailPage;
