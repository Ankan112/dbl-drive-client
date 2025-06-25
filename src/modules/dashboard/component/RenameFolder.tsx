import { FolderAddOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useUpdateFileNameMutation, useUpdateFolderNameMutation } from "../api/dashboardEndPoints";

const RenameFolder = ({
  id,
  name,
  type,
}: {
  id?: number;
  name: string;
  type: string;
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [updateFileName, fileResult] = useUpdateFileNameMutation();
  const [updateFolderName, folderResult] = useUpdateFolderNameMutation();

  const { isSuccess, isLoading } =
    type === "file" ? fileResult : folderResult;

  const fileOrFolderName = type === "file" ? name?.split(".")[0] : name;

  const onFinish = (data: { name: string }) => {
    if (type === "file") {
      updateFileName({ body: data, id: Number(id) });
    } else {
      updateFolderName({ body: data, id: Number(id) });
    }
  };

  useEffect(() => {
    if (fileOrFolderName) {
      form.setFieldsValue({ name: fileOrFolderName });
    }
  }, [form, fileOrFolderName]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      form.resetFields();
    }
  }, [isSuccess, dispatch, form]);

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
            Update
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default RenameFolder;
