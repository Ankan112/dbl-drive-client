import { FolderAddOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useCreateFolderMutation,
  useGetFolderListQuery,
} from "../api/dashboardEndPoints";
import { ICreateFolder } from "../types/dashboardTypes";
import { useWatch } from "antd/es/form/Form";

const CreateFolder = ({ parentId }: { parentId?: number | null }) => {
  const [form] = Form.useForm();
  const name = useWatch("name", form);
  const dispatch = useDispatch();
  const [create, { isSuccess, isLoading }] = useCreateFolderMutation();
  const { data } = useGetFolderListQuery();
  const isExist = data?.data?.some((item) => item.name === name);
  const onFinish = (data: ICreateFolder) => {
    const formattedData = { ...data };
    if (parentId) {
      formattedData.parent_id = parentId;
    }
    create(formattedData).unwrap();
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
              {
                validator: (_, value) => {
                  if (isExist) {
                    return Promise.reject(
                      new Error("Folder name already exists!")
                    );
                  }
                  return Promise.resolve();
                },
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
