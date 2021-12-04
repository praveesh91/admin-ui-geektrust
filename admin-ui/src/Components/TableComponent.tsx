import React, { useEffect, useState } from "react";
import { Button, Card, Input, Space, Table } from "antd";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface IUserDataType {
  key: React.Key;
  name: string;
  email: string;
  id: number;
  role: string;
}

const TableComponent = () => {
  const [userDetails, setUserDetails] = useState<IUserDataType[]>();
  const [filtered, setFiltered] = useState<IUserDataType[]>();
  const [selectedRow, setSelectedRow] = useState<IUserDataType[]>();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_: any, record: IUserDataType) => (
        <Space size="large">
          <a>
            <EditOutlined
              onClick={() =>
                console.log(
                  selectedRow?.some((el: any) => el.name === record.name)
                )
              }
            />
          </a>
          <a>
            {selectedRow?.some((el: any) => el.name === record.name) && (
              <DeleteOutlined onClick={handleDelete} style={{ color: "red" }} />
            )}
          </a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getUserData();
  }, []);

  const handleChange = (e: any) => {
    const filterTable: IUserDataType[] = userDetails?.filter(
      (item: IUserDataType) =>
        Object.keys(item).some((k) =>
          String(item[k]).toLowerCase().includes(e.target.value.toLowerCase())
        )
    );
    setFiltered(filterTable);
  };

  const handleDelete = () => {
    if (filtered?.length > 0) {
      setFiltered(
        filtered?.filter(
          (value: IUserDataType) => !selectedRow?.includes(value)
        )
      );
    } else
      setUserDetails(
        userDetails?.filter(
          (value: IUserDataType) => !selectedRow?.includes(value)
        )
      );
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setUserDetails(
        data.map((el: IUserDataType) => ({
          name: el.name,
          email: el.email,
          role: el.role,
          id: el.id,
          key: el.id,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IUserDataType[]) => {
      setSelectedRow(selectedRows);
    },
  };
  console.log({ selectedRow });
  return (
    <div>
      <Card title={"User List"}>
        <Input
          style={{ width: "40%", marginBottom: "1rem" }}
          placeholder={"Search user details ..."}
          onChange={handleChange}
        />
        <Table
          rowSelection={{ ...rowSelection }}
          dataSource={filtered === undefined ? userDetails : filtered}
          columns={columns}
        />
        <Button
          danger
          type="ghost"
          disabled={!(selectedRow?.length > 0)}
          onClick={handleDelete}>
          Delete Selected
        </Button>
      </Card>
      ;
    </div>
  );
};

export default TableComponent;
