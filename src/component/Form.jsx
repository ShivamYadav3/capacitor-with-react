import React, { useEffect, useState } from "react";
import { Device } from "@capacitor/device";
import { Toast } from "@capacitor/toast";

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
    <div>
      <h1>This is {platform === "web" ? "Web" : "App"}</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
