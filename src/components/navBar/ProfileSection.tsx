import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Image, Space, Tag } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../app/api/userApi";
import { setLogout } from "../../app/features/userSlice";
import { setCommonModal } from "../../app/slice/modalSlice";
import { useAppDispatch } from "../../app/store/store";
import user from "../../assets/user.png";
import ChangeEmployeePassword from "./ChangePassword";

const ProfileSection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data } = useGetMeQuery();
  const {
    role_id,
    status,
    name,
    email,
    department,
    designation,
    joining_date,
    unit_name,
    employee_id,
    contact_no,
  } = data?.data || {};

  const record = data?.data;

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "20px" }}>
      <Card
        title="Profile Details"
        extra={
          <Space wrap>
            <Button
              type="primary"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Update Employee",
                    content: "test",
                    show: true,
                    width: 678,
                  })
                );
              }}
              icon={<EditOutlined />}
              style={{
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "6px",
              }}
            >
              Update Profile
            </Button>
            <Button
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Change Employee Password",
                    content: <ChangeEmployeePassword />,
                    show: true,
                    width: 550,
                  })
                );
              }}
              style={{
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: "#ff7a45",
                color: "#fff",
              }}
            >
              Change Password
            </Button>
          </Space>
        }
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "150px",
              height: "150px",
              border: "5px solid #1890ff",
              borderRadius: "50%",
              overflow: "hidden",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Image
              preview={false}
              src={user}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <div
            style={{
              width: "calc(100% - 170px)",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Name{" "}
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                : {name}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Employee ID
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                : {employee_id}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Phone{" "}
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                : {contact_no}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Email{" "}
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                : {email}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Designation
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                : {designation}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Department
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                : {department}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Unit Name
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                : {unit_name}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Joining Date
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                : {dayjs(joining_date).format("DD MMM YYYY")}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Role
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                : {role_id === 1 && <Tag color="blue-inverse">SUPER ADMIN</Tag>}
                {role_id === 2 && <Tag color="geekblue">ADMIN</Tag>}
                {role_id === 3 && <Tag color="orange-inverse">EMPLOYEE</Tag>}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <p style={{ width: "20%", fontSize: "16px", color: "#555" }}>
                Status
              </p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#333" }}>
                :{" "}
                <Tag color={status === 1 ? "success" : "error"}>
                  {status === 1 ? "ACTIVE" : "INACTIVE"}
                </Tag>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSection;
