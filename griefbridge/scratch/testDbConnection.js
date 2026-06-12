import net from "net";

const client = net.connect({ host: "db.prisma.io", port: 5432 }, () => {
  console.log("Successfully connected to db.prisma.io on port 5432!");
  client.end();
});

client.on("error", (err) => {
  console.error("Connection error:", err);
});
