import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import CreatePostModal from "./modals/CreatePostModal";

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "32px",
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBlock: "10px",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "20px",
  },
}));

function Header() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  return (
    <AppBar
      position="fixed"
      sx={{ top: 0, width: "100vw", bgcolor: "black" }}
      elevation={6}
    >
      <Container maxWidth="xl">
        <StyledToolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <StyledTypography variant="h1">Coding is easy</StyledTypography>
            <Button
              variant="contained"
              color="error"
              onClick={() => dispatch(logout())}
            >
              Logout
            </Button>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowModal(true)}
          >
            Create Post
          </Button>
        </StyledToolbar>
        <CreatePostModal isOpen={showModal} setIsOpen={setShowModal} />
      </Container>
    </AppBar>
  );
}

export default Header;
