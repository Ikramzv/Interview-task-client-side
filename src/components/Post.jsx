import {
  Delete,
  ExpandMore as ExpandMoreIcon,
  PushPin,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import decode from "jwt-decode";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import mutationInstance from "../axios/axios";
import {
  addComment,
  deletePost,
  editPost,
  likePost,
  setPinned,
} from "../redux/slices/postsSlice";
import socket from "../socket/socket";

const cardContentStyle = {
  mx: "10px",
  bgcolor: "#DFF6FF",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxHeight: "200px",
  overflowY: "auto",
};

const buttonGroupStyles = {
  position: "absolute",
  right: "90px",
  top: "10px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const ExpandMore = styled((props) => {
  const { expand, ...others } = props;
  return <IconButton {...others} />;
})(({ expand }) => ({
  transition: "400ms",
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
}));

function Post({ post, date }) {
  const [expanded, setExpanded] = useState(false);

  const currentUser = useSelector((state) => state.user);
  const token = useRef(decode(currentUser.payload.accessToken));
  const dispatch = useDispatch();

  const handleEdit = async () => {
    const question = prompt("Edit the question by writing here", post.question);
    try {
      if (question === post.question || !question) return;
      if (question.length >= 3) {
        dispatch(editPost({ id: post._id, question }));
        const updatedPost = await mutationInstance.patch(
          `/edit_post/${post._id}`,
          { question }
        );
        return updatedPost;
      }
      return alert("Question must be 3 letter length at least");
    } catch (error) {
      Promise.reject(error);
    }
  };
  const handleDelete = async (id) => {
    const req = prompt("Are you sure to delete post ? If sure write 'yes' ");
    try {
      if (req !== "yes") return;
      dispatch(deletePost({ id }));
      await mutationInstance.delete(`/post/${post._id}`);
    } catch (error) {
      Promise.reject(error);
    }
  };

  const handleComment = async () => {
    const commentText = prompt(
      "Type a comment here and more earn 10 points 🔥"
    );
    try {
      if (!commentText) return alert("Empty comment are not allowed");
      dispatch(
        addComment({
          postId: post._id,
          comment: {
            text: commentText,
            userId: {
              _id: currentUser.payload.user._id,
              username: currentUser.payload.user.username,
            },
          },
        })
      );
      socket.emit("commentPoint", {
        userId: currentUser.payload.user._id,
        value: 10,
      });
      await mutationInstance.patch(`/comment/${post._id}`, {
        text: commentText,
      });
      return;
    } catch (error) {
      Promise.reject(error);
    }
  };

  const handlePin = async () => {
    try {
      dispatch(setPinned({ postId: post._id }));
      await mutationInstance.patch(`/pin_post/${post._id}`);
      return;
    } catch (error) {
      Promise.reject(error);
    }
  };

  const handleLike = async () => {
    try {
      dispatch(
        likePost({ postId: post._id, userId: currentUser.payload.user._id })
      );
      await mutationInstance.patch(`/like_post/${post._id}`);
      return;
    } catch (error) {
      Promise.reject(error);
    }
  };

  return (
    <Card
      sx={{
        mb: 4,
        boxShadow: "0 2px 2px 0 black",
        position: "relative",
      }}
    >
      <CardHeader title={post.userId?.username} subheader={date} />
      {token.current.admin && (
        <ButtonGroup sx={buttonGroupStyles}>
          <IconButton color="error" onClick={() => handleDelete(post._id)}>
            <Delete />
          </IconButton>
          <IconButton
            color={post.pinned ? "primary" : "default"}
            onClick={() => handlePin(post._id)}
          >
            <PushPin fontSize={"medium"} />
          </IconButton>
        </ButtonGroup>
      )}

      {(token.current.id === post.userId._id || token.current.admin) && (
        <Button
          onClick={() => handleEdit(post)}
          variant={"outlined"}
          sx={{ position: "absolute", right: "10px", top: "10px" }}
        >
          Edit
        </Button>
      )}

      <CardContent>
        <Typography variant="h5" fontSize={16}>
          {post.question}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant={
            post.likes.includes(currentUser.payload.user._id)
              ? "contained"
              : "outlined"
          }
          color={"success"}
          sx={{ justifySelf: "flex-start", mr: "auto" }}
          onClick={handleLike}
        >
          Like {post.likes.length}
        </Button>
        {post.comments.length > 0 && (
          <ExpandMore onClick={() => setExpanded(!expanded)} expand={expanded}>
            <ExpandMoreIcon />
          </ExpandMore>
        )}
        <Button variant="outlined" size="small" onClick={handleComment}>
          Comment
        </Button>
      </CardActions>
      {post.comments.length > 0 && (
        <Collapse in={expanded}>
          <CardContent sx={cardContentStyle}>
            {post.comments.map((comment) => (
              <Box
                sx={{
                  bgcolor: "white",
                  padding: "6px 8px",
                  borderRadius: "8px",
                  transitionDuration: "200ms",
                  ":hover": {
                    bgcolor: "#00000063",
                    color: "white",
                  },
                }}
                key={comment._id ? comment._id : crypto.randomUUID()}
              >
                <Typography fontWeight={600} sx={{ float: "left" }}>
                  {comment.userId?.username} &nbsp;
                </Typography>
                <Typography>{comment.text}</Typography>
              </Box>
            ))}
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
}

export default Post;
