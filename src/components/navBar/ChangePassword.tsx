import { Card, Col, Row, Form, Input, Button, message } from "antd";
import { LockOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../app/slice/modalSlice";

const ChangeEmployeePassword = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // const [update, { isLoading, isSuccess }] =
  //   useChangeEmployeePasswordMutation();

  const onFinish = (data: any) => {
    if (data.new_password === data.old_password) {
      return message.error("Old password and new password can not be same");
    }
    // update(data);
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(setCommonModal());
  //     form.resetFields();
  //   }
  // }, [isSuccess]);
  return (
    <Row justify="center" align="middle" style={{ maxWidth: "auto" }}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Card
            className="border"
            style={{
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            <Row align={"middle"} gutter={[5, 16]}>
              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  name="old_password"
                  label="Old Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your old password!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter Old Password"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24}>
                <Form.Item
                  name="new_password"
                  label="New Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your new password!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter New Password"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item style={{ marginTop: "1rem" }}>
            <div style={{ textAlign: "end" }}>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SendOutlined />}
                // loading={isLoading}
              >
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ChangeEmployeePassword;
