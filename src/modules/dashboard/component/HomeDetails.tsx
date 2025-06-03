import { useLocation, useNavigate, useParams } from "react-router";
import { useGetFolderDetailsQuery } from "../api/dashboardEndPoints";
import { Card, Col, Row, Typography } from "antd";

const HomeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get the path after `/folder/`
  const path = location.pathname.replace("/folder/", "");

  // Get the last segment (last folder UID)
  const segments = path.split("/").filter(Boolean);
  const lastFolderId = segments[segments.length - 1];
  const { data, isLoading } = useGetFolderDetailsQuery(Number(lastFolderId));
  console.log({ lastFolderId });
  return (
    <div>
      <h1>Parent Folder {data?.data?.full_path}</h1>
      <Row gutter={[12, 12]}>
        {data?.data?.next_folder?.map((folder) => (
          <Col key={folder.id} xs={24} sm={24} md={8} lg={6}>
            <Card onClick={() => navigate(`/folder/${folder.id}`)}>
              <Typography.Title>{folder.name}</Typography.Title>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomeDetails;
