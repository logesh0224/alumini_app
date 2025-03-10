import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign-In and Sign-Up

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const endpoint = isSignUp
        ? "http://localhost:5000/api/alumni/signup"
        : "http://localhost:5000/api/auth/login";
      const response = await axios.post(endpoint, values);
      message.success(response.data.message);
    } catch (error) {
      //@ts-ignore
      message.error(error.response?.data?.error || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 400,
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <Title level={3} style={{ marginBottom: "20px" }}>
          {isSignUp ? "Alumni Sign Up" : "Sign In"}
        </Title>

        <Form onFinish={onFinish}>
          {isSignUp && (
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please enter your name!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Name"
                size="large"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>
          )}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{
                width: "100%",
                borderRadius: "8px",
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </Form.Item>
        </Form>

        <Text>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Button
            type="link"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ padding: 0, fontWeight: "bold" }}
          >
            {isSignUp ? "Sign In" : "Create an Account"}
          </Button>
        </Text>
      </Card>
    </div>
  );
};

export default AuthPage;
