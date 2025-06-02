import { FolderAddOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useCreateFolderMutation } from "../api/dashboardEndPoints";
import { ICreateFolder } from "../types/dashboardTypes";

const CreateFolder = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [create, { isSuccess, isLoading }] = useCreateFolderMutation();

  const onFinish = (data: ICreateFolder) => {
    create(data);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess]);
  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row align={"middle"} gutter={[5, 16]}>
        <Col xs={24} sm={24} md={24}>
          <Form.Item
            name="name"
            style={{ marginTop: "1rem" }}
            rules={[
              {
                required: true,
                message: "Please enter your folder name",
              },
            ]}
          >
            <Input prefix={<FolderAddOutlined />} placeholder=" Folder Name" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <div style={{ textAlign: "end" }}>
          <Button
            htmlType="submit"
            type="primary"
            icon={<SendOutlined />}
            loading={isLoading}
          >
            Create
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CreateFolder;
