// import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
// import { Col, Divider, Form, Image, Input, Row } from "antd";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import { useLoginMutation } from "../../app/api/api";
// import logo from "../../assets/logo.png";
// import SubmitButton from "../../components/submitButton/SubmitButton";
// import "./Login.css";
// type IInputs = {
//   id: string;
//   password: string;
// };

// export const Login = () => {
//   const navigate = useNavigate();
//   const [login, { isLoading }] = useLoginMutation();
//   const onFinish = (values: IInputs) => {
//     const body = {
//       id: values.id,
//       password: values.password,
//     };
//     login(body);
//   };

//   return (
//     <>
//       {/* <video className="video-background" autoPlay loop muted>
//         <source src={videoBg} type="video/mp4" />
//       </video> */}
//       <motion.div
//         className="login-container"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.div
//           className="login-form-container"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <div className="login-form">
//               <div className="flex justify-center">
//                 <Image preview={false} height={140} src={logo} />
//               </div>
//               <Form name="login-form" layout="vertical" onFinish={onFinish}>
//                 <Row gutter={6}>
//                   <Col xs={24}>
//                     <Form.Item
//                       name="id"
//                       label="Employee ID"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Please input your ID!",
//                         },
//                       ]}
//                     >
//                       <Input
//                         prefix={<UserOutlined />}
//                         placeholder="Enter Employee ID"
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col xs={24}>
//                     <Form.Item
//                       name="password"
//                       label="Password"
//                       rules={[
//                         {
//                           required: true,
//                           message: "Please enter your password!",
//                         },
//                       ]}
//                     >
//                       <Input.Password
//                         prefix={<LockOutlined />}
//                         placeholder="Enter Password"
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col xs={24}>
//                     <Form.Item>
//                       <div
//                         style={{ display: "flex", justifyContent: "center" }}
//                       >
//                         <SubmitButton
//                           loading={isLoading}
//                           label="LogIn"
//                           icon={<LoginOutlined />}
//                           style={{ width: "100%" }}
//                         />
//                       </div>
//                     </Form.Item>
//                   </Col>
//                   {/* <Divider style={{ marginTop: "0px", marginBottom: "10px" }} /> */}
//                   <Col xs={24}>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                       }}
//                     >
//                       <span style={{ color: "black" }}>
//                         <Link to="/forget-password"> Forget Password? </Link>
//                       </span>
//                     </div>
//                   </Col>
//                 </Row>
//               </Form>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </>
//   );
// };
import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Divider, Form, Image, Input, Row } from "antd";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/api/api";
import logo from "../../assets/logo.png";
import SubmitButton from "../../components/submitButton/SubmitButton";
import React, { useState } from "react";

export const Login = () => {
  const [formData, setFormData] = useState({ id: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [login, { isLoading }] = useLoginMutation();
  const onFinish = (values: any) => {
    const body = {
      id: values.id,
      password: values.password,
    };
    login(body);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-2xl opacity-20 transform rotate-12"></div>
      <div className="absolute bottom-32 left-16 w-48 h-48 bg-blue-300 rounded-full opacity-15"></div>
      <div className="absolute top-1/2 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-25"></div>
      <div className="absolute bottom-20 right-32 w-40 h-40 bg-blue-300 rounded-2xl opacity-20 transform -rotate-12"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-xl w-full flex"
      >
        {/* Left side - Welcome section */}

        {/* Right side - Login form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="max-w-sm mx-auto w-full">
            {/* <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Sign in</h3>
              <p className="text-gray-500 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </p>
            </motion.div> */}

            {/* <form className="space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="Employee ID"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center justify-between text-sm"
              >
                <label className="flex items-center text-gray-600">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                  />
                  Remember me
                </label>
                <a
                  href="/forget-password"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot Password?
                </a>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-4"
              >
                <button
                  onClick={onFinish}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <button
                  onClick={() => console.log("Sign in with other clicked")}
                  className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 transform hover:scale-[1.02] focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Sign in with other
                </button>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-center text-sm text-gray-600"
              >
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Sign Up
                </a>
              </motion.div>
            </form> */}
            <div>
              <div className="flex justify-center">
                <Image preview={false} height={140} src={logo} />
              </div>
              <Form
                layout="vertical"
                onFinish={onFinish}
                style={{ width: "100%" }}
              >
                <Row gutter={6}>
                  <Col xs={24}>
                    <Form.Item
                      name="id"
                      label="Employee ID"
                      rules={[
                        {
                          required: true,
                          message: "Please input your ID!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter Employee ID"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Enter Password"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <SubmitButton
                          loading={isLoading}
                          label="LogIn"
                          icon={<LoginOutlined />}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Form.Item>
                  </Col>
                  {/* <Divider style={{ marginTop: "0px", marginBottom: "10px" }} /> */}
                  {/* <Col xs={24}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "black" }}>
                        <Link to="/forget-password"> Forget Password? </Link>
                      </span>
                    </div>
                  </Col> */}
                </Row>
              </Form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
