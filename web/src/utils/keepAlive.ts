const INTERVAL_MS = 12 * 60 * 1000;

const keepServerAlive = () => {
  setInterval(async () => {
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/v1/health/keep-server-alive`,
      );

      if (res.ok) {
        console.log("✅ Server is alive. GET request sent successfully.");
      } else {
        console.log(`❌ GET request failed. Status: ${res.status}`);
      }
    } catch (err) {
      console.error("❌ Error while sending request:", err);
    }
  }, INTERVAL_MS);
};

export default keepServerAlive;
