import React, { useState } from "react";
import "../Styles/Info.css";
import { Table, DatePicker, Select, Space } from 'antd';

function Info() {
    
    const [type, setType] = useState('date');
    const { Option } = Select;

    const renderContent = (value, row, index) => {
        const obj = {
            children: value,
            props: {},
        };
        if (index === 2) {
            obj.props.colSpan = 0;
        } 
        return obj;
    };

    const PickerWithType = ({ type, onChange }) => {
        if (type === 'date') return <DatePicker onChange={onChange} />;
        return <DatePicker picker={type} onChange={onChange} />;
    };

    const TournamentColumns = [
        {
            title: 'Latest Tournament Results',
            dataIndex: 'date',
            colSpan: 2,
        },
        {
            title: 'tournament',
            colSpan: 0,
            dataIndex: 'tournament',
            render: renderContent,
        },
   
    ];

    const tournamentTbl = [
    {
        key: '1',
        date: '2024-12-10',
        tournament: "JhonnyJack earned $50 USD winning the 1th position on Tournament #434543",
    },
    {
        key: '2',
        date: '2024-11-10',
        tournament: "Daivd earned $340 USD winning the 1th position on Tournament #464343",
    },
  ];

  const topPlayerColumns = [

   {
     title:() => {
      return (
          <>
            <span style={{ marginRight:'10px' }}>Top players of the</span>
            <Space>
            <Select value={type} onChange={setType} style={{ width: "100px" }}>
                <Option value="date">Day</Option>
                <Option value="week">Week</Option>
                <Option value="month">Month</Option>
                <Option value="year">Year</Option>
            </Select>
            <PickerWithType type={type} onChange={(value) => console.log(value)} />
            </Space>
          </> 
      )
  },
     dataIndex: 'no',
     colSpan: 2,
   },
   {
     title: 'player',
     colSpan: 0,
     dataIndex: 'player',
     render: renderContent,
   },
  
 ];
 
 const topPlayerTbl = [
   {
     key: '1',
     no: '#1',
     player: "JhonnyJack earned $34053 USD",
   },
   {
     key: '2',
     no: '#2',
     player: "Daivd earned $3100 USD"
   },
 ];


  return (
    <div className="info-section" id="services">
      <div className="info-cards-content">
          <div className="tournament-tbl">
              <Table columns={TournamentColumns} dataSource={tournamentTbl} />
          </div>
          <div className="top-player-tbl">
               <Table columns={topPlayerColumns} dataSource={topPlayerTbl} />
          </div>
      </div>
    </div>
  );
}

export default Info;
