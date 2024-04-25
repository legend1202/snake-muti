import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button, Checkbox, Card, Col, Space, Divider  } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const SignIn = () => {
  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  return (
    <Col span={8} offset={8}>
        <Card title="How do you want to login?" bordered={true} style={{ height: "38vh" }}>
            <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            >
            <Form.Item
                name="username"
                rules={[
                {
                    required: true,
                    message: 'Please input your Username!',
                },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                {
                    required: true,
                    message: 'Please input your Password!',
                },
                ]}
            >
                <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                Forgot password
                </a>
            </Form.Item>

            <Form.Item style={{ height:"9vh"}}>
            <Space size={10}>
                <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
                </Button>
                Or <a href="">register now!</a>
            </Space>
            <Divider style={{ margin: "12px 0" }} />
                <Space  size={10} style={{justifyContent:"center", display:"flex", alignItems:"center"}}>
                    <a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 48 48">
                            <path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"/><path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"/><path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"/><path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"/>
                        </svg>
                    </a>
                </Space>
            </Form.Item>
            </Form>
        </Card>
    </Col>

  );
};

export default SignIn;