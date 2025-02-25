import PropTypes from 'prop-types';
import * as React from 'react';
import Link from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  ButtonBase,
  CardMedia,
  Collapse,
  FormHelperText,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
// third-party
import * as yup from 'yup';
import uniqueId from 'lodash/uniqueId';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { useSnackbar } from 'notistack';

// project imports
import Comment from '../Comment';
import MainCard from '../../MainCard';
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import ImageList from 'components/ui-component/extended/ImageList';
import Avatar from 'components/ui-component/extended/Avatar';

import SimpleDialog from 'components/ui-component/SimpleDialog';

import { BoostpowQrCodeDialog } from 'components/ui-component/SimpleDialog';

// assets
import BoostButton from 'components/boostpow';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import QrCode from '@mui/icons-material/QrCode';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import useConfig from 'hooks/useConfig';
import { useRouter } from 'next/router';

const avatarImage = '/assets/images/profile/';

import { DateTime } from 'luxon';

import axios from 'utils/axios';

import { QRCodeSVG } from 'qrcode.react';

const validationSchema = yup.object().shape({
  name: yup.string().required('Comment Field is Required')
});

// ==============================|| COMMENT TEXTFIELD ||============================== //

const FormInput = ({ bug, label, size, fullWidth = true, name, required, ...others }) => {
  let isError = false;
  let errorMessage = '';
  if (bug && Object.prototype.hasOwnProperty.call(bug, name)) {
    isError = true;
    errorMessage = bug[name].message;
  }

  return (
    <>
      <Controller
        name={name}
        defaultValue=""
        render={({ field }) => (
          <TextField
            fullWidth={fullWidth}
            size={size}
            label={label}
            InputLabelProps={{
              className: required ? 'required-label' : '',
              required: required || false
            }}
            error={isError}
            {...field}
          />
        )}
        {...others}
      />
      {errorMessage && (
        <Grid item xs={12}>
          <FormHelperText error>{errorMessage}</FormHelperText>
        </Grid>
      )}
    </>
  );
};

FormInput.propTypes = {
  bug: PropTypes.object,
  size: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool
};

import moment from 'moment'


// ==============================|| SOCIAL PROFILE - POST ||============================== //

const Post = ({ commentAdd, handleCommentLikes, handleReplayLikes, post, replyAdd, answer }) => {
  const theme = useTheme();
  const router = useRouter();
  var { tx_id, content, author, difficulty, answers, created_at, timestamp } = post;

  const [qrDialogOpen, setQrDialogOpen] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { borderRadius } = useConfig();
  const matchesXS = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setQrDialogOpen(false);
    setAnchorEl(false);
  };

  const [anchorSharedEl, setAnchorSharedEl] = React.useState(null);
  const handleSharedClick = (event) => {
    event.stopPropagation();
    setAnchorSharedEl(event.currentTarget);
  };

  const handleSharedClose = () => {
    setAnchorSharedEl(null);
  };

  const handleChangeComment = (event) => {
    event.stopPropagation();
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    formState: { errors },
    reset
  } = methods;
  const onSubmit = async (comment) => {
    handleChangeComment();
    const commentId = uniqueId('#COMMENT_');
    const newComment = {
      id: commentId,
      profile,
      data: {
        comment: comment.name,
        likes: {
          like: false,
          value: 0
        },
        replies: []
      }
    };
    commentAdd(id, newComment);
    reset({ name: '' });
  };

  const navigate = (event) => {
    event.stopPropagation();
    router.push(`/${answer ? 'answers' : 'questions'}/${tx_id}`);
  };

  function handleClickOpen() {
    console.log('handle click open');
  }

  console.log('TIME STAMP', timestamp)

  if (typeof timestamp === 'number') {

    timestamp = timestamp * 1000
  }

  return (
    <MainCard onClick={navigate}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container xs={12} wrap="nowrap" alignItems="center" spacing={1}>
            <Grid item>
              <Avatar alt="User 1" src={author?.email ? `https://bitpic.network/u/${author.email}` : 'https://bitpic.network/u/unknown'} />
            </Grid>
            
            <Grid sx={{minWidth: '50%' }} item xs={12} sm={6} md={6}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  {author && <Typography align="left" variant="h5" component="div">
                    {author ? author.name : 'Anonymous'}
                  </Typography>}
                </Grid>
                <Grid item>
                  <Typography align="left" wrap="scroll">
                  <ReactMarkdown sx={{overflow: 'scroll'}} remarkPlugins={[gfm]}>{content}</ReactMarkdown>

                  </Typography>
                </Grid>
              </Grid>
            </Grid>

          <Grid xs={4} md={4} justifyContent="center" item sx={{ h: '100%', w: '100%', display: 'flex', justifyContent: 'center' }}>
            <BoostButton txid={tx_id} content={content} difficulty={difficulty} />
          </Grid>

          <Grid
            item
            xs={4}
            container
            alignItems="center"
            justifyContent="space-arround"
            fullWidth
            sx={{ mt: 0, height: 69, color: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.800' }}
          >
          <Grid xs={2} md={2} item sx={{ h: '100%', w: '100%', display: 'flex', justifyContent: 'center' }}></Grid>
          <Grid xs={2} md={2} item sx={{ h: '100%', w: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleChangeComment} variant="text" color="inherit" startIcon={<ChatBubbleTwoToneIcon color="secondary" />}>
              {answers ? answers.length : 0}
            </Button>
          </Grid>


        </Grid>
            <Grid item>
              <ButtonBase sx={{ borderRadius: '12px' }} onClick={handleClick}>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.smallAvatar,
                    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                    color: theme.palette.mode === 'dark' ? theme.palette.dark.light : theme.palette.secondary.dark,
                    zIndex: 1,
                    transition: 'all .2s ease-in-out',
                    '&[aria-controls="menu-list-grow"],&:hover': {
                      background: theme.palette.secondary.main,
                      color: theme.palette.secondary.light
                    }
                  }}
                  aria-controls="menu-post"
                  aria-haspopup="true"
                >
                  <MoreVertTwoToneIcon fontSize="inherit" />
                </Avatar>
              </ButtonBase>
              <Menu
                id="menu-post"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="selectedMenu"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <MenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    setQrDialogOpen(true);
                    return false;
                  }}
                >
                  View QR Code
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            '& > p': {
              ...theme.typography.body1,
              mb: 0
            }
          }}
        >

          <Typography  variant="caption">
                              <a target="_blank" rel="noopener" href={`https://whatsonchain.com/tx/${tx_id}`}>
                      {moment(timestamp).format('MMM Do YYYY, h:mm:ss a')}
                    </a>
                    </Typography>
          <br />

          <BoostpowQrCodeDialog tx_id={tx_id} currency={'USD'} value={0.05} open={qrDialogOpen} onClose={handleClose} />
        </Grid>



      </Grid>
    </MainCard>
  );
};

Post.propTypes = {
  commentAdd: PropTypes.func,
  handleCommentLikes: PropTypes.func,
  handlePostLikes: PropTypes.func,
  handleReplayLikes: PropTypes.func,
  post: PropTypes.object,
  replyAdd: PropTypes.func
};

export default Post;
