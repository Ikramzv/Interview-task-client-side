import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import axios from "../../axios/axios";
import { createPost } from "../../redux/slices/postsSlice";

function ModalComponent({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  return (
    <Modal open={isOpen} sx={{ display: "grid", placeContent: "center" }}>
      <Formik
        initialValues={{ question: "" }}
        onSubmit={async (values, actions) => {
          const { setErrors } = actions;
          console.log(values);
          if (values.question === "")
            return setErrors({ question: "Question field must be fullfilled" });
          try {
            const { data } = await axios.post("/posts", values);
            dispatch(createPost(data));
            setIsOpen(false);
          } catch (error) {
            return setErrors({ question: error.response.data });
          }
        }}
      >
        {({ isSubmitting, handleChange, errors }) => (
          <Form
            style={{
              background: "white",
              width: "80vmin",
              padding: "20px",
              borderRadius: "15px",
            }}
          >
            <Stack display={"flex"} flexDirection="column" gap={4}>
              <TextField
                variant="outlined"
                name="question"
                label="Question"
                placeholder="Type your question..."
                onChange={handleChange}
                color="primary"
              />
              <Box display={"flex"} gap={2}>
                <Button
                  sx={{ flex: 3 }}
                  variant="contained"
                  color="success"
                  type="submit"
                >
                  {isSubmitting ? <CircularProgress size={"15px"} /> : "Create"}
                </Button>
                <Button
                  sx={{ flex: 1 }}
                  onClick={() => setIsOpen(false)}
                  variant="contained"
                  color="error"
                >
                  Close
                </Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default ModalComponent;
