import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import dotenv from "dotenv";

const healthCheckURL = import.meta.env.VITE_healthCheckURL;
// Change to your personal HealthChecks.io URL in production.

function App() {
  const [status, setStatus] = useState("Waiting to run first test");
  const [statusArray, setStatusArray] = useState([]);
  const intervalRef = useRef();

  const addStatus = (newItem) => {
    setStatusArray((prevArray) => [...prevArray, newItem]);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log("This function runs every 30 seconds");
      axios({
        method: "get",
        url: healthCheckURL,
      })
        .then((r) => {
          let currentTime = new Date().toISOString();
          console.log(currentTime, r.data);
          setStatus(r.data);
          addStatus([currentTime, r.data]);
          console.log(statusArray);
          // ! Good result gives "OK"
          // ! Bad result gives nil, need to modify code to catch error.
        })
        .catch((error) => {
          let currentTime = new Date().toISOString();
          console.log("error:", error);
          setStatus(error.message);
          addStatus([currentTime, error.message]);
        });
    }, 30000); // run every 30000ms (which is 30 seconds)
    // clear interval on re-render or unmount
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // async function calculateNetworkSpeed() {
  //   const fileSizeInBytes = 5000000; // Size of file in bytes (5MB in this case)
  //   const url = "https://raw.githubusercontent.com/BitDoctor/speed-test-file/master/10mb.txt"; // URL of the file you want to download

  //   const startTime = new Date().getTime();

  //   await axios
  //     .get(url, { responseType: "blob" })
  //     .then(() => {
  //       const endTime = new Date().getTime();
  //       const durationInSeconds = (endTime - startTime) / 1000;
  //       const bitsLoaded = fileSizeInBytes * 8;
  //       const bps = (bitsLoaded / durationInSeconds).toFixed(2);
  //       const kbps = (bps / 1024).toFixed(2);
  //       const mbps = (kbps / 1024).toFixed(2);

  //       console.log(`Your network speed: ${bps} bps, ${kbps} kbps, ${mbps} mbps`);
  //     })
  //     .catch((e) => {
  //       console.error(`Error occurred while calculating network speed: ${e}`);
  //     });
  // }

  // calculateNetworkSpeed();

  return (
    <>
      <h1>HealthCheck.io Client Side Logging</h1>
      <table>
        <tbody>
          <tr>
            <td>Check:</td>
            <td>{healthCheckURL}</td>
          </tr>
          <tr>
            <td>Last Status:</td>
            <td>{status}</td>
          </tr>
        </tbody>
      </table>

      <br />
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {statusArray.map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
