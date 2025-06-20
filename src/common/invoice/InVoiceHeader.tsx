import { Col, Row, Typography } from "antd";
import logo from "../../assets/invoice-logo.png";
import { useGetMeQuery } from "../../app/api/userApi";
import { IUser } from "../../auth/types/loginTypes";

export const InvoiceHeader = () => {
  const { data: profile } = useGetMeQuery();
  const ProfileInfo = profile?.data as IUser;

  return (
    <div style={{ marginTop: 15 }}>
      <Row
        style={{
          fontFamily: "'Source Sans Pro', sans-serif",
          borderBottom: "2px solid #F9F5F6",
        }}
        justify={"space-between"}
        align="middle"
      >
        {/* <Col style={{ display: "flex", alignItems: "center", maxWidth: "30%" }}>
          <img
            src={
              ProfileInfo?.company_logo
                ? imageURL + ProfileInfo?.company_logo
                : logo
            }
            width={150}
            height={100}
            style={{ objectFit: "contain" }}

            // style={GetInfo().logoProp}
          />
        </Col> */}

        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            maxWidth: "46%",
          }}
        >
          {/* <div>
            <QRCode
              style={{ marginRight: "5px" }}
              size={145}
              color="black"
              bordered={false}
              value={`
              Name: ${ProfileInfo?.company_name || "M360 ICT"}
              Email: ${ProfileInfo?.company_email || ""}
              Mobile No: ${ProfileInfo?.company_phone}
              Address: ${ProfileInfo?.company_address}
                `}
            />
          </div> */}
          <div>
            {/* <Typography.Title level={4} style={{ fontFamily: "serif" }}>
              {ProfileInfo?.company_name || ""}
            </Typography.Title> */}
            {/* {orgInfo?.org_address1 ? (
              <Typography.Text
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontFamily: "'Source Sans Pro', sans-serif",
                }}
                className=""
              >
                {orgInfo?.org_address2 ? (
                  <>
                    <strong>Address: </strong>
                    <span>{orgInfo?.org_address1}</span>
                  </>
                ) : (
                  orgInfo?.org_address1
                )}
              </Typography.Text>
            ) : (
              ""
            )} */}
            {/* {orgInfo?.org_address2 && (
              <Typography.Text
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontFamily: "'Source Sans Pro', sans-serif",
                }}
              >
                {orgInfo?.org_address2}
              </Typography.Text>
            )} */}
            {/* <Typography.Text
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              <strong>Mobile:</strong> {ProfileInfo?.company_phone}
            </Typography.Text> */}
            {/* <Typography.Text
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              <strong>Email:</strong> {ProfileInfo?.company_email}
            </Typography.Text>{" "} */}
            {/* <Typography.Text
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              <strong>Address:</strong> {ProfileInfo?.company_address}
            </Typography.Text> */}
            {/* <Typography.Text
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              {orgInfo?.org_extra_info}
            </Typography.Text> */}
            {/* <Typography.Text
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              {ProfileInfo?.}
            </Typography.Text> */}
            {/* <Typography.Text
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "'Source Sans Pro', sans-serif",
              }}
            >
              {orgInfo?.org_facebook}
            </Typography.Text> */}
          </div>
        </Col>
      </Row>
    </div>
  );
};
