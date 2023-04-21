import { Component } from "react";
import { Table, Select, Message } from "@alifd/next";

const columns = [
  
  {
    title: "Group2-7",
    children: [
      {
        title: "Title2",
        dataIndex: "id",
        width: 140,
      },
      {
        title: "Title3",
        dataIndex: "title.name",
        lock: true,
        width: 200,
      },
    ],
  },
  {
    title: "",
    children: [
      {
        title: "Time",
        dataIndex: "time",
        width: 500,
      },
    ],
  },
];

class App extends Component {
  componentDidCatch(error, info) {
    console.log(error, info, "-------------");
  }
  componentDidMount() {
  
  }
  render() {
    return (
      <div className="App" style={{ padding: 20 }}>
        <Select
          dataSource={[
            { value: "10001", label: "Lucy King" },
            { value: 10002, label: "Lily King" },
          ]}
        />
        <Message type="notice">This is an Inline Message Notice</Message>
        <Table
          columns={columns}
          dataSource={[
            {
              title: {
                name: `Quo}.0 controller compatible`,
              },
              id: 100306660,
              time: 20,
            },
          ]}
        />
        ,
      </div>
    );
  }
}

export default App;
