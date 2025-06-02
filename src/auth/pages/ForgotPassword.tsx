/*
Change Password
@Author Abdulla al mammun<mamun.m360ict@gmail.com>
*/
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Form, Input, Typography, Row, Col, Image } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { motion } from "framer-motion"; // Import motion from framer-motion
import "./Login.css";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useGetOTPMutation } from "../../forget_api/forgetApi";
import logo from "../../assets/logo.png";
import SubmitButton from "../../components/submitButton/SubmitButton";

type IForget = {
  email: string;
  type: string;
  otp: string;
};
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [getOTP, { isSuccess, isLoading }] = useGetOTPMutation();

  const onFinish = (values: IForget) => {
    const body = {
      email: values.email.toLowerCase().replace(/\s/g, ""),
    };
    getOTP(body);
  };
  if (isSuccess) {
    navigate(`/forget-password/otp?email=${email}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-sky-100 to-indigo-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-sky-300 rounded-2xl opacity-25 animate-floatSlow rotate-12"></div>
      <div className="absolute bottom-32 left-16 w-48 h-48 bg-indigo-300 rounded-full opacity-20 animate-float rotate-6"></div>
      <div className="absolute top-1/2 right-20 w-24 h-24 bg-slate-300 rounded-full opacity-25 animate-floatFast"></div>
      <div className="absolute bottom-20 right-32 w-40 h-40 bg-sky-300 rounded-2xl opacity-25 transform -rotate-12 animate-floatMedium"></div>
      <div className="absolute top-10 right-10 w-20 h-20 bg-indigo-200 rounded-full opacity-30 animate-floatDelay"></div>
      <div className="absolute bottom-10 left-24 w-28 h-28 bg-gray-200 rounded-full opacity-30 animate-floatSlow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-indigo-200 rounded-3xl opacity-20 animate-float"></div>
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-sky-400 rounded-full opacity-40 animate-floatFast"></div>
      <div className="absolute top-10 left-1/4 w-20 h-20 bg-indigo-300 rounded-3xl opacity-35 animate-floatDelay"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full flex"
      >
        {/* Left side - Welcome section */}

        {/* Right side - Login form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full p-8 lg:p-10 flex flex-col justify-center"
        >
          <div className="max-w-sm mx-auto w-full">
            <div>
              <div className="flex justify-center">
                <Image preview={false} height={140} src={logo} />
              </div>
              <Typography.Title
                level={4}
                style={{
                  textAlign: "center",
                  paddingBottom: "10px",
                  color: "black",
                }}
              >
                Forget Password
              </Typography.Title>
              <Form name="login-form" layout="vertical" onFinish={onFinish}>
                <Row gutter={[16, 8]}>
                  <Col xs={24}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          type: "email",
                          message: "The input is not a valid E-mail!",
                        },
                        {
                          required: true,
                          message: "Please input your E-mail!",
                        },
                      ]}
                    >
                      <Input
                        onChange={(e: any) => setEmail(e.target.value)}
                        prefix={<MailOutlined />}
                        placeholder="Enter email address"
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
                          label="Send OTP"
                          block
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <span>
                        Go to <Link to="/login"> Login</Link>
                      </span>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
