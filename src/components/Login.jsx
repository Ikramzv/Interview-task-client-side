import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import axios from "../axios/axios";
import { setUser } from "../redux/slices/userSlice";

function Login() {
  const dispatch = useDispatch();
  return (
    <Grid
      component={motion.div}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0, transitionDuration: "800ms" }}
      exit={{ opacity: 0, y: -100 }}
      container
      alignContent={"center"}
      justifyContent={"center"}
      height={"80vh"}
    >
      <Grid item xs={10} sm={8} md={5}>
        <Typography variant={"h3"} mb={5} align={"center"}>
          Login
        </Typography>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, action) => {
            const { setErrors } = action;
            if (Object.values(values).some((value) => value === "")) {
              Object.entries(values).map(([key, value]) => {
                return value === ""
                  ? setErrors({ [key]: "Field must be fullfilled" })
                  : "";
              });
              return;
            }
            try {
              const { data } = await axios.post("/login", values);
              dispatch(
                setUser({
                  payload: data,
                })
              );
            } catch (error) {
              setErrors({
                username: error.response.data,
                password: "",
              });
            }
          }}
        >
          {({ handleChange, isSubmitting, errors, touched }) => (
            <Form
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <TextField
                name="username"
                id={"username"}
                onChange={handleChange}
                type={"text"}
                autoComplete="off"
                label="Username"
                variant="outlined"
                placeholder="Type username.."
              />

              {touched.username && errors.username && (
                <Typography variant="p" color={"red"} fontSize={"14px"}>
                  {errors.username}
                </Typography>
              )}
              <TextField
                name="password"
                id="password"
                type={"password"}
                onChange={handleChange}
                autoComplete="off"
                variant="outlined"
                label="Password"
                placeholder="Type password.."
              />
              {touched.password && errors.password && (
                <Typography variant="p" color={"red"} fontSize={"14px"}>
                  {errors.password}
                </Typography>
              )}
              <Button type="submit" variant="outlined">
                {isSubmitting ? <CircularProgress size={"30px"} /> : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default Login;
