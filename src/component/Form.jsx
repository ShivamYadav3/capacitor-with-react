import React, { useEffect, useState } from "react";
import { Device } from "@capacitor/device";
import { Toast } from "@capacitor/toast";
import styled from "styled-components";

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 1px solid #6288c4;
  margin: 0 1em;
  padding: 0.25em 1em;
`;
const Input = styled.input`
  height: 25px;
  outline: none;
  border-radius: 6px;
  margin-left: 20px;
  border: 1px solid #6288c4;
  padding-left: 10px;
`;
const Container = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
`;
const Label = styled.label`
  display: inline-block;
  width: 60px;
`;
const MainContainer = styled.div`
  margin: 20px;
`;

const Form = () => {
  const [platform, setPlatform] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState({
    name: false,
    email: false,
  });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const offlineHandler = () => setIsOnline(false);
    const onlineHandler = () => setIsOnline(true);

    window.addEventListener("offline", offlineHandler);
    window.addEventListener("online", onlineHandler);

    return () => {
      window.removeEventListener("offline", offlineHandler);
      window.removeEventListener("online", onlineHandler);
    };
  }, []);

  useEffect(() => {
    const getDeviceInfo = async () => {
      const info = await Device.getInfo();
      console.log(info);
      setPlatform(info.platform);
    };

    getDeviceInfo();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    for (let i in formData) {
      if (formData[i] === "") {
        setError((prev) => {
          return { ...prev, i: true };
        });
        console.log(`please fill the ${i} field`);
        return;
      }
    }
    if (isOnline && platform === "web") {
      return alert("data submitted successfully");
    } else if (platform === "web" && !isOnline) {
      return alert("You Are offline");
    } else if (isOnline && platform !== "web") {
      return Toast.show({
        text: "Data submitted successfully",
        duration: "short",
      });
    } else {
      Toast.show({
        text: `Name: ${formData.name}, Email: ${formData.email}\nData not submitted, You are offline`,
        duration: "short",
      });
    }
  };

  return (
    <MainContainer>
      <h1>This is {platform === "web" ? "Web" : "App"}</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <Container>
            <div>
              <Label htmlFor="name">Name :</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email :</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Button type="submit">Submit</Button>
            </div>
          </Container>
        </form>
      </div>
    </MainContainer>
  );
};

export default Form;
