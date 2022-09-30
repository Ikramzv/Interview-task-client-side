import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { queryInstance } from "../axios/axios";
import { setPosts } from "../redux/slices/postsSlice";
import Post from "./Post";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column-reverse",
  gap: "50px",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
  [theme.breakpoints.up("lg")]: {
    justifyContent: "space-between",
  },
}));

function Feed() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const [users, setUsers] = useState([]);
  const variantsLeft = useRef({
    hidden: {
      opacity: 0,
      x: -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transitionDuration: "800ms",
    },
  });
  const variantsRight = useRef({
    hidden: {
      opacity: 0,
      x: 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transitionDuration: "800ms",
    },
  });

  useEffect(() => {
    async function getPosts() {
      const { data } = await queryInstance.get("/posts");
      dispatch(setPosts(data));
    }

    async function getUsers() {
      const { data } = await queryInstance.get("/users");
      setUsers(data);
    }
    getUsers();
    getPosts();
  }, []);
  // If any post is pinned then it will be sort the posts again
  useEffect(() => {
    function sortByPinned() {
      const sortedArray = [];
      posts.map((post) => {
        if (post.pinned) {
          sortedArray.unshift(post);
          return post;
        }
        sortedArray.push(post);
        return post;
      });
      dispatch(setPosts(sortedArray));
    }
    sortByPinned();
  }, [posts.filter((post) => post.pinned).length]);
  return (
    <Grid container mt={15} px={4}>
      <StyledContainer maxWidth={"xl"}>
        <Grid
          item
          xs={12}
          sm={8}
          lg={6}
          component={motion.div}
          variants={variantsLeft.current}
          initial={"hidden"}
          animate={"visible"}
        >
          {posts.map((post) => {
            const date = new Date(post.createdAt).toLocaleString();
            return <Post key={post._id} post={post} date={date} />;
          })}
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          lg={4}
          component={motion.div}
          variants={variantsRight.current}
          initial={"hidden"}
          animate={"visible"}
        >
          <Typography
            variant={"h2"}
            fontSize={25}
            fontWeight={"bold"}
            align={"center"}
            mb={2}
          >
            Leaderboard
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "black" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Username</TableCell>
                  <TableCell sx={{ color: "white" }}>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={user._id}
                    sx={{ backgroundColor: `${index < 3 && "#E1FFB1"}` }}
                  >
                    <TableCell>{user.username}</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </StyledContainer>
    </Grid>
  );
}

export default Feed;
