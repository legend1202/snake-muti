import React, { useState } from "react";
import "../Styles/Tournaments.css";
import { Table, Card, Space, Flex, Button  } from 'antd';
import { useNavigate } from "react-router-dom";


function Tournament() {

   let navigate  = useNavigate(); 

   const [selectedRowKey, setSelectedRowKey] = useState(null);
   
   const dataSource = [
         {
            key: '660ba5e661d95f4c31bce5bd',
            time: 'Late Registration (1 minute)',
            event: "Freerool",
            buyIn: '$2',
            players: '199',
            prize: '$80 USD',
         },
         {
            key: '661738860a86c45c0aa6dfb3',
            time: 'In 1 minute',
            event: "Regular",
            buyIn: '$2',
            players: '48',
            prize: '$168 USD',
         },
         {
            key: '661738930a86c45c0aa6dfb4',
            time: 'In 2 minute',
            event: "Regular",
            buyIn: '$2',
            players: '80',
            prize: '$10 USD',
            
         },
         {
         key: '661738950a86c45c0aa6dfb5',
         time: 'Late Registration (1 minute)',
         event: "Freerool",
         buyIn: '$2',
         players: '199',
         prize: '$80 USD',
      }  
   ];
   
   const columns = [
      {
         title: 'Start Time',
         dataIndex: 'time',
         key: 'time',
         align: 'center',

      },
      {
         title: 'Event Name',
         dataIndex: 'event',
         key: 'event',
         align: 'center',
      },
      {
         title: 'Buy-In',
         dataIndex: 'buyIn',
         key: 'buyIn',
         align: 'center',
      },
      {
         title: 'Players',
         dataIndex: 'players',
         key: 'players',
         align: 'center',
      },
      {
         title: 'Prize Pool',
         dataIndex: 'prize',
         key: 'prize',
         align: 'center',
      },
   ];
      
   const handleRowClick = (record) => {
      setSelectedRowKey(record.key);
    };

   const routeChange = (newPath) =>{ 
      
      if(selectedRowKey == null){

         alert("Choose Tournament what you want!")

      } else {
         const params = { 

            roomId: selectedRowKey, 
            playerId: `Player-${Date.now()}`};

            navigate(newPath, { state:  params });
      }
   }
   
   return (
      <div className="section-container">
         <div className="tournament-section">
               <div className="tournament-title">
                  <span>Select the tournament you would like to join and press the Register button</span>
               </div>
               <div className="tournament-content">
                  <div className="tournament-tbl">
                     <Table dataSource={dataSource} columns={columns} scroll={{ y: 1000 }} pagination={false} bordered  
                           style={{ cursor:"pointer" }}
                           onRow={(record, rowIndex) => {
                              return {
                                 onClick: () => {
                                    handleRowClick(record);
                                 },
                              };
                           }}
                     />;
                  </div>
                  <div className="tournament-detail">
                     <Card
                        title={`Room_ID: ${!selectedRowKey? 'Select Room':selectedRowKey}`}
                        bordered={true}
                        style={{
                           width: 350,
                        }}
                     >
                     <Space direction="vertical" size="middle">
                        <Flex justify={'space-between'} horizontal="true">
                           <span>Start time</span>
                           <p>Mar 27, 14:56</p>
                        </Flex >
                        <Flex justify={'space-between'}  horizontal="true">
                           <span>Duration:</span>
                           <p>30 minutes</p>
                        </Flex>
                        <Flex justify={'space-between'}  horizontal="true">
                           <span>Buy-In:</span>
                           <p>$1 USD</p>
                        </Flex>
                        <Flex justify={'space-between'}  horizontal="true">
                           <span>Players Registered:</span>
                           <p>109</p>
                        </Flex>
                        <Flex justify={'space-between'}  horizontal="true">
                           <span>Min./Max. Players:</span>
                           <p>50/300</p>
                        </Flex>
                        <Flex justify={'space-between'}  horizontal="true">
                           <span>Prize Pool:</span>
                           <p>$99</p>
                        </Flex>
                        <Flex justify={'space-between'}  horizontal="true">
                           <span>Payout Structure:</span>
                           <p>Top 10%</p>
                        </Flex>
                        <p>
                           The prize pool is distributed to the top 10% of
                           the total participants. The winner takes 35%
                        </p> 
                           <Button onClick={ () => routeChange('/gameroom')} type="primary" block size="large" style={{ fontWeight:"bold" }}>
                                          Register
                           </Button>
                        </Space>                   
                     </Card>
                  </div>
                  
               </div>
         </div>
      </div>
  );
}

export default Tournament;
